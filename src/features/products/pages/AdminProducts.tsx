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
      // Select all 9 product IDs
      setSelectedProducts(
        new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9"])
      );
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
            101 sản phẩm
          </h2>
        </div>

        {/* Table Section */}
        <div className="flex flex-col items-start px-3 sm:px-[15px] py-0 relative rounded-[16px] w-full">
          {/* Table Container with Scroll */}
          <div className="w-full overflow-x-auto overflow-y-visible table-scroll-horizontal pb-4">
            <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[24px] min-w-[1400px] sm:min-w-[1600px] lg:min-w-[1800px] w-fit">
              {/* Table Header */}
              {selectedProducts.size > 0 ? (
                /* Selection Header */
                <div className="bg-[#f6f6f6] flex items-center px-[15px] py-0 rounded-tl-[24px] rounded-tr-[24px] w-full h-[68px]">
                  <div className="flex flex-row items-center w-full h-full gap-[12px]">
                    <CustomCheckbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-[24px] h-[24px]"
                    />
                    <span className="font-semibold text-[#272424] text-[12px] leading-[1.5]">
                      Đã chọn {selectedProducts.size} sản phẩm
                    </span>
                    <div className="flex gap-[6px] items-center ml-auto">
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
                    <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-[60px] min-h-[68px]">
                      <CustomCheckbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-[24px] h-[24px]"
                      />
                    </div>
                    <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-[500px] min-h-[68px]">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
                        Tên sản phẩm
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        SKU sản phẩm
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        Barcode
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        Tồn kho
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        Có thể bán
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        SL bán trên website
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        SL bán trên POS
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        Giá bán
                      </span>
                    </div>
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                      <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                        Giá vốn
                      </span>
                    </div>
                    <div className="flex gap-[4px] h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
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

              {/* Sample Product Row 2 */}
              <div className="border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-50">
                <div className="flex flex-row items-center w-full">
                  {/* Checkbox Column */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedProducts.has("2")}
                        onChange={() => handleProductSelect("2")}
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
                      Áo khoác gió nam cao cấp Windbreaker WB-2024
                    </p>
                  </div>
                  {/* SKU */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      SKU02
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
                      50
                    </span>
                  </div>
                  {/* Available to Sell */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      45
                    </span>
                  </div>
                  {/* Sold on Website */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      850.000đ
                    </span>
                  </div>
                  {/* Sold on POS */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      15
                    </span>
                  </div>
                  {/* Selling Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      950.000đ
                    </span>
                  </div>
                  {/* Cost Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      650.00đ
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

              {/* Product 2 - Variant Row 1 - Color: Black */}
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
                      Color: Black
                    </p>
                  </div>
                  {/* SKU */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center whitespace-pre-line">
                      SKU phân loại:{"\n"}SKU02-BLK
                    </span>
                  </div>
                  {/* Barcode */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      8930195417620
                    </span>
                  </div>
                  {/* Inventory */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      25
                    </span>
                  </div>
                  {/* Available to Sell */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      23
                    </span>
                  </div>
                  {/* Sold on Website */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      850.000đ
                    </span>
                  </div>
                  {/* Sold on POS */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      7
                    </span>
                  </div>
                  {/* Selling Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      950.000đ
                    </span>
                  </div>
                  {/* Cost Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      650.00đ
                    </span>
                  </div>
                  {/* Empty Actions Column */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    {/* No actions for variants */}
                  </div>
                </div>
              </div>

              {/* Product 2 - Variant Row 2 - Color: Navy */}
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
                      Color: Navy
                    </p>
                  </div>
                  {/* SKU */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center whitespace-pre-line">
                      SKU phân loại:{"\n"}SKU02-NVY
                    </span>
                  </div>
                  {/* Barcode */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      8930195417621
                    </span>
                  </div>
                  {/* Inventory */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      25
                    </span>
                  </div>
                  {/* Available to Sell */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      22
                    </span>
                  </div>
                  {/* Sold on Website */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      850.000đ
                    </span>
                  </div>
                  {/* Sold on POS */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      8
                    </span>
                  </div>
                  {/* Selling Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      950.000đ
                    </span>
                  </div>
                  {/* Cost Price */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      650.00đ
                    </span>
                  </div>
                  {/* Empty Actions Column */}
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    {/* No actions for variants */}
                  </div>
                </div>
              </div>

              {/* Product 3 - Backpack */}
              <div className="border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-50">
                <div className="flex flex-row items-center w-full">
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedProducts.has("3")}
                        onChange={() => handleProductSelect("3")}
                        className="w-[24px] h-[24px]"
                      />
                    </div>
                  </div>
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-[500px] min-w-[500px]">
                    <div className="w-[70px] h-[70px] border-[0.5px] border-[#d1d1d1] rounded-[8px] bg-gray-100 flex-shrink-0"></div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Balo du lịch chống nước Osprey Daylite Plus 20L
                    </p>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      SKU03
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      ---
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      80
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      75
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      1.200.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      35
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      1.500.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      900.00đ
                    </span>
                  </div>
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

              {/* Product 4 - T-Shirt */}
              <div className="border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-50">
                <div className="flex flex-row items-center w-full">
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedProducts.has("4")}
                        onChange={() => handleProductSelect("4")}
                        className="w-[24px] h-[24px]"
                      />
                    </div>
                  </div>
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-[500px] min-w-[500px]">
                    <div className="w-[70px] h-[70px] border-[0.5px] border-[#d1d1d1] rounded-[8px] bg-gray-100 flex-shrink-0"></div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Áo thun thể thao nam nữ Columbia Quick Dry
                    </p>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      SKU04
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      8930195417700
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      120
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      115
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      250.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      48
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      350.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      180.00đ
                    </span>
                  </div>
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

              {/* Product 5 - Water Bottle */}
              <div className="border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-50">
                <div className="flex flex-row items-center w-full">
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedProducts.has("5")}
                        onChange={() => handleProductSelect("5")}
                        className="w-[24px] h-[24px]"
                      />
                    </div>
                  </div>
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-[500px] min-w-[500px]">
                    <div className="w-[70px] h-[70px] border-[0.5px] border-[#d1d1d1] rounded-[8px] bg-gray-100 flex-shrink-0"></div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Bình nước giữ nhiệt Hydro Flask 750ml
                    </p>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      SKU05
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      8930195417800
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      60
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      58
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      550.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      22
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      680.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      420.00đ
                    </span>
                  </div>
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

              {/* Product 6 - Sunglasses */}
              <div className="border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-50">
                <div className="flex flex-row items-center w-full">
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedProducts.has("6")}
                        onChange={() => handleProductSelect("6")}
                        className="w-[24px] h-[24px]"
                      />
                    </div>
                  </div>
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-[500px] min-w-[500px]">
                    <div className="w-[70px] h-[70px] border-[0.5px] border-[#d1d1d1] rounded-[8px] bg-gray-100 flex-shrink-0"></div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Kính mát thể thao Oakley UV Protection
                    </p>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      SKU06
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      ---
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      40
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      38
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      1.800.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      12
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      2.200.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      1.300.00đ
                    </span>
                  </div>
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

              {/* Product 7 - Hat */}
              <div className="border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-50">
                <div className="flex flex-row items-center w-full">
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedProducts.has("7")}
                        onChange={() => handleProductSelect("7")}
                        className="w-[24px] h-[24px]"
                      />
                    </div>
                  </div>
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-[500px] min-w-[500px]">
                    <div className="w-[70px] h-[70px] border-[0.5px] border-[#d1d1d1] rounded-[8px] bg-gray-100 flex-shrink-0"></div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Mũ lưỡi trai The North Face Horizon Hat
                    </p>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      SKU07
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      8930195417900
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      95
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      92
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      320.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      28
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      420.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      240.00đ
                    </span>
                  </div>
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

              {/* Product 8 - Hiking Socks */}
              <div className="border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-50">
                <div className="flex flex-row items-center w-full">
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedProducts.has("8")}
                        onChange={() => handleProductSelect("8")}
                        className="w-[24px] h-[24px]"
                      />
                    </div>
                  </div>
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-[500px] min-w-[500px]">
                    <div className="w-[70px] h-[70px] border-[0.5px] border-[#d1d1d1] rounded-[8px] bg-gray-100 flex-shrink-0"></div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Vớ leo núi Smartwool Merino Wool Hiking
                    </p>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      SKU08
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      8930195418000
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      150
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      148
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      180.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      65
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      250.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      120.00đ
                    </span>
                  </div>
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

              {/* Product 9 - Gloves */}
              <div className="border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-50">
                <div className="flex flex-row items-center w-full">
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-[60px] min-w-[60px]">
                    <div onClick={(e) => e.stopPropagation()}>
                      <CustomCheckbox
                        checked={selectedProducts.has("9")}
                        onChange={() => handleProductSelect("9")}
                        className="w-[24px] h-[24px]"
                      />
                    </div>
                  </div>
                  <div className="flex h-full items-center gap-[8px] px-[12px] py-[14px] w-[500px] min-w-[500px]">
                    <div className="w-[70px] h-[70px] border-[0.5px] border-[#d1d1d1] rounded-[8px] bg-gray-100 flex-shrink-0"></div>
                    <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1">
                      Găng tay leo núi chống lạnh Black Diamond Guide
                    </p>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      SKU09
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      ---
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      70
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      68
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[140px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      480.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[120px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      18
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      650.000đ
                    </span>
                  </div>
                  <div className="flex h-full items-center justify-center px-[12px] py-[14px] flex-1 min-w-[100px]">
                    <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                      380.00đ
                    </span>
                  </div>
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

        {/* Pagination */}
        <div className="px-3 sm:px-[15px] py-[8px] w-full flex-shrink-0">
          <div className="w-full bg-white border border-[#e7e7e7] rounded-[12px] min-h-12 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-2 gap-2 sm:gap-0">
            <div className="flex items-center">
              <p className="text-[10px] sm:text-[12px] font-normal text-[#737373] font-montserrat leading-[150%]">
                Đang hiển thị 1 - 12 trong tổng 20 trang
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <p className="text-[10px] sm:text-[12px] font-normal text-[#272424] font-montserrat leading-[150%]">
                  Trang số
                </p>
                <div className="px-2 py-1 rounded-[8px] bg-gray-100">
                  <p className="text-[10px] sm:text-[12px] font-normal text-[#272424] font-montserrat leading-[150%]">
                    1
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="border border-[#b0b0b0] rounded-[8px] p-1">
                  {/* Left arrow icon */}
                </button>
                <button className="border border-[#b0b0b0] rounded-[8px] p-1">
                  {/* Right arrow icon */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
