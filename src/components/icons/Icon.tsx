import React from "react";
import ShopLogo from "@/assets/icons/ShopLogo.svg";

export type IconName =
  | "image"
  | "trash"
  | "plus"
  | "arrow-left"
  | "close"
  | "star"
  | "chevron-down"
  | "shop-logo";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = "",
  color,
  strokeWidth = 2,
  onClick,
}) => {
  const getIconPath = () => {
    switch (name) {
      case "image":
        return (
          <>
            <rect
              x="3"
              y="3"
              width="26"
              height="26"
              rx="2"
              stroke={color || "#e04d30"}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle cx="11" cy="11" r="2.5" fill={color || "#e04d30"} />
            <path
              d="M3 23L10 16L15 21L22 14L29 21V27C29 28.1046 28.1046 29 27 29H5C3.89543 29 3 28.1046 3 27V23Z"
              fill={color || "#e04d30"}
              opacity="0.3"
            />
            <path
              d="M10 16L3 23M15 21L10 16M22 14L15 21M29 21L22 14"
              stroke={color || "#e04d30"}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );

      case "trash":
        return (
          <>
            <path
              d="M3 6H5H21"
              stroke={color || "#322f30"}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
              stroke={color || "#322f30"}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );

      case "plus":
        return (
          <path
            d="M12.5 5V20M5 12.5H20"
            stroke={color || "#1a71f6"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      case "arrow-left":
        return (
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke={color || "#272424"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      case "close":
        return (
          <path
            d="M12 4L4 12M4 4L12 12"
            stroke={color || "#737373"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      case "star":
        return (
          <path
            d="M10 2L12.5 7.5L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7.5L10 2Z"
            fill={color || "#322f30"}
          />
        );

      case "chevron-down":
        return (
          <path
            d="M6 9L12 15L18 9"
            stroke={color || "#322f30"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );

      case "shop-logo":
        return (
          <img
            src={ShopLogo}
            alt="Shop Logo"
            style={{ width: size, height: size }}
            className={className}
          />
        );

      default:
        return null;
    }
  };

  const getViewBox = () => {
    switch (name) {
      case "image":
        return "0 0 32 32";
      case "plus":
        return "0 0 25 25";
      case "close":
        return "0 0 12 12";
      case "star":
        return "0 0 20 20";
      case "shop-logo":
        return `0 0 ${size} ${size}`;
      default:
        return "0 0 24 24";
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={getViewBox()}
      fill="none"
      className={className}
      onClick={onClick}
      style={{ pointerEvents: onClick ? "auto" : "none" }}
    >
      {getIconPath()}
    </svg>
  );
};

export default Icon;
