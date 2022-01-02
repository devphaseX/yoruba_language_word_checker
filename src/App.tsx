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
import NetworkStatus from './components/network/NetworkStatus';

const context = createContext<typeof store>(store);

const offlineMsg = `oops!, we noticed your network connection is inactive, search feature only works on active network`;
const onlineMsg = `you are connected.`;
export { context as AppContext };
export default function App() {
  return (
    <div className="app" id="me">
      <NetworkStatus
        offlineStatusMessage={offlineMsg}
        onlineStatusMessage={onlineMsg}
      />
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
