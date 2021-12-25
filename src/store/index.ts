import {
  partialDeepStateUpdate,
  StateReplacement,
  take,
  getStateSnapshot,
  createIdAccessfn as createFnAccessId,
} from '../components/utils';
import type {
  DeepPartial,
  PropertyKeyArray,
  UnwrapArray,
} from '../components/utils/globalTypes';
import {
  SubscriberUpdateRequirement,
  PendState,
  StoreSubscriber,
  SliceDataQueue,
  PriorityQueueFnStore,
  DataSubscriber,
} from './type';

export function createStore<StoreState extends object>(
  _initialState: DeepPartial<StoreState>
) {
  {
    let _rootStore = _initialState as StoreState;
    var getStoreState = getStateSnapshot(() => _rootStore);
    var _setStoreState = (newState: StoreState) =>
      (_rootStore = newState);
  }
  const updateSubscriberRecord: SliceDataQueue<StoreState> =
    new Map();
  let recentUpdate: DeepPartial<StoreState> | null = null;
  let isSubscriberNotifiedOfUpdate: boolean = false;

  type DataKeyList = PropertyKeyArray<StoreState>;

  const subscriberTaskRecord: PriorityQueueFnStore<
    StoreState,
    DataKeyList
  > = new Map();

  const subscriber: StoreSubscriber<StoreState> = (
    dataKeys,
    cb
  ) => {
    const dataSubscriberEntry = createFnAccessId(
      cb,
      dataKeys
    );
    registerSubscriberByPriority(dataSubscriberEntry);
    return unsubcriber(dataSubscriberEntry.id);
  };

  function registerSubscriberByPriority<
    DKey extends DataKeyList
  >(
    requirement: SubscriberUpdateRequirement<
      StoreState,
      DKey
    >
  ) {
    const { dataSubscriber, id: accessId } = requirement;
    dataSubscriber.dataKeys.forEach((dataKey) => {
      registerSubcriberInPriorityQueueStore(
        dataSubscriber,
        accessId
      );
      connectSubscriberForDataUpdate(dataKey, accessId);
    });
  }

  function registerSubcriberInPriorityQueueStore(
    dataSubscriber: DataSubscriber<StoreState, DataKeyList>,
    accessId: string
  ) {
    subscriberTaskRecord.set(accessId, dataSubscriber);
  }

  function connectSubscriberForDataUpdate(
    dataKey: UnwrapArray<DataKeyList>,
    accessId: string
  ) {
    const existingSubscriberOption =
      updateSubscriberRecord.get(dataKey);
    if (existingSubscriberOption) {
      existingSubscriberOption.add(accessId);
    } else {
      updateSubscriberRecord.set(
        dataKey,
        new Set([accessId])
      );
    }
  }

  function unsubcriber(
    accessKey: string,
    immediate?: boolean
  ) {
    function detachSubscriber() {
      subscriberTaskRecord.delete(accessKey);
      updateSubscriberRecord.forEach((record) => {
        record.delete(accessKey);
      });
    }
    if (immediate) {
      return detachSubscriber();
    }
    return detachSubscriber;
  }

  function setStoreState(
    updatedStatePart: StateReplacement<StoreState>,
    storeSetOption?: {
      allowEmptyState?: boolean;
      pendState?: PendState<StoreState>;
    }
  ) {
    if (
      Object.keys(updatedStatePart).length ||
      (storeSetOption && storeSetOption.allowEmptyState)
    ) {
      _setStoreState(
        partialDeepStateUpdate(
          getStoreState(),
          updatedStatePart
        )
      );

      isSubscriberNotifiedOfUpdate = false;
      recentUpdate =
        updatedStatePart as DeepPartial<StoreState>;
      updateSubscriber();
    }
  }

  function updateSubscriber() {
    if (recentUpdate && !isSubscriberNotifiedOfUpdate) {
      const mutateParts = Object.keys(
        recentUpdate
      ) as DataKeyList;

      const dataUpForUpdate = prepDataUpdate(mutateParts);

      notifySubscriber(dataUpForUpdate);
      isSubscriberNotifiedOfUpdate = true;
      recentUpdate = null;
    }
  }

  function notifySubscriber(
    updateStore: ReturnType<typeof prepDataUpdate>
  ) {
    for (let [subscriberKey, dataUpdate] of updateStore) {
      if (updateStore.has(subscriberKey)) {
        const { subscriber } =
          subscriberTaskRecord.get(subscriberKey)!;
        try {
          subscriber(dataUpdate as any);
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            throw e;
          }
        }
      }
    }
  }

  function prepDataUpdate(dataKeys: DataKeyList) {
    const cacheAcknowledgeStore = new Set<string>();
    const updateDispatchDatastore: Map<
      string,
      DeepPartial<StoreState>
    > = new Map();

    dataKeys.forEach((dataKey) => {
      const dataSubcriberAccessIds =
        updateSubscriberRecord.get(dataKey);
      if (!dataSubcriberAccessIds) {
        return (
          void updateSubscriberRecord.has(dataKey) &&
          updateSubscriberRecord.delete(dataKey)
        );
      }

      dataSubcriberAccessIds.forEach((subscriberId) => {
        const subscriberOptions =
          subscriberTaskRecord.get(subscriberId)!;

        if (!subscriberOptions) {
          return (
            void subscriberTaskRecord.has(subscriberId) &&
            subscriberTaskRecord.delete(subscriberId)
          );
        }

        if (
          subscriberOptions.dataKeys.length &&
          !cacheAcknowledgeStore.has(subscriberId)
        ) {
          const subcriberRequestButNotUpdateData =
            sliceState(subscriberOptions.dataKeys);

          updateDispatchDatastore.set(
            subscriberId,
            subcriberRequestButNotUpdateData
          );
        }

        const currentPrepUpdateState =
          updateDispatchDatastore.get(subscriberId)!;

        updateDispatchDatastore.set(subscriberId, {
          ...currentPrepUpdateState,
          [dataKey]: getStoreState()[dataKey],
        });
      });
    });

    return updateDispatchDatastore;
  }

  function sliceState(parts: DataKeyList) {
    return take(parts, getStoreState());
  }

  return {
    getStoreState,
    subscriber,
    setStoreState,
    sliceState,
  };
}

export {};
