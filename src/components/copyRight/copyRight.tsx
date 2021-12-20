import { FC } from 'react';

const CopyRight: FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gridColumn: '-2/2',
        marginBottom: '2rem',
      }}
    >
      <p
        style={{
          textTransform: 'capitalize',
          color: '#515151',
        }}
      >
        Built by&nbsp;
        <abbr
          title="Olabisi Onabanjo State University"
          style={{ textTransform: 'uppercase' }}
        >
          &nbsp; oou &nbsp;
        </abbr>
        computer engineering finialist &copy;
        {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default CopyRight;
