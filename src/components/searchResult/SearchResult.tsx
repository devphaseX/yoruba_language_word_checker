import { FC } from 'react';
import useGlobalState from '../../hooks/useGlobalState';
import style from '../../styles/searchResult.module.css';
import CheckMarkIcon from '../UI/Icons/CheckMarkIcon';
import CancelIcon from '../UI/Icons/CancelIcon';
import {
  InvalidSuggest,
  SuggestDetail,
} from '../../appStore';

const SearchResult: FC = () => {
  const { searchResult: searchResultData } = useGlobalState(
    ['searchResult', 'searchedWord']
  );

  if (
    searchResultData &&
    searchResultData._type === '_valid'
  ) {
    return <FoundResult searchedWord={searchResultData} />;
  } else {
    return (
      <NotFoundResult searchedWord={searchResultData!} />
    );
  }
};

interface FoundResultProps {
  searchedWord: SuggestDetail;
}

const FoundResult: FC<FoundResultProps> = ({
  searchedWord,
}) => {
  return (
    <div>
      <h3 className={style.resultMsg}>
        we couldn't find the searched word in our dictionary
      </h3>
      <div>
        <h2 className={style.searchKeyWord}>
          <CheckMarkIcon />
          <span>{searchedWord.word}</span>
        </h2>
      </div>
    </div>
  );
};

interface NotFoundResultProps {
  searchedWord: InvalidSuggest & { word: string };
}

const NotFoundResult: FC<NotFoundResultProps> = ({
  searchedWord,
}) => {
  const sortedSuggestedWord = searchedWord.suggests
    .slice()
    .sort((a, b) =>
      ascendingOrder(a.probability, b.probability)
    );
  return (
    <div>
      <h3 className={style.resultMsg}>
        We cannot find this word in our dictionary
      </h3>
      <div>
        <h2 className={style.searchKeyWord}>
          <CancelIcon />
          <span>{searchedWord.word}</span>
        </h2>
      </div>
      {sortedSuggestedWord.length ? (
        <div className={style.suggestion_board}>
          <h4 className={style.suggest_question}>
            Do you mean?
          </h4>
          <div className={style.suggest_list}>
            {sortedSuggestedWord.map((sug, i) => (
              <span key={sug.word + i}>{sug.word}</span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

function ascendingOrder(a: number, b: number) {
  return a - b;
}
export default SearchResult;
