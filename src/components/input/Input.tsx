import PrimaryButton from '../UI/button/PrimaryButton';
import style from '../../styles/input.module.css';
import SearchIcon from '../UI/Icons/SearchIcon';
import useGlobalDispatch from '../../hooks/useGlobalDispatch';
import useGlobalState from '../../hooks/useGlobalState';
import AutoSuggest from '../autoSuggest/AutoSuggest';
import { useEffect, useState } from 'react';
import axios from '../../axios';
import axiosCall, { CancelToken } from 'axios';
import { descendingOrder, sort } from '../utils';
import { SuggestResult } from '../types';
import {
  RealTimeSuggest,
  SuggestDetail,
} from '../../appStore';
import { useNavigate } from 'react-router-dom';
import SearchResult from '../searchResult/SearchResult';

const Input = () => {
  const dispatch = useGlobalDispatch();
  const { isTyping, suggests } = useGlobalState([
    'isTyping',
    'suggests',
  ]);

  const [userInput, setUserInput] = useState('');
  const navigate = useNavigate();

  async function searchHanlder<R = unknown, E = unknown>(
    searchOption: {
      source: CancelToken;
      resultHanlder: (
        result: R,
        searchWord: string
      ) => void;
    },
    errorHandler?: (error: E) => void
  ) {
    if (userInput) {
      try {
        const searchResult = await axios
          .post(
            '/api/search',
            { search_word: userInput },
            { cancelToken: searchOption.source }
          )
          .then<Array<SuggestResult>>((res) => res.data);

        const pickedSearchResult = sort(
          searchResult,
          (f, s) => descendingOrder(f[1], s[1])
        )
          .slice(0, 4)
          .map(
            ([word, probability]): RealTimeSuggest => ({
              _type: '_valid',
              probability,
              word,
            })
          );
        searchOption.resultHanlder(
          pickedSearchResult as any,
          userInput
        );
      } catch (e: any) {
        if (errorHandler) return void errorHandler(e);
        throw e;
      }
    }
  }
  const source = axiosCall.CancelToken.source();

  useEffect(() => {
    searchHanlder<Array<RealTimeSuggest>>(
      {
        source: source.token,
        resultHanlder(result) {
          dispatch({
            suggests: { '[[_data_]]': result },
          });
        },
      },
      () => {}
    );
    return () => {
      source.cancel();
    };
  }, [userInput]);
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
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
        />

        <span className={style.searchBtnBox}>
          <PrimaryButton
            onClick={() => {
              searchHanlder<Array<RealTimeSuggest>>(
                {
                  source: source.token,
                  resultHanlder(result, searchWord) {
                    const validWord = result.find(
                      (word) => {
                        return word.word === searchWord;
                      }
                    );

                    const invalidWord: SuggestDetail = {
                      _type: '_invalid',
                      suggests: result,
                      word: searchWord,
                    };

                    const SearchResult =
                      validWord || invalidWord;

                    dispatch({
                      searchResult: {
                        '[[_data_]]': SearchResult,
                      },
                      history: {
                        '[[_data_]]': {
                          lastSearch: SearchResult,
                          pasts: [SearchResult],
                        },
                        mapper(
                          { pasts },
                          newHistoryEntries
                        ) {
                          return {
                            ...newHistoryEntries,
                            pasts: [
                              ...(pasts || []),
                              ...(newHistoryEntries.pasts ||
                                []),
                            ],
                          };
                        },
                      },
                    });
                    navigate('/results');
                  },
                },
                () => {}
              );
            }}
          >
            Search
          </PrimaryButton>
        </span>
      </div>
      {suggests && suggests.length && userInput ? (
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
