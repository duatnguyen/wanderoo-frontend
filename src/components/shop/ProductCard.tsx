import React from "react";

export type ProductCardProps = {
  id?: string | number;
  imageUrl: string;
  name: string;
  price: number; // current price in VND
  originalPrice?: number; // optional old price
  rating?: number; // 0-5
  discountPercent?: number; // e.g. 35 for -35%
  onClick?: () => void;
  className?: string;
};

function formatCurrencyVND(value: number) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("vi-VN")}đ`;
  }
}

const Star: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg
    viewBox="0 0 20 20"
    width="16"
    height="16"
    className={filled ? "text-yellow-400" : "text-gray-300"}
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
  </svg>
);

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  name,
  price,
  originalPrice,
  rating = 0,
  discountPercent,
  onClick,
  className = "",
}) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));

  return (
    <div
      className={`border border-[#454545]/60 rounded-[8px] overflow-hidden bg-white hover:shadow-md transition-shadow ${className}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-[245px] object-cover"
        />
        {typeof discountPercent === "number" && (
          <div className="absolute right-2 top-2 bg-[#ffe8a3] text-red-600 font-semibold text-[14px] rounded-[4px] px-2 py-1 flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="text-red-600"
            >
              <path
                d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                fill="currentColor"
              />
            </svg>
            -{discountPercent}%
          </div>
        )}
      </div>
      <div className="px-4 py-3 border-t border-[#454545]/40">
        <h3 className="text-[#454545] text-[16px] font-semibold leading-snug line-clamp-2 min-h-[44px]">
          {name}
        </h3>
        <div
          className="flex items-center gap-1 mt-2"
          aria-label={`Rating ${rating} out of 5`}
        >
          {stars.map((filled, idx) => (
            <Star key={idx} filled={filled} />
          ))}
        </div>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-[18px] font-semibold text-[#454545]">
            {formatCurrencyVND(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-[14px] text-[#454545] line-through">
              {formatCurrencyVND(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
