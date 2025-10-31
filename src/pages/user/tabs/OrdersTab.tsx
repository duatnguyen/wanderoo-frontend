import React, { useState } from "react";

function formatCurrencyVND(value: number) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("vi-VN")}đ`;
  }
}

type OrderStatus =
  | "all"
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled"
  | "return";

type Order = {
  id: string;
  orderDate: string;
  status: OrderStatus;
  statusLabel: string;
  products: {
    id: string;
    imageUrl: string;
    name: string;
    price: number;
    originalPrice?: number;
    variant?: string;
    variantColor?: string;
  }[];
  totalPayment: number;
};

// Helper function for date parsing (converts YYYY-MM-DD to DD/MM/YYYY for display)
const parseDateFromInput = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const OrdersTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");
  // Store dates in YYYY-MM-DD format for date input, but display in DD/MM/YYYY
  // Initialize with empty strings so date filter is optional
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Mock orders data
  const orders: Order[] = [
    {
      id: "WB0303168522",
      orderDate: "25/08/2025",
      status: "cancelled",
      statusLabel: "Đã hủy",
      products: [
        {
          id: "1",
          imageUrl: "/api/placeholder/100/100",
          name: "Lều Dã Ngoại Bền Đẹp Rằn ri - Đồ Câu Simano",
          price: 199000,
          originalPrice: 230000,
          variant: "xanh",
          variantColor: "green",
        },
      ],
      totalPayment: 199000,
    },
    {
      id: "WB0303168523",
      orderDate: "24/08/2025",
      status: "delivered",
      statusLabel: "Đã giao hàng",
      products: [
        {
          id: "2",
          imageUrl: "/api/placeholder/100/100",
          name: "Lều mái vòm cho 2 người - MT500 xám (SIMOND)",
          price: 1200000,
          originalPrice: 1500000,
        },
      ],
      totalPayment: 1200000,
    },
    {
      id: "WB0303168524",
      orderDate: "23/08/2025",
      status: "delivered",
      statusLabel: "Đã giao hàng",
      products: [
        {
          id: "3",
          imageUrl: "/api/placeholder/100/100",
          name: "Lều cắm trại 222 người - MH100 trắng/Xanh (QUECHUA)",
          price: 199000,
          originalPrice: 230000,
        },
      ],
      totalPayment: 999000,
    },
    {
      id: "WB0303168525",
      orderDate: "22/08/2025",
      status: "delivered",
      statusLabel: "Đã giao hàng",
      products: [
        {
          id: "4",
          imageUrl: "/api/placeholder/100/100",
          name: "Lều cắm trại 3 người - MH100 trắng/Xanh",
          price: 199000,
          originalPrice: 330000,
          variant: "Đen",
          variantColor: "gray",
        },
      ],
      totalPayment: 300000,
    },
  ];

  const tabs = [
    { id: "all" as OrderStatus, label: "Tất cả" },
    { id: "pending" as OrderStatus, label: "Chờ xác nhận" },
    { id: "confirmed" as OrderStatus, label: "Đã xác nhận" },
    { id: "shipping" as OrderStatus, label: "Đang vận chuyển" },
    { id: "delivered" as OrderStatus, label: "Đã giao hàng" },
    { id: "cancelled" as OrderStatus, label: "Đã hủy" },
    { id: "return" as OrderStatus, label: "Trả hàng / Hoàn tiền" },
  ];

  // Filter orders by status and date range
  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (activeTab !== "all" && order.status !== activeTab) {
      return false;
    }

    // Filter by date range only if both dates are selected
    if (startDate && endDate) {
      const orderDateParts = order.orderDate.split("/");
      if (orderDateParts.length === 3) {
        const [day, month, year] = orderDateParts;
        const orderDateValue = new Date(
          `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
        );
        const startDateValue = new Date(startDate);
        const endDateValue = new Date(endDate);

        // Validate dates
        if (
          isNaN(orderDateValue.getTime()) ||
          isNaN(startDateValue.getTime()) ||
          isNaN(endDateValue.getTime())
        ) {
          return true; // If dates are invalid, show all orders
        }

        // Set time to start/end of day for proper comparison
        startDateValue.setHours(0, 0, 0, 0);
        endDateValue.setHours(23, 59, 59, 999);
        orderDateValue.setHours(0, 0, 0, 0);

        if (orderDateValue < startDateValue || orderDateValue > endDateValue) {
          return false;
        }
      }
    }

    return true;
  });

  const CalendarIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Đơn mua
        </h1>

        {/* Order Status Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Lịch sử mua hàng:
          </label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  // Optionally filter orders here
                  console.log(
                    "Start date selected:",
                    parseDateFromInput(e.target.value)
                  );
                }}
                className="px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                placeholder="dd/mm/yyyy"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <CalendarIcon />
              </div>
            </div>
            <span className="text-gray-500">-</span>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  // Optionally filter orders here
                  console.log(
                    "End date selected:",
                    parseDateFromInput(e.target.value)
                  );
                }}
                className="px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                placeholder="dd/mm/yyyy"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <CalendarIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gray-50 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Không có đơn hàng nào.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
                  <span className="font-medium">Đơn hàng: #{order.id}</span>
                  <span className="hidden sm:inline">|</span>
                  <span>Ngày đặt hàng: {order.orderDate}</span>
                </div>
                <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-lg">
                  {order.statusLabel}
                </span>
              </div>

              {/* Order Products */}
              <div className="px-4 sm:px-6 py-4 sm:py-6">
                {order.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row gap-4 mb-4 last:mb-0"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/100";
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between gap-2">
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm sm:text-base font-semibold text-gray-900">
                              {formatCurrencyVND(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs sm:text-sm text-gray-500 line-through">
                                {formatCurrencyVND(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          {product.variant && (
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                product.variantColor === "green"
                                  ? "bg-green-100 text-green-700"
                                  : product.variantColor === "gray"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {product.variant}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2 pt-2 border-t border-gray-200">
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Tổng thanh toán:{" "}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-red-600">
                            {formatCurrencyVND(order.totalPayment)}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            // Navigate to order detail page
                            console.log("View order details:", order.id);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base self-start sm:self-auto transition-colors"
                        >
                          Xem chi tiết &gt;&gt;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
