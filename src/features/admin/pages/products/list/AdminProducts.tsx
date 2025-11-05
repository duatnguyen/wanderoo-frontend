import React, { useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import ProductItem from "../../../../../components/admin/table/ProductItem";
import ProductTableHeader from "../../../../../components/admin/table/ProductTableHeader";
import type { Product } from "../../../../../types/types";
import {
  TabMenuAccount,
  PageContainer,
  ContentCard,
} from "@/components/common";
import { Pagination } from "@/components/ui/pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "active", label: "Đang hoạt động" },
    { id: "inactive", label: "Chưa được đăng" },
  ];

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
      // Select all product IDs
      const allIds = mockProducts.map(p => p.id);
      setSelectedProducts(new Set(allIds));
      setSelectAll(true);
    } else {
      setSelectedProducts(new Set());
      setSelectAll(false);
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
    setSelectAll(newSelected.size === mockProducts.length);
  };

  const handleClearSelection = () => {
    setSelectedProducts(new Set());
    setSelectAll(false);
  };

  const handleViewMore = (productId: string) => {
    console.log("View more product:", productId);
  };

  const handleUpdate = (productId: string) => {
    console.log("Update product:", productId);
  };

  // Filter products based on search and tab
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchValue.toLowerCase());
    
    // Add tab filtering logic here if needed
    return matchesSearch;
  });

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
          <span className="text-sm text-[#6b7280] font-medium">
            ({filteredProducts.length} sản phẩm)
          </span>
        </div>
      </div>

      {/* Tab Menu */}

      <div className="flex flex-col gap-[8px] items-center py-[5px] relative rounded-[20px] w-full flex-shrink-0">
        <TabMenuAccount
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          className="w-full mx-auto"
        />
      </div>
      {/* Main Content */}
      <ContentCard>
        {/* Search Bar */}
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full max-w-md"
        />

        {/* Table Section */}
        {/* Table Container with Scroll */}
        <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[10px] w-full min-w-[1200px]">
          {/* Table Header */}
          <ProductTableHeader
            selectAll={selectAll}
            selectedCount={selectedProducts.size}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            showSelectionActions={selectedProducts.size > 0}
          />

          {/* Table Body */}
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
        {/* Pagination */}
        <Pagination
          current={currentPage}
          total={totalPages}
          onChange={setCurrentPage}
        />
      </ContentCard>
    </PageContainer>
  );
};

export default AdminProducts;