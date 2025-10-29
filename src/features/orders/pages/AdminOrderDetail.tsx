// src/pages/admin/AdminOrderDetail.tsx
import React from "react";
import { ArrowLeft, MapPin, Truck, Wallet, Package } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data cho order detail
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

const AdminOrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const handleBackClick = () => {
    navigate(-1);
  };

  // Function to get order data based on orderId
  const getOrderData = () => {
    // If orderId matches our mock orders, we could fetch real data here
    // For now, we'll use the mock data but display the correct orderId
    return {
      ...orderDetail,
      id: orderId || orderDetail.id,
    };
  };

  const currentOrder = getOrderData();

  // Get status card styling based on order status
  const getStatusCardStyle = () => {
    if (currentOrder.status === "Đang giao") {
      return {
        bg: "bg-[#bbe1ff]",
        text: "text-[#1a71f6]",
      };
    }
    // Default: Đã hoàn thành
    return {
      bg: "bg-[#b2ffb4]",
      text: "text-[#04910c]",
    };
  };

  const statusCardStyle = getStatusCardStyle();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-[10px] items-center w-full">
      {/* Header */}
      <div className="flex flex-col gap-[8px] items-start justify-center w-full">
        <div className="flex gap-[4px] items-center">
          <button
            onClick={handleBackClick}
            className="relative shrink-0 size-[24px] flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-[#737373]" />
          </button>
          <h1 className="font-montserrat font-bold text-[#272424] text-[24px] leading-[1.5]">
            Chi tiết đơn hàng
          </h1>
        </div>
      </div>

      {/* Status Cards */}
      <div className="flex gap-[10px] items-center justify-center w-full">
        <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
          <div
            className={`basis-0 ${statusCardStyle.bg} border border-[#d1d1d1] box-border flex gap-[8px] grow h-full items-center min-h-px min-w-px p-[12px] relative rounded-[18px] shrink-0`}
          >
            <div className="box-border flex gap-[6px] items-center px-[6px] py-[4px] relative shrink-0">
              <span
                className={`font-montserrat font-bold ${statusCardStyle.text} text-[20px] leading-[normal]`}
              >
                Trạng thái đơn: {currentOrder.status}
              </span>
            </div>
          </div>
        </div>
        <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
          <div className="basis-0 bg-[#e7e7e7] border border-[#d1d1d1] box-border flex gap-[8px] grow h-full items-center min-h-px min-w-px p-[12px] relative rounded-[18px] shrink-0">
            <div className="box-border flex gap-[6px] items-center px-[6px] py-[4px] relative shrink-0">
              <span className="font-montserrat font-bold text-[#272424] text-[20px] leading-[normal]">
                Nguồn đơn: {currentOrder.source}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[24px] w-full">
        <div className="flex flex-row gap-[20px] items-start justify-between w-full">
          <div className="flex gap-[12px] items-center">
            <Package className="h-10 w-10 text-[#737373]" />
            <div className="flex flex-col gap-[5px] items-start">
              <p className="font-inter font-bold text-[12px] leading-[normal] text-[#1a1a1b]">
                Mã đơn hàng
              </p>
              <p className="font-montserrat font-medium text-[10px] leading-[1.4] text-[#1a1a1b]">
                {currentOrder.id}
              </p>
            </div>
          </div>
          <div className="flex gap-[18px] items-center">
            <MapPin className="h-10 w-10 text-[#737373]" />
            <div className="flex flex-col gap-[5px] items-start">
              <p className="font-inter font-bold text-[12px] leading-[normal] text-[#1a1a1b]">
                Địa chỉ nhận hàng
              </p>
              <p className="font-montserrat font-medium text-[10px] leading-[1.4] text-[#1a1a1b]">
                {currentOrder.shipping.address}
              </p>
              <p className="font-montserrat font-medium text-[10px] leading-[1.4] text-[#1a1a1b]">
                {currentOrder.shipping.district}
              </p>
            </div>
          </div>
          <div className="flex gap-[15px] items-center w-[270px]">
            <Truck className="h-10 w-10 text-[#737373]" />
            <div className="flex flex-col gap-[5px] items-start">
              <p className="font-inter font-bold text-[12px] leading-[normal] text-[#1a1a1b]">
                Thông tin vận chuyển
              </p>
              <p className="font-montserrat font-medium text-[10px] leading-[1.4] text-[#1a1a1b]">
                {currentOrder.shipping.method}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="border border-[#e7e7e7] box-border flex h-[77px] items-start justify-between p-[12px] relative rounded-[24px] w-full">
          <div className="box-border flex gap-[10px] items-start p-[10px] relative shrink-0">
            <div
              className={`flex items-center justify-center relative self-stretch shrink-0 ${
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
                      width={currentOrder.status === "Đang giao" ? "33" : "35"}
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
              <div className="flex flex-col font-montserrat font-medium gap-[5px] items-start leading-[normal] text-[10px] text-[#04910c] relative shrink-0">
                <p className="leading-[1.4]">
                  {currentOrder.timeline[0].status}
                </p>
                <p className="leading-[1.4]">{currentOrder.timeline[0].date}</p>
              </div>
            ) : (
              <div className="flex flex-col font-inter font-bold gap-[5px] items-start leading-[normal] text-[12px] text-[#04910c] relative shrink-0">
                <p className="leading-[normal]">
                  {currentOrder.timeline[0].status}
                </p>
                <p className="leading-[normal]">
                  {currentOrder.timeline[0].date}
                </p>
              </div>
            )}
          </div>
          <div className="box-border flex gap-[10px] items-center justify-center p-[12px] relative rounded-[12px] shrink-0">
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
      <div className="bg-white border-2 border-[#e7e7e7] box-border flex gap-[8px] items-center px-[24px] py-[8px] relative rounded-[24px] w-full">
        <div className="basis-0 box-border flex gap-[6px] grow items-center min-h-px min-w-px px-[6px] py-[4px] relative shrink-0">
          <div className="flex gap-[10px] items-center relative shrink-0 w-[205px]">
            <Avatar className="relative rounded-[24px] size-[54px]">
              <AvatarFallback className="bg-gray-200 rounded-[24px]">
                {currentOrder.customer.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-[8px] items-center relative shrink-0">
              <span className="font-montserrat font-bold text-[#2a2a2a] text-[12px] leading-[1.5]">
                {currentOrder.customer.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[8px] items-start p-[24px] relative rounded-[24px] w-full">
        <div className="box-border flex gap-[6px] items-center px-[6px] py-0 relative shrink-0 w-full">
          <Wallet className="relative shrink-0 size-[24px]" />
          <h2 className="font-montserrat font-semibold text-[#272424] text-[18px] leading-[1.4]">
            Thông tin thanh toán
          </h2>
        </div>
        <div className="flex flex-col items-start relative rounded-[24px] w-full">
          {/* Table Header */}
          <div className="flex items-start relative shrink-0 w-full">
            <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] relative rounded-tl-[12px] self-stretch shrink-0 w-[70px]">
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
            <div className="basis-0 bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] grow items-center justify-end min-h-px min-w-px pb-[15px] pt-[14px] px-[14px] relative rounded-tr-[16px] self-stretch shrink-0">
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
                  <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                    {index + 1}
                  </p>
                </div>
              </div>
              <div className="flex flex-row items-center self-stretch">
                <div className="box-border flex gap-[8px] h-full items-center justify-center p-[14px] relative shrink-0 w-[400px]">
                  <div className="border-[0.5px] border-[#d1d1d1] relative rounded-[8px] shrink-0 size-[70px]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full"
                    />
                  </div>
                  <div className="basis-0 flex gap-[8px] grow h-full items-start min-h-px min-w-px relative shrink-0">
                    <p className="basis-0 font-montserrat font-medium grow leading-[1.4] min-h-px min-w-px relative self-stretch shrink-0 text-[#272424] text-[12px]">
                      {item.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                <div className="basis-0 box-border flex gap-[8px] grow h-full items-center justify-center min-h-px min-w-px p-[14px] relative shrink-0">
                  <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
              <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                <div className="basis-0 box-border flex gap-[8px] grow h-full items-center justify-center min-h-px min-w-px p-[14px] relative shrink-0">
                  <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                    {item.quantity}
                  </p>
                </div>
              </div>
              <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
                <div className="basis-0 box-border flex gap-[8px] grow h-full items-center justify-end min-h-px min-w-px p-[14px] relative shrink-0">
                  <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                    {formatCurrency(item.total)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {/* Summary Row */}
          <div className="border border-[#e7e7e7] box-border flex gap-[40px] items-center justify-end px-[6px] py-0 relative rounded-bl-[16px] rounded-br-[16px] shrink-0 w-full">
            <div className="box-border flex items-center justify-between px-[6px] py-[12px] relative shrink-0 w-[335px]">
              <div className="flex flex-col gap-[4px] items-end justify-center leading-[1.4] relative shrink-0 text-[#272424] text-nowrap">
                <p className="font-montserrat font-medium relative shrink-0 text-[12px]">
                  Tổng tiền sản phẩm
                </p>
                <p className="font-montserrat font-medium relative shrink-0 text-[12px]">
                  Tổng phí vận chuyển
                </p>
                <p className="font-montserrat font-medium relative shrink-0 text-[12px]">
                  Phụ phí
                </p>
                <p className="font-montserrat font-semibold relative shrink-0 text-[14px]">
                  Doanh thu đơn hàng
                </p>
              </div>
              <div className="flex flex-row items-center self-stretch">
                <div className="flex flex-col gap-[4px] h-full items-end justify-center leading-[1.4] relative shrink-0 text-[#272424] text-nowrap">
                  <p className="font-montserrat font-medium relative shrink-0 text-[12px]">
                    {formatCurrency(currentOrder.summary.subtotal)}
                  </p>
                  <p className="font-montserrat font-medium relative shrink-0 text-[12px]">
                    {formatCurrency(currentOrder.summary.shipping)}
                  </p>
                  <p className="font-montserrat font-medium relative shrink-0 text-[12px]">
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

      {/* Payment Information Card */}
      <div className="bg-white border-2 border-[#e7e7e7] box-border flex items-start justify-between px-[24px] py-[15px] relative rounded-[24px] w-full">
        <div className="flex gap-[5px] items-start relative self-stretch shrink-0">
          <Wallet className="relative shrink-0 size-[24px]" />
          <p className="font-montserrat font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[18px] text-nowrap">
            Thanh toán của người mua
          </p>
        </div>
        <div className="box-border flex items-center justify-between px-[10px] py-[12px] relative shrink-0 w-[347px]">
          <div className="flex flex-col gap-[4px] h-[72px] items-end justify-center leading-[1.4] relative shrink-0 text-[#272424] text-nowrap">
            <p className="font-montserrat font-medium relative shrink-0 text-[12px]">
              Tổng tiền sản phẩm
            </p>
            <p className="font-montserrat font-medium relative shrink-0 text-[12px]">
              Phí vận chuyển
            </p>
            <p className="font-montserrat font-medium relative shrink-0 text-[12px]">
              Mã giảm giá của shop
            </p>
            <p className="font-montserrat font-semibold relative shrink-0 text-[14px]">
              Tổng tiền thanh toán
            </p>
          </div>
          <div className="flex flex-col gap-[4px] items-end justify-center leading-[1.4] relative shrink-0 text-[#272424] text-nowrap">
            <p className="font-montserrat font-medium relative shrink-0 text-[12px]">
              {formatCurrency(currentOrder.payment.subtotal)}
            </p>
            <p className="font-montserrat font-medium relative shrink-0 text-[12px]">
              {formatCurrency(currentOrder.payment.shipping)}
            </p>
            <p className="font-montserrat font-medium relative shrink-0 text-[12px]">
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

export default AdminOrderDetail;
