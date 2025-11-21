// src/pages/admin/AdminOrderDetailPOS.tsx
import React, { useState } from "react";
import {
  ArrowLeft,
  Wallet,
  Package,
  FileText,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Truck,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageContainer, ContentCard } from "@/components/common";

// Mock data cho order detail POS
const getMockOrderDataPOS = (status: string) => {
  const baseOrder = {
    source: "POS",
    customer: {
      name: "buiminhhang",
      avatar: "",
    },
  };

  switch (status) {
    case "Chờ xác nhận":
      return {
        ...baseOrder,
        id: "POS001",
        status: "Chờ xác nhận",
      };
    case "Đã xác nhận":
      return {
        ...baseOrder,
        id: "POS002",
        status: "Đã xác nhận",
      };
    case "Đang giao":
      return {
        ...baseOrder,
        id: "POS003",
        status: "Đang giao",
      };
    case "Đã hủy":
      return {
        ...baseOrder,
        id: "POS004",
        status: "Đã hủy",
      };
    default:
      return {
        ...baseOrder,
        id: "POS005",
        status: "Đã hoàn thành",
      };
  }
};

const baseOrderDataPOS = {
  items: [
    {
      id: 1,
      name: "Áo thun cờ giấn thoáng khí Rockbros LKW008",
      price: 1500000,
      quantity: 1,
      total: 1500000,
      image: "/api/placeholder/80/80",
    },
    {
      id: 2,
      name: "Áo thun đài tay nhanh khô Northshengwolf ch...",
      price: 850000,
      quantity: 2,
      total: 1700000,
      image: "/api/placeholder/80/80",
    },
    {
      id: 3,
      name: "Áo thun ngắn tay nam Gothiar Active",
      price: 650000,
      quantity: 1,
      total: 650000,
      image: "/api/placeholder/80/80",
    },
    {
      id: 4,
      name: "Áo thun dài tay nam Gothiar Active",
      price: 750000,
      quantity: 1,
      total: 750000,
      image: "/api/placeholder/80/80",
    },
    {
      id: 5,
      name: "Gậy chống di chuyển dễ dàng Ryder Straight-Bar Hiki...",
      price: 400000,
      quantity: 3,
      total: 1200000,
      image: "/api/placeholder/80/80",
    },
  ],
};

// Payment Summary Component with Dropdown
const PaymentSummary: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const totalAmount = 380000; // Khách phải trả
  const summaryData = [
    { label: "Tổng tiền hàng", amount: 400000 },
    { label: "Giảm giá", amount: 20000 },
    { label: "Khách phải trả", amount: 380000, isTotal: true },
    { label: "Tiền khách đưa", amount: 400000 },
    { label: "Tiền thừa trả khách", amount: 20000 },
  ];

  return (
    <div className="border border-[#e7e7e7] box-border relative rounded-bl-[6px] rounded-br-[6px] shrink-0 w-full bg-white">
      {/* Collapsed View - Always Visible */}
      <div
        className="flex items-center justify-between px-[16px] py-[12px] cursor-pointer hover:bg-[#f8f9fa] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center justify-center w-[32px] h-[32px] bg-[#e8f5e8] rounded-[6px]">
            <Wallet className="w-[16px] h-[16px] text-[#28a745]" />
          </div>
          <div className="flex flex-col">
            <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424]">
              Tổng thanh toán
            </p>
            <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
              {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[8px]">
          <p className="font-montserrat font-bold text-[18px] leading-[1.3] text-[#28a745]">
            {formatCurrency(totalAmount)}
          </p>
          <div className="flex items-center justify-center w-[24px] h-[24px] text-[#737373]">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Expanded View - Payment Details */}
      {isExpanded && (
        <div className="border-t border-[#e7e7e7] px-[16px] py-[12px] bg-[#fafbfc]">
          <div className="space-y-[8px]">
            {summaryData.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between py-[4px] ${
                  item.isTotal ? "border-t border-[#e7e7e7] pt-[8px]" : ""
                }`}
              >
                <p
                  className={`font-montserrat ${
                    item.isTotal
                      ? "font-semibold text-[14px] text-[#272424]"
                      : "font-medium text-[13px] text-[#737373]"
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`font-montserrat ${
                    item.isTotal
                      ? "font-bold text-[16px] text-[#28a745]"
                      : "font-medium text-[13px] text-[#272424]"
                  }`}
                >
                  {formatCurrency(item.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminOrderDetailPOS: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams<{ orderId: string }>();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleConfirmOrder = () => {
    // Xử lý xác nhận đơn hàng
    console.log("Confirming order:", orderId);

    // Hiển thị thông báo xác nhận
    if (window.confirm("Bạn có chắc chắn muốn xác nhận đơn hàng này?")) {
      // TODO: Thêm API call để cập nhật trạng thái đơn hàng
      alert("Đơn hàng đã được xác nhận thành công!");

      // Có thể redirect về trang danh sách đơn hàng
      // navigate("/admin/orders");
    }
  };

  const handleCancelOrder = () => {
    // Xử lý hủy đơn hàng
    console.log("Canceling order:", orderId);

    // Hiển thị thông báo xác nhận hủy
    if (
      window.confirm(
        "Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác."
      )
    ) {
      const reason = prompt("Vui lòng nhập lý do hủy đơn hàng:");
      if (reason) {
        // TODO: Thêm API call để hủy đơn hàng với lý do
        alert(`Đơn hàng đã được hủy với lý do: ${reason}`);

        // Có thể redirect về trang danh sách đơn hàng
        // navigate("/admin/orders");
      }
    }
  };

  // Function to get order data based on orderId
  const getOrderData = () => {
    // Get status from navigation state if available
    const statusFromState = (location.state as { status?: string })?.status;

    // Get mock data based on status or default
    const mockData = getMockOrderDataPOS(statusFromState || "Chờ xác nhận");

    // Combine with base order data
    return {
      ...mockData,
      ...baseOrderDataPOS,
      id: orderId || mockData.id,
      status: statusFromState || mockData.status,
    };
  };

  const currentOrder = getOrderData();

  // Get status card styling based on order status
  const getStatusCardStyle = () => {
    switch (currentOrder.status) {
      case "Đang giao":
        return {
          bg: "bg-[#cce5ff]",
          text: "text-[#004085]",
        };
      case "Đã hoàn thành":
        return {
          bg: "bg-[#b2ffb4]",
          text: "text-[#04910c]",
        };
      case "Chờ xác nhận":
        return {
          bg: "bg-[#e7e7e7]",
          text: "text-[#737373]",
        };
      case "Đã xác nhận":
        return {
          bg: "bg-[#D1E7DD]",
          text: "text-[#28A745]",
        };
      case "Đã hủy":
        return {
          bg: "bg-[#ffdcdc]",
          text: "text-[#eb2b0b]",
        };
      default:
        return {
          bg: "bg-[#b2ffb4]",
          text: "text-[#04910c]",
        };
    }
  };

  const statusCardStyle = getStatusCardStyle();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-[10px] items-center w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-[8px] items-start justify-center w-full">
          <div className="flex gap-[4px] items-center">
            <button
              onClick={handleBackClick}
              className="relative shrink-0 size-[24px] flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-[#737373]" />
            </button>
            <h1 className="font-montserrat font-bold text-[#272424] text-[24px] leading-[1.5] whitespace-nowrap">
              Chi tiết đơn hàng
            </h1>
          </div>
        </div>
        <ContentCard>
          {/* Status Cards */}
          <div className="flex flex-col lg:flex-row gap-[16px] w-full">
            {/* Order Status Card */}
            <div className="flex-1 min-w-0">
              <div
                className={`${statusCardStyle.bg} border-2 border-opacity-20 box-border flex gap-[12px] items-center p-[16px] relative rounded-[12px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-white bg-opacity-80 rounded-full">
                  {currentOrder.status === "Đang giao" ? (
                    <Truck className="w-5 h-5 text-[#004085]" />
                  ) : currentOrder.status === "Đã hoàn thành" ? (
                    <Package className="w-5 h-5 text-[#04910c]" />
                  ) : currentOrder.status === "Chờ xác nhận" ? (
                    <svg
                      className="w-5 h-5 text-[#737373]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : currentOrder.status === "Đã xác nhận" ? (
                    <svg
                      className="w-5 h-5 text-[#28A745]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-[#eb2b0b]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[14px] text-black text-opacity-70 leading-[1.4]">
                    Trạng thái đơn hàng
                  </p>
                  <p
                    className={`font-montserrat font-bold ${statusCardStyle.text} text-[18px] leading-[1.2] truncate`}
                  >
                    {currentOrder.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Source Card */}
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 box-border flex gap-[12px] items-center p-[16px] relative rounded-[12px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full shadow-sm">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2a1 1 0 000 2h.01a1 1 0 100-2H5zm3 0a1 1 0 000 2h3a1 1 0 100-2H8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[14px] text-orange-700 leading-[1.4]">
                    Nguồn đơn hàng
                  </p>
                  <p className="font-montserrat font-bold text-orange-800 text-[18px] leading-[1.2] truncate">
                    {currentOrder.source}
                  </p>
                </div>
              </div>
            </div>

            {/* Order ID Card */}
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 box-border flex gap-[12px] items-center p-[16px] relative rounded-[12px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full shadow-sm">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[14px] text-purple-700 leading-[1.4]">
                    Mã đơn hàng
                  </p>
                  <p className="font-montserrat font-bold text-purple-800 text-[18px] leading-[1.2] truncate font-mono">
                    #{currentOrder.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* POS Order Info */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[20px] items-start p-[20px] sm:p-[28px] relative rounded-[8px] w-full overflow-hidden min-w-0">
            {/* Header */}
            <div className="flex items-center gap-[8px] w-full">
              <div className="w-[4px] h-[20px] bg-[#e04d30] rounded-[2px]"></div>
              <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
                Thông tin POS
              </h3>
            </div>

            {/* Created By Section */}
            <div className="flex gap-[14px] items-center w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#fff5f0] rounded-[8px] shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="#e04d30"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="#e04d30"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="#e04d30"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
                  Được tạo bởi
                </p>
                <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424]">
                  Thanh
                </p>
                <p className="font-montserrat font-medium text-[13px] leading-[1.3] text-[#737373]">
                  26/07/2025 15:24
                </p>
              </div>
            </div>

            {/* Responsible Person Section */}
            <div className="flex gap-[14px] items-center w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f0f8ff] rounded-[8px] shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="#4285f4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="#4285f4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
                  Nhân viên phụ trách
                </p>
                <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424]">
                  Thanh
                </p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="flex gap-[14px] items-center w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f8f9fa] rounded-[8px] shrink-0">
                <FileText className="h-[20px] w-[20px] text-[#6c757d]" />
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
                  Ghi chú
                </p>
                <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#737373] italic">
                  Không có ghi chú
                </p>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex gap-[8px] items-center px-[16px] sm:px-[24px] py-[8px] relative rounded-[8px] w-full overflow-hidden min-w-0">
            <div className="basis-0 box-border flex gap-[6px] grow items-center min-h-px min-w-px px-[6px] py-[4px] relative shrink-0 min-w-0">
              <div className="flex gap-[10px] items-center relative shrink-0 min-w-0">
                <Avatar className="relative rounded-full size-[54px]">
                  <AvatarFallback className="bg-gray-200 rounded-full">
                    {currentOrder.customer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-[8px] items-center relative shrink-0 min-w-0">
                  <span className="font-montserrat font-bold text-[#2a2a2a] text-[14px] leading-[1.5] truncate">
                    {currentOrder.customer.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Table */}
          <div
            className={`bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[8px] items-start p-[16px] sm:p-[24px] relative rounded-[8px] w-full overflow-hidden min-w-0 ${
              currentOrder.status === "Đã hủy" ? "opacity-50" : ""
            }`}
          >
            <div className="w-full">
              <div className="box-border flex gap-[6px] items-center px-[6px] py-0 mb-1 relative shrink-0 w-full">
                <Wallet className="relative shrink-0 size-[24px]" />
                <h2 className="font-montserrat font-semibold text-[#272424] text-[18px] leading-[1.4]">
                  Thông tin thanh toán
                </h2>
              </div>
              <div className="w-full overflow-x-auto">
                <div className="flex flex-col items-start relative rounded-[8px] w-full min-w-[700px]">
                  {/* Table Header - Fixed */}
                  <div className="flex items-center relative shrink-0 w-full sticky top-0 z-10 bg-white">
                    <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[8px] items-center justify-center p-[12px] relative rounded-tl-[6px] shrink-0 w-[60px] min-w-[60px]">
                      <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                        STT
                      </p>
                    </div>
                    <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[8px] items-center justify-start p-[12px] relative flex-1 min-w-[200px]">
                      <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                        Sản phẩm
                      </p>
                    </div>
                    <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] items-center justify-center p-[12px] relative w-[100px] min-w-[100px]">
                      <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                        Đơn giá
                      </p>
                    </div>
                    <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] items-center justify-center p-[12px] relative w-[80px] min-w-[80px]">
                      <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                        SL
                      </p>
                    </div>
                    <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] items-center justify-end p-[12px] relative rounded-tr-[6px] w-[120px] min-w-[120px]">
                      <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                        Thành tiền
                      </p>
                    </div>
                  </div>

                  {/* Table Body - Scrollable Container */}
                  <div className="w-full max-h-[320px] overflow-y-auto">
                    {currentOrder.items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center relative shrink-0 w-full min-w-[700px] border-b border-[#e7e7e7]"
                      >
                        <div className="box-border flex gap-[8px] items-center justify-center p-[12px] relative shrink-0 w-[60px] min-w-[60px]">
                          <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                            {index + 1}
                          </p>
                        </div>
                        <div className="box-border flex gap-[8px] items-start justify-start p-[12px] relative flex-1 min-w-[200px]">
                          <div className="border-[0.5px] border-[#d1d1d1] relative shrink-0 size-[40px] rounded-[4px] overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-0 items-start min-w-0 flex-1">
                            <p className="font-montserrat font-medium leading-[1.4] text-[#272424] text-[12px] truncate">
                              {item.name}
                            </p>
                            <p className="font-montserrat font-medium text-[10px] leading-[1.4] text-[#737373] -mt-[2px]">
                              Phân loại hàng: Size M, Màu cam
                            </p>
                          </div>
                        </div>
                        <div className="box-border flex gap-[4px] items-center justify-center p-[12px] relative w-[100px] min-w-[100px]">
                          <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="box-border flex gap-[4px] items-center justify-center p-[12px] relative w-[80px] min-w-[80px]">
                          <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                            {item.quantity}
                          </p>
                        </div>
                        <div className="box-border flex gap-[4px] items-center justify-end p-[12px] relative w-[120px] min-w-[120px]">
                          <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                            {formatCurrency(item.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Summary Row - POS */}
                  <PaymentSummary />
                </div>
              </div>
            </div>
          </div>
        </ContentCard>
      </div>
    </PageContainer>
  );
};

export default AdminOrderDetailPOS;
