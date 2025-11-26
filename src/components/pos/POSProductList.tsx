import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type POSProduct = {
  id: string;
  name: string;
  image?: string;
  category?: string;
  variant?: string;
  price: number; // Giá sau giảm (discounted price)
  originalPrice?: number; // Giá gốc (original price)
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
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>(
    {}
  );
  const [editingInputs, setEditingInputs] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    setEditingInputs((prev) => {
      const next = { ...prev };
      let changed = false;
      const productIds = new Set(products.map((product) => product.id));

      Object.keys(next).forEach((id) => {
        if (!productIds.has(id)) {
          delete next[id];
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [products]);

  useEffect(() => {
    setQuantityInputs((prev) => {
      const next = { ...prev };
      let changed = false;
      const currentProductIds = new Set(products.map((product) => product.id));

      Object.keys(next).forEach((id) => {
        if (!currentProductIds.has(id)) {
          delete next[id];
          changed = true;
        }
      });

      products.forEach((product) => {
        if (editingInputs[product.id]) {
          return;
        }
        const syncedValue = product.quantity.toString();
        if (next[product.id] !== syncedValue) {
          next[product.id] = syncedValue;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [products, editingInputs]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const getTotal = (price: number, quantity: number) => {
    // price is already discounted price
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
            {products.map((product, index) => (
              <div key={`${product.id}-${index}`} className="px-4 py-2 hover:bg-gray-50">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Product Info with Image */}
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-[60px] h-[60px] rounded-[8px] border border-[#e7e7e7] object-cover shadow-sm"
                        />
                      ) : (
                        <div className="w-[60px] h-[60px] rounded-[8px] border border-[#e7e7e7] bg-[#f8f9fa] flex items-center justify-center">
                          <span className="text-[#737373] text-xs font-medium">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm text-[#272424] font-semibold line-clamp-2 leading-[1.3]">
                          {product.name}
                        </h3>
                      </div>
                      {(product.category || product.variant) && (
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd]">
                            {product.variant || product.category}
                          </span>
                        </div>
                      )}
                      {/* Removed availability row as requested */}
                    </div>
                  </div>
                  {/* Price */}
                  <div className="col-span-2 text-center">
                    {product.originalPrice != null && 
                     product.originalPrice > product.price && 
                     Math.abs(product.originalPrice - product.price) > 0.01 ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                        <span className="text-sm text-[#272424] font-medium">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-[#272424] font-medium">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>
                  {/* Quantity */}
                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        const nextQuantity = Math.max(1, product.quantity - 1);
                        if (nextQuantity === product.quantity) {
                          return;
                        }
                        setQuantityInputs((prev) => ({
                          ...prev,
                          [product.id]: nextQuantity.toString(),
                        }));
                        onQuantityChange?.(product.id, nextQuantity);
                      }}
                      className="w-7 h-7 flex items-center justify-center border border-[#e7e7e7] rounded text-[#272424] hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={
                        quantityInputs[product.id] ??
                        product.quantity.toString()
                      }
                      onFocus={() =>
                        setEditingInputs((prev) => ({
                          ...prev,
                          [product.id]: true,
                        }))
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value;
                        if (/^\d*$/.test(rawValue)) {
                          setQuantityInputs((prev) => ({
                            ...prev,
                            [product.id]: rawValue,
                          }));
                        }
                      }}
                      onBlur={() => {
                        const rawValue = quantityInputs[product.id];
                        let nextQuantity = Number.parseInt(rawValue ?? "", 10);

                        if (Number.isNaN(nextQuantity) || nextQuantity <= 0) {
                          nextQuantity = product.quantity || 1;
                        }

                        setEditingInputs((prev) => {
                          const updated = { ...prev };
                          delete updated[product.id];
                          return updated;
                        });

                        setQuantityInputs((prev) => ({
                          ...prev,
                          [product.id]: nextQuantity.toString(),
                        }));

                        if (nextQuantity !== product.quantity) {
                          onQuantityChange?.(product.id, nextQuantity);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="w-12 text-center text-sm text-[#272424] border border-[#e7e7e7] rounded py-1.5 focus:outline-none focus:border-[#e04d30]"
                      min="1"
                      inputMode="numeric"
                    />
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
