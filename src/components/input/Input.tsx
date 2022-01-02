import PrimaryButton from '../UI/button/PrimaryButton';
import style from '../../styles/input.module.css';
import SearchIcon from '../UI/Icons/SearchIcon';
import useGlobalDispatch from '../../hooks/useGlobalDispatch';
import AutoSuggest from '../autoSuggest/AutoSuggest';
import { useEffect, useState } from 'react';
import axios from '../../axios';
import axiosCall, { CancelToken } from 'axios';
import {
  descendingOrder,
  findItem,
  pipe,
  sort,
  takeFromList,
} from '../utils';
import { SuggestResult } from '../types';
import {
  mergeHistory,
  RealTimeSuggest,
  SuggestDetail,
} from '../../appStore';
import { useNavigate } from 'react-router-dom';
import { unwrappedData } from '../utils/index';
import useNetworkStatus from '../../hooks/useNetwork';

function getRealTimeSuggests(
  searchResult: Array<SuggestResult>
) {
  const sortUsingProbability = (
    suggests: Array<SuggestResult>
  ) =>
    sort(suggests, (f, s) => descendingOrder(f[1], s[1]));

  const pickTopFiveSuggest = (
    suggests: Array<SuggestResult>
  ) => {
    return takeFromList(suggests, 0, 5);
  };

  return pipe(
    sortUsingProbability,
    pickTopFiveSuggest
  )(searchResult).map(
    ([word, probability]): RealTimeSuggest => ({
      _type: '_valid',
      probability,
      word,
    })
  );
}

const Input = () => {
  const dispatch = useGlobalDispatch();
  const onlineStatus = useNetworkStatus();

  const [currentSuggests, setCurrentSuggests] =
    useState<Array<RealTimeSuggest> | null>(null);

  const [isTyping, setIsTyping] = useState(false);

  const [userInput, setUserInput] = useState('');
  const navigate = useNavigate();

  interface SearchOptionConfig<E> {
    ignoreError: boolean;
    errorHandler: this['ignoreError'] extends true
      ? (error: E) => void
      : undefined;
  }

  type SearchResultHandler = (
    result: Array<RealTimeSuggest>,
    searchWord: string
  ) => void;
  interface SearchOption<E> {
    handler: SearchResultHandler;
    source: CancelToken;
    options: Partial<SearchOptionConfig<E>>;
  }

  async function suggestResolver<E = unknown>({
    handler,
    source,
    options,
  }: SearchOption<E>) {
    console.log(onlineStatus.status);
    if (userInput) {
      if (onlineStatus.status === 'online') {
        try {
          const searchResult = await axios
            .post(
              '/api/search',
              { search_word: userInput },
              { cancelToken: source }
            )
            .then<Array<SuggestResult>>(unwrappedData);

          handler(
            getRealTimeSuggests(searchResult),
            userInput
          );
        } catch (e: any) {
          if (
            !(options.ignoreError && options.errorHandler)
          ) {
            throw e;
          }
        }
        return;
      }
      alert(
        "Sorry you are currently offline. So the search function isn't working, check your connection."
      );
    }
  }

  const source = axiosCall.CancelToken.source();

  useEffect(() => {
    suggestResolver({
      handler: setCurrentSuggests,
      source: source.token,
      options: { ignoreError: true },
    });

    return () => {
      source.cancel();
    };
  }, [userInput]);
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
            setIsTyping(true);
          }}
          onBlur={() => {
            if (userInput === '') {
              setIsTyping(false);
            }
          }}
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
        />

        <span className={style.searchBtnBox}>
          <PrimaryButton
            onClick={() => {
              const searchResultHandler: SearchResultHandler =
                function (suggests, searchWord) {
                  const validWord = findItem(
                    suggests,
                    (suggest) => suggest.word === searchWord
                  );

                  const invalidWord: SuggestDetail = {
                    _type: '_invalid',
                    word: searchWord,
                    suggests,
                  };

                  const currentSearchResult =
                    validWord || invalidWord;

                  dispatch(
                    mergeHistory(currentSearchResult)
                  );
                  navigate('/results');
                };

              suggestResolver({
                handler: searchResultHandler,
                source: source.token,
                options: { ignoreError: true },
              });
            }}
          >
            Search
          </PrimaryButton>
        </span>
      </div>
      {currentSuggests &&
      currentSuggests.length &&
      userInput ? (
        <AutoSuggest
          inputId="word_search_input"
          isVisible={isTyping}
          suggests={currentSuggests}
          setIsTyping={setIsTyping}
        />
      ) : null}
    </div>
  );
};

export default Input;
