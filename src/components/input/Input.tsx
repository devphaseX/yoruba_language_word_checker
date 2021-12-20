import PrimaryButton from '../UI/button/PrimaryButton';
import style from '../../styles/input.module.css';
import SearchIcon from '../UI/Icons/SearchIcon';
import useGlobalDispatch from '../../hooks/useGlobalDispatch';
import useGlobalState from '../../hooks/useGlobalState';
import AutoSuggest from '../autoSuggest/AutoSuggest';

const Input = () => {
  const dispatch = useGlobalDispatch();
  const { isTyping, suggests } = useGlobalState([
    'isTyping',
    'suggests',
  ]);
  return (
    <div
      className={style.outterInputBox}
      onMouseLeave={() => {
        dispatch({ isTyping: false });
      }}
    >
      <div className={style.innerInputBox}>
        <span className={style.searchIconBox}>
          <SearchIcon />
        </span>
        <input
          type="text"
          className={style.input}
          id="word_search_input"
          onFocus={() => {
            dispatch({ isTyping: true });
          }}
        />

        <span className={style.searchBtnBox}>
          <PrimaryButton>Search</PrimaryButton>
        </span>
      </div>
      {suggests.length ? (
        <AutoSuggest
          inputId="word_search_input"
          isVisible={isTyping}
          suggests={suggests}
        />
      ) : null}
    </div>
  );
};

export default Input;
