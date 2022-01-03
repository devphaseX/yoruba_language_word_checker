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
  popLastChar,
  sort,
  takeFromList,
} from '../utils';
import { SuggestResult } from '../types';
import {
  mergeHistory,
  RealTimeSuggest,
  SuggestDetail,
} from '../../appStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { unwrappedData } from '../utils/index';
import useNetworkStatus from '../../hooks/useNetwork';

function getRealTimeSuggests(
  searchResult: Array<SuggestResult>,
  searchWord: string
) {
  const sortUsingProbability = (
    suggests: Array<SuggestResult>
  ) =>
    sort(suggests, (f, s) => descendingOrder(f[1], s[1]));

  const pickTopFiveSuggest = (
    suggests: Array<SuggestResult>
  ) => {
    return takeFromList(suggests, 0, 7);
  };

  let getSuggestsFromSearchWord = (
    suggests: Array<SuggestResult>
  ) => excludeSearchWordFromSuggest(suggests, searchWord);

  function mapSuggestToReal([
    word,
    probability,
  ]: SuggestResult): RealTimeSuggest {
    return {
      _type: '_valid',
      probability,
      word,
    };
  }

  return pipe(
    getSuggestsFromSearchWord,
    removeInvalidSuggest((suggest) => {
      return (
        suggest[0].length > searchWord.length &&
        normalizeSubstringComparison(suggest[0], searchWord)
      );
    }),
    sortUsingProbability,
    pickTopFiveSuggest
  )(searchResult).map(mapSuggestToReal);
}

function normalizeSubstringComparison(
  longest: string,
  short: string
) {
  const longCharList = [...longest];
  return [...short].every((char, i) => {
    return compareByChar(char, longCharList[i]);
  });

  function compareByChar(char1: string, char2: string) {
    return (
      char1
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '') ===
      char2
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
    );
  }
}

function excludeSearchWordFromSuggest(
  suggest: Array<SuggestResult>,
  searchWord: string
) {
  return suggest.filter(
    ([suggestword]) => suggestword !== searchWord
  );
}

function removeInvalidSuggest(
  suggestPasser: (suggest: SuggestResult) => boolean
) {
  return function suggestValidator(
    suggests: Array<SuggestResult>
  ) {
    return suggests.filter(suggestPasser);
  };
}

const Input = () => {
  const dispatch = useGlobalDispatch();
  const onlineStatus = useNetworkStatus();

  const [currentSuggests, setCurrentSuggests] =
    useState<Array<RealTimeSuggest> | null>(null);

  const [isTyping, setIsTyping] = useState(false);

  const [userInput, setUserInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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
    if (userInput) {
      if (onlineStatus.status === 'online') {
        try {
          const searchResult = await axios
            .post(
              '/api/search',
              { search_word: popLastChar(userInput, 2) },
              { cancelToken: source }
            )
            .then<Array<SuggestResult>>(unwrappedData);

          handler(
            getRealTimeSuggests(searchResult, userInput),
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

                  if (location.pathname === '/results') {
                    setIsTyping(false);
                  }
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
