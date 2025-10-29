import React from "react";

interface CoinDiscountIconProps {
  size?: number;
  className?: string;
  color?: string;
}

const CoinDiscountIcon: React.FC<CoinDiscountIconProps> = ({
  size = 24,
  className = "",
  color = "#292D32",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 25 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.5 11.3992C8.5 12.1692 9.1 12.7992 9.83 12.7992H11.33C11.97 12.7992 12.49 12.2492 12.49 11.5792C12.49 10.8492 12.17 10.5892 11.7 10.4192L9.3 9.57922C8.82 9.40922 8.5 9.14922 8.5 8.41922C8.5 7.74922 9.02 7.19922 9.66 7.19922H11.16C11.9 7.20922 12.5 7.82922 12.5 8.59922"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 12.8496V13.5896"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 6.41016V7.19016"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.49 17.98C14.9028 17.98 18.48 14.4028 18.48 9.99C18.48 5.57724 14.9028 2 10.49 2C6.07724 2 2.5 5.57724 2.5 9.99C2.5 14.4028 6.07724 17.98 10.49 17.98Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.48 19.88C14.38 21.15 15.85 21.98 17.53 21.98C20.26 21.98 22.48 19.76 22.48 17.03C22.48 15.37 21.66 13.9 20.41 13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CoinDiscountIcon;
