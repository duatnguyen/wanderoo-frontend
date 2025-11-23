import React from "react";
import { cn } from "@/lib/utils";

interface ReturnSidebarIconProps {
  className?: string;
  isActive?: boolean;
}

export const ReturnSidebarIcon: React.FC<ReturnSidebarIconProps> = ({
  className,
  isActive = false,
}) => {
  const strokeColor = isActive ? "#FFFFFF" : "#454545";

  return (
    <svg
      width="29"
      height="27"
      viewBox="0 0 29 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-[28.125px]", className)}
    >
      <path
        d="M5.10063 9.22894C6.12186 6.78127 8.07359 4.83954 10.5265 3.83089C12.9793 2.82224 15.7324 2.82931 18.1801 3.85054C20.7561 4.9367 22.8125 6.97666 23.9193 9.54386L25.2699 12.8283"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.4092 7.70108L25.27 12.8283L20.1428 10.6891"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.5585 16.93C22.5372 19.3777 20.5855 21.3194 18.1326 22.3281C15.6798 23.3367 12.9267 23.3296 10.479 22.3084C7.90299 21.2223 5.84661 19.1823 4.73981 16.6151L3.38924 13.3307"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.51659 15.4699L3.3894 13.3307L1.25022 18.4579"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ReturnSidebarIcon;
