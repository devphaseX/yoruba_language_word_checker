import { useEffect, useState } from 'react';

const useReloadTrap = () => {
  const [isForceEnable, setIsUnmount] = useState(false);
  useEffect(() => {
    window.onbeforeunload = () => {
      setIsUnmount(true);
    };
  });

  return isForceEnable;
};

export default useReloadTrap;
