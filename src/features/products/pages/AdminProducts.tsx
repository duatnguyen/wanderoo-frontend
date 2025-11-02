import React, { useState } from "react";
import TabMenuAccount from "@/components/ui/tab-menu-account";
import SearchBar from "@/components/ui/search-bar";
import CaretDown from "@/components/ui/caret-down";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminProducts: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "active", label: "Đang hoạt động" },
    { id: "inactive", label: "Chưa được đăng" },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select first 3 product IDs (mock data)
      setSelectedProducts(new Set(["1", "2", "3"]));
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
    setSelectAll(false);
  };

  const handleClearSelection = () => {
    setSelectedProducts(new Set());
    setSelectAll(false);
  };

  return (
    <div className="flex flex-col w-full gap-1">
      {/* Header */}
      <div className="flex items-center justify-between py-[4px] px-0 min-h-[32px] w-full">
        <h1 className="font-bold text-base text-[24px] text-[#272424] font-['Montserrat']">
          Danh sách sản phẩm
        </h1>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-[#e7e7e7] flex flex-col items-start relative rounded-[20px] w-full">
        {/* Tab Menu */}
        <div className="flex flex-col gap-[8px] items-center px-[15px] py-[8px] relative rounded-[20px] w-full flex-shrink-0">
          <TabMenuAccount
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            className="w-full mx-auto"
          />
        </div>

        {/* Search Section */}
        <div className="flex flex-col gap-[8px] items-center px-3 sm:px-[15px] py-[8px] relative rounded-[20px] w-full flex-shrink-0">
          <div className="flex gap-[8px] items-center justify-left relative w-full">
            <div className="flex flex-row items-center self-stretch w-full sm:w-auto">
              <SearchBar
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full sm:w-[500px]"
              />
            </div>
          </div>
        </div>

        {/* Product Count */}
        <div className="px-3 sm:px-[15px] pb-[8px] flex-shrink-0">
          <h2 className="text-sm sm:text-[16px] font-bold text-[#272424] font-['Montserrat']">
            3 sản phẩm
          </h2>
        </div>

        {/* Table Section */}
        <div className="flex flex-col items-start px-3 sm:px-[15px] py-0 relative rounded-[16px] w-full">
          {/* Table Container with Scroll */}
          <div className="w-full overflow-x-auto pb-4">
            <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[24px] w-full min-w-[1200px]">
              {/* Table Header */}
              {selectedProducts.size > 0 ? (
                /* Selection Header */
                <div className="bg-[#f6f6f6] flex items-center px-[15px] py-0 rounded-tl-[24px] rounded-tr-[24px] w-full h-[68px]">
                  <div className="flex flex-row items-center w-full h-full gap-[12px]">
                    <div
                      className="min-w-[24px] flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CustomCheckbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-[24px] h-[24px]"
                      />
                    </div>
                    <span className="font-semibold text-[#272424] text-[12px] leading-[1.5] whitespace-nowrap">
                      Đã chọn {selectedProducts.size} sản phẩm
                    </span>
                    <div className="flex gap-[6px] items-center">
                      <Button
                        variant="secondary"
                        onClick={handleClearSelection}
                      >
                        Xóa
                      </Button>
                      <Button>Ẩn</Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary">
                            Thao tác khác
                            <CaretDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            Hiển thị trên kênh
                          </DropdownMenuItem>
                          <DropdownMenuItem>Ẩn khỏi kênh</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ) : (
                /* Normal Header */
                <div className="bg-[#f6f6f6] flex items-center px-[15px] py-0 rounded-tl-[24px] rounded-tr-[24px] w-full h-[68px]">
                  <div className="flex flex-row items-center w-full h-full">
                    <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-12 flex-shrink-0">
                      <div
                        className="flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CustomCheckbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-[24px] h-[24px]"
                        />
                      </div>
                    </div>
                    <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-1/4 min-w-48">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                        Tên sản phẩm
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/8 min-w-20">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        SKU
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/8 min-w-20">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        Barcode
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/12 min-w-16">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        Tồn kho
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/12 min-w-16">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        Có bán
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        SL web
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        SL POS
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        Giá bán
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        Giá vốn
                      </span>
                    </div>
                    <div className="flex gap-[4px] h-full items-center justify-center px-[12px] py-[14px] w-1/8 min-w-20">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        Thao tác
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Table Body */}
              {/* Sample Product Row */}
              <div className="border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-50">
                <div className="flex flex-row items-center w-full">
                  {/* Checkbox Column */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-12 flex-shrink-0">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedProducts.has("1")}
                        onChange={() => handleProductSelect("1")}
                        className="w-[24px] h-[24px]"
                      />
                    </div>
                  </div>
                  {/* Product Name with Image */}
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-1/4 min-w-48">
                    <div className="w-[70px] h-[70px] border-[0.5px] border-[#d1d1d1] rounded-[8px] bg-gray-100 flex-shrink-0">
                      {/* Product Image Placeholder */}
                    </div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Giày leo núi nữ cổ thấp Humtto Hiking Shoes 140134B-4
                    </p>
                  </div>
                  {/* SKU */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      SKU01
                    </span>
                  </div>
                  {/* Barcode */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      ---
                    </span>
                  </div>
                  {/* Inventory */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Available to Sell */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Sold on Website */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      400.000đ
                    </span>
                  </div>
                  {/* Sold on POS */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Selling Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      600.000đ
                    </span>
                  </div>
                  {/* Cost Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      400.00đ
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="flex h-full flex-col items-center justify-center gap-[16px] px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center cursor-pointer hover:text-[#e04d30]">
                      Xem thêm
                    </p>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center cursor-pointer hover:text-[#e04d30]">
                      Cập nhật
                    </p>
                  </div>
                </div>
              </div>

              {/* Variant Row 1 - Size 36 */}
              <div className="bg-[#f6f6f6] border-b-[0.5px] border-[#e7e7e7] flex items-center px-[12px] py-0 w-full hover:bg-gray-100">
                <div className="flex flex-row items-center w-full">
                  {/* Empty Checkbox Column */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    {/* No checkbox for variants */}
                  </div>
                  {/* Variant Name */}
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-[500px] min-w-[500px]">
                    <div className="w-[70px] h-[70px] flex-shrink-0">
                      {/* No image for variants */}
                    </div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Size 36
                    </p>
                  </div>
                  {/* SKU */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center whitespace-pre-line">
                      SKU phân loại:{"\n"}SKU01-40B
                    </span>
                  </div>
                  {/* Barcode */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      8930195417609
                    </span>
                  </div>
                  {/* Inventory */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Available to Sell */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Sold on Website */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      400.000đ
                    </span>
                  </div>
                  {/* Sold on POS */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Selling Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      600.000đ
                    </span>
                  </div>
                  {/* Cost Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      400.00đ
                    </span>
                  </div>
                  {/* Empty Actions Column */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    {/* No actions for variants */}
                  </div>
                </div>
              </div>

              {/* Variant Row 2 - Size 37 */}
              <div className="bg-[#f6f6f6] border-b-[0.5px] border-[#e7e7e7] flex items-center px-[12px] py-0 w-full hover:bg-gray-100">
                <div className="flex flex-row items-center w-full">
                  {/* Empty Checkbox Column */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    {/* No checkbox for variants */}
                  </div>
                  {/* Variant Name */}
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-[500px] min-w-[500px]">
                    <div className="w-[70px] h-[70px] flex-shrink-0">
                      {/* No image for variants */}
                    </div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Size 37
                    </p>
                  </div>
                  {/* SKU */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center whitespace-pre-line">
                      SKU phân loại:{"\n"}SKU01-40C
                    </span>
                  </div>
                  {/* Barcode */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      8930195417610
                    </span>
                  </div>
                  {/* Inventory */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Available to Sell */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Sold on Website */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      400.000đ
                    </span>
                  </div>
                  {/* Sold on POS */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Selling Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      600.000đ
                    </span>
                  </div>
                  {/* Cost Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      400.00đ
                    </span>
                  </div>
                  {/* Empty Actions Column */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    {/* No actions for variants */}
                  </div>
                </div>
              </div>

              {/* Variant Row 3 - Size 38 */}
              <div className="bg-[#f6f6f6] border-b-[0.5px] border-[#e7e7e7] flex items-center px-[12px] py-0 w-full hover:bg-gray-100">
                <div className="flex flex-row items-center w-full">
                  {/* Empty Checkbox Column */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    {/* No checkbox for variants */}
                  </div>
                  {/* Variant Name */}
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-[500px] min-w-[500px]">
                    <div className="w-[70px] h-[70px] flex-shrink-0">
                      {/* No image for variants */}
                    </div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Size 38
                    </p>
                  </div>
                  {/* SKU */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center whitespace-pre-line">
                      SKU phân loại:{"\n"}SKU01-40D
                    </span>
                  </div>
                  {/* Barcode */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      8930195417611
                    </span>
                  </div>
                  {/* Inventory */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Available to Sell */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Sold on Website */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      400.000đ
                    </span>
                  </div>
                  {/* Sold on POS */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Selling Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      600.000đ
                    </span>
                  </div>
                  {/* Cost Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      400.00đ
                    </span>
                  </div>
                  {/* Empty Actions Column */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    {/* No actions for variants */}
                  </div>
                </div>
              </div>
              <div className="border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-50">
                <div className="flex flex-row items-center w-full">
                  {/* Checkbox Column */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedProducts.has("1")}
                        onChange={() => handleProductSelect("1")}
                        className="w-[24px] h-[24px]"
                      />
                    </div>
                  </div>
                  {/* Product Name with Image */}
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-[500px] min-w-[500px]">
                    <div className="w-[70px] h-[70px] border-[0.5px] border-[#d1d1d1] rounded-[8px] bg-gray-100 flex-shrink-0">
                      {/* Product Image Placeholder */}
                    </div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Giày leo núi nữ cổ thấp Humtto Hiking Shoes 140134B-4
                    </p>
                  </div>
                  {/* SKU */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      SKU01
                    </span>
                  </div>
                  {/* Barcode */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      ---
                    </span>
                  </div>
                  {/* Inventory */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Available to Sell */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Sold on Website */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      400.000đ
                    </span>
                  </div>
                  {/* Sold on POS */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Selling Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      600.000đ
                    </span>
                  </div>
                  {/* Cost Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      400.00đ
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="flex h-full flex-col items-center justify-center gap-[16px] px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center cursor-pointer hover:text-[#e04d30]">
                      Xem thêm
                    </p>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center cursor-pointer hover:text-[#e04d30]">
                      Cập nhật
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-50">
                <div className="flex flex-row items-center w-full">
                  {/* Checkbox Column */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedProducts.has("1")}
                        onChange={() => handleProductSelect("1")}
                        className="w-[24px] h-[24px]"
                      />
                    </div>
                  </div>
                  {/* Product Name with Image */}
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-[500px] min-w-[500px]">
                    <div className="w-[70px] h-[70px] border-[0.5px] border-[#d1d1d1] rounded-[8px] bg-gray-100 flex-shrink-0">
                      {/* Product Image Placeholder */}
                    </div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Giày leo núi nữ cổ thấp Humtto Hiking Shoes 140134B-4
                    </p>
                  </div>
                  {/* SKU */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      SKU01
                    </span>
                  </div>
                  {/* Barcode */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      ---
                    </span>
                  </div>
                  {/* Inventory */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Available to Sell */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Sold on Website */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      400.000đ
                    </span>
                  </div>
                  {/* Sold on POS */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      0
                    </span>
                  </div>
                  {/* Selling Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      600.000đ
                    </span>
                  </div>
                  {/* Cost Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      400.00đ
                    </span>
                  </div>
                  {/* Actions */}
                  <div className="flex h-full flex-col items-center justify-center gap-[16px] px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center cursor-pointer hover:text-[#e04d30]">
                      Xem thêm
                    </p>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center cursor-pointer hover:text-[#e04d30]">
                      Cập nhật
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
