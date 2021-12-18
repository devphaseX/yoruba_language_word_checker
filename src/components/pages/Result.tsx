import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import useGlobalState from '../../hooks/useGlobalState';
import Input from '../input/Input';
import Navigation from '../navigation/Navigation';
import style from '../../styles/result.module.css';
import SearchResult from '../searchResult/SearchResult';

const Result: FC = () => {
  const state = useGlobalState(['searchResult']);

  if (!state.searchResult) {
    return <Navigate to="/" />;
  }
  return (
    <div className={style.resultPage}>
      <header className={style.result_header}>
        <Input />
        <Navigation />
      </header>
      <div className={style.resultBody}>
        <h2 className={style.searchedWord}>
          <span className={style.searchTag}>
            Search Word
          </span>
          <span></span>
        </h2>
        <SearchResult />
      </div>
    </div>
  );
};

export default Result;
