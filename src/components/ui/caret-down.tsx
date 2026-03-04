interface CaretDownProps {
  className?: string;
  width?: number;
  height?: number;
}

export function CaretDown({
  className,
  width = 11,
  height = 5,
}: CaretDownProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 11 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_1524_24299)">
        <path
          d="M9.46854 -0.0625H1.53146C1.2934 -0.0625 1.16047 0.188857 1.3079 0.360456L5.27644 4.96222C5.39003 5.09394 5.60876 5.09394 5.72356 4.96222L9.6921 0.360456C9.83953 0.188857 9.7066 -0.0625 9.46854 -0.0625Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_1524_24299">
          <rect width="11" height="5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default CaretDown;
