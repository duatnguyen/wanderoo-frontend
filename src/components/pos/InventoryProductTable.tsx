import React from "react";
import { cn } from "@/lib/utils";
import { SimpleDropdown } from "@/components/ui/SimpleDropdown";

export type InventoryProduct = {
  id: string;
  name: string;
  image?: string;
  variant?: string;
  category?: string;
  available: number;
  price: number;
};

export type InventoryProductTableProps = {
  products: InventoryProduct[];
  totalProducts: number;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  className?: string;
};

export const InventoryProductTable: React.FC<InventoryProductTableProps> = ({
  products,
  totalProducts,
  sortBy = "default",
  onSortChange,
  className,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
  };

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Summary and Sort Bar */}
      <div className="p-4 border-b border-[#e7e7e7]">
        <div className="flex items-center justify-between gap-4">
          <span className="text-2xl font-bold text-[#272424]">
            Tổng sản phẩm ({totalProducts})
          </span>
          <SimpleDropdown
            value={
              sortBy === "default"
                ? "Mặc định"
                : sortBy === "name-asc"
                  ? "Tên A-Z"
                  : sortBy === "name-desc"
                    ? "Tên Z-A"
                    : sortBy === "price-asc"
                      ? "Giá tăng dần"
                      : sortBy === "price-desc"
                        ? "Giá giảm dần"
                        : sortBy === "available-asc"
                          ? "Tồn kho tăng dần"
                          : sortBy === "available-desc"
                            ? "Tồn kho giảm dần"
                            : "Mặc định"
            }
            onValueChange={(value) => {
              const sortMap: Record<string, string> = {
                "Mặc định": "default",
                "Tên A-Z": "name-asc",
                "Tên Z-A": "name-desc",
                "Giá tăng dần": "price-asc",
                "Giá giảm dần": "price-desc",
                "Tồn kho tăng dần": "available-asc",
                "Tồn kho giảm dần": "available-desc",
              };
              onSortChange?.(sortMap[value] || "default");
            }}
            options={[
              "Mặc định",
              "Tên A-Z",
              "Tên Z-A",
              "Giá tăng dần",
              "Giá giảm dần",
              "Tồn kho tăng dần",
              "Tồn kho giảm dần",
            ]}
            placeholder="Chọn sắp xếp"
            className="min-w-[160px] max-w-[200px]"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="flex-1 overflow-y-auto">
        {products.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#737373] text-sm">Không có sản phẩm nào</p>
          </div>
        ) : (
          <div className="rounded-lg border border-[#e7e7e7] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f6f6f6] sticky top-0 z-10">
                <tr>
                  <th className="text-left w-[400px] px-3 h-[40px] text-sm font-bold text-[#272424]">
                    Sản phẩm
                  </th>
                  <th className="text-center px-3 h-[40px] text-sm font-bold text-[#272424]">
                    Có thể bán
                  </th>
                  <th className="text-right px-3 h-[40px] text-sm font-bold text-[#272424]">
                    Đơn giá
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e7e7]">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 h-[60px]">
                    <td className="px-3 h-[60px] align-middle">
                      <div className="flex items-center gap-2">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[#e7e7e7] flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#272424] line-clamp-1">
                            {product.name}
                          </p>
                          {(product.category || product.variant) && (
                            <p className="text-[10px] text-[#737373] mt-0.5">
                              Phân loại hàng:{" "}
                              <span className="text-[#272424]">
                                {product.variant || product.category}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-center px-3 h-[60px] align-middle">
                      <span className="text-sm text-[#272424] font-medium">
                        {product.available.toLocaleString("vi-VN")}
                      </span>
                    </td>
                    <td className="text-right px-3 h-[60px] align-middle">
                      <span className="text-sm font-bold text-[#272424]">
                        {formatCurrency(product.price)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryProductTable;
