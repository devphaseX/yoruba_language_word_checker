import { useCallback, useEffect, useState } from 'react';

const useLocalStorage = <Data>(dataId: string) => {
  const [state, setState] = useState<Data | null>();

  const persist = useCallback(
    function persist(data: Data) {
      window.localStorage.setItem(
        dataId,
        JSON.stringify(data)
      );
    },
    [dataId]
  );

  const remove = useCallback(
    function remove() {
      window.localStorage.removeItem(dataId);
    },
    [dataId]
  );

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
