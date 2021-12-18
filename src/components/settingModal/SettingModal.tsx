import { FC } from 'react';
import useGlobalState from '../../hooks/useGlobalState';
import style from '../../styles/settingModal.module.css';
import Setting from '../setting/Setting';
import useGlobalDispatch from '../../hooks/useGlobalDispatch';

const SettingModal: FC = () => {
  const state = useGlobalState([
    'isModalOpen',
    'appConfig',
  ]);
  const { status } = state.appConfig.searchMode.mode;
  const dispatch = useGlobalDispatch();

  return (
    <div
      className={`${
        [style.close, style.open][+state.isModalOpen]
      } ${style.settingModalContainer}`}
    >
      <div
        className={style.SettingModalBg}
        onClick={() => {
          switch (status) {
            case true: {
              return dispatch({ isModalOpen: false });
            }
            case false: {
              return dispatch({
                isModalOpen: false,
                appConfig: {
                  searchMode: {
                    mode: { _type: 'light', status: true },
                  },
                },
              });
            }
          }
        }}
      ></div>
      <Setting />
    </div>
  );
};

export default SettingModal;
