import { createContext } from 'react';
import Layout from './components/layout/Layout';
import { createStore } from './store';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './components/pages/Home';
import './styles/index.css';
import Result from './components/pages/Result';
import { SuggestResult as SuggestWord } from './components/types';

export type SearchMode = (
  | { _type: 'light' }
  | { _type: 'deep' }
) & { status: boolean };
export interface AppConfig {
  searchMode: { mode: SearchMode };
  allowPersist: boolean;
}

export interface GlobalState {
  isModalOpen: boolean;
  appConfig: AppConfig;
  isTyping: boolean;
  searchResult: null | SuggestDetail;
  searchedWord?: string;
  history: SearchHistory;
}

export type ValidSuggest = { _type: '_valid' };
export type InvalidSuggest = {
  _type: '_invalid';
  suggests: Array<SuggestWord>;
};

export type SuggestDetail = (
  | InvalidSuggest
  | ValidSuggest
) & { word: string };

export interface SearchHistory {
  lastSearch: SuggestDetail | null;
  pasts: Array<SuggestDetail> | null;
}

const store = createStore<GlobalState>({
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
  history: { lastSearch: null, pasts: null },
});

export type InferStoreState = typeof store;
//@ts-ignore
globalThis.store = store;
const context = createContext<typeof store>(store);

export { context as AppContext };
export default function App() {
  return (
    <div className="app" id="me">
      <context.Provider value={store}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/results" element={<Result />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </context.Provider>
    </div>
  );
}
