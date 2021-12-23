import { useCallback, useContext } from 'react';
import { AppContext, InferStoreState } from '../App';
import { GetStoreDispatcherParams } from '../store/type';
import { GlobalDispatcherHookFn } from './hooksType';
import useLocalStorage, {
  APP_HISTORY_KEY,
} from './useLocalStorage';

const useGlobalDispatch = () => {
  const store = useContext(AppContext);
  const { persistToLocalStorage: persistLocalHistory } =
    useLocalStorage(APP_HISTORY_KEY);

  type GlobalDispatcherParams =
    GetStoreDispatcherParams<InferStoreState>;
  type StoreDispatcherFn =
    GlobalDispatcherHookFn<GlobalDispatcherParams>;

  return useCallback(
    ((state, options) => {
      store.setStoreState(state);
      if (options && options.persistToLocal) {
        if (typeof options.persistToLocal !== 'boolean') {
          const state =
            options.persistToLocal.getPersistState(
              store.getStoreState()
            );
          persistLocalHistory(state);
        } else {
          persistLocalHistory(
            store.getStoreState().history
          );
        }
      }
    }) as StoreDispatcherFn,
    [store]
  );
};
export default useGlobalDispatch;
