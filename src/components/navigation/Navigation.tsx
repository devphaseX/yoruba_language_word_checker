import TertiaryButton from '../UI/button/TertiaryButton';
import SettingIcon from '../UI/Icons/SettingIcon';
import style from '../../styles/navigation.module.css';
import useGlobalDispatch from '../../hooks/useGlobalDispatch';

const Navigation = () => {
  const dispatcher = useGlobalDispatch();
  return (
    <nav className={style.navigation}>
      <span
        onClick={() => dispatcher({ isModalOpen: true })}
        style={{ cursor: 'pointer' }}
      >
        <SettingIcon />
      </span>
      <TertiaryButton>History</TertiaryButton>
    </nav>
  );
};

export default Navigation;
