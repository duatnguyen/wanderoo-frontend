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

    // Get complete timeline steps based on shipping log data
    const getTimelineSteps = () => {
        if (!orderData) return [];

        // Base steps that are always present
        const baseSteps = [
            {
                id: 1,
                status: "Đơn hàng đã được đặt",
                date: formatTimelineDate(orderData.createdAt),
                isCompleted: true,
                isCurrent: false,
            },
        ];

        // Map GHN status to Vietnamese descriptions
        const getStatusDescription = (status: string) => {
            switch (status) {
                case "ready_to_pick":
                    return "Chờ lấy hàng";
                case "picking":
                    return "Đang lấy hàng";
                case "money_collect_picking":
                    return "Đang tương tác với người gửi";
                case "picked":
                    return "Lấy hàng thành công";
                case "storing":
                    return "Nhập kho";
                case "transporting":
                    return "Đang trung chuyển";
                case "sorting":
                    return "Đang phân loại";
                case "delivering":
                    return "Đang giao hàng";
                case "delivered":
                    return "Giao hàng thành công";
                case "money_collect_delivering":
                    return "Đang tương tác với người nhận";
                case "delivery_fail":
                    return "Giao hàng không thành công";
                case "waiting_to_return":
                    return "Chờ xác nhận giao lại";
                case "return":
                    return "Chuyển hoàn";
                case "return_transporting":
                    return "Đang trung chuyển hàng hoàn";
                case "return_sorting":
                    return "Đang phân loại hàng hoàn";
                case "returning":
                    return "Đang hoàn hàng";
                case "return_fail":
                    return "Hoàn hàng không thành công";
                case "returned":
                    return "Hoàn hàng thành công";
                case "cancel":
                    return "Đơn huỷ";
                case "exception":
                    return "Hàng ngoại lệ";
                case "lost":
                    return "Hàng thất lạc";
                case "damage":
                    return "Hàng hư hỏng";
                default:
                    return `Trạng thái: ${status}`;
            }
        };

        // Add steps from shipping log if available
        // Sort log by updated_date to ensure chronological order
        const rawLog = orderData.shippingDetail?.log || [];
        const sortedLog = [...rawLog].sort((a: any, b: any) => {
            const dateA = a.updated_date ? new Date(a.updated_date).getTime() : 0;
            const dateB = b.updated_date ? new Date(b.updated_date).getTime() : 0;
            return dateA - dateB; // Sort ascending (oldest first)
        });

        // Debug: Log the raw and sorted log entries
        if (rawLog.length > 0) {
            console.log('Raw shipping log:', rawLog);
            console.log('Sorted shipping log:', sortedLog);
            console.log('Log statuses:', sortedLog.map((entry: any) => ({
                status: entry.status,
                date: entry.updated_date,
                description: getStatusDescription(entry.status)
            })));
        }

        const logSteps = sortedLog.map((logEntry: any, index: number) => ({
            id: baseSteps.length + index + 1,
            status: getStatusDescription(logEntry.status),
            date: formatTimelineDate(logEntry.updated_date),
            isCompleted: true,
            isCurrent: false,
            rawStatus: logEntry.status, // Keep raw status for debugging
        }));

        // Combine base steps with log steps
        const allSteps = [...baseSteps, ...logSteps];

        // If we have log steps, use the last log step as the current status
        // Don't add artificial steps based on order status
        if (logSteps.length > 0) {
            // Mark the last step as current
            const stepsWithCurrent = allSteps.map((step, index) => ({
                ...step,
                isCurrent: index === allSteps.length - 1,
            }));
            return stepsWithCurrent;
        }

        // If no log steps, determine current step based on order status
        const currentStatus = orderData.status;
        if (currentStatus === "PENDING") {
            return [
                {
                    id: 1,
                    status: "Đơn hàng đã được đặt",
                    date: formatTimelineDate(orderData.createdAt),
                    isCompleted: true,
                    isCurrent: false,
                },
                {
                    id: 2,
                    status: "Chờ xác nhận đơn hàng",
                    date: "",
                    isCompleted: false,
                    isCurrent: true,
                },
            ];
        } else if (currentStatus === "CONFIRMED") {
            return [
                ...baseSteps,
                {
                    id: baseSteps.length + 1,
                    status: "Đơn hàng đang được chuẩn bị",
                    date: "",
                    isCompleted: false,
                    isCurrent: true,
                },
            ];
        } else if (currentStatus === "SHIPPING") {
            return [
                ...allSteps,
                {
                    id: allSteps.length + 1,
                    status: "Đang trong quá trình giao hàng",
                    date: formatTimelineDate(orderData.shippingDetail?.leadtime_order?.to_estimate_date),
                    isCompleted: false,
                    isCurrent: true,
                },
            ];
        } else if (currentStatus === "COMPLETE") {
            return [
                ...allSteps,
                {
                    id: allSteps.length + 1,
                    status: "Giao hàng thành công",
                    date: formatTimelineDate(orderData.updatedAt),
                    isCompleted: true,
                    isCurrent: true,
                },
            ];
        } else if (currentStatus === "CANCELED") {
            return [
                ...baseSteps,
                {
                    id: baseSteps.length + 1,
                    status: "Đơn hàng đã bị hủy",
                    date: formatTimelineDate(orderData.updatedAt),
                    isCompleted: true,
                    isCurrent: true,
                },
            ];
        }

        // Default case - return all completed steps
        return allSteps.map((step, index) => ({
            ...step,
            isCurrent: index === allSteps.length - 1,
        }));
    };

    // Get timeline text based on order status (for collapsed view)
    // Always show the last step (most recent status) in the header
    const getTimelineText = () => {
        const steps = getTimelineSteps();
        // Always get the last step (most recent status)
        const lastStep = steps[steps.length - 1];
        return {
            status: lastStep.status,
            date: lastStep.date,
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
                        Thông tin người nhận hàng
                    </p>
                    <div className="flex flex-col gap-[2px]">
                        <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424]">
                            {orderData.receiverName || orderData.userInfo?.name || "Chưa có thông tin tên"}
                        </p>
                        <p className="font-montserrat font-medium text-[13px] leading-[1.3] text-[#666666]">
                            📞 {orderData.receiverPhone || orderData.userInfo?.phone || "Chưa có thông tin số điện thoại"}
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
                    <div className="flex flex-col gap-[4px] w-full">
                        {orderData.receiverAddress || orderData.shippingDetail?.to_address ? (
                            <>
                                <p className="font-montserrat font-semibold text-[14px] leading-[1.4] text-[#272424] break-words">
                                    {orderData.receiverAddress || orderData.shippingDetail?.to_address}
                                </p>
                                {(orderData.receiverWardName || orderData.receiverDistrictName || orderData.receiverProvinceName) && (
                                    <div className="flex flex-wrap gap-[6px] items-center">
                                        {orderData.receiverWardName && (
                                            <span className="font-montserrat font-medium text-[12px] text-[#666666] bg-gray-100 px-[8px] py-[2px] rounded-[4px]">
                                                {orderData.receiverWardName}
                                            </span>
                                        )}
                                        {orderData.receiverDistrictName && (
                                            <span className="font-montserrat font-medium text-[12px] text-[#666666] bg-gray-100 px-[8px] py-[2px] rounded-[4px]">
                                                {orderData.receiverDistrictName}
                                            </span>
                                        )}
                                        {orderData.receiverProvinceName && (
                                            <span className="font-montserrat font-medium text-[12px] text-[#666666] bg-gray-100 px-[8px] py-[2px] rounded-[4px]">
                                                {orderData.receiverProvinceName}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424] break-words min-w-0">
                                Chưa có thông tin địa chỉ
                            </p>
                        )}
                    </div>
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
                        {(orderData as any).shippingProvider ? `${(orderData as any).shippingProvider} (Dịch vụ ${(orderData as any).shippingDetail?.service_type_id || 'N/A'})` : "Chưa có thông tin phương thức vận chuyển"}
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

            {/* Timeline - Only show when shippingDetail exists */}
            {orderData.shippingDetail && (
            <div className="border border-[#e7e7e7] box-border flex flex-col relative rounded-[12px] w-full overflow-hidden min-w-0 bg-white">
                {/* Timeline Header - Always visible */}
                <div className="flex flex-col sm:flex-row h-auto sm:h-[80px] items-start justify-between p-[16px] gap-[12px] sm:gap-0">
                    <div className="box-border flex gap-[12px] items-center relative shrink-0 min-w-0 flex-1">
                        {/* Status Icon */}
                        <div className="flex items-center justify-center w-[48px] h-[48px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full border-2 border-blue-100 shrink-0">
                            {orderData!.status === "SHIPPING" ? (
                                <Truck className="w-6 h-6 text-blue-600" />
                            ) : orderData!.status === "COMPLETE" ? (
                                <Package className="w-6 h-6 text-green-600" />
                            ) : orderData!.status === "PENDING" ? (
                                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            ) : orderData!.status === "CONFIRMED" ? (
                                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>

                        {/* Status Text */}
                        <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                            <p className="font-montserrat font-semibold text-[16px] leading-[1.3] text-[#272424]">
                                {getTimelineText().status}
                            </p>
                            <p className="font-montserrat font-medium text-[13px] leading-[1.3] text-[#737373]">
                                {getTimelineText().date}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleToggleTimeline}
                        className="box-border flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative rounded-[8px] shrink-0 whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-all duration-200 border border-gray-200"
                    >
                        <span className="font-inter font-medium text-[13px] leading-[normal] text-[#555555]">
                            {isTimelineExpanded ? "Thu gọn" : "Xem chi tiết"}
                        </span>
                        <div
                            className={`relative shrink-0 size-[16px] transition-transform duration-200 ${isTimelineExpanded ? "rotate-180" : ""}`}
                        >
                            <svg
                                width="16"
                                height="16"
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
                    <div className="border-t border-[#e7e7e7] p-[20px] bg-gradient-to-b from-gray-50 to-white">
                        <div className="flex flex-col gap-[20px]">
                            <div className="flex items-center gap-[8px]">
                                <div className="w-[4px] h-[20px] bg-[#e04d30] rounded-full"></div>
                                <h3 className="font-montserrat font-semibold text-[18px] text-[#272424]">
                                    Lịch sử đơn hàng
                                </h3>
                            </div>
                            <div className="flex flex-col gap-[16px]">
                                {getTimelineSteps().map((step, index) => (
                                    <div
                                        key={step.id}
                                        className="flex items-start gap-[16px] group"
                                    >
                                        {/* Timeline Icon */}
                                        <div className="flex flex-col items-center gap-[8px] shrink-0">
                                            <div
                                                className={`w-[16px] h-[16px] rounded-full border-3 flex items-center justify-center transition-all duration-200 ${step.isCompleted
                                                    ? step.isCurrent
                                                        ? "bg-[#04910c] border-[#04910c] shadow-lg shadow-green-200"
                                                        : "bg-[#28a745] border-[#28a745] shadow-md shadow-green-100"
                                                    : step.isCurrent
                                                        ? "bg-[#ffc107] border-[#ffc107] shadow-lg shadow-yellow-200 animate-pulse"
                                                        : "bg-white border-[#d1d1d1] shadow-sm"
                                                    }`}
                                            >
                                                {step.isCompleted && (
                                                    <svg
                                                        width="10"
                                                        height="8"
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
                                                    className={`w-[2px] h-[24px] rounded-full transition-all duration-300 ${step.isCompleted
                                                        ? "bg-gradient-to-b from-[#28a745] to-[#20c997]"
                                                        : "bg-[#e7e7e7]"
                                                        }`}
                                                />
                                            )}
                                        </div>

                                        {/* Timeline Content */}
                                        <div className="flex flex-col gap-[4px] min-w-0 flex-1 pb-[8px]">
                                            <div className="flex items-center gap-[6px]">
                                                <p
                                                    className={`font-montserrat font-medium text-[15px] leading-[1.4] transition-colors duration-200 ${step.isCurrent
                                                        ? "text-[#04910c] font-semibold"
                                                        : step.isCompleted
                                                            ? "text-[#272424]"
                                                            : "text-[#888888]"
                                                        }`}
                                                >
                                                    {step.status}
                                                </p>
                                                {/* Debug: Show raw status in development */}
                                                {(step as any).rawStatus && process.env.NODE_ENV === 'development' && (
                                                    <span className="font-montserrat font-normal text-[10px] text-gray-400 italic">
                                                        ({((step as any).rawStatus)})
                                                    </span>
                                                )}
                                            </div>
                                            {step.date && (
                                                <div className="flex items-center gap-[6px]">
                                                    <svg className="w-3 h-3 text-[#737373]" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                    <p className="font-montserrat font-medium text-[12px] leading-[1.4] text-[#737373]">
                                                        {step.date}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
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