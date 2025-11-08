import React from "react";

interface CreditCardPercentIconProps {
  size?: number;
  className?: string;
  color?: string;
}

const CreditCardPercentIcon: React.FC<CreditCardPercentIconProps> = ({
  size = 24,
  className = "",
  color = "black",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 6.5H5C3.89543 6.5 3 7.39543 3 8.5V14.5M21 3.5L16 9.5M15 3.5L15 4.5M22 8.5L22 9.5M3 14.5V17.5C3 18.6046 3.89543 19.5 5 19.5H19C20.1046 19.5 21 18.6046 21 17.5V14.5H3Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CreditCardPercentIcon;
