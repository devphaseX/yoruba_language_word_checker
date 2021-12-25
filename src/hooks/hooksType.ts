import { GlobalState, InferStoreShape } from '../appStore';
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
        state: GlobalState
      ) => DeepPartial<GetStoreStateShape<InferStoreShape>>;
    };

export type DispatcherParams =
  GetStoreDispatcherParams<InferStoreShape>;

type GlobalDispatchOption = {
  allowEmpty: DispatcherParams[1];
  persistToLocal: LocalPersistOption;
  cacheAndSpreadOldState?: PendState<
    GetStoreDispatcherParams<InferStoreShape>
  >;
};

export type GlobalDispatcherHookFn = (
  state: DispatcherParams[0],
  options?: Partial<GlobalDispatchOption>
) => void;
