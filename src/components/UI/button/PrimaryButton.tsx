import { FC } from 'react';
import style from '../../../styles/button.module.css';

const PrimaryButton: FC = ({ children }) => {
  return (
    <button type="submit" className={style.primaryButton}>
      {children}
    </button>
  );
};

export default PrimaryButton;
