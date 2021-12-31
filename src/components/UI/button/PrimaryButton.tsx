import { FC } from 'react';
import style from '../../../styles/button.module.css';

interface PrimaryButtonProps {
  onClick?: () => void;
}

const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      type="submit"
      className={style.primaryButton}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
