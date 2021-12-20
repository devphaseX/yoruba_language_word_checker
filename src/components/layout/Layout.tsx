import { FC, useEffect } from 'react';
import Navigation from '../navigation/Navigation';
import LogoIcon from '../UI/Icons/LogoIcon';
import Modal from '../settingModal/SettingModal';
import { useLocation } from 'react-router';
import useLocalStorage, {
  APP_CONFIG_KEY,
  APP_HISTORY_KEY,
} from '../../hooks/useLocalStorage';
import useGlobalDispatch from '../../hooks/useGlobalDispatch';
import { AppConfig, SearchHistory } from '../../App';
import useGlobalState from '../../hooks/useGlobalState';
import HistoryArchieve from '../historyArchieve/historyArchieve';
import CopyRight from '../copyRight/copyRight';

const Layout: FC = ({ children }) => {
  const location = useLocation();

  const { state: configLocalSave } =
    useLocalStorage<AppConfig>(APP_CONFIG_KEY);

  const {
    persistToLocalStorage: persistHistoryLocal,
    state: historyLocalState,
  } = useLocalStorage<SearchHistory>(APP_HISTORY_KEY);

  const dispatch = useGlobalDispatch();
  const {
    appConfig: { allowPersist },
    history,
  } = useGlobalState(['appConfig', 'history']);

  useEffect(() => {
    if (historyLocalState?.pasts && configLocalSave) {
      dispatch({
        history: { '[[_data_]]': historyLocalState },
        appConfig: configLocalSave,
      });
    }
    if (historyLocalState?.pasts) {
      dispatch({
        history: { '[[_data_]]': historyLocalState },
      });
    } else if (configLocalSave) {
      dispatch({ appConfig: configLocalSave });
    }

    return () => {
      if (allowPersist) {
        persistHistoryLocal(history);
      }
    };
  }, [historyLocalState, configLocalSave, dispatch]);

  return (
    <div className="layout">
      <Modal />
      <HistoryArchieve />
      {location.pathname.startsWith('/results') ? (
        children
      ) : (
        <>
          <div className="nav_header">
            <LogoIcon />
            <Navigation />
          </div>
          {children}
        </>
      )}
      <CopyRight />
    </div>
  );
};

export default Layout;
