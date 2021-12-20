import { useCallback, useContext } from 'react';
import { AppContext } from '../App';
import { DeepPartial, PendState } from '../store';
import useLocalStorage, {
  APP_HISTORY_KEY,
} from './useLocalStorage';

const useGlobalDispatch = () => {
  const store = useContext(AppContext);
  const { persistToLocalStorage: persistLocalHistory } =
    useLocalStorage(APP_HISTORY_KEY);
  type StoreDispatcherParams = Parameters<
    typeof store.setStoreState
  >;

  type StoreState = ReturnType<typeof store.getStoreState>;
  type StoreDispatcher = (
    state: StoreDispatcherParams[0],
    options?: Partial<{
      allowEmpty: StoreDispatcherParams[1];
      persistToLocal:
        | boolean
        | {
            getPersistState: (
              state: StoreState
            ) => DeepPartial<StoreState>;
          };
      cacheAndSpreadOldState?: PendState<
        ReturnType<typeof store.getStoreState>
      >;
    }>
  ) => void;

  return useCallback(
    ((state, options) => {
      store.setStoreState(state);
      if (options && options.persistToLocal) {
        if (typeof options.persistToLocal !== 'boolean') {
          persistLocalHistory(
            options.persistToLocal.getPersistState(
              store.getStoreState()
            )
          );
        } else {
          persistLocalHistory(
            store.getStoreState().history
          );
        }
      }
    }) as StoreDispatcher,
    [store]
  );
};
export default useGlobalDispatch;

export type GlobalDispatcher = ReturnType<
  typeof useGlobalDispatch
>;
