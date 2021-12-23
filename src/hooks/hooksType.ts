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

export type DispatcherHookOption<
  DispatcherParams extends GetStoreDispatcherParams<InferStoreState>
> = {
  allowEmpty: DispatcherParams[1];
  persistToLocal: LocalPersistOption;
  cacheAndSpreadOldState?: PendState<
    GetStoreStateShape<InferStoreState>
  >;
};

type GlobalDispatchOption<
  DispatcherParams extends GetStoreDispatcherParams<InferStoreState>
> = {
  allowEmpty: DispatcherParams[1];
  persistToLocal: LocalPersistOption;
  cacheAndSpreadOldState?: PendState<
    GetStoreDispatcherParams<InferStoreState>
  >;
};

export type GlobalDispatcherHookFn<
  DispatcherParams extends GetStoreDispatcherParams<InferStoreState>
> = (
  state: DispatcherParams[0],
  options?: Partial<GlobalDispatchOption<DispatcherParams>>
) => void;
