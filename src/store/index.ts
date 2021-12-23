import {
  partialDeepStateUpdate,
  StateReplacement,
  take,
  generateSudoId,
} from '../components/utils';
import type { _PickOwn } from '../components/utils/globalTypes';
import type {
  PendState,
  QueueDataLoader,
  _CallPriorityQueue,
  _SelectiveSubscribers,
} from './type';

export function createStore<State extends object>(
  _initialState: State
) {
  let _rootStore: State = _initialState;
  const _selectiveSubscribers: _SelectiveSubscribers<State> =
    new Map();
  let recentUpdated: Partial<State> | null = null;
  let _isUpdatePublish: boolean = false;
  const _priorityCbQueue: _CallPriorityQueue = new Map();

  function getStoreState(): State {
    return JSON.parse(JSON.stringify(_rootStore));
  }

  function subscriber<
    PickedKeys extends Partial<Array<keyof State>>
  >(
    sliceState: PickedKeys,
    cb: (slice: _PickOwn<State, PickedKeys[number]>) => void
  ) {
    const _selectedDataSliceKeys = sliceState.filter(
      (k): k is keyof State =>
        _rootStore.hasOwnProperty(k as PropertyKey)
    );
    const accessKey = prioprityBaseEnqueue(
      cb,
      _selectedDataSliceKeys
    );

    return dequeueCb(accessKey, true);
  }

  function sliceState<
    PickedKeys extends Partial<Array<keyof State>>
  >(
    parts: PickedKeys
  ): _PickOwn<State, PickedKeys[number]> {
    return take(
      parts as Array<keyof State>,
      getStoreState()
    );
  }

  function prioprityBaseEnqueue(
    cb: (state: any) => void,
    subscribeKeys: Array<keyof State>
  ) {
    const accessKey = generateSudoId();
    _priorityCbQueue.set(accessKey, [
      cb,
      [subscribeKeys, null],
    ]);

    subscribeKeys.forEach((sbKey) => {
      const subscribeRegister =
        _selectiveSubscribers.get(sbKey);
      if (subscribeRegister) {
        subscribeRegister.add(accessKey);
      } else {
        _selectiveSubscribers.set(
          sbKey,
          new Set([accessKey])
        );
      }
    });

    return accessKey;
  }

  function removeCbFromQueue(
    accessKey: string,
    priorityQueue: _CallPriorityQueue,
    selectiveQueue: _SelectiveSubscribers<any>
  ) {
    priorityQueue.delete(accessKey);
    selectiveQueue.forEach((queueIndexer) => {
      queueIndexer.delete(accessKey);
    });
  }

  function dequeueCb(accessKey: string, defer?: boolean) {
    const lazyDequeue = removeCbFromQueue.bind(
      null,
      accessKey,
      _priorityCbQueue,
      _selectiveSubscribers
    );
    if (defer) {
      return lazyDequeue;
    }
    lazyDequeue();
  }

  function setStoreState(
    updatedStatePart: StateReplacement<State>,
    storeSetOption?: {
      allowEmptyState?: boolean;
      pendState?: PendState<State>;
    }
  ) {
    if (
      Object.keys(updatedStatePart).length ||
      (storeSetOption && storeSetOption.allowEmptyState)
    ) {
      _rootStore = partialDeepStateUpdate(
        _rootStore,
        updatedStatePart
      ) as State;

      _isUpdatePublish = false;
      recentUpdated = updatedStatePart as any;
      updateSubscriber();
    }
  }

  function updateSubscriber() {
    if (recentUpdated && !_isUpdatePublish) {
      const mutateParts = Object.keys(
        recentUpdated
      ) as Array<keyof State>;

      cookState(
        mutateParts,
        (accessId, [subscriber, dataPreload]) => {
          _priorityCbQueue.set(accessId as string, [
            subscriber,
            dataPreload,
          ]);
        }
      );

      notifySubscribers();
    }
  }

  function cookState(
    mutateParts: Array<keyof State>,
    cb: (
      accessKey: PropertyKey,
      cookedResult: QueueDataLoader
    ) => void
  ) {
    for (const dataKey of mutateParts) {
      const activeSubscriberIds = _selectiveSubscribers.get(
        dataKey as keyof State
      );

      if (activeSubscriberIds) {
        let cookedData: Partial<State> | null = {};
        const cacheCheckedBooklet: Set<string> = new Set();

        for (const accessId of activeSubscriberIds) {
          let [subscriber, lastestSelfPath] =
            _priorityCbQueue.get(accessId)!;
          [, cookedData] = lastestSelfPath;
          let dataKeys = lastestSelfPath[0] as Array<
            keyof State
          >;

          if (!cacheCheckedBooklet.has(accessId)) {
            cookedData = Object.fromEntries(
              dataKeys.map((key) => [key, _rootStore[key]])
            ) as State;
            cacheCheckedBooklet.add(accessId);
          }
          cookedData = {
            ...cookedData,
            [dataKey]: _rootStore![dataKey as keyof State],
          };
          cb(accessId, [
            subscriber,
            [dataKeys, cookedData],
          ]);
        }
      }
    }
  }

  function notifySubscribers() {
    if (_isUpdatePublish) return;
    for (const [
      accessKey,
      [activeSubscriber, [dataKeys, patchedState]],
    ] of _priorityCbQueue) {
      if (patchedState) {
        activeSubscriber(patchedState);
        _priorityCbQueue.set(accessKey, [
          activeSubscriber,
          [dataKeys, null],
        ]);
      }
    }
    _isUpdatePublish = true;
    recentUpdated = null;
  }
  return {
    getStoreState,
    subscriber,
    setStoreState,
    sliceState,
  };
}

export {};
