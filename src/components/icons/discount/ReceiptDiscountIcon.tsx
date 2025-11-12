import React from "react";

interface ReceiptDiscountIconProps {
  size?: number;
  className?: string;
  color?: string;
}

const ReceiptDiscountIcon: React.FC<ReceiptDiscountIconProps> = ({
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
        d="M22.5 6V8.42C22.5 10 21.5 11 19.92 11H16.5V4.01C16.5 2.9 17.41 2 18.52 2C19.61 2.01 20.61 2.45 21.33 3.17C22.05 3.9 22.5 4.9 22.5 6Z"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 7V21C2.5 21.83 3.44 22.3 4.1 21.8L5.81 20.52C6.21 20.22 6.77 20.26 7.13 20.62L8.79 22.29C9.18 22.68 9.82 22.68 10.21 22.29L11.89 20.61C12.24 20.26 12.8 20.22 13.19 20.52L14.9 21.8C15.56 22.29 16.5 21.82 16.5 21V4C16.5 2.9 17.4 2 18.5 2H7.5H6.5C3.5 2 2.5 3.79 2.5 6V7Z"
        stroke={color}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.77 13.7295L12.23 8.26953"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.4247 13.5H12.4337"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.6947 8.5H6.70368"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ReceiptDiscountIcon;
