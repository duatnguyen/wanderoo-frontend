// src/pages/admin/AdminOrderDetailPOS.tsx
import React, { useState } from "react";
import { ArrowLeft, Wallet, Package, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data cho order detail POS
const orderDetail = {
  id: "8F878Q29",
  status: "Đã hoàn thành",
  source: "POS",
  customer: {
    name: "buiminhhang",
    avatar: "",
  },
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
    { label: "Tiền thừa trả khách", amount: 20000 }
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
                  item.isTotal ? 'border-t border-[#e7e7e7] pt-[8px]' : ''
                }`}
              >
                <p className={`font-montserrat ${
                  item.isTotal 
                    ? 'font-semibold text-[14px] text-[#272424]' 
                    : 'font-medium text-[13px] text-[#737373]'
                }`}>
                  {item.label}
                </p>
                <p className={`font-montserrat ${
                  item.isTotal 
                    ? 'font-bold text-[16px] text-[#28a745]' 
                    : 'font-medium text-[13px] text-[#272424]'
                }`}>
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

  // Function to get order data based on orderId
  const getOrderData = () => {
    // Get status from navigation state if available
    const statusFromState = (location.state as { status?: string })?.status;

    // If orderId matches our mock orders, we could fetch real data here
    // For now, we'll use the mock data but display the correct orderId and status
    return {
      ...orderDetail,
      id: orderId || orderDetail.id,
      status: statusFromState || orderDetail.status,
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

      {/* Status Cards */}
      <div className="flex flex-col sm:flex-row gap-[10px] items-stretch sm:items-center justify-center w-full">
        <div className="flex-1 min-w-0">
          <div
            className={`${statusCardStyle.bg} border border-[#d1d1d1] box-border flex gap-[8px] h-[45px] items-center p-[12px] relative rounded-[8px] w-full overflow-hidden`}
          >
            <div className="box-border flex gap-[6px] items-center min-w-0 flex-1">
              <span
                className={`font-montserrat font-bold ${statusCardStyle.text} text-[18px] leading-[normal] whitespace-nowrap truncate`}
              >
                Trạng thái đơn: {currentOrder.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-[#e7e7e7] border border-[#d1d1d1] box-border flex gap-[8px] h-[45px] items-center p-[12px] relative rounded-[8px] w-full overflow-hidden">
            <div className="box-border flex gap-[6px] items-center min-w-0 flex-1">
              <span className="font-montserrat font-bold text-[#272424] text-[18px] leading-[normal] whitespace-nowrap truncate">
                Nguồn đơn: {currentOrder.source}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* POS Order Info */}
      <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[20px] items-start p-[20px] sm:p-[28px] relative rounded-[8px] w-full overflow-hidden min-w-0">
        {/* Order ID Section */}
        <div className="flex gap-[14px] items-center w-full">
          <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f8f9fa] rounded-[8px] shrink-0">
            <Package className="h-[20px] w-[20px] text-[#272424]" />
          </div>
          <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
            <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
              Mã đơn hàng
            </p>
            <p className="font-montserrat font-bold text-[16px] leading-[1.3] text-[#272424]">
              {currentOrder.id}
            </p>
          </div>
        </div>

        {/* Created By Section */}
        <div className="flex gap-[14px] items-center w-full">
          <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f8f9fa] rounded-[8px] shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="#272424"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="#272424"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="#272424"
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
              Thanh - 26/07/2025 15:24
            </p>
          </div>
        </div>

        {/* Responsible Person Section */}
        <div className="flex gap-[14px] items-center w-full">
          <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f8f9fa] rounded-[8px] shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="#272424"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="#272424"
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
            <FileText className="h-[20px] w-[20px] text-[#272424]" />
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
        className={`bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[8px] items-start p-[16px] sm:p-[24px] relative rounded-[8px] w-full overflow-hidden min-w-0 ${currentOrder.status === "Đã hủy" ? "opacity-50" : ""
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
              <div className="flex items-start relative shrink-0 w-full sticky top-0 z-10 bg-white">
                <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] relative rounded-tl-[6px] self-stretch shrink-0 w-[60px] min-w-[60px]">
                  <div className="box-border flex gap-[8px] h-full items-center overflow-clip pb-[15px] pt-[14px] px-[8px] relative rounded-[inherit]">
                    <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                      STT
                    </p>
                  </div>
                </div>
                <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] items-center justify-start pb-[15px] pt-[14px] px-[12px] relative self-stretch flex-1 min-w-[200px]">
                  <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                    Sản phẩm
                  </p>
                </div>
                <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] items-center justify-center pb-[15px] pt-[14px] px-[12px] relative self-stretch w-[100px] min-w-[100px]">
                  <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                    Đơn giá
                  </p>
                </div>
                <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] items-center justify-center pb-[15px] pt-[14px] px-[12px] relative self-stretch w-[80px] min-w-[80px]">
                  <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                    SL
                  </p>
                </div>
                <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] items-center justify-end pb-[15px] pt-[14px] px-[12px] relative rounded-tr-[6px] self-stretch w-[120px] min-w-[120px]">
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
    </div>
  );
};

export default AdminOrderDetailPOS;

