import { FC } from 'react';
import { SearchMode } from '../../../App';
import ToggleIcon from '../../UI/Icons/ToggleIcon';
import { DispatchWithLocalFunction } from '../Setting';

interface ModeProps {
  checked: boolean;
  id: string;
  name: string;
  mode: SearchMode;
  dispatcher: DispatchWithLocalFunction;
}

type OnToggleHandler = (
  mode: SearchMode,
  dispatcher: DispatchWithLocalFunction
) => void;

const Mode = (
  handler: OnToggleHandler,
  label: string
): FC<ModeProps> => {
  return function ({
    checked,
    id,
    name,
    mode,
    dispatcher: dispatch,
  }) {
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <ToggleIcon
          name={name}
          id={id}
          onChange={() => handler(mode, dispatch)}
          checked={checked}
        />
      </div>
    );
  };
};

export default Mode;

export const LightSearchMode = Mode((mode, dispatch) => {
  const isDeepToggleActive =
    mode._type === 'deep' && mode.status;

  if (isDeepToggleActive) {
    dispatch({
      searchMode: {
        mode: { _type: 'light', status: true },
      },
    });
  } else if (mode._type === 'light') {
    dispatch({
      searchMode: {
        mode: { _type: 'light', status: !mode.status },
      },
    });
  }
}, 'Light search mode');

export const DeepSearchMode = Mode((mode, dispatch) => {
  const isLightModeActive =
    mode._type === 'light' && mode.status;

  if (
    isLightModeActive ||
    (mode._type === 'light' && !mode.status)
  ) {
    dispatch({
      searchMode: { mode: { _type: 'deep', status: true } },
    });
  } else if (mode._type === 'deep') {
    if (mode.status) {
      dispatch({
        searchMode: {
          mode: { _type: 'light', status: true },
        },
      });
    }
  }
}, 'Deep search mode');
