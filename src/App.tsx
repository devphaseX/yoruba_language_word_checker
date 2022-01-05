import { createContext } from 'react';
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
import NetworkStatus from './components/network/NetworkStatus';

const context = createContext<typeof store>(store);

export { context as AppContext };
export default function App() {
  return (
    <div className="app" id="me">
      <NetworkStatus />
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
