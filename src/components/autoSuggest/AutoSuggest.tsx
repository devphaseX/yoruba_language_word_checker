import { FC } from 'react';
import ArrowUpIcon from '../UI/Icons/ArrowUpIcon';
import style from '../../styles/suggests.module.css';
import {
  RealTimeSuggest,
  SuggestDetail,
  GlobalState,
} from '../../App';
import useGlobalDispatch from '../../hooks/useGlobalDispatch';
import { useNavigate } from 'react-router-dom';
import { PendState } from '../../store';

interface AutoSuggestProps {
  inputId: string;
  isVisible: boolean;
  suggests: Array<RealTimeSuggest> | null;
}

function ascendingOrder(a: number, b: number) {
  return a - b;
}
const AutoSuggest: FC<AutoSuggestProps> = ({
  inputId,
  isVisible,
  suggests,
}) => {
  const className = [
    style[isVisible ? 'openSuggests' : 'closeSuggests'],
    style.suggests,
  ].join(' ');

  const dispatch = useGlobalDispatch();
  const navigate = useNavigate();
  return (
    <div className={className}>
      <h4 className={style.suggested_word_title}>
        Suggested words
      </h4>
      <datalist id={inputId} className={style.suggestBox}>
        {suggests!
          .sort((a, b) =>
            ascendingOrder(a.probability, b.probability)
          )
          .map(({ word, _type }, i) => (
            <div
              key={word + i}
              className={style.suggest}
              onClick={() => {
                dispatch({
                  searchResult: {
                    '[[_data_]]': { _type, word },
                  },
                  history: {
                    '[[_data_]]': {
                      pasts: [{ _type, word }],
                      lastSearch: { _type, word },
                    },
                    mapper(prev, cur) {
                      return {
                        pasts: [
                          ...(prev.pasts ?? []),
                          ...(cur.pasts ?? []),
                        ],
                        lastSearch: cur.lastSearch,
                      };
                    },
                  },
                  isTyping: false,
                });
                navigate('/results');
              }}
            >
              <div className={style.suggestInner}>
                <ArrowUpIcon />
                <option value={word} label={word}></option>
              </div>
              <span className={style.clickTag}>
                click on to select
              </span>
            </div>
          ))}
      </datalist>
    </div>
  );
};
export default AutoSuggest;
