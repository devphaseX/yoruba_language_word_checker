import {
  fallbackDataResolver,
  StateReplacement,
} from './components/utils';
import { createStore } from './store';
import { mergeArray } from './components/utils/index';

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
  searchResult: null | SuggestDetail;
  searchedWord?: string;
  history: SearchHistory;
}

export type ValidSuggest = { _type: '_valid' };
export type InvalidSuggest = {
  _type: '_invalid';
  suggests: Array<RealTimeSuggest>;
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
  searchResult: null,
  history: {
    lastSearch: null,
    pasts: [],
  },
});

export type InferStoreShape = typeof store;

export function mergeHistoryPast(
  { pasts }: SearchHistory,
  currentHistory: SearchHistory
) {
  const currentPasts = mergeArray(
    fallbackDataResolver(pasts, 'array'),
    fallbackDataResolver(currentHistory.pasts, 'array')
  );
  return {
    ...currentHistory,
    pasts: currentPasts,
  };
}

export function mergeHistory(
  currentSearchResult: SuggestDetail
): StateReplacement<GlobalState> {
  return {
    searchResult: {
      '[[_data_]]': currentSearchResult,
    },
    history: {
      '[[_data_]]': {
        lastSearch: currentSearchResult,
        pasts: [currentSearchResult],
      },
      mapper: mergeHistoryPast,
    },
  };
}
