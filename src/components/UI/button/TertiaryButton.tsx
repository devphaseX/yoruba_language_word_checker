import { FC } from 'react';
import style from '../../../styles/button.module.css';

const TertiaryButton: FC = ({ children }) => {
  return (
    <button className={style.tertiaryButton} type="button">
      {children}
    </button>
  );
};
//1400
export default TertiaryButton;
