import React from "react";
import { Select } from "antd";
import Checkbox from "../Checkbox";
import { formatCurrencyVND } from "../../../features/shop/pages/Cart/utils/formatCurrency";

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
};

interface CartItemRowProps {
  item: CartItemDisplay;
  isSelected: boolean;
  onSelect: () => void;
  onQuantityChange: (change: number) => void;
  onRemove: () => void;
  onVariantChange: (variant: string) => void;
}

const DropdownArrow = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-gray-500"
  >
    <path d="M6.75 9.75L12 15l5.25-5.25H6.75z" />
  </svg>
);

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  isSelected,
  onSelect,
  onQuantityChange,
  onRemove,
  onVariantChange,
}) => {
  return (
    <div
      className="grid gap-4 px-4 py-4 items-start hover:bg-gray-50 transition-colors"
      style={{
        gridTemplateColumns: "2.5fr 1.8fr 1.2fr 1.5fr 1.5fr 0.8fr",
      }}
    >
      {/* Product Info */}
      <div className="flex gap-3 items-start">
        <div className="flex items-start pt-2">
          <Checkbox checked={isSelected} onChange={onSelect} />
        </div>
        <div className="w-20 h-20 rounded border border-gray-300 bg-transparent flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-medium text-gray-900 mb-0 line-clamp-2">
            {item.name}
          </h3>
        </div>
      </div>

      {/* Variant Column */}
      <div className="flex flex-col gap-2 justify-center">
        <div className="flex items-center gap-1 text-[14px] text-gray-600">
          <span>Phân loại hàng:</span>
          <DropdownArrow />
        </div>
        {item.variantOptions ? (
          <Select
            value={item.variant}
            onChange={onVariantChange}
            className="w-[200px] text-[14px]"
            size="small"
            options={item.variantOptions}
            suffixIcon={<DropdownArrow />}
            popupClassName="cart-variant-dropdown"
          />
        ) : (
          <span className="text-[14px] text-gray-700">
            {item.variant || "Mặc định"}
          </span>
        )}
      </div>

      {/* Unit Price */}
      <div className="text-center pt-2">
        <div className="text-[14px] text-gray-900 font-medium">
          {formatCurrencyVND(item.price)}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex justify-center pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(-1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Giảm số lượng"
          >
            <svg
              width="12"
              height="12"
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
            className="w-12 h-8 text-center border border-gray-300 rounded text-[14px] font-medium"
          />
          <button
            onClick={() => onQuantityChange(1)}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            aria-label="Tăng số lượng"
          >
            <svg
              width="12"
              height="12"
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
      <div className="text-center pt-2">
        <div className="text-[14px] text-gray-900 font-semibold">
          {formatCurrencyVND(item.price * item.quantity)}
        </div>
      </div>

      {/* Remove Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onRemove}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          aria-label="Xóa sản phẩm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-600"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
