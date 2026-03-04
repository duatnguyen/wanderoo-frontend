import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Define Product type inline since it's only used for the optional product prop
export interface Product {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating?: number;
  discountPercent?: number;
  discountValue?: string;
  [key: string]: any; // Allow for additional properties
}

export type ProductCardProps = {
  id?: string | number;
  imageUrl: string;
  name: string;
  price: number; // current price in VND
  originalPrice?: number; // optional old price
  rating?: number; // 0-5
  discountPercent?: number; // For backward compatibility (e.g. 35 for -35%)
  discountValue?: string; // Formatted discount value from API (e.g. "-35%" or "-1.000đ")
  onClick?: () => void;
  className?: string;
  product?: Product; // Full product data for navigation
};

function formatCurrencyVND(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

const Star: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg
    viewBox="0 0 20 20"
    width="14"
    height="14"
    className={filled ? "text-yellow-400" : "text-gray-300"}
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
  </svg>
);

// Helper function to format discount value for display
// API returns: "-35%" or "-1000đ" or "35%" or "1000đ"
// Display format: "-35%" or "-1.000đ" (with thousand separator for VND)
const formatDiscountValue = (discountValue: string | null | undefined): string | undefined => {
  if (!discountValue) return undefined;
  const discountStr = discountValue.toString().trim();

  // Check if it's a percentage (contains "%")
  if (discountStr.includes("%")) {
    // For percentage, just ensure it starts with "-"
    if (discountStr.startsWith("-")) {
      return discountStr;
    }
    return `-${discountStr}`;
  }

  // For VND amount (contains "đ" or "Đ")
  if (discountStr.includes("đ") || discountStr.includes("Đ")) {
    // Extract ALL digits (remove all non-digit characters except minus sign)
    const cleaned = discountStr.replace(/[^\d-]/g, "");
    const numberMatch = cleaned.match(/(-?\d+)/);
    if (numberMatch) {
      const numberStr = numberMatch[1];
      const number = Math.abs(parseInt(numberStr, 10)); // Get absolute value
      // Format number with thousand separator (.)
      const formattedNumber = number.toLocaleString("vi-VN");
      // Determine if original had "-" prefix
      const hasMinus = discountStr.startsWith("-") || numberStr.startsWith("-");
      // Get the currency symbol (đ or Đ) - preserve original case
      const currencySymbol = discountStr.includes("Đ") ? "Đ" : "đ";
      return hasMinus ? `-${formattedNumber}${currencySymbol}` : `-${formattedNumber}${currencySymbol}`;
    }
  }

  // If it's just a number without currency, assume it's percentage
  const numberMatch = discountStr.match(/(-?\d+)/);
  if (numberMatch) {
    const hasMinus = discountStr.startsWith("-");
    return hasMinus ? `${discountStr}%` : `-${discountStr}%`;
  }

  // Fallback: ensure it starts with "-"
  if (discountStr.startsWith("-")) {
    return discountStr;
  }
  return `-${discountStr}`;
};

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl) return undefined;

  // If already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If relative path starting with /, add base URL
  if (imageUrl.startsWith('/')) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    return `${baseUrl}${imageUrl}`;
  }

  // If relative path not starting with /, assume it's from uploads
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${baseUrl}/static/${imageUrl}`;
};

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  originalPrice,
  rating = 0,
  discountPercent,
  discountValue,
  onClick,
  className = "",
  id,
  product,
  imageUrl,
}) => {
  const navigate = useNavigate();
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

  const FALLBACK_IMAGE = "/images/placeholders/no-image.svg";
  const displayImage = imageUrl && imageUrl.trim().length > 0
    ? (getImageUrl(imageUrl) || imageUrl)
    : FALLBACK_IMAGE;

  // Format discount value for display (prioritize discountValue from API)
  const displayDiscount = discountValue
    ? formatDiscountValue(discountValue)
    : (discountPercent ? `-${discountPercent}%` : undefined);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (id && product) {
      // Navigate to product detail with full product data
      navigate(`/shop/products/${id}`, {
        state: { product },
      });
    } else if (id) {
      // Fallback: navigate with just ID
      navigate(`/shop/products/${id}`);
    }
  };

  return (
    <Button
      variant="ghost"
      asChild
      className={`h-auto w-full p-0 block text-left font-normal hover:bg-transparent ${className}`}
      onClick={handleClick}
    >
      <div
        className="cursor-pointer border border-[#454545]/60 rounded-[8px] overflow-hidden bg-white hover:shadow-md transition-shadow h-full flex flex-col"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
      >
        <div className="relative">
          <div className="w-full h-[180px] border border-gray-300 bg-gray-100 overflow-hidden">
            <img
              src={displayImage}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.dataset.fallbackApplied === "true") {
                  return;
                }
                target.dataset.fallbackApplied = "true";
                target.src = FALLBACK_IMAGE;
              }}
            />
          </div>
          {/* Discount badge - Top for both PERCENT and FIXED */}
          {displayDiscount && (
            <div className="absolute right-2 top-2 bg-[#ffe8a3] text-red-600 font-semibold text-xs rounded-[4px] px-1.5 py-0.5 flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className="text-red-600"
              >
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor" />
              </svg>
              {displayDiscount}
            </div>
          )}
        </div>
        <div className="px-3 py-2 border-t border-[#454545]/40 flex-1 flex flex-col">
          <h3 className="text-[#454545] text-[13px] font-semibold leading-snug line-clamp-2 min-h-[34px]">
            {name}
          </h3>
          <div
            className="flex items-center gap-0.5 mt-1"
            aria-label={`Rating ${rating} out of 5`}
          >
            {stars.map((filled, idx) => (
              <Star key={idx} filled={filled} />
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-0.5 pt-1">
            <span className="text-sm font-semibold text-[#454545]">
              {formatCurrencyVND(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-[11px] text-[#777777] line-through">
                {formatCurrencyVND(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Button>
  );
};

export default ProductCard;
