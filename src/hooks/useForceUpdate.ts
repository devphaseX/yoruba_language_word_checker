import { useState } from 'react';
const useForceUpdate = () => {
  const [, forceUpdate] = useState(null);
  return () => forceUpdate(null);
};

export default useForceUpdate;
