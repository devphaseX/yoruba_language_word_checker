import { FC } from 'react';

interface ExitIconProps {
  onExit(): void;
}

const ExitIcon: FC<ExitIconProps> = ({ onExit }) => {
  return (
    <span
      onClick={onExit}
      style={{
        width: '48px',
        height: '48px',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        backgroundColor: '#fff',
        position: 'relative',
        zIndex: 5000,
        cursor: 'pointer',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="11.647"
        height="11.647"
        viewBox="0 0 11.647 11.647"
      >
        <g
          id="Group_71"
          data-name="Group 71"
          transform="translate(-36.603 -628.785) rotate(45)"
        >
          <line
            id="Line_12"
            data-name="Line 12"
            y2="12.472"
            transform="translate(478.736 412.5)"
            fill="none"
            stroke="#515151"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <line
            id="Line_13"
            data-name="Line 13"
            y2="12.472"
            transform="translate(484.972 418.736) rotate(90)"
            fill="none"
            stroke="#515151"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </span>
  );
};

export default ExitIcon;
