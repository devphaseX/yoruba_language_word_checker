import { useContext } from 'react';
import { AppContext } from '../App';
import { useState } from 'react';
import { useEffect } from 'react';
import { SlicedGlobalState } from '../components/utils/globalTypes';
import { StoreDataSubscriber } from '../store/type';
import { GlobalState } from '../appStore';

const useGlobalState = <
  PickedState extends Array<keyof GlobalState>
>(
  pickedParts: PickedState
): SlicedGlobalState<GlobalState, PickedState[number]> => {
  const store = useContext(AppContext);

  const [sliceState, setSliceState] = useState(
    store.sliceState(pickedParts)
  );

  useEffect(() => {
    return store.subscriber(
      pickedParts,
      setSliceState as StoreDataSubscriber<
        GlobalState,
        PickedState
      >
    );
  }, [pickedParts, store]);

  return sliceState;
};
export default useGlobalState;
