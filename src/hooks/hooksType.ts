import { GlobalState, InferStoreShape } from '../appStore';
import { PropertyKeyArray } from '../components/utils/globalTypes';
import {
  GetStoreDispatcherParams,
  PendState,
} from '../store/type';

type LocalStoragePersistOption = Partial<
  Record<PropertyKeyArray<GlobalState>[number], string>
>;

export type DispatcherParams =
  GetStoreDispatcherParams<InferStoreShape>;

type GlobalDispatchOption = {
  allowEmpty: DispatcherParams[1];
  localStorageOption: LocalStoragePersistOption;
  cacheAndSpreadOldState?: PendState<
    GetStoreDispatcherParams<InferStoreShape>
  >;
};

export type GlobalDispatcherHookFn = (
  state: DispatcherParams[0],
  options?: Partial<GlobalDispatchOption>
) => void;
