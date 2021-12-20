import { FC } from 'react';

interface BackArrowProps {
  onBackHandler(): void;
  iconBoxClassName?: string;
  iconClassName?: string;
}

const BackArrow: FC<BackArrowProps> = ({
  onBackHandler,
  iconBoxClassName,
  iconClassName,
}) => (
  <span
    onClick={onBackHandler}
    className={iconBoxClassName}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="29.5"
      height="27.194"
      viewBox="0 0 29.5 27.194"
      className={iconClassName}
    >
      <g
        id="streamline-icon-interface-arrows-left_48x48"
        data-name="streamline-icon-interface-arrows-left@48x48"
        transform="translate(1.5 -5.879)"
      >
        <g
          id="Group_95"
          data-name="Group 95"
          transform="translate(0 8)"
        >
          <line
            id="Line_56"
            data-name="Line 56"
            x1="24.5"
            transform="translate(2 11.476)"
            fill="none"
            stroke="#b4b4b4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path
            id="Path_9"
            data-name="Path 9"
            d="M13.19,12,1.714,23.476,13.19,34.951"
            transform="translate(-1.714 -12)"
            fill="none"
            stroke="#b4b4b4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
        </g>
      </g>
    </svg>
  </span>
);

export default BackArrow;
