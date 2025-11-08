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

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  isSelected,
  onSelect,
  onQuantityChange,
  onRemove,
  onVariantChange,
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-4 items-start hover:bg-gray-50 transition-colors">
      {/* Checkbox */}
      <div className="col-span-1 flex items-start pt-2">
        <Checkbox checked={isSelected} onChange={onSelect} />
      </div>

      {/* Product Info */}
      <div className="col-span-4 flex gap-3">
        <div className="w-20 h-20 rounded border border-gray-300 bg-transparent flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">
              {item.description}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Phân loại hàng:</span>
            {item.variantOptions ? (
              <Select
                value={item.variant}
                onChange={onVariantChange}
                className="w-[180px]"
                options={item.variantOptions}
              />
            ) : (
              <span className="text-sm text-gray-700">
                {item.variant || "Mặc định"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Unit Price */}
      <div className="col-span-1 text-center pt-2">
        <div className="text-gray-900 font-medium">
          {formatCurrencyVND(item.price)}
        </div>
      </div>

      {/* Quantity */}
      <div className="col-span-2 flex justify-center pt-2">
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
            className="w-12 h-8 text-center border border-gray-300 rounded text-sm font-medium"
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
      <div className="col-span-2 text-center pt-2">
        <div className="text-gray-900 font-semibold">
          {formatCurrencyVND(item.price * item.quantity)}
        </div>
      </div>

      {/* Remove Button */}
      <div className="col-span-2 flex justify-center pt-2">
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

