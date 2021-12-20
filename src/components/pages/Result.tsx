import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalState from '../../hooks/useGlobalState';
import Input from '../input/Input';
import Navigation from '../navigation/Navigation';
import style from '../../styles/result.module.css';
import SearchResult from '../searchResult/SearchResult';
import BackArrow from '../UI/Icons/BackArrow';

const Result: FC = () => {
  const state = useGlobalState(['searchResult']);
  const navigate = useNavigate();

  if (!state.searchResult) {
    navigate('/');
    return null;
  }

  return (
    <div className={style.resultPage}>
      <header className={style.result_header}>
        <Input />
        <Navigation />
      </header>
      <div className={style.resultBody}>
        <h2 className={style.searchedWord}>
          <BackArrow
            onBackHandler={() => {
              navigate('/');
            }}
            iconBoxClassName={style.iconBox}
          />
          <span className={style.searchTag}>
            Searched Word
            <span> "{state.searchResult.word}"</span>
          </span>
        </h2>
        <SearchResult />
      </div>
    </div>
  );
};

export default Result;
