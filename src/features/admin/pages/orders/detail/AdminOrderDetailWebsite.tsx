// src/pages/admin/AdminOrderDetailWebsite.tsx
import React from "react";
import { ArrowLeft, MapPin, Truck, Wallet, Package } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data cho order detail Website
const orderDetail = {
  id: "8F878Q29",
  status: "Đã hoàn thành",
  source: "Website",
  customer: {
    name: "buiminhhang",
    avatar: "",
  },
  shipping: {
    address: "0862684255, Nguyễn Thị Thanh",
    district: "Xóm *** - thị xã ***-tỉnh Thái Bình",
    method: "SPX: #123F5124Q412",
  },
  timeline: [
    {
      status: "Giao hàng thành công",
      date: "13:20 12/3/2003",
      isCompleted: true,
    },
  ],
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
  summary: {
    subtotal: 5800000,
    shipping: 30000,
    fee: 34000,
    total: 5796000,
  },
  payment: {
    subtotal: 5800000,
    shipping: 0,
    discount: 34000,
    total: 5766000,
  },
};

const AdminOrderDetailWebsite: React.FC = () => {
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

  // Get timeline text based on order status
  const getTimelineText = () => {
    switch (currentOrder.status) {
      case "Đang giao":
        return {
          status: "Đơn vị vận chuyển lấy hàng thành công",
          date: "13:20 12/3/2003",
        };
      case "Đã hoàn thành":
        return {
          status: "Giao hàng thành công",
          date: "13:20 12/3/2003",
        };
      case "Chờ xác nhận":
        return {
          status: "Chờ xác nhận đơn hàng",
          date: "13:20 12/3/2003",
        };
      case "Đã xác nhận":
        return {
          status: "Đơn hàng đã được xác nhận",
          date: "13:20 12/3/2003",
        };
      case "Đã hủy":
        return {
          status: "Đơn hàng đã bị hủy",
          date: "13:20 12/3/2003",
        };
      default:
        return {
          status: currentOrder.timeline[0]?.status || "Chưa có thông tin",
          date: currentOrder.timeline[0]?.date || "",
        };
    }
  };

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
    <div className="flex flex-col gap-[10px] items-center w-full mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
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

      {/* Website Order Info */}
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
          <MapPin className="h-[24px] w-[24px] text-[#272424]" />
          <div className="flex flex-col gap-[8px] items-start">
            <p className="font-montserrat font-semibold text-[16px] leading-[1.4] text-[#272424]">
              Địa chỉ nhận hàng
            </p>
            <p className="font-montserrat font-medium text-[14px] leading-[1.4] text-[#272424] break-words min-w-0">
              {currentOrder.shipping.address}
            </p>
            <p className="font-montserrat font-medium text-[14px] leading-[1.4] text-[#272424] break-words min-w-0">
              {currentOrder.shipping.district}
            </p>
          </div>
        </div>
        <div className="flex gap-[12px] items-start">
          <Truck className="h-[24px] w-[24px] text-[#272424]" />
          <div className="flex flex-col gap-[8px] items-start">
            <p className="font-montserrat font-semibold text-[16px] leading-[1.4] text-[#272424]">
              Thông tin vận chuyển
            </p>
            <p className="font-montserrat font-medium text-[14px] leading-[1.4] text-[#272424]">
              {currentOrder.shipping.method}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="border border-[#e7e7e7] box-border flex flex-col sm:flex-row h-auto sm:h-[77px] items-start justify-between p-[12px] gap-[8px] sm:gap-0 relative rounded-[8px] w-full overflow-hidden min-w-0">
          <div className="box-border flex gap-[10px] items-start p-[10px] relative shrink-0 min-w-0 flex-1">
            <div
              className={`flex items-center justify-center relative self-stretch shrink-0 flex-shrink-0 ${
                currentOrder.status === "Đang giao" ? "w-[33px]" : "w-[35px]"
              }`}
            >
              <div className="flex-none h-full rotate-[90deg]">
                <div
                  className={`h-full relative ${
                    currentOrder.status === "Đang giao"
                      ? "w-[33px]"
                      : "w-[35px]"
                  }`}
                >
                  <div className="absolute inset-[-1px]">
                    <svg
                      width={
                        currentOrder.status === "Đang giao" ? "33" : "35"
                      }
                      height="1"
                      viewBox={`0 0 ${
                        currentOrder.status === "Đang giao" ? "33" : "35"
                      } 1`}
                      fill="none"
                      className="stroke-[#737373]"
                    >
                      <line
                        x1="0"
                        y1="0.5"
                        x2={currentOrder.status === "Đang giao" ? "33" : "35"}
                        y2="0.5"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {currentOrder.status === "Đang giao" ? (
              <div className="flex flex-col font-montserrat font-medium gap-[5px] items-start leading-[normal] text-[10px] text-[#04910c] relative shrink-0 min-w-0">
                <p className="leading-[1.4] break-words">{getTimelineText().status}</p>
                <p className="leading-[1.4] whitespace-nowrap">{getTimelineText().date}</p>
              </div>
            ) : (
              <div className="flex flex-col font-inter font-bold gap-[5px] items-start leading-[normal] text-[14px] text-[#04910c] relative shrink-0 min-w-0">
                <p className="leading-[normal] break-words">{getTimelineText().status}</p>
                <p className="leading-[normal] whitespace-nowrap">{getTimelineText().date}</p>
              </div>
            )}
          </div>
          <div className="box-border flex gap-[10px] items-center justify-center p-[12px] relative rounded-[8px] shrink-0 whitespace-nowrap">
            <span className="font-inter font-bold text-[12px] leading-[normal] text-[#888888]">
              Mở rộng
            </span>
            <div className="relative shrink-0 size-[18px]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12L5 8M9 12L13 8M9 12V3"
                  stroke="#888888"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
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
        <div className="w-full">
        <div className="box-border flex gap-[6px] items-center px-[6px] py-0 relative shrink-0 w-full">
          <Wallet className="relative shrink-0 size-[24px]" />
          <h2 className="font-montserrat font-semibold text-[#272424] text-[18px] leading-[1.4]">
            Thông tin thanh toán
          </h2>
        </div>
        <div className="w-full overflow-x-auto">
          <div className="flex flex-col items-start relative rounded-[8px] w-full min-w-[700px]">
          {/* Table Header */}
          <div className="flex items-start relative shrink-0 w-full">
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
          {/* Table Body */}
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
          {/* Summary Row - Website */}
          <div className="border border-[#e7e7e7] box-border flex gap-[40px] items-center justify-end px-[6px] py-0 relative rounded-bl-[6px] rounded-br-[6px] shrink-0 w-full">
            <div className="box-border flex items-center justify-between px-[6px] py-[12px] relative shrink-0 w-[335px]">
              <div className="flex flex-col gap-[4px] items-end justify-center leading-[1.4] relative shrink-0 text-[#272424] text-nowrap">
                <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                  Tổng tiền sản phẩm
                </p>
                <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                  Tổng phí vận chuyển
                </p>
                <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                  Phụ phí
                </p>
                <p className="font-montserrat font-semibold relative shrink-0 text-[14px]">
                  Doanh thu đơn hàng
                </p>
              </div>
              <div className="flex flex-row items-center self-stretch">
                <div className="flex flex-col gap-[4px] h-full items-end justify-center leading-[1.4] relative shrink-0 text-[#272424] text-nowrap">
                  <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                    {formatCurrency(currentOrder.summary.subtotal)}
                  </p>
                  <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                    {formatCurrency(currentOrder.summary.shipping)}
                  </p>
                  <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
                    {formatCurrency(currentOrder.summary.fee)}
                  </p>
                  <p className="font-montserrat font-semibold relative shrink-0 text-[14px]">
                    {formatCurrency(currentOrder.summary.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>

      {/* Payment Information Card */}
      <div
        className={`bg-white border-2 border-[#e7e7e7] box-border flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[12px] px-[16px] sm:px-[24px] py-[15px] relative rounded-[8px] w-full overflow-hidden min-w-0 ${
          currentOrder.status === "Đã hủy" ? "opacity-50" : ""
        }`}
      >
        <div className="flex gap-[5px] items-start relative self-stretch shrink-0 min-w-0">
          <Wallet className="relative shrink-0 size-[24px] flex-shrink-0" />
          <p className="font-montserrat font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[18px] text-nowrap">
            Thanh toán của người mua
          </p>
        </div>
        <div className="box-border flex items-center justify-between px-[10px] py-[12px] relative shrink-0 w-full sm:w-[347px] min-w-0">
          <div className="flex flex-col gap-[4px] h-[72px] items-end justify-center leading-[1.4] relative shrink-0 text-[#272424] text-nowrap">
            <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
              Tổng tiền sản phẩm
            </p>
            <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
              Phí vận chuyển
            </p>
            <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
              Mã giảm giá của shop
            </p>
            <p className="font-montserrat font-semibold relative shrink-0 text-[14px]">
              Tổng tiền thanh toán
            </p>
          </div>
          <div className="flex flex-col gap-[4px] items-end justify-center leading-[1.4] relative shrink-0 text-[#272424] text-nowrap">
            <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
              {formatCurrency(currentOrder.payment.subtotal)}
            </p>
            <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
              {formatCurrency(currentOrder.payment.shipping)}
            </p>
            <p className="font-montserrat font-medium relative shrink-0 text-[14px]">
              {formatCurrency(currentOrder.payment.discount)}
            </p>
            <p className="font-montserrat font-semibold relative shrink-0 text-[14px]">
              {formatCurrency(currentOrder.payment.total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailWebsite;

