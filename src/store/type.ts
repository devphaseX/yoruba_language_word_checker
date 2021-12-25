import {
  DeepPartial,
  PropertyKeyArray,
  SlicedGlobalState,
  UnwrapArray,
} from '../components/utils/globalTypes';

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

export type SubscriberQueueIds = Set<string>;

export type DataEntityKey<State> = UnwrapArray<
  PropertyKeyArray<State>
>;

export type SliceDataQueue<State> = Map<
  DataEntityKey<State>,
  SubscriberQueueIds
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

export type StoreDataSubscriber<State, DataKeys> = (
  slice: SlicedGlobalState<State, DataKeys>
) => void;
export interface StoreSubscriber<State> {
  <DKey extends PropertyKeyArray<State>>(
    dataKeys: DKey,
    cb: StoreDataSubscriber<State, DKey>
  ): void;
}

export interface SubscriberUpdateRequirement<State, DKey> {
  id: string;
  dataSubscriber: DataSubscriber<State, DKey>;
}

export interface DataSubscriber<State, DKey> {
  subscriber: (
    state: SlicedGlobalState<State, DKey>
  ) => void;
  dataKeys: DKey;
}

export type PriorityQueueFnStore<State, Dkey> = Map<
  string,
  DataSubscriber<State, Dkey>
>;
