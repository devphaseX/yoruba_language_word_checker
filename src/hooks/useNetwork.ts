import { useEffect, useState } from 'react';

export interface NetworkConnection {
  status: 'online' | 'offline';
}
const useNetworkStatus = () => {
  const [internetStatus, setInternetStatus] =
    useState<NetworkConnection>({
      status: navigator.onLine ? 'online' : 'offline',
    });

  useEffect(() => {
    function networkStatusHandler({ type }: Event) {
      setInternetStatus({
        status: type as NetworkConnection['status'],
      });
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
