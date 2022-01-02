import { FC } from 'react';
import ArrowUpIcon from '../UI/Icons/ArrowUpIcon';
import style from '../../styles/suggests.module.css';
import useGlobalDispatch from '../../hooks/useGlobalDispatch';
import { useNavigate } from 'react-router-dom';
import {
  mergeHistory,
  RealTimeSuggest,
} from '../../appStore';

interface AutoSuggestProps {
  inputId: string;
  isVisible: boolean;
  suggests: Array<RealTimeSuggest> | null;
  setIsTyping: (typing: boolean) => void;
}

function ascendingOrder(a: number, b: number) {
  return a - b;
}
const AutoSuggest: FC<AutoSuggestProps> = ({
  inputId,
  isVisible,
  suggests,
  setIsTyping,
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
          .map((suggest, i) => (
            <div
              key={suggest.word + i}
              className={style.suggest}
              onClick={() => {
                dispatch({
                  ...mergeHistory(suggest),
                  searchResult: { '[[_data_]]': suggest },
                });
                setIsTyping(false);
                navigate('/results');
              }}
            >
              <div className={style.suggestInner}>
                <ArrowUpIcon />
                <option
                  value={suggest.word}
                  label={suggest.word}
                ></option>
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
