import React, { useState } from "react";
import TabMenuAccount from "../../components/ui/tab-menu-account";
import SearchBar from "../../components/ui/search-bar";

const AdminProducts: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchValue, setSearchValue] = useState("");

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

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="w-full px-0 py-[10px]">
        <h1 className="text-[24px] font-bold text-[#272424] font-montserrat leading-[100%]">
          Danh sách sản phẩm
        </h1>
      </div>

      {/* Main Content Frame */}
      <div className="w-full bg-white border-2 border-[#e7e7e7] rounded-[24px] p-6 flex flex-col gap-4">
        {/* Tab Menu Account */}
        <div className="w-full">
          <TabMenuAccount
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Search Bar */}
        <div className="w-[500px]">
          <SearchBar
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm"
          />
        </div>

        {/* Product Count */}
        <div className="w-full">
          <h2 className="text-[20px] font-bold text-[#272424] font-montserrat leading-[100%]">
            101 sản phẩm
          </h2>
        </div>

        {/* Data Table Container */}
        <div className="w-full bg-white border border-[#d1d1d1] rounded-[16px] flex flex-col">
          {/* Table Header */}
          <div className="bg-[#f6f6f6] border-b border-[#d1d1d1] rounded-t-[12px] flex">
            <div className="w-[44px] p-3 flex items-center justify-center">
              {/* Checkbox column */}
            </div>
            <div className="w-[500px] p-3 border-r border-[#d1d1d1]">
              <p className="text-[12px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                Tên sản phẩm
              </p>
            </div>
            <div className="flex-1 p-3 border-r border-[#d1d1d1] text-center">
              <p className="text-[12px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                SKU sản phẩm
              </p>
            </div>
            <div className="flex-1 p-3 border-r border-[#d1d1d1] text-center">
              <p className="text-[12px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                Barcode
              </p>
            </div>
            <div className="flex-1 p-3 border-r border-[#d1d1d1] text-center">
              <p className="text-[12px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                Tồn kho
              </p>
            </div>
            <div className="flex-1 p-3 border-r border-[#d1d1d1] text-center">
              <p className="text-[12px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                Có thể bán
              </p>
            </div>
            <div className="flex-1 p-3 border-r border-[#d1d1d1] text-center">
              <p className="text-[12px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                SL bán trên website
              </p>
            </div>
            <div className="flex-1 p-3 border-r border-[#d1d1d1] text-center">
              <p className="text-[12px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                SL bán trên POS
              </p>
            </div>
            <div className="flex-1 p-3 border-r border-[#d1d1d1] text-center">
              <p className="text-[12px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                Giá bán
              </p>
            </div>
            <div className="flex-1 p-3 border-r border-[#d1d1d1] text-center">
              <p className="text-[12px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                Giá vốn
              </p>
            </div>
            <div className="w-[120px] p-3 text-center">
              <p className="text-[12px] font-semibold text-[#272424] font-montserrat leading-[140%]">
                Thao tác
              </p>
            </div>
          </div>

          {/* Table Body - Empty for now */}
          <div className="flex-1 min-h-[400px]">
            {/* Table rows will be added here */}
          </div>
        </div>

        {/* Pagination */}
        <div className="w-full bg-white border border-[#e7e7e7] rounded-[12px] h-12 flex items-center justify-between px-8 py-2">
          <div className="flex items-center">
            <p className="text-[12px] font-normal text-[#737373] font-montserrat leading-[150%]">
              Đang hiển thị 1 - 12 trong tổng 20 trang
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <p className="text-[12px] font-normal text-[#272424] font-montserrat leading-[150%]">
                Trang số
              </p>
              <div className="px-2 py-1 rounded-[8px] bg-gray-100">
                <p className="text-[12px] font-normal text-[#272424] font-montserrat leading-[150%]">
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
  );
};

export default AdminProducts;
