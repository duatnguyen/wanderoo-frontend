// src/pages/admin/AdminOrders.tsx
import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TabMenuAccount } from "@/components/common";
import type { TabMenuAccountItem } from "@/components/common";
import { Pagination } from "@/components/ui/pagination";
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
    <div className="flex flex-col gap-[22px] items-center px-[10px] md:px-[20px] lg:px-[50px] py-[20px] md:py-[32px] w-full">
      {/* Tab Menu */}
      <TabMenuAccount
        tabs={orderTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Orders Table */}
      <div className="bg-white border border-[#b0b0b0] flex flex-col gap-[16px] items-start px-[10px] md:px-[16px] lg:px-[24px] py-[16px] md:py-[24px] rounded-[24px] w-full">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-bold text-[#272424] text-[24px] leading-normal">
            Danh sách đơn hàng
          </h2>
        </div>

        {/* Search */}
        <div className="flex gap-[10px] items-center w-full">
          <div className="bg-white border border-[#e04d30] flex items-center justify-between px-[12px] md:px-[16px] py-[8px] rounded-[12px] w-full max-w-[500px]">
            <div className="flex items-center gap-[8px] relative flex-1">
              <span className="text-[10px] font-medium text-[#888888] leading-[1.4]">
                {searchTerm ? "" : "Tìm kiếm"}
              </span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="absolute left-0 top-0 w-full h-full bg-transparent border-0 outline-none px-[12px] md:px-[16px] py-[8px] text-sm"
                placeholder=""
              />
            </div>
            <div className="w-6 h-6 relative">
              <Search className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#d1d1d1] rounded-[16px] overflow-hidden w-full">
          {/* Table Header */}
          <div className="bg-[#f6f6f6] flex items-center overflow-hidden rounded-t-[12px]">
            <div className="bg-[#f6f6f6] flex gap-[10px] items-center px-[12px] py-[14px] w-[500px]">
              <p className="font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.4]">
                Tên sản phẩm
              </p>
            </div>
            <div className="bg-[#f6f6f6] flex items-center justify-center px-[14px] py-[14px] flex-1 border-l border-[#d1d1d1]">
              <p className="font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                Tổng đơn hàng
              </p>
            </div>
            <div className="bg-[#f6f6f6] flex items-center justify-center px-[14px] py-[14px] flex-1 border-l border-[#d1d1d1]">
              <p className="font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                Nguồn đơn
              </p>
            </div>
            <div className="bg-[#f6f6f6] flex items-center justify-center px-[14px] py-[14px] flex-1 border-l border-[#d1d1d1]">
              <p className="font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                ĐVVC
              </p>
            </div>
            <div className="bg-[#f6f6f6] flex items-center justify-center px-[14px] py-[14px] flex-1 border-l border-[#d1d1d1]">
              <p className="font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                Trạng thái xử lý
              </p>
            </div>
            <div className="bg-[#f6f6f6] flex items-center justify-center px-[14px] py-[14px] flex-1 border-l border-[#d1d1d1]">
              <p className="font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                Trạng thái thanh toán
              </p>
            </div>
            <div className="bg-[#f6f6f6] flex items-center justify-center px-[14px] py-[14px] flex-1 border-l border-[#d1d1d1]">
              <p className="font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
                Thao tác
              </p>
            </div>
          </div>

          {/* Table Body */}
          <div className="border border-[#d1d1d1] border-t-0 rounded-b-[12px]">
            {paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="border-b border-[#d1d1d1] last:border-b-0"
              >
                {/* User Header Row */}
                <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-[#d1d1d1]">
                  <div className="flex gap-[10px] items-center">
                    <div className="w-[30px] h-[30px] rounded-[24px] bg-gray-200"></div>
                    <div className="flex gap-[8px] items-center">
                      <p className="font-montserrat font-semibold text-[#1a71f6] text-[12px] leading-[1.4]">
                        {order.customer}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[4px] items-start">
                    <p className="font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.4]">
                      Mã đơn hàng: {order.id}
                    </p>
                  </div>
                </div>

                {/* Product Rows */}
                {order.products.map((product, productIndex) => (
                  <div key={product.id} className="flex items-center">
                    {/* Product Name Column */}
                    <div className="flex gap-[8px] items-center px-[16px] py-[12px] w-[500px]">
                      <div className="border-[0.5px] border-[#d1d1d1] rounded-[8px] w-[91px] h-[91px] bg-gray-100"></div>
                      <div className="flex flex-col gap-[8px] items-start flex-1 px-[12px]">
                        <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
                          {product.name}
                        </p>
                        {productIndex === 0 && (
                          <>
                            <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
                              Size 40
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Other Columns - Only show content for first product */}
                    {productIndex === 0 ? (
                      <>
                        {/* Total Order Column */}
                        <div className="flex flex-col gap-[4px] items-center justify-center px-[8px] py-[12px] flex-1">
                          <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
                            {product.price}
                          </p>
                          <div className="bg-[#dcd2ff] flex items-center justify-center px-[8px] py-[6px] rounded-[10px]">
                            <p className="font-montserrat font-bold text-[#7f27ff] text-[12px] leading-normal">
                              {order.paymentType}
                            </p>
                          </div>
                        </div>

                        {/* Source Column */}
                        <div className="flex items-center justify-center px-[8px] py-[12px] flex-1">
                          <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
                            {order.category}
                          </p>
                        </div>

                        {/* Shipping Column */}
                        <div className="flex items-center justify-center px-[12px] py-[12px] flex-1">
                          <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
                            .....
                          </p>
                        </div>

                        {/* Processing Status Column */}
                        <div className="flex items-center justify-center px-[12px] py-[12px] flex-1">
                          <div className="bg-[#b2ffb4] flex items-center justify-center px-[8px] py-[6px] rounded-[10px]">
                            <p className="font-montserrat font-bold text-[#04910c] text-[12px] leading-normal">
                              {order.status}
                            </p>
                          </div>
                        </div>

                        {/* Payment Status Column */}
                        <div className="flex items-center justify-center px-[12px] py-[12px] flex-1">
                          <div className="bg-[#b2ffb4] flex items-center justify-center px-[8px] py-[6px] rounded-[10px]">
                            <p className="font-montserrat font-bold text-[#04910c] text-[12px] leading-normal">
                              {order.paymentStatus}
                            </p>
                          </div>
                        </div>

                        {/* Actions Column */}
                        <div className="flex gap-[8px] items-center justify-center px-[12px] py-[12px] flex-1">
                          <button
                            className="font-montserrat font-medium text-[#1a71f6] text-[14px] leading-[1.4] cursor-pointer"
                            onClick={() => handleViewOrderDetail(order.id)}
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </>
                    ) : (
                      /* Empty columns for subsequent products */
                      <>
                        <div className="flex-1"></div>
                        <div className="flex-1"></div>
                        <div className="flex-1"></div>
                        <div className="flex-1"></div>
                        <div className="flex-1"></div>
                        <div className="flex-1"></div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
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
