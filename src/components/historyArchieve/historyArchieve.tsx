import { FC } from 'react';
import { useNavigate } from 'react-router';
import useGlobalDispatch from '../../hooks/useGlobalDispatch';
import useGlobalState from '../../hooks/useGlobalState';
import style from '../../styles/history.module.css';
import TertiaryButton from '../UI/button/TertiaryButton';
import ArrowUpIcon from '../UI/Icons/ArrowUpIcon';
import BackArrow from '../UI/Icons/BackArrow';

const HistoryArchieve: FC = () => {
  const { isHistoryOpen, history } = useGlobalState([
    'isHistoryOpen',
    'history',
  ]);

  const navigate = useNavigate();
  const dispatch = useGlobalDispatch();

  const historyLength = (history.pasts ?? []).length;

  const historyStyleClasses = [
    style.history,
    style[isHistoryOpen ? 'historyOpen' : 'historyClose'],
  ].join(' ');

  return (
    <div className={historyStyleClasses}>
      <div>
        <BackArrow
          onBackHandler={() => {
            dispatch({ isHistoryOpen: false });
          }}
        />
        <h3 className={style.component_title}>
          History <span>({historyLength})</span>
        </h3>
      </div>
      <div>
        {historyLength && history.pasts ? (
          <ul>
            {history.pasts.map((entry, i) => {
              return (
                <li
                  onClick={() => {
                    dispatch(
                      {
                        searchResult: {
                          '[[_data_]]': entry,
                        },
                        isHistoryOpen: false,
                      },
                      {
                        persistToLocal: {
                          getPersistState: (state) => {
                            return {
                              history: state.history,
                            };
                          },
                        },
                      }
                    );

                    navigate('/results');
                  }}
                  className={style.historyEntry}
                  key={entry.word + i}
                >
                  <span className={style.word_entry}>
                    <ArrowUpIcon />
                    <span>{entry.word}</span>
                  </span>
                  <span className={style.result_tag}>
                    {entry._type === '_valid'
                      ? 'result found'
                      : 'result not found'}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      <TertiaryButton
        onClick={() => {
          if (historyLength) {
            dispatch(
              {
                history: {
                  '[[_data_]]': {
                    pasts: null,
                    lastSearch: null,
                  },
                },
              },
              { persistToLocal: true }
            );
          }
        }}
      >
        Empty History
      </TertiaryButton>
    </div>
  );
};

export default HistoryArchieve;
