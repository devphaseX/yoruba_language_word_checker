import { FC } from 'react';
import useGlobalState from '../../../hooks/useGlobalState';
import ToggleIcon from '../../UI/Icons/ToggleIcon';

interface PersisitHistoryProps {
  className: string;

  onToggleHandler: () => void;
}

const PersistHistory: FC<PersisitHistoryProps> = ({
  className,

  onToggleHandler,
}) => {
  const config = useGlobalState(['appConfig']).appConfig;
  const { allowPersist } = config;

  return (
    <div
      className={className}
      style={{ marginBottom: '48px' }}
    >
      <label htmlFor="persistHistory">
        Persist data locally
      </label>
      <ToggleIcon
        checked={allowPersist}
        id="persistHistory"
        onChange={onToggleHandler}
        name=""
      />
    </div>
  );
};

export default PersistHistory;
