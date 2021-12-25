import { SuggestResult as SuggestWord } from './components/types';
import { createStore } from './store';

export type SearchMode = (
  | { _type: 'light' }
  | { _type: 'deep' }
) & { status: boolean };
export interface AppConfig {
  searchMode: { mode: SearchMode };
  allowPersist: boolean;
}

export interface GlobalState {
  isHistoryOpen: boolean;
  isModalOpen: boolean;
  appConfig: AppConfig;
  isTyping: boolean;
  searchResult: null | SuggestDetail;
  searchedWord?: string;
  history: SearchHistory;
  suggests: Array<RealTimeSuggest>;
}

export type ValidSuggest = { _type: '_valid' };
export type InvalidSuggest = {
  _type: '_invalid';
  suggests: Array<SuggestWord>;
};

export interface RealTimeSuggest extends ValidSuggest {
  word: string;
  probability: number;
}

export type SuggestDetail = (
  | InvalidSuggest
  | ValidSuggest
) & { word: string };

export interface SearchHistory {
  lastSearch: SuggestDetail | null;
  pasts: Array<SuggestDetail> | null;
}

export const store = createStore<GlobalState>({
  isHistoryOpen: false,
  isModalOpen: false,
  appConfig: {
    searchMode: { mode: { _type: 'light', status: true } },
    allowPersist: false,
  },
  isTyping: false,
  searchResult: {
    _type: '_invalid',
    word: 'Adeniyi',
    suggests: [['Adeoluwa', Math.random()]],
  },
  history: {
    lastSearch: null,
    pasts: [
      { _type: '_valid', word: 'adeniyi' },
      {
        _type: '_invalid',
        word: 'ad',
        suggests: [['adeniyi', Math.random()]],
      },
    ],
  },
  suggests: [
    {
      _type: '_valid',
      word: 'adeolu',
      probability: Math.random(),
    },
    {
      _type: '_valid',
      word: 'Omolabake',
      probability: Math.random(),
    },
    {
      _type: '_valid',
      word: 'Ishola',
      probability: Math.random(),
    },
  ],
});

export type InferStoreShape = typeof store;
