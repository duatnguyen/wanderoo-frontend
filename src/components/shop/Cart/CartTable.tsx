import React from "react";
import Checkbox from "../Checkbox";
import Button from "../Button";
import CartItemRow from "./CartItemRow";
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
  websiteSoldQuantity?: number;
  availableVariants?: ProductDetailVariant[];
};

interface CartTableProps {
  items: CartItemDisplay[];
  selectedItems: Set<string>;
  onSelectItem: (id: string) => void;
  onSelectAll: () => void;
  onQuantityChange: (productId: string | number, change: number) => void;
  onRemoveItem: (productId: string | number) => void;
  onVariantChange: (cartId: number, newProductDetailId: number) => void;
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
  // Filter out disabled items (out of stock or quantity exceeds stock)
  const availableItems = items.filter((item) => {
    const isOutOfStock = item.websiteSoldQuantity === 0;
    const isQuantityExceedsStock = (item.websiteSoldQuantity || 0) < item.quantity;
    
    // Item is available if not out of stock and quantity doesn't exceed stock
    return !isOutOfStock && !isQuantityExceedsStock;
  });

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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div
        className="bg-gray-50 grid gap-4 px-5 py-3 border-b border-gray-200 items-center"
        style={{
          gridTemplateColumns: "3fr 1.2fr 1.5fr 1.5fr 0.8fr",
        }}
      >
        <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <Checkbox
            checked={availableItems.length > 0 && availableItems.every(item => selectedItems.has(item.id))}
            onChange={onSelectAll}
          />
          <span>Sản phẩm</span>
        </div>
        <div className="text-sm font-medium text-gray-700 text-center">
          Đơn giá
        </div>
        <div className="text-sm font-medium text-gray-700 text-center">
          Số lượng
        </div>
        <div className="text-sm font-medium text-gray-700 text-center">
          Thành tiền
        </div>
        <div className="text-sm font-medium text-gray-700 text-center">
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
            onQuantityChange={(change) =>
              onQuantityChange(item.productId, change)
            }
            onRemove={() => onRemoveItem(item.productId)}
            onVariantChange={(cartId, newProductDetailId) =>
              onVariantChange(cartId, newProductDetailId)
            }
          />
        ))}
      </div>

      {/* Table Footer */}
      <div className="bg-white border-t border-gray-200 px-5 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={availableItems.length > 0 && availableItems.every(item => selectedItems.has(item.id))}
              onChange={onSelectAll}
            />
            <span className="text-sm text-gray-700">
              Chọn tất cả ({availableItems.length})
            </span>
            {selectedItems.size > 0 && (
              <button
                onClick={onDeleteSelected}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Xóa ({selectedItems.size})
              </button>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-end md:items-center gap-4 w-full md:w-auto">
            <div className="text-right md:text-left">
              <div className="text-sm text-gray-600 mb-1">
                Tổng cộng ({totalSelectedItems} sản phẩm)
              </div>
              <div className="text-xl font-bold text-[#E04D30]">
                {formatCurrencyVND(totalAmount)}
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={onCheckout}
              disabled={selectedItems.size === 0}
              className="w-full md:w-auto bg-[#E04D30] hover:bg-[#c53b1d] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTable;
