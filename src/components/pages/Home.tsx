import { FC } from 'react';
import Search from '../search/Search';
import style from '../../styles/homePage.module.css';

const Home: FC = () => {
  return (
    <div className={style.homePage}>
      <Search />
    </div>
  );
};

export default Home;
