import React, { useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import ProductItem from "../../../../../components/admin/table/ProductItem";
import ProductTableHeader from "../../../../../components/admin/table/ProductTableHeader";
import type { Product } from "../../../../../types/types";
import {
  TabMenuWithBadge,
  PageContainer,
  ContentCard,
  type TabItemWithBadge,
} from "@/components/common";
import { Pagination } from "@/components/ui/pagination";
import { useMemo } from "react";
// Mock data for products
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Giày leo núi nữ cổ thấp Humtto Hiking Shoes 140134B-4",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop&crop=center",
    sku: "SKU01",
    barcode: "",
    inventory: 0,
    availableToSell: 0,
    webQuantity: 400000,
    posQuantity: 0,
    sellingPrice: "600.000đ",
    costPrice: "400.000đ",
    variants: [
      {
        id: "v1-1",
        name: "Size 36",
        sku: "SKU01-40B",
        barcode: "8930195417609",
        inventory: 0,
        availableToSell: 0,
        webQuantity: 0,
        posQuantity: 0,
        sellingPrice: "600.000đ",
        costPrice: "400.000đ",
      },
      {
        id: "v1-2",
        name: "Size 37",
        sku: "SKU01-40C",
        barcode: "8930195417610",
        inventory: 0,
        availableToSell: 0,
        webQuantity: 0,
        posQuantity: 0,
        sellingPrice: "600.000đ",
        costPrice: "400.000đ",
      },
      {
        id: "v1-3",
        name: "Size 38",
        sku: "SKU01-40D",
        barcode: "8930195417611",
        inventory: 0,
        availableToSell: 0,
        webQuantity: 0,
        posQuantity: 0,
        sellingPrice: "600.000đ",
        costPrice: "400.000đ",
      },
    ],
  },
  {
    id: "2",
    name: "Giày thể thao nam Nike Air Max",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&crop=center",
    sku: "SKU02",
    barcode: "1234567890123",
    inventory: 15,
    availableToSell: 15,
    webQuantity: 10,
    posQuantity: 5,
    sellingPrice: "2.500.000đ",
    costPrice: "1.800.000đ",
  },
  {
    id: "3",
    name: "Áo khoác nữ Adidas Originals",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop&crop=center",
    sku: "SKU03",
    barcode: "9876543210987",
    inventory: 8,
    availableToSell: 8,
    webQuantity: 5,
    posQuantity: 3,
    sellingPrice: "1.200.000đ",
    costPrice: "800.000đ",
  },
];

const AdminProducts: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate product counts by status
  const productCounts = useMemo(() => {
    const counts = {
      all: mockProducts.length,
      active: 0,
      inactive: 0,
    };

    mockProducts.forEach(product => {
      // Logic để phân loại sản phẩm theo trạng thái
      // Ví dụ: dựa trên inventory hoặc các field khác
      if (product.inventory > 0) {
        counts.active++;
      } else {
        counts.inactive++;
      }
    });

    return counts;
  }, []);

  // Create tabs with badge counts
  const tabsWithCounts: TabItemWithBadge[] = useMemo(() => [
    { id: "all", label: "Tất cả", count: productCounts.all },
    { id: "active", label: "Đang hoạt động", count: productCounts.active },
    { id: "inactive", label: "Chưa được đăng", count: productCounts.inactive },
  ], [productCounts]);

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
      const visibleIds = filteredProducts.map(p => p.id);
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
    const totalVisible = filteredProducts.length;
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
      .map(id => mockProducts.find(p => p.id === id)?.name)
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

  const handleBulkHide = () => {
    if (selectedProducts.size === 0) return;

    console.log('Hiding products:', Array.from(selectedProducts));
    // TODO: Implement actual hiding
    handleClearSelection();
    alert(`Đã ẩn ${selectedProducts.size} sản phẩm thành công!`);
  };

  const handleBulkExport = () => {
    if (selectedProducts.size === 0) return;

    console.log('Exporting products:', Array.from(selectedProducts));
    // TODO: Implement actual export
    alert(`Đang xuất dữ liệu ${selectedProducts.size} sản phẩm...`);
  };

  const handleViewMore = (productId: string) => {
    console.log("View more product:", productId);
  };

  const handleUpdate = (productId: string) => {
    console.log("Update product:", productId);
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
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchValue.toLowerCase());

      // Filter by tab status
      const matchesTab = (() => {
        switch (activeTab) {
          case 'active':
            return product.inventory > 0;
          case 'inactive':
            return product.inventory === 0;
          case 'all':
          default:
            return true;
        }
      })();

      return matchesSearch && matchesTab;
    });
  }, [searchValue, activeTab]);

  // Reset selection when filters change
  React.useEffect(() => {
    handleClearSelection();
  }, [searchValue, activeTab, currentPage]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

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
          />          {/* Table Body */}
          <div className={`w-full transition-all duration-200 ${selectedProducts.size > 0 ? 'ring-2 ring-blue-200 ring-opacity-50 rounded-b-[16px]' : 'rounded-b-[16px]'} overflow-hidden`}>
            {paginatedProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                isSelected={selectedProducts.has(product.id)}
                onSelect={handleProductSelect}
                onViewMore={handleViewMore}
                onUpdate={handleUpdate}
              />
            ))}
          </div>

          {/* No products message */}
          {paginatedProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
              <p className="text-sm mt-1">
                {searchValue ? `Không có sản phẩm nào khớp với "${searchValue}"` : 'Danh sách sản phẩm trống'}
              </p>
            </div>
          )}
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