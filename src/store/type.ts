import { DeepPartial } from '../components/utils/globalTypes';

export type QueueDataLoader<State = any> = [
  (state: State) => void,
  [Array<keyof State>, Partial<State> | null]
];

export type StateMapper<State> = (
  prevState: State,
  newState: DeepPartial<State>
) => any;

export type PendState<
  State,
  K extends keyof State = keyof State
> = Partial<{
  [stateKey in K]:
    | StateMapper<State[stateKey]>
    | PendState<State[stateKey]>;
}>;

export type QueueIndexer = Set<string>;

export type _SelectiveSubscribers<State> = Map<
  keyof State,
  QueueIndexer
>;

export type _CallPriorityQueue = Map<
  string,
  QueueDataLoader
>;

export type PureFunction = (...args: any[]) => any;

export type DispatchableStore = {
  setStoreState: PureFunction;
};

export type GetStoreDispatcherFnShape<
  Store extends DispatchableStore
> = Store['setStoreState'];

export type GetStoreStateShape<
  Store extends { getStoreState: PureFunction }
> = ReturnType<Store['getStoreState']>;

export type GetStoreDispatcherParams<
  Store extends DispatchableStore
> = Parameters<GetStoreDispatcherFnShape<Store>>;
