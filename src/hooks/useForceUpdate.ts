import { useState } from 'react';
const useForceUpdate = () => {
  const [, forceUpdate] = useState<number>(-1);
  return () => forceUpdate(Math.random());
};

export default useForceUpdate;
