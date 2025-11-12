import React from "react";
import Checkbox from "../Checkbox";
import Button from "../Button";
import CartItemRow from "./CartItemRow";
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

interface CartTableProps {
  items: CartItemDisplay[];
  selectedItems: Set<string>;
  onSelectItem: (id: string) => void;
  onSelectAll: () => void;
  onQuantityChange: (productId: string | number, change: number) => void;
  onRemoveItem: (productId: string | number) => void;
  onVariantChange: (productId: string | number, variant: string) => void;
  onDeleteSelected: () => void;
  onCheckout: () => void;
}

const CartTable: React.FC<CartTableProps> = ({
  items,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onQuantityChange,
  onRemoveItem,
  onVariantChange,
  onDeleteSelected,
  onCheckout,
}) => {
  const selectedCartItems = items.filter((item) => selectedItems.has(item.id));
  const totalSelectedItems = selectedCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalAmount = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-100 grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200">
        <div className="col-span-1"></div>
        <div className="col-span-4 text-[14px] font-semibold text-gray-700">Sản phẩm</div>
        <div className="col-span-1 text-[14px] font-semibold text-gray-700 text-center">
          Đơn giá
        </div>
        <div className="col-span-2 text-[14px] font-semibold text-gray-700 text-center">
          Số lượng
        </div>
        <div className="col-span-2 text-[14px] font-semibold text-gray-700 text-center">
          Thành tiền
        </div>
        <div className="col-span-2 text-[14px] font-semibold text-gray-700 text-center">
          Thao tác
        </div>
      </div>

      {/* Cart Items Rows */}
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            isSelected={selectedItems.has(item.id)}
            onSelect={() => onSelectItem(item.id)}
            onQuantityChange={(change) => onQuantityChange(item.productId, change)}
            onRemove={() => onRemoveItem(item.productId)}
            onVariantChange={(variant) => onVariantChange(item.productId, variant)}
          />
        ))}
      </div>

      {/* Table Footer */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={items.length > 0 && selectedItems.size === items.length}
            onChange={onSelectAll}
          />
          <span className="text-[14px] text-gray-700">Chọn tất cả ({items.length})</span>
          <button
            onClick={onDeleteSelected}
            disabled={selectedItems.size === 0}
            className="text-[14px] text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Xóa
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[14px] text-gray-600">
              Tổng cộng ({totalSelectedItems} sản phẩm):
            </div>
            <div
              className={`text-[14px] font-bold ${
                totalSelectedItems === 0 ? "text-red-600" : "text-gray-900"
              }`}
            >
              {formatCurrencyVND(totalAmount)}
            </div>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={onCheckout}
            disabled={selectedItems.size === 0}
            className="!bg-[#e9502c] !border-[#e9502c] !text-white hover:!bg-[#d34221]"
          >
            Mua Hàng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartTable;

