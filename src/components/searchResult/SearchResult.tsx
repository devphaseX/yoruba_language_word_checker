import { FC } from 'react';
import useGlobalState from '../../hooks/useGlobalState';
import style from '../../styles/searchResult.module.css';
import { InvalidSuggest, SuggestDetail } from '../../App';

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
        We found the word in the dictionary
      </h3>
      <div>
        <h2 className={style.searchKeyWord}>
          {searchedWord.word}
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
    .sort((a, b) => ascendingOrder(a[1], b[1]));
  return (
    <div>
      <h3 className={style.resultMsg}>
        We didn't found the word in the dictionary
      </h3>
      <div>
        <h2 className={style.searchKeyWord}>
          {searchedWord.word}
        </h2>
      </div>
      <div className={style.suggestion_board}>
        <h4 className={style.suggest_question}>
          Do you mean?
        </h4>
        <div>
          {sortedSuggestedWord.map((sug, i) => (
            <span key={sug[0] + i}>{sug[0]}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

function ascendingOrder(a: number, b: number) {
  return a - b;
}
export default SearchResult;
