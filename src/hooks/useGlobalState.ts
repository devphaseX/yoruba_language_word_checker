import { useContext } from 'react';
import { AppContext, GlobalState } from '../App';
import { useState } from 'react';
import { useEffect } from 'react';
import { _PickOwn } from '../store';

const useGlobalState = <
  PickedState extends Array<keyof GlobalState>
>(
  pickedParts: PickedState
): _PickOwn<GlobalState, PickedState[number]> => {
  const store = useContext(AppContext);

  const [sliceState, setSliceState] = useState(
    store.sliceState(pickedParts)
  );

  useEffect(() => {
    return store.subscriber(pickedParts, setSliceState);
  }, [pickedParts, store]);

  return sliceState;
};
export default useGlobalState;