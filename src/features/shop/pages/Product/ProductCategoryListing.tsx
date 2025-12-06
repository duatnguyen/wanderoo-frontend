import React from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import ProductCard from "../../../../components/shop/ProductCard";
import Pagination from "../../../../components/shop/Pagination";
import FilterSidebar from "../../../../components/shop/Product/FilterSidebar";
import SortDropdown, { SORT_OPTIONS } from "../../../../components/shop/Product/SortDropdown";
import { useProductCategoryFilters } from "../../../../hooks/useProductCategoryFilters";
import { useCart } from "../../../../context/CartContext";
import { useAuth } from "../../../../context/AuthContext";
import type { ProductCategoryItemResponse } from "../../../../types";

// Helper function để tính discount percent từ discountValue string
const getDiscountPercent = (discountValue?: string | null): number | undefined => {
  if (!discountValue || !discountValue.includes("%")) return undefined;
  const match = discountValue.match(/(\d+(?:\.\d+)?)/);
  if (!match) return undefined;
  return Number(match[1]);
};

// Helper function để tính display price và discount info
const getProductDisplayInfo = (product: ProductCategoryItemResponse) => {
  const hasDiscount =
    product.discountSellingPrice !== null &&
    product.discountSellingPrice !== undefined &&
    product.discountSellingPrice > 0 &&
    product.discountSellingPrice < product.minSellingPrice;

  const displayPrice = hasDiscount
    ? product.discountSellingPrice || product.minSellingPrice
    : product.minSellingPrice;

  const originalPrice = hasDiscount ? product.minSellingPrice : undefined;
  const discountPercent = hasDiscount
    ? getDiscountPercent(product.discountValue)
    : undefined;

  return {
    displayPrice,
    originalPrice,
    discountPercent,
  };
};

const ProductCategoryListing: React.FC = () => {
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const { parentId, categoryId } = useParams();

  // Debug logging
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("ProductCategoryListing - URL Params:", { parentId, categoryId });
    }
  }, [parentId, categoryId]);

  // Use custom hook để quản lý tất cả logic
  const {
    filters,
    sortOption,
    page,
    parentCategory,
    childCategory,
    products,
    totalPages,
    totalElements,
    isLoading,
    isError,
    error,
    brands,
    isBrandLoading,
    handleKeywordChange,
    handleSortChange,
    handlePriceChange,
    handleBrandToggle,
    resetFilters,
    setPage,
  } = useProductCategoryFilters(parentId, categoryId);

  // Nếu không có categoryId (chỉ có parentId) → redirect về trang chủ
  // Vì danh mục cha không có sản phẩm, chỉ có danh mục con mới có sản phẩm
  if (!categoryId && parentId) {
    return <Navigate to="/shop" replace />;
  }

  // Nếu không có cả parentId và categoryId → redirect về trang chủ
  if (!parentId && !categoryId) {
    return <Navigate to="/shop" replace />;
  }

  // Format breadcrumb: uppercase với "/"
  const breadcrumbText = parentCategory?.name && childCategory?.name
    ? `${parentCategory.name.toUpperCase()} / ${childCategory.name.toUpperCase()}`
    : parentCategory?.name
    ? parentCategory.name.toUpperCase()
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f2f6fb] to-white">
      <Header
        cartCount={getCartCount()}
        userName={user?.name}
        avatarUrl={user?.avatar || undefined}
      />

      {/* Breadcrumb & Title Section */}
      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6">
          {breadcrumbText && (
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1c3b6c]">
              {breadcrumbText}
            </p>
          )}
          <h1 className="text-2xl font-semibold text-[#0f1f3d]">
            {childCategory?.name ?? parentCategory?.name ?? "Danh mục sản phẩm"}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - Bên trái */}
          <FilterSidebar
            filters={filters}
            brands={brands}
            isBrandLoading={isBrandLoading}
            onPriceChange={handlePriceChange}
            onBrandToggle={handleBrandToggle}
            onReset={resetFilters}
          />

          {/* Product List - Bên phải */}
          <div className="flex-1 space-y-6">
            {/* Search & Sort Bar */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-[0_15px_35px_rgba(12,35,64,0.08)] md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={filters.keyword}
                  onChange={handleKeywordChange}
                  className="flex-1 rounded-2xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316] transition-all"
                />
                <SortDropdown
                  value={sortOption}
                  options={SORT_OPTIONS}
                  onChange={handleSortChange}
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 text-center text-sm text-gray-500">
                Đang tải sản phẩm...
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-base font-medium text-red-900">
                  Có lỗi xảy ra khi tải sản phẩm
                </p>
                <p className="text-sm text-red-600 mt-2">
                  {error instanceof Error ? error.message : "Vui lòng thử lại sau"}
                </p>
              </div>
            )}

            {/* Empty State */}
            {products.length === 0 && !isLoading && !isError && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white/80 p-10 text-center text-gray-500">
                <p className="text-base font-medium text-slate-900">
                  Không có sản phẩm phù hợp
                </p>
                <p className="text-sm text-gray-500">
                  Thử nới rộng điều kiện lọc hoặc chọn danh mục khác.
                </p>
              </div>
            )}

            {/* Product Grid */}
            {products.length > 0 && (
              <>
                <div className="flex flex-wrap gap-4">
                  {products.map((product) => {
                    const { displayPrice, originalPrice, discountPercent } =
                      getProductDisplayInfo(product);

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

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={12} // PAGE_SIZE from hook
                    onPageChange={setPage}
                    label="Trang"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductCategoryListing;
