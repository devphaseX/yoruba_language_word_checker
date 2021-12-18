import { ChangeEvent, FC } from 'react';
import style from '../../../styles/toggle.module.css';

interface ToggleProps {
  name: string;
  id?: string;
  checked?: boolean;
  onChange: (event: ChangeEvent) => void;
}
const ToggleIcon: FC<ToggleProps> = ({
  name,
  id,
  checked,
  onChange,
}) => {
  return (
    <span>
      <label className={style.outerToggler} htmlFor={id}>
        <input
          type="checkbox"
          name={name}
          style={{ display: 'none' }}
          id={id}
          onChange={onChange}
          checked={checked}
        />
        <label
          className={style.toggleIndicator}
          htmlFor={id}
        ></label>
      </label>
    </span>
  );
};

export default ToggleIcon;
