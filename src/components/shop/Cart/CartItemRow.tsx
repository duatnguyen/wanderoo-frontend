import React from "react";
import { Select } from "antd";
import Checkbox from "../Checkbox";
import { formatCurrencyVND } from "../../../features/shop/pages/Cart/utils/formatCurrency";

type ProductDetailVariant = {
  id: number;
  productDetailId: number;
  imageUrl: string | null;
  attributes: Array<{
    name: string;
    id: number;
    groupLevel: number;
    value: string;
  }>;
  originalPrice: number;
  discountedPrice: number;
  discountValue: string | null;
  websiteSoldQuantity: number;
};

type CartItemDisplay = {
  id: string;
  productId: string | number;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variant?: string;
  variantOptions?: { label: string; value: string }[];
  websiteSoldQuantity?: number; // For stock status
  availableVariants?: ProductDetailVariant[]; // Available variants
  cartId?: number; // For variant change
  discountValue?: string | null; // Discount value for badge display
};

interface CartItemRowProps {
  item: CartItemDisplay;
  isSelected: boolean;
  onSelect: () => void;
  onQuantityChange: (change: number) => void;
  onRemove: () => void;
  onVariantChange: (cartId: number, newProductDetailId: number) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  isSelected,
  onSelect,
  onQuantityChange,
  onRemove,
  onVariantChange,
}) => {
  const isOutOfStock = item.websiteSoldQuantity === 0;
  const isQuantityExceedsStock = (item.websiteSoldQuantity || 0) < item.quantity;

  // Disable checkbox if out of stock
  const isCheckboxDisabled = isOutOfStock;

  // Disable quantity controls if out of stock or quantity exceeds stock
  const isQuantityDisabled = isOutOfStock || isQuantityExceedsStock;

  // Format discount value for display
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
        // Get the currency symbol (đ or Đ) - preserve original case
        const currencySymbol = discountStr.includes("Đ") ? "Đ" : "đ";
        return `-${formattedNumber}${currencySymbol}`;
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

  // Format discount value for display
  const displayDiscount = item.discountValue ? formatDiscountValue(item.discountValue) : undefined;

  // Xác định biến thể hiện tại dựa trên productDetailId hoặc id của variant
  const selectedVariant = item.availableVariants?.find((variant) => {
    const currentId = Number(item.productId);
    return (
      variant.productDetailId === currentId ||
      variant.id === currentId
    );
  });

  const selectedVariantValue = selectedVariant?.productDetailId ?? undefined;

  return (
    <div
      className={`grid gap-4 px-5 py-4 items-center transition-colors ${isQuantityDisabled
        ? "opacity-50 bg-gray-50"
        : "hover:bg-gray-50"
        }`}
      style={{
        gridTemplateColumns: "3fr 1.2fr 1.5fr 1.5fr 0.8fr",
      }}
    >
      {/* Product Info */}
      <div className="flex gap-3 items-center">
        <div className="flex items-center">
          <Checkbox
            checked={isSelected}
            onChange={onSelect}
            disabled={isCheckboxDisabled}
          />
        </div>
        <div className="w-16 h-16 rounded border border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden relative">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium">
              No Image
            </div>
          )}
          {/* Discount badge - Top for both PERCENT and FIXED */}
          {displayDiscount && (
            <div className="absolute right-0 top-0 bg-[#ffe8a3] text-red-600 font-semibold text-[10px] rounded-bl-[4px] px-1 py-0.5 flex items-center gap-0.5 z-10">
              <svg
                width="10"
                height="10"
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
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
            {item.name}
          </h3>
          {item.variant && (
            <div className="mt-1">
              <p className="text-xs text-gray-500 mb-1">
                {item.variant}
              </p>
              {item.availableVariants && item.availableVariants.length > 0 && (
                <Select
                  // Dùng productDetailId của biến thể hiện tại để Select lấy đúng label
                  value={selectedVariantValue}
                  onChange={(value) => {
                    if (item.cartId && typeof value === 'number') {
                      onVariantChange(item.cartId, value);
                    }
                  }}
                  className="w-full text-xs"
                  size="small"
                  placeholder="Chọn biến thể"
                  options={item.availableVariants.map((variant) => {
                    const variantLabel = variant.attributes
                      ?.map(attr => `${attr.name}: ${attr.value}`)
                      .join(", ") || "Mặc định";
                    const isVariantOutOfStock = variant.websiteSoldQuantity === 0;

                    return {
                      value: variant.productDetailId,
                      label: (
                        <div className="flex items-center justify-between">
                          <span className={isVariantOutOfStock ? "text-gray-400" : ""}>
                            {variantLabel}
                            {isVariantOutOfStock && " (Hết hàng)"}
                          </span>
                          {!isVariantOutOfStock && (
                            <span className="text-xs text-gray-500 ml-2">
                              {formatCurrencyVND(variant.discountedPrice)}
                            </span>
                          )}
                        </div>
                      ),
                      disabled: isVariantOutOfStock,
                    };
                  })}
                />
              )}
            </div>
          )}
          {isOutOfStock && (
            <span className="text-xs text-red-600 font-medium inline-block mt-1">
              Hết hàng
            </span>
          )}
          {isQuantityExceedsStock && !isOutOfStock && (
            <span className="text-xs text-red-600 font-medium inline-block mt-1">
              Số lượng vượt quá tồn kho ({item.websiteSoldQuantity} có sẵn)
            </span>
          )}
        </div>
      </div>

      {/* Unit Price */}
      <div className="text-center">
        {item.originalPrice && item.originalPrice > item.price ? (
          <div className="space-y-0.5">
            <div className="text-xs text-gray-400 line-through">
              {formatCurrencyVND(item.originalPrice)}
            </div>
            <div className="text-sm font-semibold text-[#E04D30]">
              {formatCurrencyVND(item.price)}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-900">
            {formatCurrencyVND(item.price)}
          </div>
        )}
      </div>

      {/* Quantity */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1 border border-gray-200 rounded">
          <button
            onClick={() => onQuantityChange(-1)}
            disabled={item.quantity <= 1 || isQuantityDisabled}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
            aria-label="Giảm số lượng"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
            </svg>
          </button>
          <input
            type="number"
            value={item.quantity}
            readOnly
            className="w-12 h-8 text-center text-sm font-medium border-0 focus:outline-none"
          />
          <button
            onClick={() => onQuantityChange(1)}
            disabled={isQuantityDisabled}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
            aria-label="Tăng số lượng"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="text-center">
        <div className="text-sm font-semibold text-[#E04D30]">
          {formatCurrencyVND(item.price * item.quantity)}
        </div>
      </div>

      {/* Remove Button */}
      <div className="flex justify-center">
        <button
          onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
          aria-label="Xóa sản phẩm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-500"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
