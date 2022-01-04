import useGlobalDispatch from '../../hooks/useGlobalDispatch';
import useGlobalState from '../../hooks/useGlobalState';
import {
  APP_CONFIG_KEY,
  APP_HISTORY_KEY,
  useLocalStorageFeature,
} from '../../hooks/useLocalStorage';
import style from '../../styles/settingModal.module.css';
import {
  DeepSearchMode,
  LightSearchMode,
} from './individual/Mode';
import PersistHistory from './individual/Persist';
import { partialDeepStateUpdate } from '../utils/index';
import { AppConfig } from '../../appStore';

export type DispatchWithLocalFunction = (
  config: Partial<AppConfig>,
  options?: Partial<{
    forceRemove: true;
  }>
) => void;

const Setting = () => {
  const { appConfig } = useGlobalState(['appConfig']);

  const {
    searchMode: { mode },
    allowPersist: prevAllowedPersist,
  } = appConfig;
  let dispatch = useGlobalDispatch();

  const {
    remove: removeLocalSaveData,
    persist: persistLocalSaveData,
  } = useLocalStorageFeature();

  const dispatchWithLocal: DispatchWithLocalFunction =
    function (
      userChangedConfig: Partial<AppConfig>,
      options
    ) {
      let { forceRemove } = options ?? {};
      const { allowPersist: justAllowedPersist } =
        userChangedConfig;

      dispatch(
        { appConfig: userChangedConfig },
        {
          localStorageOption: { history: APP_HISTORY_KEY },
        }
      );

      let isPersistAllowed =
        prevAllowedPersist || justAllowedPersist;

      if (isPersistAllowed && !forceRemove) {
        const lastestConfig = {
          ...userChangedConfig,
          allowPersist:
            justAllowedPersist || prevAllowedPersist,
        };

        const newAppConfig = partialDeepStateUpdate(
          appConfig,
          lastestConfig
        );

        persistLocalSaveData(newAppConfig, APP_CONFIG_KEY);
      } else if (forceRemove) {
        removeLocalSaveData(APP_CONFIG_KEY);
        removeLocalSaveData(APP_HISTORY_KEY);
      }
    };

  return (
    <div className={style.setting}>
      <h3 className={style.settingTitle}>Search Setting</h3>
      <div className={style.settingControls}>
        <ul>
          <li className={style.searchMode}>
            <h4 className={style.settingTypeName}>
              Filtering mode
            </h4>
            <div className={style.mode}>
              <LightSearchMode
                checked={
                  mode._type === 'light' && mode.status
                }
                id="lightMode"
                name="searchMode"
                mode={mode}
                dispatcher={dispatchWithLocal}
              />

              <DeepSearchMode
                checked={
                  mode._type === 'deep' && mode.status
                }
                id="deepMode"
                name="searchMode"
                mode={mode}
                dispatcher={dispatchWithLocal}
              />
            </div>
          </li>
          <li>
            <PersistHistory
              className={style.mininally_setting}
              onToggleHandler={() => {
                if (!prevAllowedPersist) {
                  dispatchWithLocal({
                    ...appConfig,
                    allowPersist: true,
                  });
                } else {
                  dispatchWithLocal(
                    { ...appConfig, allowPersist: false },
                    {
                      forceRemove: true,
                    }
                  );
                }
              }}
            />
          </li>
          <li className={style.directFileAccess}>
            <h4 className={style.settingTypeName}>
              File location
            </h4>
            <div>
              <label htmlFor="fileUrl">
                Enter your file url
              </label>
              <input
                type="text"
                id="fileUrl"
                className={style.fileInputUrl}
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Setting;
