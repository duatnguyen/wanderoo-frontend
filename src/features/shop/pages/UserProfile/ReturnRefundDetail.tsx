import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import OrderTimeline from "../../../../components/admin/order/OrderTimeline";
import { customerReturnOrderApi, type ReturnOrderResponse } from "../../../../api/customerReturnOrderApi";
import { getImageUrl } from "../../../../utils/imageUtils";
import { toast } from "sonner";

function formatCurrencyVND(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

function formatShippingStatus(status?: string): string {
  if (!status) return "";
  const statusMap: Record<string, string> = {
    PENDING: "Chờ xử lý",
    PICKING: "Đang lấy hàng",
    DELIVERING: "Đang giao hàng",
    DELIVERED: "Đã giao hàng",
    RETURNING: "Đang trả hàng",
    RETURNED: "Đã trả hàng",
    CANCELLED: "Đã hủy",
  };
  return statusMap[status.toUpperCase()] || status;
}

interface ProductType {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  originalPrice?: number;
  finalPrice?: number; // Giá sau khi giảm (snapshotProductFinalPrice)
  variant?: string;
  quantity: number;
  sku?: string;
  totalReturnPrice?: number;
  receivedStatus?: string;
  receivedStatusLabel?: string; // Mô tả trạng thái nhận hàng bằng tiếng Việt
  refundedStatus?: string;
  refundedStatusLabel?: string; // Mô tả trạng thái hoàn tiền bằng tiếng Việt
}

interface ReturnRefundStatus {
  id: string;
  label: string;
  completed: boolean;
  date?: string;
}

interface ReturnRefundDetailData {
  orderId: string;
  requestDate: string;
  status: string;
  statusMessage: string;
  products: ProductType[];
  refundAmount: number;
  totalReturnAmount: number;
  refundedStatus?: string;
  refundedStatusLabel?: string;
  refundMethod?: string;
  refundMethodLabel?: string;
  returnOrderCode?: string;
  reason: string;
  description: string;
  images: string[];
  statusSteps: ReturnRefundStatus[];
  receiverName?: string;
  receiverPhone?: string;
  receiverAddress?: string;
  forwardShippingStatus?: string;
  shippingOrderCode?: string;
  shippingProvider?: string;
  returnTypeLabel?: string;
}

const ReturnRefundDetail: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  // Fetch return order detail from API
  const {
    data: returnOrderData,
    isLoading,
    isError,
    error,
  } = useQuery<ReturnOrderResponse>({
    queryKey: ["returnOrderDetail", requestId],
    queryFn: () => {
      if (!requestId) {
        throw new Error("Return order ID is missing");
      }
      return customerReturnOrderApi.getReturnOrderDetails(requestId);
    },
    enabled: !!requestId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Helper function to generate status message based on status label
  // This is a fallback if API doesn't provide status message
  const getStatusMessage = (statusLabel?: string, statusKey?: string): string => {
    if (!statusLabel) {
      return "Yêu cầu đang được xử lý";
    }
    const normalizedStatus = (statusKey || "").toUpperCase();
    
    // Generate appropriate message based on status
    if (normalizedStatus === "CANCELLED") {
      return "Yêu cầu đã được hủy";
    }
    if (statusLabel.includes("xem xét") || statusLabel.includes("chờ")) {
      return "Shop đang xem xét yêu cầu trả hàng & hoàn tiền của bạn";
    }
    if (statusLabel.includes("chấp nhận")) {
      return "Yêu cầu của bạn đã được chấp nhận";
    }
    if (statusLabel.includes("từ chối")) {
      return "Yêu cầu của bạn đã bị từ chối";
    }
    if (statusLabel.includes("trả hàng")) {
      return "Đơn hàng đang được hoàn trả";
    }
    if (statusLabel.includes("nhận hàng")) {
      return "Shop đã nhận được hàng hoàn";
    }
    if (statusLabel.includes("hoàn tiền")) {
      return "Tiền đã được hoàn trả";
    }
    if (statusLabel.includes("hoàn thành")) {
      return "Yêu cầu trả hàng đã hoàn thành";
    }
    
    return `Trạng thái: ${statusLabel}`;
  };

  // Map return order data to component format
  const data = useMemo<ReturnRefundDetailData | null>(() => {
    if (!returnOrderData) return null;

    // Use statusLabel from API
    const statusLabel = returnOrderData.statusLabel || "Đang xử lý";
    const statusMessage = getStatusMessage(statusLabel, returnOrderData.statusKey || returnOrderData.status);

    const createdDate = returnOrderData.createdDate
      ? new Date(returnOrderData.createdDate).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      : "";

    // Map return order details to products
    const products: ProductType[] = (returnOrderData.returnOrderDetails || []).map((detail, index) => {
      // Parse variant attributes if available
      let variant: string | undefined;
      if (detail.snapshotVariantAttributes) {
        try {
          const attrs = typeof detail.snapshotVariantAttributes === 'string'
            ? JSON.parse(detail.snapshotVariantAttributes)
            : detail.snapshotVariantAttributes;
          if (Array.isArray(attrs)) {
            variant = attrs.map((attr: any) => {
              if (attr?.name && attr?.value) {
                return `${attr.name}: ${attr.value}`;
              }
              return attr?.value || attr?.name || null;
            }).filter(Boolean).join(", ");
          }
        } catch (e) {
          console.error("Error parsing variant attributes:", e);
        }
      }

      // Get image URL
      let imageUrl = "";
      if (detail.snapshotProductImageUrl && detail.snapshotProductImageUrl.trim() !== "") {
        imageUrl = getImageUrl(detail.snapshotProductImageUrl) || "";
      } else {
        imageUrl = "/images/placeholders/no-image.svg";
      }

      return {
        id: detail.id?.toString() || `${returnOrderData.id}-${index}`,
        imageUrl,
        name: detail.snapshotProductName || "Sản phẩm không tên",
        price: detail.returnPrice || 0,
        originalPrice: detail.snapshotProductPrice,
        finalPrice: detail.snapshotProductFinalPrice, // Giá sau khi giảm
        variant,
        quantity: detail.quantityRequested || 1,
        sku: detail.snapshotProductSku,
        totalReturnPrice: detail.totalReturnPrice,
        receivedStatus: detail.receivedStatus,
        receivedStatusLabel: detail.receivedStatusLabel,
        refundedStatus: detail.refundedStatus,
        refundedStatusLabel: detail.refundedStatusLabel,
      };
    });

    // Build status steps based on current status
    // Backend status flow: UNDER_REVIEW -> APPROVED -> RETURNING -> RECEIVED -> REFUNDED/COMPLETED
    // For CANCELLED status, only show reviewing step as completed
    const currentStatus = (returnOrderData.statusKey || returnOrderData.status)?.toUpperCase() || "";
    const isCancelledStatus = currentStatus === "CANCELLED";

    const statusSteps: ReturnRefundStatus[] = [
      {
        id: "reviewing",
        label: "Yêu cầu đang được xem xét",
        completed: ["UNDER_REVIEW", "PENDING", "APPROVED", "REJECTED", "RETURNING", "RECEIVED", "REFUNDED", "COMPLETED", "CANCELLED"].includes(currentStatus),
        date: createdDate,
      },
      {
        id: "accepted",
        label: "Chấp nhận yêu cầu",
        completed: !isCancelledStatus && ["APPROVED", "REJECTED", "RETURNING", "RECEIVED", "REFUNDED", "COMPLETED"].includes(currentStatus),
      },
      {
        id: "returning",
        label: "Trả hàng",
        completed: !isCancelledStatus && ["RETURNING", "RECEIVED", "REFUNDED", "COMPLETED"].includes(currentStatus),
      },
      {
        id: "checking",
        label: "Kiểm tra hàng hoàn",
        completed: !isCancelledStatus && ["RECEIVED", "REFUNDED", "COMPLETED"].includes(currentStatus),
      },
      {
        id: "refunded",
        label: "Đã hoàn tiền",
        completed: !isCancelledStatus && ["REFUNDED", "COMPLETED"].includes(currentStatus),
      },
    ];

    // Process images - convert relative paths to full URLs
    const processedImages = (returnOrderData.images || []).map((img) => {
      if (!img || img.trim() === "") return "";
      return getImageUrl(img) || img;
    }).filter((img) => img !== "");

    // Use returnReasonLabel from API, fallback to returnReason if not available
    const reasonLabel = returnOrderData.returnReasonLabel || returnOrderData.returnReason || "Không có lý do";

    return {
      orderId: returnOrderData.orderId?.toString() || "",
      requestDate: createdDate,
      status: statusLabel,
      statusMessage: statusMessage,
      products: products.length > 0 ? products : [],
      refundAmount: returnOrderData.totalRefundedAmount != null && returnOrderData.totalRefundedAmount > 0 
        ? returnOrderData.totalRefundedAmount 
        : (returnOrderData.totalReturnAmount || 0),
      totalReturnAmount: returnOrderData.totalReturnAmount || 0,
      refundedStatus: returnOrderData.refundedStatus,
      refundedStatusLabel: returnOrderData.refundedStatusLabel,
      refundMethod: returnOrderData.refundMethod,
      refundMethodLabel: returnOrderData.refundMethodLabel,
      returnOrderCode: returnOrderData.code,
      reason: reasonLabel,
      description: returnOrderData.returnReasonNote || "", // Lấy từ returnReasonNote (return_reason_note)
      images: processedImages,
      statusSteps,
      receiverName: returnOrderData.receiverName,
      receiverPhone: returnOrderData.receiverPhone,
      receiverAddress: returnOrderData.receiverAddress,
      forwardShippingStatus: returnOrderData.forwardShippingStatus,
      shippingOrderCode: returnOrderData.shippingOrderCode,
      shippingProvider: returnOrderData.shippingProvider,
      returnTypeLabel: returnOrderData.returnTypeLabel,
    };
  }, [returnOrderData]);

  // Use data from API only, no fallback to mock data
  const displayData = data;

  // Check if order is cancelled from API status, or from user action
  const currentStatus = returnOrderData?.statusKey || returnOrderData?.status || "";
  const isCancelledFromApi = currentStatus.toUpperCase() === "CANCELLED";
  const [isCancelledByUser, setIsCancelledByUser] = useState(false);
  const isCancelled = isCancelledFromApi || isCancelledByUser;

  // Handle cancel return order
  const handleCancelReturnOrder = async () => {
    if (!requestId) {
      toast.error("Không tìm thấy mã yêu cầu trả hàng");
      return;
    }

    try {
      await customerReturnOrderApi.cancelReturnOrder(requestId);
      setIsCancelledByUser(true);
      toast.success("Hủy yêu cầu trả hàng thành công");
      // Refetch data to get updated status
      window.location.reload();
    } catch (error: any) {
      console.error("Error canceling return order:", error);
      toast.error(error?.message || "Không thể hủy yêu cầu trả hàng");
    }
  };

  // Calculate stepsToRender - must be before early returns (React hooks rule)
  const stepsToRender = useMemo(() => {
    if (!displayData) {
      return [];
    }

    // If cancelled, show only reviewing step as completed + cancelled step
    if (isCancelled) {
      return [
        {
          id: "reviewing",
          label: "Yêu cầu đang được xem xét",
          completed: true,
          date: displayData.requestDate,
        },
        {
          id: "cancelled",
          label: "Yêu cầu đã được hủy",
          completed: true,
        },
      ];
    }

    return displayData.statusSteps;
  }, [displayData?.statusSteps, displayData?.requestDate, isCancelled]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e04d30] mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin yêu cầu trả hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 sm:px-6 py-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Không thể tải thông tin</h3>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải thông tin yêu cầu trả hàng"}
          </p>
          <button
            onClick={() => navigate("/user/profile/orders", { state: { activeTab: "return" } })}
            className="px-4 py-2 bg-[#E04D30] hover:bg-[#c93d24] text-white rounded-lg font-medium transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // Early return if no data
  if (!displayData) {
    return null;
  }

  const activeStatus = isCancelled ? "Yêu cầu đã được hủy" : displayData.status;
  const statusTitle =
    activeStatus === "Chấp nhận yêu cầu"
      ? "Yêu cầu đã được chấp nhận"
      : activeStatus;
  const statusAdditionalNote = (() => {
    if (activeStatus === "Chấp nhận yêu cầu") {
      return "Bạn vui lòng chọn phương thức trả hàng. Nếu không yêu cầu sẽ bị hủy tự động trong 24 giờ.";
    }
    if (activeStatus === "Trả hàng") {
      return "Đơn hàng đang được hoàn trả.";
    }
    return undefined;
  })();
  const statusMessage = isCancelled
    ? "Bạn đã hủy yêu cầu Trả hàng hoàn tiền."
    : displayData.statusMessage;
  const statusCardClasses = isCancelled
    ? "bg-[#FFF8F1] border-[#FBD1BF]"
    : "bg-white border-gray-200";
  const statusTitleClasses = isCancelled
    ? "text-[18px] font-bold text-[#E04D30]"
    : "text-[18px] font-bold text-gray-900";
  const canCancelRequest =
    ["Yêu cầu đang được xem xét", "Chấp nhận yêu cầu"].includes(activeStatus) &&
    !isCancelled;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 border-b border-gray-200 h-[60px] flex items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              // Navigate back to orders page with "return" tab active
              navigate("/user/profile/orders", {
                state: {
                  activeTab: "return",
                },
              });
            }}
            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Quay lại"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[20px] font-normal text-gray-900">
            Chi tiết yêu cầu trả hàng / hoàn tiền
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gray-50 space-y-6">
        {/* Status Timeline - same style as order detail */}
        {!isCancelled && <OrderTimeline steps={stepsToRender} />}

        {/* Current Status Box */}
        <div
          className={`rounded-lg border p-3 sm:p-4 text-[14px] space-y-3 ${statusCardClasses}`}
        >
          {/* Title + Cancel button */}
          <div className={statusTitleClasses}>{statusTitle}</div>

          {/* Description + select method */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col gap-1 text-[14px] text-gray-700 sm:flex-1">
              {statusAdditionalNote ? (
                <span className="text-[13px] text-gray-500">
                  {statusAdditionalNote}
                </span>
              ) : (
                <span className="text-[13px] text-gray-500">
                  {statusMessage}
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center sm:justify-end">
              {canCancelRequest && (
                <button
                  type="button"
                  onClick={handleCancelReturnOrder}
                  className="px-4 h-6 text-[13px] font-normal rounded-[10px] border border-[#E04D30] text-[#E04D30] bg-white hover:bg-[#E04D30] hover:text-white transition-colors w-full sm:w-auto"
                >
                  Hủy yêu cầu
                </button>
              )}
              {displayData.status === "Chấp nhận yêu cầu" && !isCancelled && (
                <button
                  type="button"
                  onClick={() => {
                    navigate(
                      `/user/profile/return-refund/${displayData.returnOrderCode || requestId}/method`,
                      {
                        state: { data: displayData },
                      }
                    );
                  }}
                  className="px-4 h-6 text-[13px] font-normal rounded-[10px] border border-[#E04D30] text-white bg-[#E04D30] hover:bg-[#c93d24] hover:border-[#c93d24] transition-colors w-full sm:w-auto sm:self-start"
                >
                  Chọn phương thức trả hàng
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tổng quan (Overview) Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-[14px]">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-[18px] font-bold text-gray-900 mb-0">
              Sản phẩm trả
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-[14px] text-gray-700 sm:justify-end sm:text-right">
              <span>Đơn hàng:</span>
              <button
                type="button"
                onClick={() => navigate(`/user/profile/orders/${displayData.orderId}`)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                #{displayData.orderId}
              </button>
              {displayData.returnOrderCode && (
                <>
                  <span className="hidden sm:inline">|</span>
                  <span className="text-gray-600">Mã yêu cầu: {displayData.returnOrderCode}</span>
                </>
              )}
              <span className="hidden sm:inline">|</span>
              <span>Đã yêu cầu lúc: {displayData.requestDate}</span>
            </div>
          </div>

          {/* Product Details */}
          {displayData.products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row gap-4 pb-4 mb-4 last:pb-0 last:mb-0 border-b border-gray-100 last:border-0"
            >
              <div className="flex-shrink-0">
                <img
                  src={product.imageUrl || "/images/placeholders/no-image.svg"}
                  alt={product.name}
                  className="w-[75px] h-[75px] rounded-lg border border-gray-300 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/placeholders/no-image.svg";
                  }}
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-[14px] font-medium text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {product.finalPrice != null && product.finalPrice > 0 ? (
                          <>
                            <span className="text-[14px] font-semibold text-gray-900">
                              {formatCurrencyVND(product.finalPrice)}
                            </span>
                            {product.originalPrice != null && product.originalPrice > 0 && product.originalPrice > product.finalPrice && (
                              <span className="text-[12px] text-gray-500 line-through">
                                {formatCurrencyVND(product.originalPrice)}
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {product.price != null && product.price > 0 && (
                              <span className="text-[14px] font-semibold text-gray-900">
                                {formatCurrencyVND(product.price)}
                              </span>
                            )}
                            {product.originalPrice != null && product.originalPrice > 0 && product.originalPrice > product.price && (
                              <span className="text-[12px] text-gray-500 line-through">
                                {formatCurrencyVND(product.originalPrice)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      {product.variant && (
                        <span className="inline-block px-2 py-1 rounded bg-gray-100 text-[12px] text-gray-600">
                          {product.variant}
                        </span>
                      )}
                      {product.quantity != null && product.quantity > 0 && (
                        <span className="text-[12px] text-gray-600 bg-gray-100 px-2 py-1 rounded font-medium">
                          x{product.quantity}
                        </span>
                      )}
                    </div>
                    {product.sku && (
                      <div className="flex items-center gap-2 text-[12px] text-gray-500">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>SKU: {product.sku}</span>
                      </div>
                    )}
                    {product.totalReturnPrice != null && product.totalReturnPrice > 0 && (
                      <div className="mt-2 text-[13px] text-gray-700">
                        <span className="font-medium">Tổng tiền trả ({product.quantity} sản phẩm): </span>
                        <span className="font-semibold text-red-600">
                          {formatCurrencyVND(product.totalReturnPrice)}
                        </span>
                      </div>
                    )}
                    {/* Status Information */}
                    {(product.receivedStatusLabel || product.refundedStatusLabel) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                        {product.receivedStatusLabel && (
                          <div className="flex items-center gap-2 text-[12px]">
                            <span className="text-gray-600">Trạng thái nhận hàng:</span>
                            <span className="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 font-medium">
                              {product.receivedStatusLabel}
                            </span>
                          </div>
                        )}
                        {product.refundedStatusLabel && (
                          <div className="flex items-center gap-2 text-[12px]">
                            <span className="text-gray-600">Trạng thái hoàn tiền:</span>
                            <span className="inline-block px-2 py-1 rounded bg-green-50 text-green-700 font-medium">
                              {product.refundedStatusLabel}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Total Return Amount Summary */}
          {displayData.totalReturnAmount != null && displayData.totalReturnAmount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-[14px] font-semibold text-gray-900">
                  Tổng số tiền trả hàng:
                </span>
                <span className="text-[16px] font-bold text-red-600">
                  {formatCurrencyVND(displayData.totalReturnAmount)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Refund Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-[14px]">
          <h2 className="text-[18px] font-bold text-gray-900 mb-4">
            Thông tin hoàn tiền
          </h2>
          <div className="space-y-3">
            {displayData.totalReturnAmount != null && displayData.totalReturnAmount > 0 && (
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-[14px] text-gray-700">
                  Tổng số tiền trả hàng
                </span>
                <span className="text-[14px] font-semibold text-gray-900">
                  {formatCurrencyVND(displayData.totalReturnAmount)}
                </span>
              </div>
            )}
            {displayData.refundAmount != null && displayData.refundAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-gray-700">
                  Số tiền đã hoàn nhận được
                </span>
                <span className="text-[14px] font-semibold text-red-600">
                  {formatCurrencyVND(displayData.refundAmount)}
                </span>
              </div>
            )}
            {displayData.refundedStatusLabel && (
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-gray-700">Trạng thái hoàn tiền</span>
                <span className="text-[14px] text-gray-900">{displayData.refundedStatusLabel}</span>
              </div>
            )}
            {displayData.refundMethodLabel && (
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-gray-700">Phương thức hoàn tiền</span>
                <span className="text-[14px] text-gray-900">{displayData.refundMethodLabel}</span>
              </div>
            )}
            {displayData.returnTypeLabel && (
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-gray-700">Loại yêu cầu</span>
                <span className="text-[14px] text-gray-900">{displayData.returnTypeLabel}</span>
              </div>
            )}
          </div>
        </div>

        {/* Receiver and Shipping Information */}
        {(displayData.receiverName || displayData.receiverPhone || displayData.receiverAddress || 
          displayData.forwardShippingStatus || displayData.shippingOrderCode || displayData.shippingProvider) && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-[14px]">
            <h2 className="text-[18px] font-bold text-gray-900 mb-4">
              Thông tin người nhận & vận chuyển
            </h2>
            <div className="space-y-3">
              {displayData.receiverName && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-gray-700">Người nhận</span>
                  <span className="text-[14px] text-gray-900 font-medium">{displayData.receiverName}</span>
                </div>
              )}
              {displayData.receiverPhone && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-gray-700">Số điện thoại</span>
                  <span className="text-[14px] text-gray-900">{displayData.receiverPhone}</span>
                </div>
              )}
              {displayData.receiverAddress && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <span className="text-[14px] text-gray-700">Địa chỉ nhận hàng</span>
                  <span className="text-[14px] text-gray-900 text-right sm:text-left sm:flex-1 sm:ml-4">
                    {displayData.receiverAddress}
                  </span>
                </div>
              )}
              {displayData.forwardShippingStatus && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-[14px] text-gray-700">Trạng thái vận chuyển</span>
                  <span className="text-[14px] text-gray-900 font-medium">
                    {formatShippingStatus(displayData.forwardShippingStatus)}
                  </span>
                </div>
              )}
              {displayData.shippingProvider && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-gray-700">Đơn vị vận chuyển</span>
                  <span className="text-[14px] text-gray-900">{displayData.shippingProvider}</span>
                </div>
              )}
              {displayData.shippingOrderCode && (
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-gray-700">Mã vận đơn</span>
                  <span className="text-[14px] text-gray-900 font-medium">{displayData.shippingOrderCode}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reason and Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-[14px]">
          <h2 className="text-[18px] font-bold text-gray-900 mb-4">
            Lý do trả hàng
          </h2>

          {/* Loại lý do (enum reason) */}
          {displayData.reason && displayData.reason !== "Không có lý do" && (
            <div className="mb-4">
              <div className="text-[14px] font-semibold text-gray-700 mb-2">
                Loại lý do:
              </div>
              <div className="text-[14px] text-gray-900">
                {displayData.reason}
              </div>
            </div>
          )}

          {/* Lý do chi tiết (notes) */}
          <div className="mb-4">
            <div className="text-[14px] font-semibold text-gray-700 mb-2">
              Lý do chi tiết:
            </div>
            <p className="text-[14px] text-gray-700 whitespace-pre-line">
              {displayData.description || "Không có mô tả chi tiết"}
            </p>
          </div>

          {/* Images */}
          {displayData.images && displayData.images.length > 0 && (
            <div className="mt-4">
              <div className="text-[14px] font-semibold text-gray-700 mb-2">
                Hình ảnh minh chứng:
              </div>
              <div className="flex flex-wrap gap-3">
                {displayData.images.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl || "/images/placeholders/no-image.svg"}
                    alt={`Return evidence ${index + 1}`}
                    className="w-[60px] h-[60px] rounded border border-gray-300 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/placeholders/no-image.svg";
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundDetail;
