import React, {
  useCallback,
  useEffect,
  useMemo,
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
    <div className="space-y-5">
      <section>
        <p className="text-sm font-semibold text-slate-900 mb-3">
          Khoảng giá (VNĐ)
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => onPriceChange("minPrice", e.target.value)}
            placeholder="Từ"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          />
          <span className="text-gray-400 text-sm">-</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => onPriceChange("maxPrice", e.target.value)}
            placeholder="Đến"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
          />
        </div>
      </section>

      <section>
        <p className="text-sm font-semibold text-slate-900 mb-3">Thương hiệu</p>
        {isBrandLoading ? (
          <p className="text-xs text-gray-400">Đang tải...</p>
        ) : brands.length === 0 ? (
          <p className="text-xs text-gray-400">Chưa có thương hiệu</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label
                key={brand.id}
                className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={filters.brandIds.includes(brand.id)}
                  onChange={() => onBrandToggle(brand.id)}
                  className="size-4 rounded border-gray-300 text-[#f97316] focus:ring-[#f97316]"
                />
                <span>{brand.name}</span>
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

const ProductCategoryListing: React.FC = () => {
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const { parentId, categoryId } = useParams();

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const productQuery = useQuery({
    queryKey: ["publicCategoryProducts", resolvedCategoryId, filters, page],
    enabled: resolvedCategoryId > 0,
    keepPreviousData: true,
    queryFn: () =>
      getPublicProductsByCategory(resolvedCategoryId, {
        keyword: filters.keyword || undefined,
        brandIds: filters.brandIds.length ? filters.brandIds : undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        page: Math.max(page - 1, 0),
        size: PAGE_SIZE,
      }),
  });

  const products = productQuery.data?.productCategoryResponseList ?? [];

  const sortedProducts = useMemo(() => {
    const list = [...products];
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

  // Đếm số bộ lọc đang áp dụng
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
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="rounded-2xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]"
            >
              <option value="ALL">Tất cả</option>
              <option value="PRICE_ASC">Giá tăng dần</option>
              <option value="PRICE_DESC">Giá giảm dần</option>
              <option value="IN_STOCK">Còn hàng</option>
              <option value="RATING">Đánh giá cao</option>
            </select>
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#1c3b6c] px-4 py-2 text-sm font-semibold text-[#1c3b6c] transition hover:bg-[#1c3b6c] hover:text-white"
            >
              <span>Bộ lọc</span>
              {appliedFilterCount > 0 && (
                <span className="rounded-full bg-[#f97316] px-2 py-0.5 text-xs font-semibold text-white">
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
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(4,12,24,0.45)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#0b1f3a]">Bộ lọc</h3>
              <button
                type="button"
                className="text-sm font-medium text-[#1c3b6c] hover:underline"
                onClick={resetFilters}
              >
                Đặt lại
              </button>
            </div>

            <FilterPanel
              filters={filters}
              brands={brandOptions}
              isBrandLoading={brandQuery.isLoading}
              onPriceChange={handlePriceChange}
              onBrandToggle={handleBrandToggle}
            />

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-2xl border border-[#1c3b6c] py-2 text-sm font-semibold text-[#1c3b6c] hover:bg-gray-50"
                onClick={resetFilters}
              >
                Xóa bộ lọc
              </button>
              <button
                type="button"
                className="flex-1 rounded-2xl bg-[#f97316] py-2 text-sm font-semibold text-white hover:bg-[#ea580c]"
                onClick={() => setIsFilterOpen(false)}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductCategoryListing;
