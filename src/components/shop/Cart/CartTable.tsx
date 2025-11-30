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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Table Header */}
      <div
        className="bg-gradient-to-r from-gray-50 to-white grid gap-4 px-5 py-4 border-b-2 border-gray-200 items-center"
        style={{
          gridTemplateColumns: "3fr 1.2fr 1.5fr 1.5fr 0.8fr",
        }}
      >
        <div className="flex items-center gap-3">
          <Checkbox
            checked={availableItems.length > 0 && availableItems.every(item => selectedItems.has(item.id))}
            onChange={onSelectAll}
          />
          <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Sản phẩm
          </span>
        </div>
        <div className="text-sm font-bold text-gray-900 text-center uppercase tracking-wide">
          Đơn giá
        </div>
        <div className="text-sm font-bold text-gray-900 text-center uppercase tracking-wide">
          Số lượng
        </div>
        <div className="text-sm font-bold text-gray-900 text-center uppercase tracking-wide">
          Thành tiền
        </div>
        <div className="text-sm font-bold text-gray-900 text-center uppercase tracking-wide">
          Thao tác
        </div>
      </div>

      {/* Cart Items Rows */}
      <div className="divide-y divide-gray-100">
        {items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Giỏ hàng trống</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="hover:bg-gray-50/50 transition-colors duration-150"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CartItemRow
                item={item}
                isSelected={selectedItems.has(item.id)}
                onSelect={() => onSelectItem(item.id)}
                onQuantityChange={(change) =>
                  onQuantityChange(item.id, change)
                }
                onRemove={() => onRemoveItem(item.id)}
                onVariantChange={(cartId, newProductDetailId) =>
                  onVariantChange(cartId, newProductDetailId)
                }
              />
            </div>
          ))
        )}
      </div>

      {/* Table Footer */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-200 px-5 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={availableItems.length > 0 && availableItems.every(item => selectedItems.has(item.id))}
                onChange={onSelectAll}
              />
              <span className="text-sm font-medium text-gray-900">
                Chọn tất cả
              </span>
              <span className="text-sm text-gray-500">
                ({availableItems.length} sản phẩm)
              </span>
            </div>
            {selectedItems.size > 0 && (
              <button
                onClick={onDeleteSelected}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa ({selectedItems.size})
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full md:w-auto">
            <div className="text-right sm:text-left">
              <div className="text-xs text-gray-500 mb-0.5">
                Tổng cộng ({totalSelectedItems} sản phẩm)
              </div>
              <div className="text-lg font-bold text-[#E04D30]">
                {formatCurrencyVND(totalAmount)}
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={onCheckout}
              disabled={selectedItems.size === 0}
              className="w-full sm:w-auto bg-gradient-to-r from-[#E04D30] to-[#c53b1d] hover:from-[#c53b1d] hover:to-[#b0351a] text-white font-bold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Mua hàng
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTable;
