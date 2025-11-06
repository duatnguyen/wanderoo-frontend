// src/pages/admin/AdminOrderDetailPOS.tsx
import React from "react";
import { ArrowLeft, Wallet, Package, FileText } from "lucide-react";
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
    <div className="flex flex-col gap-[10px] items-center w-full max-w-[930px] mx-auto px-[16px] sm:px-[24px] lg:px-0">
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
      <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start p-[16px] sm:p-[24px] relative rounded-[8px] w-full overflow-hidden min-w-0">
        <div className="flex gap-[12px] items-start">
          <Package className="h-[24px] w-[24px] text-[#272424]" />
          <div className="flex flex-col gap-[8px] items-start">
            <p className="font-montserrat font-semibold text-[16px] leading-[1.4] text-[#272424]">
              Mã đơn hàng
            </p>
            <p className="font-montserrat font-semibold text-[14px] leading-[1.4] text-[#737373]">
              {currentOrder.id}
            </p>
          </div>
        </div>
        <div className="flex gap-[12px] items-start">
          <svg
            width="24"
            height="24"
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
          <div className="flex flex-col gap-[8px] items-start">
            <p className="font-montserrat font-semibold text-[16px] leading-[1.4] text-[#272424]">
              Tạo bởi Thanh lúc 26/07/2025 15:24
            </p>
          </div>
        </div>
        <div className="flex gap-[12px] items-start">
          <svg
            width="24"
            height="24"
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
          <div className="flex flex-col gap-[8px] items-start">
            <p className="font-montserrat font-semibold text-[16px] leading-[1.4] text-[#272424]">
              Phụ trách bởi Thanh
            </p>
          </div>
        </div>
        <div className="flex gap-[12px] items-start">
          <FileText className="h-[24px] w-[24px] text-[#272424]" />
          <div className="flex flex-col gap-[8px] items-start">
            <p className="font-montserrat font-semibold text-[16px] leading-[1.4] text-[#272424]">
              Ghi chú: ---
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
        className={`bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[8px] items-start p-[16px] sm:p-[24px] relative rounded-[8px] w-full overflow-x-auto ${
          currentOrder.status === "Đã hủy" ? "opacity-50" : ""
        }`}
      >
        <div className="min-w-[800px] w-full">
          <div className="box-border flex gap-[6px] items-center px-[6px] py-0 relative shrink-0 w-full">
            <Wallet className="relative shrink-0 size-[24px]" />
            <h2 className="font-montserrat font-semibold text-[#272424] text-[18px] leading-[1.4]">
              Thông tin thanh toán
            </h2>
          </div>
          <div className="flex flex-col items-start relative rounded-[8px] w-full">
            {/* Table Header */}
            <div className="flex items-start relative shrink-0 w-full">
              <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] relative rounded-tl-[6px] self-stretch shrink-0 w-[70px]">
                <div className="box-border flex gap-[8px] h-full items-center overflow-clip pb-[15px] pt-[14px] px-[14px] relative rounded-[inherit] w-[70px]">
                  <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[14px] text-nowrap">
                    STT
                  </p>
                </div>
              </div>
              <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] items-center justify-center pb-[15px] pt-[14px] px-[14px] relative self-stretch shrink-0 w-[400px]">
                <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[14px] text-nowrap">
                  Sản phẩm
                </p>
              </div>
              <div className="basis-0 bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] grow items-center justify-center min-h-px min-w-px pb-[15px] pt-[14px] px-[14px] relative self-stretch shrink-0">
                <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[14px] text-nowrap">
                  Đơn giá
                </p>
              </div>
              <div className="basis-0 bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] grow items-center justify-center min-h-px min-w-px pb-[15px] pt-[14px] px-[14px] relative self-stretch shrink-0">
                <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[14px] text-nowrap">
                  Số lượng
                </p>
              </div>
              <div className="basis-0 bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] grow items-center justify-end min-h-px min-w-px pb-[15px] pt-[14px] px-[14px] relative rounded-tr-[6px] self-stretch shrink-0">
                <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[14px] text-nowrap">
                  Thành tiền
                </p>
              </div>
            </div>
            {/* Table Body */}
            {currentOrder.items.map((item, index) => (
              <div
                key={item.id}
                className="border-[0px_1px_1px] border-[#e7e7e7] box-border flex items-center relative shrink-0 w-full"
              >
                <div className="flex flex-row items-center self-stretch">
                  <div className="box-border flex gap-[8px] h-full items-center p-[14px] relative shrink-0 w-[70px]">
                    <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[14px] text-nowrap">
                      {index + 1}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row items-start self-stretch">
                  <div className="box-border flex gap-[8px] h-full items-start justify-start p-[14px] relative shrink-0 w-[400px]">
                    <div className="border-[0.5px] border-[#d1d1d1] relative shrink-0 size-[56px]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                      />
                    </div>
                    <div className="flex flex-col gap-0 items-start">
                      <p className="font-montserrat font-medium leading-[1.4] text-[#272424] text-[14px]">
                        {item.name}
                      </p>
                      <p className="font-montserrat font-medium text-[12px] leading-[1.4] text-[#272424] -mt-[2px]">
                        Phân loại hàng: Size M, Màu cam
                      </p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                  <div className="basis-0 box-border flex gap-[8px] grow h-full items-center justify-center min-h-px min-w-px p-[14px] relative shrink-0">
                    <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[14px] text-nowrap">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                  <div className="basis-0 box-border flex gap-[8px] grow h-full items-center justify-center min-h-px min-w-px p-[14px] relative shrink-0">
                    <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[14px] text-nowrap">
                      {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                  <div className="basis-0 box-border flex gap-[8px] grow h-full items-center justify-end min-h-px min-w-px p-[14px] relative shrink-0">
                    <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[14px] text-nowrap">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {/* Summary Row - POS */}
            <div className="border border-[#e7e7e7] box-border flex gap-[40px] items-center justify-end px-[6px] py-0 relative rounded-bl-[6px] rounded-br-[6px] shrink-0 w-full">
              <div className="box-border flex items-center justify-between px-[6px] py-[12px] relative shrink-0 w-[335px]">
                <div className="flex flex-col gap-[4px] items-end justify-center leading-[1.4] relative shrink-0 text-[#272424] text-nowrap">
                  <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                    Tổng tiền hàng
                  </p>
                  <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                    Giảm giá
                  </p>
                  <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                    Khách phải trả
                  </p>
                  <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                    Tiền khách đưa
                  </p>
                  <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                    Tiền thừa trả khách
                  </p>
                </div>
                <div className="flex flex-row items-center self-stretch">
                  <div className="flex flex-col gap-[4px] h-full items-end justify-center leading-[1.4] relative shrink-0 text-[#272424] text-nowrap">
                    <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                      400.000đ
                    </p>
                    <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                      20.000đ
                    </p>
                    <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                      380.000đ
                    </p>
                    <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                      400.000đ
                    </p>
                    <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                      20.000đ
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

export default AdminOrderDetailPOS;
