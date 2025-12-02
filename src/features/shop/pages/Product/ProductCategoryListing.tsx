import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import ProductCard from "../../../../components/shop/ProductCard";
import Pagination from "../../../../components/shop/Pagination";
import { useCart } from "../../../../context/CartContext";
import { useAuth } from "../../../../context/AuthContext";
import {
  getPublicCategoryParents,
  getPublicCategoryChildren,
} from "../../../../api/endpoints/attributeApi";
import {
  getPublicCategoryBrands,
  getPublicProductsByCategory,
} from "../../../../api/endpoints/productApi";
import type {
  BrandResponse,
  ProductCategoryItemResponse,
} from "../../../../types";

// Hook để debounce giá trị
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const PAGE_SIZE = 12;

type FilterState = {
  keyword: string;
  minPrice: string;
  maxPrice: string;
  brandIds: number[];
};

const DEFAULT_FILTERS: FilterState = {
  keyword: "",
  minPrice: "",
  maxPrice: "",
  brandIds: [],
};

type FilterPanelProps = {
  filters: FilterState;
  brands: BrandResponse[];
  isBrandLoading: boolean;
  onPriceChange: (field: "minPrice" | "maxPrice", value: string) => void;
  onBrandToggle: (brandId: number) => void;
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  brands,
  isBrandLoading,
  onPriceChange,
  onBrandToggle,
}) => {
  return (
    <div className="space-y-6">
      {/* Khoảng giá */}
      <section>
        <h4 className="text-sm font-semibold text-[#0b1f3a] mb-3">
          Khoảng giá (VNĐ)
        </h4>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => onPriceChange("minPrice", e.target.value)}
            placeholder="Từ"
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-[#454545] placeholder:text-gray-400 focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-colors"
          />
          <span className="text-gray-400 text-sm font-medium">-</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => onPriceChange("maxPrice", e.target.value)}
            placeholder="Đến"
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-[#454545] placeholder:text-gray-400 focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-colors"
          />
        </div>
      </section>

      {/* Thương hiệu */}
      <section>
        <h4 className="text-sm font-semibold text-[#0b1f3a] mb-3">Thương hiệu</h4>
        {isBrandLoading ? (
          <div className="flex items-center justify-center py-4">
            <p className="text-xs text-gray-400">Đang tải...</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <p className="text-xs text-gray-400">Chưa có thương hiệu</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {brands.map((brand) => (
              <label
                key={brand.id}
                className="flex cursor-pointer items-center gap-3 text-sm text-[#454545] hover:text-[#1c3b6c] transition-colors group"
              >
                <input
                  type="checkbox"
                  checked={filters.brandIds.includes(brand.id)}
                  onChange={() => onBrandToggle(brand.id)}
                  className="size-5 rounded border-2 border-gray-300 text-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 focus:ring-offset-0 cursor-pointer transition-all group-hover:border-[#f97316]"
                />
                <span className="flex-1">{brand.name}</span>
              </label>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const getDiscountPercent = (discountValue?: string | null) => {
  if (!discountValue || !discountValue.includes("%")) return undefined;
  const match = discountValue.match(/(\d+(?:\.\d+)?)/);
  if (!match) return undefined;
  return Number(match[1]);
};

type SortOption = {
  value: string;
  label: string;
};

const SORT_OPTIONS: SortOption[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "PRICE_ASC", label: "Giá tăng dần" },
  { value: "PRICE_DESC", label: "Giá giảm dần" },
  { value: "IN_STOCK", label: "Còn hàng" },
  { value: "RATING", label: "Đánh giá cao" },
];

type SortDropdownProps = {
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
};

const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 rounded-2xl border-2 px-4 py-2 text-sm font-medium transition-all ${
          isOpen
            ? "border-[#f97316] bg-white shadow-sm"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <span className="text-[#454545]">{selectedOption.label}</span>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-full min-w-[180px] rounded-xl border border-gray-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                  option.value === value
                    ? "bg-blue-500 text-white font-medium"
                    : "text-[#454545] hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductCategoryListing: React.FC = () => {
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const { parentId, categoryId } = useParams();

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Debounce keyword để tránh gọi API quá nhiều
  const debouncedKeyword = useDebounce(filters.keyword, 500);

  const { data: parentCategories = [] } = useQuery({
    queryKey: ["publicCategoryParents"],
    queryFn: getPublicCategoryParents,
  });

  const numericParentId = Number(parentId);

  const { data: childCategories = [] } = useQuery({
    queryKey: ["publicCategoryChildren", numericParentId],
    queryFn: () => getPublicCategoryChildren(numericParentId),
    enabled: Number.isFinite(numericParentId),
  });

  const parentCategory = parentCategories.find(
    (cat) => cat.id === numericParentId
  );
  const childCategory = childCategories.find(
    (child) => child.id === Number(categoryId)
  );

  const resolvedCategoryId = Number(categoryId ?? 0);

  const brandQuery = useQuery({
    queryKey: ["publicBrands"],
    queryFn: () => getPublicCategoryBrands(),
  });

  const brandOptions = brandQuery.data ?? [];

  // Chuyển đổi sort option thành format API
  const getSortParam = useCallback((sortOption: string): string | undefined => {
    switch (sortOption) {
      case "PRICE_ASC":
        return "price_asc";
      case "PRICE_DESC":
        return "price_desc";
      case "RATING":
        return "rating_desc";
      case "IN_STOCK":
        return "in_stock";
      case "ALL":
      default:
        return undefined;
    }
  }, []);

  // Tạo filter object với debounced keyword và sort
  const apiFilters = useMemo(() => ({
    keyword: debouncedKeyword || undefined,
    brandIds: filters.brandIds.length ? filters.brandIds : undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    sort: getSortParam(sortOption),
  }), [debouncedKeyword, filters.brandIds, filters.minPrice, filters.maxPrice, sortOption, getSortParam]);

  const productQuery = useQuery({
    queryKey: ["publicCategoryProducts", resolvedCategoryId, apiFilters, page],
    enabled: resolvedCategoryId > 0,
    keepPreviousData: true,
    queryFn: () =>
      getPublicProductsByCategory(resolvedCategoryId, {
        ...apiFilters,
        page: Math.max(page - 1, 0),
        size: PAGE_SIZE,
      }),
  });

  const products = productQuery.data?.productCategoryResponseList ?? [];

  // Sort ở client-side như fallback (nếu API chưa hỗ trợ sort hoặc cần xử lý thêm)
  // Nếu API đã xử lý sort đúng, có thể bỏ qua phần này
  const sortedProducts = useMemo(() => {
    let list = [...products];
    
    // Xử lý filter "Còn hàng"
    if (sortOption === "IN_STOCK") {
      list = list.filter((p) => p.minSellingPrice > 0);
    }
    
    // Client-side sort như fallback (nếu API chưa sort đúng)
    // Nếu API đã sort, có thể comment phần này
    switch (sortOption) {
      case "PRICE_ASC":
        return list.sort(
          (a, b) => a.minSellingPrice - b.minSellingPrice
        );
      case "PRICE_DESC":
        return list.sort(
          (a, b) => b.minSellingPrice - a.minSellingPrice
        );
      case "RATING":
        return list.sort((a, b) => b.rating - a.rating);
      case "IN_STOCK":
        // Đã filter ở trên, giữ nguyên thứ tự
        return list;
      default:
        return list;
    }
  }, [products, sortOption]);

  useEffect(() => {
    if (productQuery.data && page > productQuery.data.totalPages) {
      setPage(productQuery.data.totalPages || 1);
    }
  }, [productQuery.data, page]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  useEffect(() => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      keyword: prev.keyword,
    }));
    setPage(1);
  }, [categoryId, parentId]);

  const totalPages = productQuery.data?.totalPages ?? 1;

  // Đếm số bộ lọc đang áp dụng (không tính keyword vì nó là search)
  const appliedFilterCount = useMemo(() => {
    return (
      filters.brandIds.length +
      (filters.minPrice ? 1 : 0) +
      (filters.maxPrice ? 1 : 0)
    );
  }, [filters]);
  

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, keyword: value }));
    // Reset page khi keyword thay đổi (debounce sẽ xử lý việc gọi API)
    setPage(1);
  };
  
  const handleSortChange = (value: string) => {
    setSortOption(value);
    // Reset page khi sort thay đổi
    setPage(1);
  };

  const handlePriceChange = useCallback(
    (field: "minPrice" | "maxPrice", value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
      setPage(1);
    },
    []
  );

  const handleBrandToggle = useCallback((brandId: number) => {
    setFilters((prev) => ({
      ...prev,
      brandIds: prev.brandIds.includes(brandId)
        ? prev.brandIds.filter((id) => id !== brandId)
        : [...prev.brandIds, brandId],
    }));
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f2f6fb] to-white">
      <Header cartCount={getCartCount()} userName={user?.name} avatarUrl={user?.avatar || undefined} />

      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1c3b6c]">
            {parentCategory?.name} / {childCategory?.name ?? "Tất cả"}
          </p>
          <h1 className="text-2xl font-semibold text-[#0f1f3d]">
            {childCategory?.name ?? parentCategory?.name ?? "Danh mục sản phẩm"}
          </h1>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-[0_15px_35px_rgba(12,35,64,0.08)] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={filters.keyword}
              onChange={handleKeywordChange}
              className="flex-1 rounded-2xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            />
            <SortDropdown
              value={sortOption}
              options={SORT_OPTIONS}
              onChange={handleSortChange}
            />
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#1c3b6c] bg-white px-4 py-2 text-sm font-semibold text-[#1c3b6c] transition-all hover:bg-[#1c3b6c] hover:text-white hover:shadow-md"
            >
              <span>Bộ lọc</span>
              {appliedFilterCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-[#f97316] px-2 text-xs font-semibold text-white">
                  {appliedFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {productQuery.isLoading && (
          <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 text-center text-sm text-gray-500">
            Đang tải sản phẩm...
          </div>
        )}

        {sortedProducts.length === 0 && !productQuery.isLoading ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white/80 p-10 text-center text-gray-500">
            <p className="text-base font-medium text-slate-900">
              Không có sản phẩm phù hợp
            </p>
            <p className="text-sm text-gray-500">
              Thử nới rộng điều kiện lọc hoặc chọn danh mục khác.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4">
              {sortedProducts.map((product) => {
                const hasDiscount =
                  product.discountSellingPrice !== null &&
                  product.discountSellingPrice !== undefined &&
                  product.discountSellingPrice > 0 &&
                  product.discountSellingPrice < product.minSellingPrice;

                const displayPrice = hasDiscount
                  ? product.discountSellingPrice || product.minSellingPrice
                  : product.minSellingPrice;

                const originalPrice = hasDiscount
                  ? product.minSellingPrice
                  : undefined;

                const discountPercent = hasDiscount
                  ? getDiscountPercent(product.discountValue)
                  : undefined;

                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    imageUrl={product.imageUrl ?? ""}
                    name={product.name}
                    price={displayPrice}
                    originalPrice={originalPrice}
                    rating={product.rating}
                    discountPercent={discountPercent}
                    className="w-[167px]"
                  />
                );
              })}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              label="Trang"
            />
          </>
        )}
      </main>

      {/* Popup bộ lọc */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_rgba(4,12,24,0.45)]">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h3 className="text-xl font-bold text-[#0b1f3a]">Bộ lọc</h3>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="text-sm font-medium text-[#1c3b6c] hover:text-[#f97316] hover:underline transition-colors"
                  onClick={resetFilters}
                >
                  Đặt lại
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  aria-label="Đóng"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
              <FilterPanel
                filters={filters}
                brands={brandOptions}
                isBrandLoading={brandQuery.isLoading}
                onPriceChange={handlePriceChange}
                onBrandToggle={handleBrandToggle}
              />
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-2xl border-2 border-[#1c3b6c] py-3 text-sm font-semibold text-[#1c3b6c] hover:bg-[#1c3b6c] hover:text-white transition-colors"
                  onClick={resetFilters}
                >
                  Xóa bộ lọc
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-2xl bg-[#f97316] py-3 text-sm font-semibold text-white hover:bg-[#ea580c] transition-colors shadow-md"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductCategoryListing;
