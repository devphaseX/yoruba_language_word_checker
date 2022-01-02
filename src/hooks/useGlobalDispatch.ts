import { useCallback, useContext } from 'react';
import { AppContext } from '../App';
import { GlobalState } from '../appStore';
import { PropertyKeyArray } from '../components/utils/globalTypes';
import { GlobalDispatcherHookFn } from './hooksType';
import { useLocalStorageFeature } from './useLocalStorage';

const useGlobalDispatch = () => {
  const store = useContext(AppContext);
  const { persist } = useLocalStorageFeature();

  return useCallback(
    ((state, options) => {
      store.setStoreState(state);
      if (options && options.localStorageOption) {
        const dataKeys = Object.keys(
          options.localStorageOption
        ) as PropertyKeyArray<GlobalState>;
        for (let key of dataKeys) {
          const localStorageKey =
            options.localStorageOption[key];
          if (localStorageKey) {
            persist(
              store.sliceState([key])[key],
              localStorageKey
            );
          }
        }
      }
    }) as GlobalDispatcherHookFn,
    [store]
  );
};
export default useGlobalDispatch;
