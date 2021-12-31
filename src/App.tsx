import { createContext, useEffect } from 'react';
import Layout from './components/layout/Layout';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './components/pages/Home';
import './styles/index.css';
import Result from './components/pages/Result';
import { store } from './appStore';
import axios from './axios';

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
