import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type POSProduct = {
  id: string;
  name: string;
  image?: string;
  category?: string;
  variant?: string;
  price: number;
  quantity: number;
};

export type POSProductListProps = {
  products: POSProduct[];
  onQuantityChange?: (productId: string, quantity: number) => void;
  onRemove?: (productId: string) => void;
  className?: string;
};

export const POSProductList: React.FC<POSProductListProps> = ({
  products = [],
  onQuantityChange,
  onRemove,
  className,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const getTotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  return (
    <div
      className={cn("flex-1 bg-white overflow-hidden flex flex-col", className)}
    >
      {/* Table Header */}
      <div className="border-b border-[#e7e7e7] bg-[#f6f6f6] px-4 py-3 flex-shrink-0">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5">
            <span className="text-sm font-bold text-[#272424]">
              Sản phẩm{" "}
              <span className="text-[#e04d30]">({products.length})</span>
            </span>
          </div>
          <div className="col-span-2 text-center">
            <span className="text-sm font-bold text-[#272424]">Đơn giá</span>
          </div>
          <div className="col-span-2 text-center">
            <span className="text-sm font-bold text-[#272424]">Số lượng</span>
          </div>
          <div className="col-span-2 text-right">
            <span className="text-sm font-bold text-[#272424]">Thành tiền</span>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto">
        {products.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#737373] text-sm">Chưa có sản phẩm nào</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e7e7e7]">
            {products.map((product) => (
              <div key={product.id} className="px-4 py-3 hover:bg-gray-50">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Product Info with Image */}
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-[70px] h-[70px] rounded-lg border border-[#e7e7e7] object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#272424] font-medium line-clamp-2 mb-1">
                        {product.name}
                      </p>
                      {(product.category || product.variant) && (
                        <p className="text-xs text-[#737373]">
                          Phân loại hàng:{" "}
                          <span className="text-[#272424]">
                            {product.variant || product.category}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Price */}
                  <div className="col-span-2 text-center">
                    <span className="text-sm text-[#272424] font-medium">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  {/* Quantity */}
                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        onQuantityChange?.(
                          product.id,
                          Math.max(0, product.quantity - 1)
                        )
                      }
                      className="w-7 h-7 flex items-center justify-center border border-[#e7e7e7] rounded text-[#272424] hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => {
                        const qty = parseInt(e.target.value) || 0;
                        onQuantityChange?.(product.id, Math.max(0, qty));
                      }}
                      className="w-12 text-center text-sm text-[#272424] border border-[#e7e7e7] rounded py-1.5 focus:outline-none focus:border-[#e04d30]"
                      min="0"
                    />
                    <button
                      onClick={() =>
                        onQuantityChange?.(product.id, product.quantity + 1)
                      }
                      className="w-7 h-7 flex items-center justify-center border border-[#e7e7e7] rounded text-[#272424] hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {/* Total */}
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-bold text-[#272424]">
                      {formatCurrency(
                        getTotal(product.price, product.quantity)
                      )}
                    </span>
                  </div>
                  {/* Remove Button */}
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => onRemove?.(product.id)}
                      className="w-8 h-8 flex items-center justify-center text-[#737373] hover:text-[#e04d30] hover:bg-red-50 rounded transition-colors"
                      aria-label="Remove product"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default POSProductList;
