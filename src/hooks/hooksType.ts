import { InferStoreState } from '../App';
import { DeepPartial } from '../components/utils/globalTypes';
import {
  GetStoreDispatcherParams,
  GetStoreStateShape,
  PendState,
} from '../store/type';

type LocalPersistOption =
  | boolean
  | {
      getPersistState: (
        state: GetStoreStateShape<InferStoreState>
      ) => DeepPartial<GetStoreStateShape<InferStoreState>>;
    };

export type DispatcherParams =
  GetStoreDispatcherParams<InferStoreState>;

export type DispatcherHookOption = {
  allowEmpty: DispatcherParams[1];
  persistToLocal: LocalPersistOption;
  cacheAndSpreadOldState?: PendState<
    GetStoreStateShape<InferStoreState>
  >;
};

type GlobalDispatchOption = {
  allowEmpty: DispatcherParams[1];
  persistToLocal: LocalPersistOption;
  cacheAndSpreadOldState?: PendState<
    GetStoreDispatcherParams<InferStoreState>
  >;
};

export type GlobalDispatcherHookFn = (
  state: DispatcherParams[0],
  options?: Partial<GlobalDispatchOption>
) => void;
