import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { SimpleDropdown } from "@/components/ui/SimpleDropdown";
import { Search, Package } from "lucide-react";

export type InventoryProduct = {
  id: string;
  name: string;
  image?: string;
  barcode: string;
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
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  className?: string;
};

export const InventoryProductTable: React.FC<InventoryProductTableProps> = ({
  products,
  totalProducts,
  sortBy = "default",
  onSortChange,
  searchValue = "",
  onSearchChange,
  className,
}) => {
  // Memoize currency formatter để tránh tạo lại function nhiều lần
  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat("vi-VN");
    return (amount: number) => formatter.format(amount) + "₫";
  }, []);

  // Memoize sort options để tránh tạo lại array
  const sortOptions = useMemo(() => [
    "Mặc định",
    "Tên A-Z",
    "Tên Z-A",
    "Giá tăng dần",
    "Giá giảm dần",
    "Tồn kho tăng dần",
    "Tồn kho giảm dần"
  ], []);

  // Memoize sort mapping để tránh tạo lại object
  const sortMap = useMemo(() => ({
    "Mặc định": "default",
    "Tên A-Z": "name-asc",
    "Tên Z-A": "name-desc",
    "Giá tăng dần": "price-asc",
    "Giá giảm dần": "price-desc",
    "Tồn kho tăng dần": "available-asc",
    "Tồn kho giảm dần": "available-desc"
  }), []);

  // Memoize current sort display value
  const currentSortValue = useMemo(() => {
    const entries = Object.entries(sortMap);
    const found = entries.find(([, value]) => value === sortBy);
    return found ? found[0] : "Mặc định";
  }, [sortBy, sortMap]);

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Header with Search and Sort */}
      <div className="p-4 border-b border-[#e7e7e7] space-y-4">
        {/* Title and Total Count */}
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-[#e04d30]" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#272424]">Kho hàng</span>
            <span className="bg-[#e04d30] text-white text-sm font-medium px-3 py-1 rounded-full">
              {totalProducts.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#737373]" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#e7e7e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e04d30] focus:border-transparent text-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <SimpleDropdown
            value={currentSortValue}
            onValueChange={(value) => {
              onSortChange?.(sortMap[value as keyof typeof sortMap] || "default");
            }}
            options={sortOptions}
            placeholder="Sắp xếp theo"
            className="min-w-[160px] max-w-[200px]"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="flex-1 flex flex-col">
        {products.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-[#e7e7e7] mb-4" />
            <p className="text-[#737373] text-lg font-medium mb-2">Không có sản phẩm nào</p>
            <p className="text-[#a0a0a0] text-sm">Hãy thêm sản phẩm vào kho hàng</p>
          </div>
        ) : (
          <>
            {/* Fixed Table Header */}
            <div className="bg-[#f8f9fa] border-b-2 border-[#e04d30] flex-shrink-0">
              <div className="flex items-center h-12 px-4">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold text-[#272424]">Sản phẩm</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold text-[#272424]">Barcode</span>
                </div>
                <div className="w-32 text-center">
                  <span className="text-sm font-bold text-[#272424]">Có thể bán</span>
                </div>
                <div className="w-32 text-right">
                  <span className="text-sm font-bold text-[#272424]">Đơn giá</span>
                </div>
              </div>
            </div>

            {/* Scrollable Product List */}
            <div className="flex-1 overflow-y-auto">
              <div className="divide-y divide-[#e7e7e7]">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className={cn(
                      "flex items-center h-16 px-4 transition-colors duration-150",
                      "hover:bg-gray-50 cursor-pointer",
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    )}
                  >
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-[#e7e7e7] flex-shrink-0 shadow-sm"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#272424] line-clamp-1 mb-0.5">
                            {product.name}
                          </p>
                          {(product.category || product.variant) && (
                            <p className="text-xs text-[#737373] line-clamp-1">
                              <span className="text-[#a0a0a0]">Phân loại:</span>{" "}
                              <span className="font-medium text-[#606060]">
                                {product.variant || product.category}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Barcode */}
                    <div className="flex-1 min-w-0">
                      <span className=" font-bold text-sm text-[#272424]">{product.barcode}</span>
                    </div>

                    {/* Stock Count */}
                    <div className="w-32 text-center">
                      <div className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-sm font-bold",
                        product.available > 50
                          ? "bg-green-100 text-green-800"
                          : product.available > 10
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      )}>
                        {product.available.toLocaleString("vi-VN")}
                      </div>
                    </div>



                    {/* Price */}
                    <div className="w-32 text-right">
                      <span className="text-sm font-bold text-[#e04d30]">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryProductTable;
