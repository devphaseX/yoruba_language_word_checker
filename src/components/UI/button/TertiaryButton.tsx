import { FC } from 'react';
import style from '../../../styles/button.module.css';

interface TertiaryButtonProps {
  onClick?(): void;
}
const TertiaryButton: FC<TertiaryButtonProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      className={style.tertiaryButton}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};
//1400
export default TertiaryButton;
