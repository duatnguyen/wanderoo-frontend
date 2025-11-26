import React, { useState } from "react";
import { MapPin, Truck, Package } from "lucide-react";
import type { CustomerOrderResponse } from "@/types/orders";
import { formatTimelineDate, formatOrderDate } from "@/utils/dateUtils";

interface WebsiteOrderInfoProps {
  orderData: CustomerOrderResponse;
}

const WebsiteOrderInfo: React.FC<WebsiteOrderInfoProps> = ({ orderData }) => {
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

  const handleToggleTimeline = () => {
    setIsTimelineExpanded(!isTimelineExpanded);
  };

  // Map shipping status to Vietnamese (supports both UPPERCASE and snake_case)
  const mapShippingStatusToLabel = (status: string | null | undefined): string => {
    if (!status) return "Chưa có thông tin";
    
    const normalizedStatus = status.toLowerCase();
    const statusMap: Record<string, string> = {
      "ready_to_pick": "Chờ lấy hàng",
      "picking": "Đang lấy hàng",
      "money_collect_picking": "Đang tương tác với người gửi",
      "picked": "Lấy hàng thành công",
      "storing": "Nhập kho",
      "transporting": "Đang trung chuyển",
      "sorting": "Đang phân loại",
      "delivering": "Đang giao hàng",
      "money_collect_delivering": "Đang tương tác với người nhận",
      "delivered": "Giao hàng thành công",
      "delivery_fail": "Giao hàng không thành công",
      "waiting_to_return": "Chờ xác nhận giao lại",
      "return": "Chuyển hoàn",
      "return_transporting": "Đang trung chuyển hàng hoàn",
      "return_sorting": "Đang phân loại hàng hoàn",
      "returning": "Đang hoàn hàng",
      "return_fail": "Hoàn hàng không thành công",
      "returned": "Hoàn hàng thành công",
      "cancel": "Đơn huỷ",
      "exception": "Hàng ngoại lệ",
      "lost": "Hàng thất lạc",
      "damage": "Hàng hư hỏng",
    };

    return statusMap[normalizedStatus] || status;
  };

  // Get timeline steps from shippingDetail.log (only log entries, no header)
  const getTimelineSteps = () => {
    if (!orderData || !orderData.shippingDetail) return [];

    const rawLog = orderData.shippingDetail.log || [];
    if (!Array.isArray(rawLog) || rawLog.length === 0) return [];

    // Sort log by updated_date (oldest first) to show chronological order
    const sortedLog = [...rawLog].sort((a: any, b: any) => {
      const dateA = a.updated_date ? new Date(a.updated_date).getTime() : 0;
      const dateB = b.updated_date ? new Date(b.updated_date).getTime() : 0;
      return dateA - dateB;
    });

    // Map log entries to timeline steps
    return sortedLog.map((logEntry: any, index: number) => ({
      id: index + 1,
      status: mapShippingStatusToLabel(logEntry.status),
      date: logEntry.updated_date ? formatTimelineDate(logEntry.updated_date) : "",
      isCompleted: true,
      isCurrent: false,
    }));
  };

  // Get timeline text for header (displays shippingStatus)
  const getTimelineText = () => {
    // Header displays shippingStatus from orderData
    const shippingStatus = orderData.shippingStatus;
    
    // Get the date from updatedAt or the latest log entry
    const steps = getTimelineSteps();
    const latestLogDate = steps.length > 0 
      ? steps[steps.length - 1].date 
      : undefined;
    
    return {
      status: mapShippingStatusToLabel(shippingStatus),
      date: latestLogDate || (orderData.updatedAt ? formatTimelineDate(orderData.updatedAt) : ""),
    };
  };

  return (
    <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[20px] items-start p-[20px] sm:p-[28px] relative rounded-[8px] w-full overflow-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center gap-[8px] w-full">
        <div className="w-[4px] h-[20px] bg-[#e04d30] rounded-[2px]"></div>
        <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
          Thông tin WEBSITE
        </h3>
      </div>

      {/* Customer Order Information Section */}
      <div className="flex gap-[14px] items-start w-full">
        <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f0f4ff] rounded-[8px] shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
              stroke="#4f46e5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
              stroke="#4f46e5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-[6px] items-start flex-1 min-w-0">
          <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
            Thông tin khách hàng đặt hàng
          </p>
          <div className="flex flex-col gap-[2px]">
            <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424]">
              {orderData.receiverName ||
                orderData.shippingDetail?.to_name ||
                orderData.userInfo?.name ||
                "Chưa có thông tin tên"}
            </p>
            <p className="font-montserrat font-medium text-[13px] leading-[1.3] text-[#666666]">
              📞{" "}
              {orderData.receiverPhone ||
                orderData.shippingDetail?.to_phone ||
                orderData.userInfo?.phone ||
                "Chưa có thông tin số điện thoại"}
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className="flex gap-[14px] items-start w-full">
        <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f0f8ff] rounded-[8px] shrink-0">
          <MapPin className="h-[20px] w-[20px] text-[#2563eb]" />
        </div>
        <div className="flex flex-col gap-[6px] items-start flex-1 min-w-0">
          <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
            Địa chỉ nhận hàng
          </p>
          <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424] break-words min-w-0">
            {orderData.receiverAddress ||
              orderData.shippingDetail?.to_address ||
              "Chưa có thông tin địa chỉ"}
          </p>
        </div>
      </div>

      {/* Shipping Method Section */}
      <div className="flex gap-[14px] items-start w-full">
        <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f0f9ff] rounded-[8px] shrink-0">
          <Truck className="h-[20px] w-[20px] text-[#0284c7]" />
        </div>
        <div className="flex flex-col gap-[6px] items-start flex-1 min-w-0">
          <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
            Phương thức vận chuyển
          </p>
          <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424]">
            {(orderData as any).shippingProvider
              ? `${(orderData as any).shippingProvider} (Dịch vụ ${(orderData as any).shippingDetail?.service_type_id || "N/A"})`
              : "Chưa có thông tin phương thức vận chuyển"}
          </p>
          {(orderData as any).shippingOrderCode && (
            <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
              Mã vận chuyển: {(orderData as any).shippingOrderCode}
            </p>
          )}
        </div>
      </div>

      {/* Order Date Section */}
      <div className="flex gap-[14px] items-start w-full">
        <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f8f9fa] rounded-[8px] shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
              stroke="#6b7280"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.6947 13.7002H15.7037M15.6947 16.7002H15.7037M11.9955 13.7002H12.0045M11.9955 16.7002H12.0045M8.29431 13.7002H8.30329M8.29431 16.7002H8.30329"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-[6px] items-start flex-1 min-w-0">
          <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
            Ngày đặt hàng
          </p>
          <p className="font-montserrat font-semibold text-[13px] leading-[1.3] text-[#272424]">
            {formatOrderDate(orderData.createdAt)}
          </p>
        </div>
      </div>

      {/* Timeline - Only show if shippingDetail exists */}
      {orderData.shippingDetail && (
        <div className="border border-[#e7e7e7] box-border flex flex-col relative rounded-[8px] w-full overflow-hidden min-w-0 bg-white">
          {/* Timeline Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between p-[16px] gap-[12px] sm:gap-0">
            <div className="box-border flex gap-[12px] items-center relative shrink-0 min-w-0 flex-1">
              {/* Status Icon */}
              <div className={`flex items-center justify-center w-[40px] h-[40px] rounded-full border shrink-0 ${
                orderData.shippingStatus === "SHIPPING" || orderData.status === "SHIPPING"
                  ? "bg-blue-50 border-blue-200"
                  : orderData.shippingStatus === "COMPLETE" || orderData.status === "COMPLETE"
                  ? "bg-green-50 border-green-200"
                  : orderData.shippingStatus === "PENDING" || orderData.status === "PENDING"
                  ? "bg-amber-50 border-amber-200"
                  : orderData.shippingStatus === "CONFIRMED" || orderData.status === "CONFIRMED"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}>
                {orderData.shippingStatus === "SHIPPING" || orderData.status === "SHIPPING" ? (
                  <Truck className="w-5 h-5 text-blue-600" />
                ) : orderData.shippingStatus === "COMPLETE" || orderData.status === "COMPLETE" ? (
                  <Package className="w-5 h-5 text-green-600" />
                ) : orderData.shippingStatus === "PENDING" || orderData.status === "PENDING" ? (
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : orderData.shippingStatus === "CONFIRMED" || orderData.status === "CONFIRMED" ? (
                  <svg
                    className="w-5 h-5 text-emerald-600"
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
                    className="w-5 h-5 text-red-600"
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

              {/* Status Text */}
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-[16px] leading-[1.3] text-[#272424]">
                  {getTimelineText().status}
                </p>
                <div className="flex items-center gap-[6px]">
                  <svg
                    className="w-3 h-3 text-[#737373]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-montserrat font-medium text-[13px] leading-[1.3] text-[#737373]">
                    {getTimelineText().date}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleTimeline}
              className="box-border flex gap-[6px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 whitespace-nowrap cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <span className="font-montserrat font-medium text-[13px] leading-[normal] text-[#555555]">
                {isTimelineExpanded ? "Thu gọn" : "Xem chi tiết"}
              </span>
              <div
                className={`relative shrink-0 size-[14px] transition-transform duration-200 ${isTimelineExpanded ? "rotate-180" : ""}`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 10L5 7M8 10L11 7M8 10V4"
                    stroke="#555555"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>

          {/* Expanded Timeline Steps */}
          {isTimelineExpanded && (
            <div className="border-t border-[#e7e7e7] p-[16px] bg-white">
              <div className="flex flex-col gap-[16px]">
                <div className="flex items-center gap-[8px]">
                  <div className="w-[3px] h-[16px] bg-[#e04d30] rounded-full"></div>
                  <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
                    Lịch sử đơn hàng
                  </h3>
                </div>
                <div className="flex flex-col gap-[12px] pl-[6px]">
                  {getTimelineSteps().length > 0 ? (
                    getTimelineSteps().map((step, index) => (
                      <div
                        key={step.id}
                        className="flex items-start gap-[12px]"
                      >
                        {/* Timeline Icon */}
                        <div className="flex flex-col items-center gap-[6px] shrink-0">
                          <div
                            className={`w-[12px] h-[12px] rounded-full border-2 flex items-center justify-center ${
                              step.isCompleted
                                ? step.isCurrent
                                  ? "bg-[#04910c] border-[#04910c]"
                                  : "bg-[#28a745] border-[#28a745]"
                                : step.isCurrent
                                  ? "bg-[#ffc107] border-[#ffc107]"
                                  : "bg-white border-[#d1d1d1]"
                            }`}
                          >
                            {step.isCompleted && (
                              <svg
                                width="8"
                                height="6"
                                viewBox="0 0 10 8"
                                fill="none"
                                className="text-white"
                              >
                                <path
                                  d="M1.5 4L3.5 6L8.5 1.5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          {index < getTimelineSteps().length - 1 && (
                            <div
                              className={`w-[2px] h-[20px] rounded-full ${
                                step.isCompleted
                                  ? "bg-[#28a745]"
                                  : "bg-[#e7e7e7]"
                              }`}
                            />
                          )}
                        </div>

                        {/* Timeline Content */}
                        <div className="flex flex-col gap-[4px] min-w-0 flex-1 pb-[4px]">
                          <p
                            className={`font-montserrat font-medium text-[14px] leading-[1.4] ${
                              step.isCurrent
                                ? "text-[#04910c] font-semibold"
                                : step.isCompleted
                                  ? "text-[#272424]"
                                  : "text-[#888888]"
                            }`}
                          >
                            {step.status}
                          </p>
                          {step.date && (
                            <div className="flex items-center gap-[6px]">
                              <svg
                                className="w-3 h-3 text-[#737373]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p className="font-montserrat font-medium text-[12px] leading-[1.4] text-[#737373]">
                                {step.date}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="font-montserrat font-medium text-[13px] text-[#737373] italic pl-[6px]">
                      Chưa có lịch sử cập nhật
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebsiteOrderInfo;
