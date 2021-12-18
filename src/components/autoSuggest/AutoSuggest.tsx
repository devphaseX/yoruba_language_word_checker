import { FC } from 'react';
import { SuggestResult } from '../types';

interface AutoSuggestProps {
  isSuggestAllowed: boolean;
  inputId: string;
  showClass: string;
  hideClass: string;
  suggests: Array<SuggestResult> | null;
}

function ascendingOrder(a: number, b: number) {
  return a - b;
}
const AutoSuggest: FC<AutoSuggestProps> = ({
  isSuggestAllowed,
  inputId,
  showClass,
  hideClass,
  suggests,
}) => {
  const className = [
    isSuggestAllowed && suggests && suggests.length
      ? showClass
      : hideClass,
    'suggest',
  ].join(' ');
  return (
    <div className={className}>
      <h4 className="suggested_word_title">
        Suggested words
      </h4>
      <datalist id={inputId} style={{ display: 'block' }}>
        {suggests!
          .sort((a, b) => ascendingOrder(a[1], b[1]))
          .map(([word], i) => (
            <option
              value={word}
              label={word}
              key={word + i}
            ></option>
          ))}
      </datalist>
    </div>
  );
};
export default AutoSuggest;
