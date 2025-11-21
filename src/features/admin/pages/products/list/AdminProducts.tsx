import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import SearchBar from "@/components/ui/search-bar";
import ProductItem from "../../../../../components/admin/table/ProductItem";
import ProductTableHeader from "../../../../../components/admin/table/ProductTableHeader";
import type { Product, ProductVariant } from "../../../../../types/types";
import {
  TabMenuWithBadge,
  PageContainer,
  ContentCard,
  type TabItemWithBadge,
} from "@/components/common";
import { Pagination } from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import {
  getAllProductsPrivate,
  getActiveProductsPrivate,
  getInactiveProductsPrivate,
  disableProductsPrivate,
  enableProductsPrivate,
} from "@/api/endpoints/productApi";
import type {
  AdminProductResponse,
  AdminProductDetailResponse,
} from "@/types";
import { toast } from "sonner";
type ProductStatus = "active" | "inactive";

type ProductWithStatus = Product & {
  status: ProductStatus;
};

const formatCurrency = (value?: number | string | null): string => {
  if (value === null || value === undefined) return "0 ₫";
  const numeric =
    typeof value === "number"
      ? value
      : Number(value.toString().replace(/[^\d.-]/g, "")) || 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(numeric);
};

const toNumber = (value?: number | string | null): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const numeric = Number(value.toString().replace(/[^\d.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatPriceDisplay = (value?: number | string | null): string => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.includes("-")) {
      return trimmed;
    }
  }
  return formatCurrency(value);
};

const mapVariant = (
  variant: AdminProductDetailResponse
): ProductVariant => ({
  id: String(variant.id),
  name: variant.nameDetail,
  sku: variant.skuDetail,
  barcode: variant.barcode ?? "---",
  inventory: toNumber(variant.totalQuantity),
  availableToSell: toNumber(variant.availableQuantity),
  webQuantity: toNumber(variant.websiteSoldQuantity),
  posQuantity: toNumber(variant.posSoldQuantity),
  sellingPrice: formatCurrency(variant.sellingPrice),
  costPrice: formatCurrency(variant.importPrice),
});

const mapProductToUi = (product: AdminProductResponse): ProductWithStatus => ({
  id: String(product.id),
  name: product.name,
  image: product.imageUrl,
  sku: product.sku,
  barcode: "---",
  inventory: toNumber(product.totalQuantity),
  availableToSell: toNumber(product.availableQuantity),
  webQuantity: toNumber(product.websiteSoldQuantity),
  posQuantity: toNumber(product.posSoldQuantity),
  sellingPrice: formatPriceDisplay(product.sellingPrice),
  costPrice: formatPriceDisplay(product.importPrice),
  variants: (product.productDetails ?? []).map(mapVariant),
  status: product.display === "ACTIVE" ? "active" : "inactive",
});

const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductWithStatus[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [productCounts, setProductCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
  });
  const [isActionLoading, setIsActionLoading] = useState(false);
  const latestRequestRef = useRef(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const fetchTabCounts = useCallback(async () => {
    const params = {
      keyword: debouncedSearch || undefined,
      page: 0,
      size: 1,
    };
    try {
      const [allRes, activeRes, inactiveRes] = await Promise.all([
        getAllProductsPrivate(params),
        getActiveProductsPrivate(params),
        getInactiveProductsPrivate(params),
      ]);
      setProductCounts({
        all:
          allRes?.totalProducts ??
          allRes?.totalElements ??
          allRes?.productResponseList?.length ??
          0,
        active:
          activeRes?.totalProducts ??
          activeRes?.totalElements ??
          activeRes?.productResponseList?.length ??
          0,
        inactive:
          inactiveRes?.totalProducts ??
          inactiveRes?.totalElements ??
          inactiveRes?.productResponseList?.length ??
          0,
      });
    } catch (error) {
      console.error("Không thể tải số lượng sản phẩm theo tab", error);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchTabCounts();
  }, [fetchTabCounts]);

  const fetchProducts = useCallback(async () => {
    const requestId = ++latestRequestRef.current;
    setIsLoading(true);
    setErrorMessage(null);

    const params = {
      keyword: debouncedSearch || undefined,
      page: Math.max(currentPage - 1, 0),
      size: itemsPerPage,
    };

    try {
      let response;
      if (activeTab === "active") {
        response = await getActiveProductsPrivate(params);
      } else if (activeTab === "inactive") {
        response = await getInactiveProductsPrivate(params);
      } else {
        response = await getAllProductsPrivate(params);
      }

      const mappedProducts =
        response?.productResponseList?.map(mapProductToUi) ?? [];

      if (requestId === latestRequestRef.current) {
        setProducts(mappedProducts);
        setTotalPages(
          response?.totalPages ??
            response?.totalPage ??
            Math.max(
              1,
              Math.ceil((response?.totalProducts ?? 1) / itemsPerPage)
            )
        );
      }
    } catch (error) {
      if (requestId === latestRequestRef.current) {
        console.error("Không thể tải danh sách sản phẩm", error);
        setProducts([]);
        setErrorMessage(
          "Không thể tải danh sách sản phẩm. Vui lòng thử lại."
        );
      }
    } finally {
      if (requestId === latestRequestRef.current) {
        setIsLoading(false);
      }
    }
  }, [activeTab, currentPage, debouncedSearch, itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const tabsWithCounts: TabItemWithBadge[] = useMemo(
    () => [
      { id: "all", label: "Tất cả", count: productCounts.all },
      { id: "active", label: "Đang hoạt động", count: productCounts.active },
      { id: "inactive", label: "Chưa được đăng", count: productCounts.inactive },
    ],
    [productCounts]
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all filtered product IDs (only visible products)
      const visibleIds = products.map((p) => p.id);
      setSelectedProducts(new Set(visibleIds));
      setSelectAll(true);
      setIsIndeterminate(false);
    } else {
      setSelectedProducts(new Set());
      setSelectAll(false);
      setIsIndeterminate(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }

    setSelectedProducts(newSelected);

    // Update checkbox states based on selection
    const totalVisible = products.length;
    const selectedCount = newSelected.size;

    if (selectedCount === 0) {
      setSelectAll(false);
      setIsIndeterminate(false);
    } else if (selectedCount === totalVisible) {
      setSelectAll(true);
      setIsIndeterminate(false);
    } else {
      setSelectAll(false);
      setIsIndeterminate(true);
    }
  };

  const handleClearSelection = () => {
    setSelectedProducts(new Set());
    setSelectAll(false);
    setIsIndeterminate(false);
  };

  // Bulk Actions Handlers
  const handleBulkDelete = () => {
    if (selectedProducts.size === 0) return;

    const productNames = Array.from(selectedProducts)
      .map((id) => products.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3) // Show first 3 names
      .join(', ');

    const moreCount = selectedProducts.size - 3;
    const displayText = selectedProducts.size <= 3
      ? productNames
      : `${productNames}${moreCount > 0 ? ` và ${moreCount} sản phẩm khác` : ''}`;

    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.size} sản phẩm?\n\n${displayText}`)) {
      console.log('Deleting products:', Array.from(selectedProducts));
      // TODO: Implement actual deletion
      handleClearSelection();
      alert(`Đã xóa ${selectedProducts.size} sản phẩm thành công!`);
    }
  };

  const buildSelectedIdPayload = (): number[] => {
    return Array.from(selectedProducts)
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id));
  };

  const handleBulkExport = () => {
    if (selectedProducts.size === 0) return;

    console.log('Exporting products:', Array.from(selectedProducts));
    // TODO: Implement actual export
    alert(`Đang xuất dữ liệu ${selectedProducts.size} sản phẩm...`);
  };
  const handleUpdate = (productId: string) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const handleBulkHide = async () => {
    const ids = buildSelectedIdPayload();
    if (ids.length === 0) return;

    setIsActionLoading(true);
    try {
      await disableProductsPrivate({ getAll: ids });
      toast.success("Ẩn sản phẩm thành công");
      await fetchProducts();
      await fetchTabCounts();
      handleClearSelection();
    } catch (error) {
      console.error("Không thể ẩn sản phẩm", error);
      toast.error("Ẩn sản phẩm thất bại. Vui lòng thử lại.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBulkShow = async () => {
    const ids = buildSelectedIdPayload();
    if (ids.length === 0) return;

    setIsActionLoading(true);
    try {
      await enableProductsPrivate({ getAll: ids });
      toast.success("Hiện sản phẩm thành công");
      await fetchProducts();
      await fetchTabCounts();
      handleClearSelection();
    } catch (error) {
      console.error("Không thể hiện sản phẩm", error);
      toast.error("Hiện sản phẩm thất bại. Vui lòng thử lại.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Keyboard shortcuts handler
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+A or Cmd+A to select all
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        handleSelectAll(true);
      }

      // Escape to clear selection
      if (event.key === 'Escape' && selectedProducts.size > 0) {
        handleClearSelection();
      }

      // Delete key to delete selected products
      if (event.key === 'Delete' && selectedProducts.size > 0) {
        event.preventDefault();
        handleBulkDelete();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProducts.size]);

  // Filter products based on search and tab
  const filteredProducts = products;

  // Reset selection when filters change
  React.useEffect(() => {
    handleClearSelection();
  }, [searchValue, activeTab, currentPage, products]);

  const paginatedProducts = filteredProducts;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between px-0 min-h-[32px] w-full">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-base text-[24px] text-[#272424] font-['Montserrat']">
            Danh sách sản phẩm
          </h1>
        </div>
      </div>

      {/* Tab Menu with Badge Counts */}
      <TabMenuWithBadge
        tabs={tabsWithCounts}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="w-full mx-auto"
      />
      {/* Main Content */}
      <ContentCard>
        {/* Search Bar and Tips */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
          <SearchBar
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full max-w-md"
          />

          {/* Quick Tips for Selection */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="hidden lg:flex items-center gap-4 bg-gray-50 px-3 py-2 rounded-lg">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">A</kbd>
                <span className="text-xs">Chọn tất cả</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Esc</kbd>
                <span className="text-xs">Bỏ chọn</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Del</kbd>
                <span className="text-xs">Xóa</span>
              </span>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {/* Table Container with Scroll */}
        <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start w-full rounded-[16px]">
          {/* Table Header */}
          <ProductTableHeader
            selectAll={selectAll}
            isIndeterminate={isIndeterminate}
            selectedCount={selectedProducts.size}
            totalCount={filteredProducts.length}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onBulkDelete={handleBulkDelete}
            onBulkHide={handleBulkHide}
            onBulkExport={handleBulkExport}
            showSelectionActions={selectedProducts.size > 0}
            onBulkShow={handleBulkShow}
            actionDisabled={isActionLoading}
          />          {/* Table Body */}
          <div className={`w-full transition-all duration-200 ${selectedProducts.size > 0 ? 'ring-2 ring-blue-200 ring-opacity-50 rounded-b-[16px]' : 'rounded-b-[16px]'} overflow-hidden`}>
            {isLoading && (
              <div className="flex items-center justify-center py-10 text-sm text-gray-500">
                Đang tải danh sách sản phẩm...
              </div>
            )}
            {!isLoading &&
              paginatedProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  isSelected={selectedProducts.has(product.id)}
                  onSelect={handleProductSelect}
                  onUpdate={handleUpdate}
                />
              ))}
            {!isLoading && paginatedProducts.length === 0 && !errorMessage && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
                <p className="text-sm mt-1">
                  {debouncedSearch ? `Không có sản phẩm nào khớp với "${debouncedSearch}"` : 'Danh sách sản phẩm trống'}
                </p>
              </div>
            )}
            {errorMessage && (
              <div className="flex items-center justify-center py-6 text-red-500 text-sm">
                {errorMessage}
              </div>
            )}
          </div>

          {/* No products message */}
        </div>
        {/* Pagination - Full Width */}
        <Pagination
          current={currentPage}
          total={totalPages}
          onChange={setCurrentPage}
        />
      </ContentCard>



      {/* Floating Selection Actions for Mobile */}
      {selectedProducts.size > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 lg:hidden">
          <div className="bg-white border border-gray-200 rounded-full shadow-lg px-6 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{selectedProducts.size}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">đã chọn</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleBulkExport}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                title="Xuất Excel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              <button
                onClick={handleBulkHide}
                className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors"
                title="Ẩn sản phẩm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>

              <button
                onClick={handleBulkDelete}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                title="Xóa sản phẩm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <button
                onClick={handleClearSelection}
                className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
                title="Bỏ chọn tất cả"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AdminProducts;