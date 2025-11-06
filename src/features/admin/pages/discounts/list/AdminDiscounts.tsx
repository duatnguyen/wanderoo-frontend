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
    icon: <CreditCardPercentIcon size={24} color="#292D32" />,
    title: "Voucher riêng tư",
    description:
      "Voucher áp dụng cho nhóm khách hàng shop thông qua mã voucher",
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
    // Map voucher types to different routes
    const routeMap: Record<string, string> = {
      "Voucher toàn shop": "/admin/discounts/new/shop-wide",
      "Voucher sản phẩm": "/admin/discounts/new/product",
      "Voucher khách hàng mới": "/admin/discounts/new/new-customer",
      "Voucher khách hàng mua lại": "/admin/discounts/new/returning-customer",
      "Voucher riêng tư": "/admin/discounts/new/private",
    };
    const route = routeMap[type] || "/admin/discounts/new";
    navigate(route);
  };

  return (
    <div className="flex flex-col gap-[6px] px-1 xl:px-[50px] pt-0 pb-[12px] w-full -mt-[7px]">
      {/* Header */}
      <div className="flex flex-col gap-[4px] h-[54px] items-start justify-center px-0 py-0 w-full">
        <div className="flex gap-[20px] items-center justify-start px-0 py-0 w-full -ml-1 xl:-ml-[50px]">
          <h1 className="font-bold text-[24px] text-[#272424] leading-[normal] text-left">
            Danh sách mã giảm giá
          </h1>
        </div>
      </div>

      {/* Create Voucher Section */}
      <div className="bg-white border border-[#d1d1d1] rounded-[24px] pt-[12px] px-[24px] pb-[24px] flex flex-col w-full -mt-[10px] overflow-x-auto">
        {/* Create Voucher Header */}
        <div className="flex flex-col gap-[2px] items-start justify-center px-0 py-0 w-full flex-shrink-0">
          <div className="flex gap-[20px] items-center px-0 py-0 w-full">
            <h2 className="font-bold text-[20px] text-[#272424] leading-[normal]">
              Tạo voucher
            </h2>
          </div>
          <p className="font-medium text-[13px] text-[#e04d30] leading-[1.4] -mt-[2px] whitespace-nowrap">
            Tạo Mã giảm giá toàn shop hoặc Mã giảm giá sản phẩm ngay bây giờ để
            thu hút người mua.
          </p>
        </div>

        {/* Conversion Section - subheading removed per request */}
        <div className="w-full min-w-[1000px]">
          <div className="flex gap-[20px] items-center justify-start">
            {voucherTypes.conversion.map((voucher, index) => (
              <div
                key={index}
                className="bg-white border-2 border-[#E04D30] rounded-[12px] px-[22px] py-[19px] h-[110px] flex flex-col items-start w-[500px] flex-shrink-0"
              >
                <div className="flex gap-[10px] items-start">
                  <div className="flex items-center justify-center w-[24px] h-[24px]">
                    {voucher.icon}
                  </div>
                  <div className="font-semibold text-[16px] text-[#2a2a2a] leading-[1.4]">
                    {voucher.title}
                  </div>
                </div>
                <p className="font-medium text-[13px] text-[#322f30] leading-[1.4] -mt-[4px] flex-1 overflow-hidden">
                  {voucher.description}
                </p>
                <div className="flex justify-end w-full mt-auto">
                  <Button
                    className="h-[28px] px-[16px] text-[14px] rounded-[8px]"
                    onClick={() => handleCreateVoucher(voucher.title)}
                  >
                    Tạo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Customer Section */}
        <div className="flex flex-col gap-[8px] items-start justify-center px-0 py-[10px] w-full mt-4 flex-shrink-0">
          <h3 className="font-bold text-[20px] text-[#2a2a2a] leading-[1.4] whitespace-nowrap">
            Tập trung vào nhóm khách hàng mục tiêu
          </h3>
        </div>
        <div className="w-full min-w-[1000px]">
          <div className="flex gap-[20px] items-center justify-start">
            {voucherTypes.targetCustomer.map((voucher, index) => (
              <div
                key={index}
                className="bg-white border-2 border-[#E04D30] rounded-[12px] px-[22px] py-[19px] h-[110px] flex flex-col items-start w-[500px] flex-shrink-0"
              >
                <div className="flex gap-[10px] items-start">
                  <div className="flex items-center justify-center w-[24px] h-[24px]">
                    {voucher.icon}
                  </div>
                  <div className="font-semibold text-[16px] text-[#2a2a2a] leading-[1.4]">
                    {voucher.title}
                  </div>
                </div>
                <p className="font-medium text-[13px] text-[#322f30] leading-[1.4] -mt-[4px] flex-1 overflow-hidden">
                  {voucher.description}
                </p>
                <div className="flex justify-end w-full mt-auto">
                  <Button
                    className="h-[28px] px-[16px] text-[14px] rounded-[8px]"
                    onClick={() => handleCreateVoucher(voucher.title)}
                  >
                    Tạo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Private Channel Section */}
        <div className="flex flex-col gap-[8px] items-start justify-center px-0 py-[10px] w-full mt-4 flex-shrink-0">
          <h3 className="font-bold text-[20px] text-[#2a2a2a] leading-[1.4] whitespace-nowrap">
            Tập trung vào kênh hiển thị riêng tư
          </h3>
        </div>
        <div className="w-full min-w-[1000px]">
          <div className="flex gap-[20px] items-center justify-start">
            <div className="bg-white border-2 border-[#E04D30] rounded-[12px] px-[22px] py-[19px] h-[110px] flex flex-col items-start w-[500px] flex-shrink-0">
              <div className="flex gap-[10px] items-start">
                <div className="flex items-center justify-center w-[24px] h-[24px]">
                  {voucherTypes.privateChannel.icon}
                </div>
                <div className="font-semibold text-[16px] text-[#2a2a2a] leading-[1.4]">
                  {voucherTypes.privateChannel.title}
                </div>
              </div>
              <p className="font-medium text-[13px] text-[#322f30] leading-[1.4] -mt-[4px] flex-1 overflow-hidden">
                {voucherTypes.privateChannel.description}
              </p>
              <div className="flex justify-end w-full mt-auto">
                <Button
                  className="h-[28px] px-[16px] text-[14px] rounded-[8px]"
                  onClick={() =>
                    handleCreateVoucher(voucherTypes.privateChannel.title)
                  }
                >
                  Tạo
                </Button>
              </div>
            </div>
            <div className="w-[500px] flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Tab Menu + Search (expanded width) */}
      <div className="w-full xl:w-[calc(100%+100px)] -mx-0 xl:-mx-[50px] flex flex-col gap-2">
        <div className="w-full overflow-x-auto xl:overflow-x-visible">
          <TabMenuAccount
            tabs={discountTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="w-auto min-w-fit"
          />
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm mã giảm giá"
          className="w-full xl:w-[500px]"
        />
      </div>

      {/* Voucher Table */}
      <div className="w-full overflow-x-auto xl:overflow-x-visible">
        <div className="bg-white border border-[#e7e7e7] rounded-[24px] w-full overflow-hidden min-w-[900px]">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr>
                <th className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] px-[12px] py-[15px] text-left rounded-tl-[12px]">
                  <p className="font-semibold text-[13px] text-[#272424] leading-[1.4] whitespace-nowrap">
                    Tên voucher|Mã voucher
                  </p>
                </th>
                <th className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] px-[14px] py-[15px] text-center">
                  <p className="font-semibold text-[13px] text-[#272424] leading-[1.4]">
                    Loại mã
                  </p>
                </th>
                <th className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] px-[14px] py-[15px] text-center">
                  <p className="font-semibold text-[13px] text-[#272424] leading-[1.4]">
                    SP áp dụng
                  </p>
                </th>
                <th className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] px-[14px] py-[15px] text-center">
                  <p className="font-semibold text-[13px] text-[#272424] leading-[1.4]">
                    Giảm giá
                  </p>
                </th>
                <th className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] px-[14px] py-[15px] text-center">
                  <p className="font-semibold text-[13px] text-[#272424] leading-[1.4] text-center">
                    Tổng lượt sử
                    <br /> dụng tối đa
                  </p>
                </th>
                <th className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] px-[14px] py-[15px] text-center">
                  <p className="font-semibold text-[13px] text-[#272424] leading-[1.4]">
                    Đã dùng
                  </p>
                </th>
                <th className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] px-[14px] py-[15px] text-center">
                  <p className="font-semibold text-[13px] text-[#272424] leading-[1.4]">
                    Hiển thị
                  </p>
                </th>
                <th className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] px-[14px] py-[15px] text-center">
                  <p className="font-semibold text-[13px] text-[#272424] leading-[1.4]">
                    Thời gian lưu
                  </p>
                </th>
                <th className="bg-[#f6f6f6] border-b border-[#e7e7e7] h-[50px] px-[14px] py-[15px] text-center rounded-tr-[12px]">
                  <p className="font-semibold text-[13px] text-[#272424] leading-[1.4]">
                    Thao tác
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {mockVouchers.map((voucher) => (
                <tr key={voucher.id} className="border-t border-[#d1d1d1]">
                  <td className="px-[12px] py-[14px] align-top">
                    <div className="flex gap-[10px] items-center">
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
                            <p className="font-bold text-[13px] leading-[normal]">
                              {voucher.status}
                            </p>
                          </div>
                          <div className="font-medium text-[13px] text-[#272424] leading-[1.4]">
                            <p className="mb-0">{voucher.name}</p>
                            <p>Mã voucher: {voucher.code}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-[14px] py-[14px] text-center align-middle">
                    {voucher.type === "Voucher khách hàng mới" ? (
                      <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
                        Voucher khách
                        <br />
                        hàng mới
                      </p>
                    ) : (
                      <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
                        {voucher.type}
                      </p>
                    )}
                  </td>
                  <td className="px-[14px] py-[14px] text-center align-middle">
                    <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
                      {voucher.products}
                    </p>
                  </td>
                  <td className="px-[14px] py-[14px] text-center align-middle">
                    <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
                      {voucher.discount}
                    </p>
                  </td>
                  <td className="px-[14px] py-[14px] text-center align-middle">
                    <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
                      {voucher.maxUsage}
                    </p>
                  </td>
                  <td className="px-[14px] py-[14px] text-center align-middle">
                    <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
                      {voucher.used}
                    </p>
                  </td>
                  <td className="px-[14px] py-[14px] text-center align-middle">
                    <p className="font-medium text-[13px] text-[#272424] leading-[1.4]">
                      {voucher.display}
                    </p>
                  </td>
                  <td className="px-[14px] py-[14px] text-center align-middle">
                    <div className="font-medium text-[13px] text-[#272424] leading-[1.4]">
                      <p className="mb-0">{voucher.startDate} -</p>
                      <p>{voucher.endDate}</p>
                    </div>
                  </td>
                  <td className="px-[14px] py-[14px] text-center align-middle">
                    <div className="font-semibold text-[13px] text-[#1a71f6] leading-[1.4] cursor-pointer">
                      <p className="mb-0 hover:opacity-70">Chỉnh sửa</p>
                      <p className="mb-0 hover:opacity-70">Đơn hàng</p>
                      <p className="hover:opacity-70">Kết thúc</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDiscounts;
