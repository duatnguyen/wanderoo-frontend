// src/pages/admin/AdminOrders.tsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TabMenuAccount } from "@/components/common";
import type { TabMenuAccountItem } from "@/components/common";
import { Pagination } from "@/components/ui/pagination";
import { ChipStatus } from "@/components/ui/chip-status";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import { SearchBar } from "@/components/ui/search-bar";
import { DetailIcon } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretDown } from "@/components/ui/caret-down";
// Mock data dựa trên hình ảnh
const mockOrders = [
  {
    id: "A122F23153",
    customer: "nguyenbh96",
    products: [
      {
        id: 1,
        name: "Áo thun cờ giấn thoáng khí Rockbros LKW008",
        price: "1.500.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
      {
        id: 2,
        name: "Áo thun đài tay nhanh khô Northshengwolf ch...",
        price: "850.000đ",
        quantity: 2,
        image: "/api/placeholder/50/50",
      },
      {
        id: 3,
        name: "Áo thun ngắn tay nam Gothiar Active",
        price: "650.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
      {
        id: 4,
        name: "Áo thun dài tay nam Gothiar Active",
        price: "750.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Tiền mặt",
    status: "Đã hoàn thành",
    paymentStatus: "Đã thanh toán",
    category: "POS",
    date: "2024-10-17",
    tabStatus: "completed",
  },
  {
    id: "ORD001",
    customer: "nguyenlan",
    products: [
      {
        id: 1,
        name: "Áo thun nữ cộc tay Jouthing Kill Producer LOVEGOS",
        price: "250.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Tiền mặt",
    status: "Chờ xác nhận",
    paymentStatus: "Chưa thanh toán",
    category: "Website",
    date: "2024-10-17",
    tabStatus: "pending",
  },
  {
    id: "ORD002",
    customer: "maianh",
    products: [
      {
        id: 1,
        name: "Áo thun đài tay nhanh Kid Northumberland",
        price: "180.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Chuyển khoản",
    status: "Đã xác nhận",
    paymentStatus: "Đã thanh toán",
    category: "Website",
    date: "2024-10-17",
    tabStatus: "confirmed",
  },
  {
    id: "ORD003",
    customer: "vanminh",
    products: [
      {
        id: 1,
        name: "Giày thể thao nữ chất liệu thoáng khí hiking",
        price: "450.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Chuyển khoản",
    status: "Đang giao",
    paymentStatus: "Đã thanh toán",
    category: "Webstore",
    date: "2024-10-16",
    tabStatus: "shipping",
  },
  {
    id: "ORD004",
    customer: "vanlinh",
    products: [
      {
        id: 1,
        name: "Áo hoodie ghi chữ Hip Hop crphone Vintage",
        price: "320.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Chuyển khoản",
    status: "Đã hoàn thành",
    paymentStatus: "Đã thanh toán",
    category: "POS",
    date: "2024-10-16",
    tabStatus: "completed",
  },
  {
    id: "ORD005",
    customer: "minhquan",
    products: [
      {
        id: 1,
        name: "Túi ba lô nam từ Canvas Performance Cross Series",
        price: "280.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Tiền mặt",
    status: "Đã hủy",
    paymentStatus: "Đã hoàn tiền",
    category: "POS",
    date: "2024-10-15",
    tabStatus: "returned",
  },
  {
    id: "ORD006",
    customer: "thanhha",
    products: [
      {
        id: 1,
        name: "Váy dài màu xanh vintage style",
        price: "350.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Tiền mặt",
    status: "Chờ xác nhận",
    paymentStatus: "Chưa thanh toán",
    category: "Webstore",
    date: "2024-10-15",
    tabStatus: "pending",
  },
];

// Order tabs data
const orderTabs: TabMenuAccountItem[] = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "confirmed", label: "Đã xác nhận" },
  { id: "shipping", label: "Đang giao" },
  { id: "completed", label: "Đã hoàn thành" },
  { id: "returned", label: "Đã hủy" },
];

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Map payment type to chip status
  const getPaymentTypeStatus = (paymentType: string): ChipStatusKey => {
    if (paymentType === "Tiền mặt") return "cash";
    if (paymentType === "Chuyển khoản") return "transfer";
    return "default";
  };

  // Map processing status to chip status
  const getProcessingStatus = (status: string): ChipStatusKey => {
    if (status === "Đã hoàn thành") return "completed";
    if (status === "Đang giao") return "processing";
    if (status === "Chờ xác nhận" || status === "Đã xác nhận")
      return "processing";
    if (status === "Đã hủy") return "disabled";
    return "default";
  };

  // Map payment status to chip status
  const getPaymentStatus = (paymentStatus: string): ChipStatusKey => {
    if (paymentStatus === "Đã thanh toán") return "paid";
    if (paymentStatus === "Chưa thanh toán" || paymentStatus === "Đã hoàn tiền")
      return "unpaid";
    return "default";
  };

  // Handle view order detail
  const handleViewOrderDetail = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  // Filter orders by active tab and search term
  const filteredOrders = useMemo(() => {
    const result = orders.filter((order) => {
      // Filter by tab
      const matchesTab = activeTab === "all" || order.tabStatus === activeTab;

      // Filter by search term - search in all products
      const matchesSearch =
        searchTerm === "" ||
        order.products.some((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesTab && matchesSearch;
    });

    // Reset to page 1 when filters change
    if (currentPage > 1) {
      setCurrentPage(1);
    }
    return result;
  }, [orders, activeTab, searchTerm, currentPage]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage]);

  return (
    <div className="flex flex-col gap-[22px] items-center w-full min-w-0">
      {/* Header */}
      <div className="flex items-center justify-start w-full shrink-0">
        <h2 className="font-bold text-[#272424] text-[24px] leading-normal">
          Danh sách đơn hàng
        </h2>
      </div>

      {/* Tab Menu */}
      <div className="w-full shrink-0">
        <TabMenuAccount
          tabs={orderTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[16px] items-start px-[10px] md:px-[16px] lg:px-[24px] py-[16px] md:py-[24px] rounded-[24px] w-full">
        {/* Search and Dropdown Section */}
        <div className="flex gap-[8px] items-center justify-start w-full">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm"
            className="w-[400px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="bg-white border-2 border-[#e04d30] flex gap-[6px] items-center justify-center px-[20px] py-[8px] rounded-[10px] cursor-pointer">
                <span className="text-[#e04d30] text-[11px] font-semibold leading-[1.4]">
                  Trạng thái
                </span>
                <CaretDown className="text-[#e04d30]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setActiveTab("all")}>
                Tất cả
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("pending")}>
                Chờ xác nhận
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("confirmed")}>
                Đã xác nhận
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("shipping")}>
                Đang giao
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("completed")}>
                Đã hoàn thành
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("returned")}>
                Đã hủy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h1 className="font-bold">101 đơn hàng</h1>
        {/* Table */}
        {/* Table Header */}
        <div className="w-full gap-2 flex flex-col overflow-x-auto">
          <div className="bg-white w-fit">
            <div className="flex items-center w-full">
              <div className="bg-[#f6f6f6] flex items-center px-[12px] py-[14px] w-[500px] rounded-l-2xl">
                <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Tên sản phẩm
                </p>
              </div>
              <div className="bg-[#f6f6f6] flex items-center justify-center px-[14px] py-[14px] w-[150px]">
                <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4] text-center">
                  Tổng đơn hàng
                </p>
              </div>
              <div className="bg-[#f6f6f6] flex items-center justify-center px-[14px] py-[14px] w-[160px]">
                <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Nguồn đơn
                </p>
              </div>
              <div className="bg-[#f6f6f6] flex items-center justify-center px-[14px] py-[14px] w-[100px]">
                <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  ĐVVC
                </p>
              </div>
              <div className="bg-[#f6f6f6] flex items-center justify-center px-[14px] py-[14px] w-[200px]">
                <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4]">
                  Trạng thái xử lý
                </p>
              </div>
              <div className="bg-[#f6f6f6] flex items-center justify-center px-[14px] py-[14px] w-[220px]">
                <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4] text-center">
                  Trạng thái thanh toán
                </p>
              </div>
              <div className="bg-[#f6f6f6] flex items-center justify-center px-[14px] py-[14px] w-[160px] rounded-r-2xl">
                <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4] text-center">
                  Thao tác
                </p>
              </div>
            </div>
          </div>
          <div>
            {/* Table Body */}
            <div className="flex flex-col gap-[12px] w-fit">
              {paginatedOrders.map((order) => (
                <div key={order.id} className="min-w-[1400px]">
                  {/* User Header Row */}
                  <div className="flex justify-between px-[16px] py-[12px] border border-[#e7e7e7] bg-gray-50 rounded-t-2xl">
                    <div className="flex gap-[10px]">
                      <div className="w-[30px] h-[30px] rounded-[24px] bg-gray-200"></div>
                      <div className="flex items-center gap-[8px]">
                        <p className="font-montserrat font-semibold text-[#1a71f6] text-[12px] leading-[1.4]">
                          {order.customer}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.4]">
                        Mã đơn hàng: {order.id}
                      </p>
                    </div>
                  </div>

                  {/* Product Row - Only show first product */}
                  {order.products[0] && (
                    <div className="flex border-b border-x rounded-b-2xl border-[#e7e7e7]">
                      {/* Product Name Column */}
                      <div className="flex items-center gap-[8px] px-[16px] py-[12px] w-[500px]">
                        <img
                          src={order.products[0].image}
                          alt={order.products[0].name}
                          className="border border-[#d1d1d1] rounded-[8px] w-[91px] h-[91px] object-cover bg-gray-100"
                        />
                        <div className="flex flex-col gap-[8px] flex-1 px-[12px]">
                          <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
                            {order.products[0].name}
                          </p>
                          <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
                            Size 40
                          </p>
                        </div>
                      </div>

                      {/* Total Order Column */}
                      <div className="flex flex-col items-center gap-[4px] px-[14px] py-[12px] w-[150px]">
                        <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
                          {order.products[0].price}
                        </p>
                        <ChipStatus
                          status={getPaymentTypeStatus(order.paymentType)}
                          labelOverride={order.paymentType}
                        />
                      </div>

                      {/* Source Column */}
                      <div className="flex items-center justify-center px-[14px] py-[12px] w-[160px]">
                        <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
                          {order.category}
                        </p>
                      </div>

                      {/* Shipping Column */}
                      <div className="flex items-center justify-center px-[14px] py-[12px] w-[100px]">
                        <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
                          .....
                        </p>
                      </div>

                      {/* Processing Status Column */}
                      <div className="flex items-center justify-center px-[14px] py-[12px] w-[200px]">
                        <ChipStatus
                          status={getProcessingStatus(order.status)}
                          labelOverride={order.status}
                        />
                      </div>

                      {/* Payment Status Column */}
                      <div className="flex items-center justify-center px-[14px] py-[12px] w-[220px]">
                        <ChipStatus
                          status={getPaymentStatus(order.paymentStatus)}
                          labelOverride={order.paymentStatus}
                        />
                      </div>

                      {/* Actions Column */}
                      <div className="flex items-center justify-center gap-[8px] px-[14px] py-[12px] w-[160px]">
                        <button
                          className="flex gap-[6px] items-center font-montserrat font-medium text-[#1a71f6] text-[14px] leading-[1.4] cursor-pointer hover:underline"
                          onClick={() => handleViewOrderDetail(order.id)}
                        >
                          <DetailIcon size={16} color="#1a71f6" />
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          current={currentPage}
          total={Math.ceil(filteredOrders.length / 10)}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AdminOrders;
