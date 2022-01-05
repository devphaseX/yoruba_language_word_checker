import { useEffect, useState } from 'react';
import axios from '../axios';

export interface NetworkConnection {
  status: 'online' | 'offline';
  isInternectActive: boolean;
}

const useNetworkStatus = () => {
  const [internetStatus, setInternetStatus] =
    useState<NetworkConnection>({
      status: navigator.onLine ? 'online' : 'offline',
      isInternectActive: false,
    });

  const [isMount, setIsMount] = useState(false);

  function testNetworkForConnective() {
    return axios.post('/api/search', { search_word: 'a' });
  }

  if (!isMount) {
    testNetworkForConnective().then(() => {
      setInternetStatus({
        status: 'online',
        isInternectActive: true,
      });
    });
  }

  useEffect(() => {
    if (!isMount) {
      setIsMount(true);
    }
    function networkStatusHandler({ type }: Event) {
      if (type === 'online') {
        return testNetworkForConnective()
          .then(() => {
            setInternetStatus({
              status: 'online',
              isInternectActive: true,
            });
          })
          .catch(() => {
            appIsOffline();
          });
      } else {
        appIsOffline();
      }

      function appIsOffline() {
        setInternetStatus({
          status: type as NetworkConnection['status'],
          isInternectActive: false,
        });
      }
    }
    window.addEventListener('online', networkStatusHandler);
    window.addEventListener(
      'offline',
      networkStatusHandler
    );

    return () => {
      window.removeEventListener(
        'online',
        networkStatusHandler
      );
      window.removeEventListener(
        'offline',
        networkStatusHandler
      );
    };
  }, []);

  return internetStatus;
};

export default useNetworkStatus;
