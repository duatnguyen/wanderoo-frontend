// src/pages/admin/AdminDiscounts.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import TabMenuAccount from "@/components/ui/tab-menu-account";
import type { TabItem } from "@/components/ui/tab-menu-account";
import {
  CoinDiscountIcon,
  CreditCardPercentIcon,
  ReceiptDiscountIcon,
  TicketDiscountIcon,
} from "@/components/icons/discount";

interface Voucher {
  id: string;
  code: string;
  name: string;
  type: string;
  products: string;
  discount: string;
  maxUsage: number;
  used: number;
  display: string;
  startDate: string;
  endDate: string;
  status: "Đang diễn ra" | "Sắp diễn ra" | "Đã kết thúc";
}

// Mock data
const mockVouchers: Voucher[] = [
  {
    id: "1",
    code: "KJAJHSS",
    name: "KHACH MOI",
    type: "Voucher khách hàng mới",
    products: "Tất cả sản phẩm",
    discount: "5.000đ",
    maxUsage: 50,
    used: 1,
    display: "Website",
    startDate: "12:00 17/3/2023",
    endDate: "12:00 17/3/2024",
    status: "Đang diễn ra",
  },
  {
    id: "2",
    code: "KJAJHSS",
    name: "KHACH MOI",
    type: "Voucher khách hàng mới",
    products: "Tất cả sản phẩm",
    discount: "5.000đ",
    maxUsage: 50,
    used: 1,
    display: "Website",
    startDate: "12:00 17/3/2023",
    endDate: "12:00 17/3/2024",
    status: "Đang diễn ra",
  },
  {
    id: "3",
    code: "KJAJHSS",
    name: "KHACH MOI",
    type: "Voucher khách hàng mới",
    products: "Tất cả sản phẩm",
    discount: "5.000đ",
    maxUsage: 50,
    used: 1,
    display: "Website",
    startDate: "12:00 17/3/2023",
    endDate: "12:00 17/3/2024",
    status: "Đang diễn ra",
  },
];

// Tab data
const discountTabs: TabItem[] = [
  { id: "all", label: "Tất cả" },
  { id: "ongoing", label: "Đang diễn ra" },
  { id: "upcoming", label: "Sắp diễn ra" },
  { id: "ended", label: "Đã kết thúc" },
];

// Voucher types configuration
const voucherTypes = {
  conversion: [
    {
      icon: <CreditCardPercentIcon size={24} color="#292D32" />,
      title: "Voucher toàn shop",
      description: "Voucher áp dụng cho tất cả sản phẩm toàn shop của bạn",
    },
    {
      icon: <ReceiptDiscountIcon size={24} color="#292D32" />,
      title: "Voucher sản phẩm",
      description: "Voucher áp dụng cho những sản phẩm áp dụng tại shop",
    },
  ],
  targetCustomer: [
    {
      icon: <TicketDiscountIcon size={24} color="#292D32" />,
      title: "Voucher khách hàng mới",
      description:
        "Voucher nhằm áp dụng cho khách hàng mới và khách hàng tiềm năng",
    },
    {
      icon: <CoinDiscountIcon size={24} color="#292D32" />,
      title: "Voucher khách hàng mua lại",
      description: "Voucher nhằm áp dụng cho khách hàng đã mua hàng tại shop",
    },
  ],
  privateChannel: {
    icon: <CreditCardPercentIcon size={30} color="#292D32" />,
    title: "Voucher riêng tư",
    description:
      "Voucher nhằm áp dụng cho nhóm khách hàng shop muốn thông qua mã voucher",
  },
};

const AdminDiscounts: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Đang diễn ra":
        return "bg-[#b2ffb4] text-[#04910c]";
      case "Sắp diễn ra":
        return "bg-[#cce5ff] text-[#0066cc]";
      case "Đã kết thúc":
        return "bg-[#f6f6f6] text-[#737373]";
      default:
        return "bg-[#f6f6f6] text-[#737373]";
    }
  };

  const handleCreateVoucher = (type: string) => {
    console.log("Creating voucher of type:", type);
    navigate("/admin/discounts/new");
  };

  return (
    <div className="flex flex-col gap-[10px] px-[50px] py-[32px] w-full">
      {/* Header */}
      <div className="flex flex-col gap-[8px] h-[79px] items-start justify-center px-0 py-[10px] w-full">
        <div className="flex gap-[30px] items-center px-0 py-[4px] w-full">
          <h1 className="font-bold text-[24px] text-[#272424] leading-[normal]">
            Danh sách mã giảm giá
          </h1>
        </div>
      </div>

      {/* Create Voucher Section */}
      <div className="bg-white border border-[#d1d1d1] rounded-[24px] p-[24px] flex flex-col w-full">
        {/* Create Voucher Header */}
        <div className="flex flex-col gap-[8px] h-[79px] items-start justify-center px-0 py-[10px] w-full">
          <div className="flex gap-[30px] items-center px-0 py-[4px] w-full">
            <h2 className="font-bold text-[24px] text-[#272424] leading-[normal]">
              Tạo voucher
            </h2>
          </div>
          <p className="font-medium text-[10px] text-[#e04d30] leading-[1.4]">
            Tạo Mã giảm giá toàn shop hoặc Mã giảm giá sản phẩm ngay bây giờ để
            thu hút người mua.
          </p>
        </div>

        {/* Conversion Section */}
        <div className="flex flex-col gap-[8px] items-start justify-center px-0 py-[10px] w-full">
          <h3 className="font-bold text-[20px] text-[#2a2a2a] leading-[normal]">
            Cải thiện tỉ lệ chuyển đổi
          </h3>
        </div>
        <div className="flex gap-[60px] items-center justify-center w-full">
          {voucherTypes.conversion.map((voucher, index) => (
            <div
              key={index}
              className="bg-white border-2 border-[#E04D30] rounded-[24px] px-[22px] py-[19px] flex flex-col gap-[10px] items-start flex-1"
            >
              <div className="flex gap-[10px] items-start">
                <div className="flex items-center justify-center w-[24px] h-[24px]">
                  {voucher.icon}
                </div>
                <div className="font-semibold text-[16px] text-[#2a2a2a] leading-[1.4]">
                  {voucher.title}
                </div>
              </div>
              <p className="font-medium text-[10px] text-[#322f30] leading-[1.4]">
                {voucher.description}
              </p>
              <div className="flex gap-[10px] items-center justify-end w-full">
                <Button onClick={() => handleCreateVoucher(voucher.title)}>
                  Tạo
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Target Customer Section */}
        <div className="flex flex-col gap-[8px] items-start justify-center px-0 py-[10px] w-full mt-4">
          <h3 className="font-bold text-[20px] text-[#2a2a2a] leading-[1.4]">
            Tập trung vào nhóm khách hàng mục tiêu
          </h3>
        </div>
        <div className="flex gap-[60px] items-center justify-center w-full">
          {voucherTypes.targetCustomer.map((voucher, index) => (
            <div
              key={index}
              className="bg-white border-2 border-[#E04D30] rounded-[24px] px-[22px] py-[19px] flex flex-col gap-[10px] items-start flex-1"
            >
              <div className="flex gap-[10px] items-start">
                <div className="flex items-center justify-center w-[24px] h-[24px]">
                  {voucher.icon}
                </div>
                <div className="font-semibold text-[16px] text-[#2a2a2a] leading-[1.4]">
                  {voucher.title}
                </div>
              </div>
              <p className="font-medium text-[10px] text-[#322f30] leading-[1.4]">
                {voucher.description}
              </p>
              <div className="flex gap-[10px] items-center justify-end w-full">
                <Button onClick={() => handleCreateVoucher(voucher.title)}>
                  Tạo
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Private Channel Section */}
        <div className="flex flex-col gap-[8px] items-start justify-center px-0 py-[10px] w-full mt-4">
          <h3 className="font-bold text-[20px] text-[#2a2a2a] leading-[1.4]">
            Tập trung vào kênh hiển thị riêng tư
          </h3>
        </div>
        <div className="flex gap-[60px] items-center justify-center w-full">
          <div className="bg-white border-2 border-[#E04D30] rounded-[24px] px-[22px] py-[19px] flex flex-col gap-[10px] items-start flex-1">
            <div className="flex gap-[10px] items-start">
              <div className="flex items-center justify-center w-[30px] h-[30px]">
                {voucherTypes.privateChannel.icon}
              </div>
              <div className="font-semibold text-[16px] text-[#2a2a2a] leading-[1.4]">
                {voucherTypes.privateChannel.title}
              </div>
            </div>
            <p className="font-medium text-[10px] text-[#322f30] leading-[1.4]">
              {voucherTypes.privateChannel.description}
            </p>
            <div className="flex gap-[10px] items-center justify-end w-full">
              <Button
                onClick={() =>
                  handleCreateVoucher(voucherTypes.privateChannel.title)
                }
              >
                Tạo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Menu */}
      <TabMenuAccount
        tabs={discountTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Search Bar */}

      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Tìm kiếm mã giảm giá"
        className="w-full sm:w-[500px]"
      />

      {/* Voucher Table */}
      <div className="">
        <div className="bg-white border border-[#e7e7e7] rounded-[24px] w-full overflow-hidden">
          {/* Table Header */}
          <div className="flex items-start w-full">
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[10px] items-center px-[12px] py-[15px] w-[200px] rounded-tl-[12px]">
              <p className="font-semibold text-[12px] text-[#272424] leading-[1.4]">
                Tên voucher|Mã voucher
              </p>
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[4px] items-center justify-center px-[14px] py-[15px] flex-1">
              <p className="font-semibold text-[12px] text-[#272424] leading-[1.4]">
                Loại mã
              </p>
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[4px] items-center justify-center px-[14px] py-[15px] flex-1">
              <p className="font-semibold text-[12px] text-[#272424] leading-[1.4]">
                SP áp dụng
              </p>
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[4px] items-center justify-center px-[14px] py-[15px] w-[100px]">
              <p className="font-semibold text-[12px] text-[#272424] leading-[1.4]">
                Giảm giá
              </p>
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[4px] items-center justify-center px-[14px] py-[15px] w-[120px]">
              <p className="font-semibold text-[12px] text-[#272424] leading-[1.4] text-center">
                Tổng lượt sử dụng tối đa
              </p>
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[4px] items-center justify-center px-[14px] py-[15px] w-[80px]">
              <p className="font-semibold text-[12px] text-[#272424] leading-[1.4]">
                Đã dùng
              </p>
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[4px] items-center justify-center px-[14px] py-[15px] w-[100px]">
              <p className="font-semibold text-[12px] text-[#272424] leading-[1.4]">
                Hiển thị
              </p>
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[4px] items-center justify-center px-[14px] py-[15px] w-[150px]">
              <p className="font-semibold text-[12px] text-[#272424] leading-[1.4]">
                Thời gian lưu
              </p>
            </div>
            <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] flex gap-[4px] items-center justify-center px-[14px] py-[15px] w-[100px] rounded-tr-[12px]">
              <p className="font-semibold text-[12px] text-[#272424] leading-[1.4]">
                Thao tác
              </p>
            </div>
          </div>

          {/* Table Body */}
          {mockVouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="flex items-start border-t border-[#d1d1d1] w-full"
            >
              <div className="flex gap-[10px] items-center px-[12px] py-[14px] w-[200px]">
                <div className="flex items-center justify-center w-[24px] h-[24px]">
                  <CreditCardPercentIcon size={24} color="#292D32" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-[4px] items-start justify-center">
                    <div
                      className={`flex gap-[10px] items-start px-[8px] py-[6px] rounded-[6px] ${getStatusBadgeClass(
                        voucher.status
                      )}`}
                    >
                      <p className="font-bold text-[12px] leading-[normal]">
                        {voucher.status}
                      </p>
                    </div>
                    <div className="font-medium text-[10px] text-[#272424] leading-[1.4]">
                      <p className="mb-0">{voucher.name}</p>
                      <p>Mã voucher: {voucher.code}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center px-[14px] py-[14px] flex-1">
                <p className="font-medium text-[10px] text-[#272424] leading-[1.4]">
                  {voucher.type}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center px-[14px] py-[14px] flex-1">
                <p className="font-medium text-[10px] text-[#272424] leading-[1.4]">
                  {voucher.products}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center px-[14px] py-[14px] w-[100px]">
                <p className="font-medium text-[10px] text-[#272424] leading-[1.4]">
                  {voucher.discount}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center px-[14px] py-[14px] w-[120px]">
                <p className="font-medium text-[10px] text-[#272424] leading-[1.4]">
                  {voucher.maxUsage}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center px-[14px] py-[14px] w-[80px]">
                <p className="font-medium text-[10px] text-[#272424] leading-[1.4]">
                  {voucher.used}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center px-[14px] py-[14px] w-[100px]">
                <p className="font-medium text-[10px] text-[#272424] leading-[1.4]">
                  {voucher.display}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center px-[14px] py-[14px] w-[150px]">
                <div className="font-medium text-[10px] text-[#272424] leading-[1.4] text-center">
                  <p className="mb-0">{voucher.startDate} -</p>
                  <p>{voucher.endDate}</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center px-[14px] py-[14px] w-[100px]">
                <div className="font-semibold text-[12px] text-[#1a71f6] leading-[1.4] cursor-pointer">
                  <p className="mb-0 hover:opacity-70">Chỉnh sửa</p>
                  <p className="mb-0 hover:opacity-70">Đơn hàng</p>
                  <p className="hover:opacity-70">Kết thúc</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDiscounts;
