import PrimaryButton from '../UI/button/PrimaryButton';
import style from '../../styles/input.module.css';
import SearchIcon from '../UI/Icons/SearchIcon';
import useGlobalDispatch from '../../hooks/useGlobalDispatch';
import useGlobalState from '../../hooks/useGlobalState';
import AutoSuggest from '../autoSuggest/AutoSuggest';

const Input = () => {
  const dispatch = useGlobalDispatch();
  const { isTyping } = useGlobalState(['isTyping']);

  return (
    <div className={style.outterInputBox}>
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
          onBlur={() => {
            dispatch({ isTyping: false });
          }}
        />

        <span className={style.searchBtnBox}>
          <PrimaryButton>Search</PrimaryButton>
        </span>
      </div>
      <AutoSuggest
        isSuggestAllowed={isTyping}
        inputId="word_search_input"
        showClass={style.showSuggests}
        hideClass={style.hideSuggests}
        suggests={[
          ['adeolu', Math.random()],
          ['Omolabake', Math.random()],
          ['Ishola', Math.random()],
        ]}
      />
    </div>
  );
};

export default Input;
