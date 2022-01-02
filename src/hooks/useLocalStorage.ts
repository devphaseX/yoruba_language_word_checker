import { useCallback, useEffect, useState } from 'react';

const useLocalStorage = <Data>(dataId: string) => {
  const [state, setState] = useState<Data | null>();

  let { persist: _persist, remove: _remove } =
    useLocalStorageFeature();

  const persist = useCallback(function persist(data: Data) {
    _persist(data, dataId);
  }, []);

  const remove = useCallback(function remove() {
    _remove(dataId);
  }, []);

  useEffect(() => {
    try {
      const localData = JSON.parse(
        window.localStorage.getItem(dataId) ?? 'null'
      );
      if (localData) {
        setState(localData);
      }
    } catch (e) {
      console.warn(e);
    }
  }, [setState, dataId]);
  return {
    state,
    persistToLocalStorage: persist,
    removeFromLocalStorage: remove,
  };
};

export default useLocalStorage;

export const APP_CONFIG_KEY = '%yorubaAppConfig%';
export const APP_HISTORY_KEY = '%yorubaSearchHistory%';

export const useLocalStorageFeature = () => {
  const persist = useCallback(function persist<Data>(
    data: Data,
    dataId: string
  ) {
    window.localStorage.setItem(
      dataId,
      JSON.stringify(data)
    );
  },
  []);

  const remove = useCallback(function remove(
    dataId: string
  ) {
    window.localStorage.removeItem(dataId);
  },
  []);

  return { persist, remove };
};
