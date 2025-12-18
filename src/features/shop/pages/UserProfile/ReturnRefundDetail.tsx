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

interface ProductType {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  originalPrice?: number;
  variant?: string;
  quantity: number;
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
  bankInfo: string;
  returnOrderCode?: string;
  reason: string;
  description: string;
  images: string[];
  statusSteps: ReturnRefundStatus[];
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

  // Map return order status to Vietnamese label
  const mapReturnOrderStatus = (status?: string | null): { label: string; message: string } => {
    if (!status) {
      return { label: "Đang xử lý", message: "Yêu cầu đang được xử lý" };
    }
    const normalized = status.toUpperCase();
    const statusMap: Record<string, { label: string; message: string }> = {
      "UNDER_REVIEW": {
        label: "Yêu cầu đang được xem xét",
        message: "Shop đang xem xét yêu cầu trả hàng & hoàn tiền của bạn",
      },
      "APPROVED": {
        label: "Chấp nhận yêu cầu",
        message: "Yêu cầu của bạn đã được chấp nhận",
      },
      "REJECTED": {
        label: "Từ chối yêu cầu",
        message: "Yêu cầu của bạn đã bị từ chối",
      },
      "RETURNING": {
        label: "Đang trả hàng",
        message: "Đơn hàng đang được hoàn trả",
      },
      "RETURNED": {
        label: "Đã trả hàng",
        message: "Hàng đã được trả về",
      },
      "RECEIVED": {
        label: "Đã nhận hàng hoàn",
        message: "Shop đã nhận được hàng hoàn",
      },
      "REFUNDED": {
        label: "Đã hoàn tiền",
        message: "Tiền đã được hoàn trả",
      },
      "CANCELLED": {
        label: "Đã hủy",
        message: "Yêu cầu đã được hủy",
      },
    };
    return statusMap[normalized] || { label: "Đang xử lý", message: "Yêu cầu đang được xử lý" };
  };

  // Map return reason value to Vietnamese label
  const mapReturnReason = (reason?: string | null): string => {
    if (!reason) {
      return "Không có lý do";
    }
    const normalized = reason.toLowerCase().replace(/_/g, '-');
    const reasonMap: Record<string, string> = {
      "empty-package": "Thùng hàng rỗng",
      "not-received": "Chưa nhận được hàng",
      "broken": "Bể vỡ",
      "wrong-model": "Sai mẫu",
      "defective": "Hàng lỗi",
      "different-description": "Khác mô tả",
      "wrong-size": "Không đúng kích thước",
      "wrong-color": "Không đúng màu sắc",
      "not-fit": "Không vừa",
      "expired": "Hàng hết hạn",
      "damaged": "Hàng bị hư hỏng",
      "missing-parts": "Thiếu phụ kiện",
      "other": "Lý do khác",
    };
    return reasonMap[normalized] || reason;
  };

  // Map return order data to component format
  const data = useMemo<ReturnRefundDetailData | null>(() => {
    if (!returnOrderData) return null;

    const statusInfo = mapReturnOrderStatus(returnOrderData.status);
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
        price: detail.returnPrice || detail.totalReturnPrice || 0,
        originalPrice: detail.snapshotProductPrice,
        variant,
        quantity: detail.returnQuantity || 1,
      };
    });

    // Build status steps based on current status
    const statusSteps: ReturnRefundStatus[] = [
      {
        id: "reviewing",
        label: "Yêu cầu đang được xem xét",
        completed: ["UNDER_REVIEW", "APPROVED", "REJECTED", "RETURNING", "RETURNED", "RECEIVED", "REFUNDED", "CANCELLED"].includes(returnOrderData.status?.toUpperCase() || ""),
        date: createdDate,
      },
      {
        id: "accepted",
        label: "Chấp nhận yêu cầu",
        completed: ["APPROVED", "REJECTED", "RETURNING", "RETURNED", "RECEIVED", "REFUNDED"].includes(returnOrderData.status?.toUpperCase() || ""),
      },
      {
        id: "returning",
        label: "Trả hàng",
        completed: ["RETURNING", "RETURNED", "RECEIVED", "REFUNDED"].includes(returnOrderData.status?.toUpperCase() || ""),
      },
      {
        id: "checking",
        label: "Kiểm tra hàng hoàn",
        completed: ["RECEIVED", "REFUNDED"].includes(returnOrderData.status?.toUpperCase() || ""),
      },
      {
        id: "refunded",
        label: "Đã hoàn tiền",
        completed: returnOrderData.status?.toUpperCase() === "REFUNDED",
      },
    ];

    // Process images - convert relative paths to full URLs
    const processedImages = (returnOrderData.images || []).map((img) => {
      if (!img || img.trim() === "") return "";
      return getImageUrl(img) || img;
    }).filter((img) => img !== "");

    // Map reason to Vietnamese label
    const rawReason = returnOrderData.returnReason || (returnOrderData as any).reason || "";
    const mappedReason = mapReturnReason(rawReason);

    return {
      orderId: returnOrderData.orderId?.toString() || "",
      requestDate: createdDate,
      status: statusInfo.label,
      statusMessage: statusInfo.message,
      products: products.length > 0 ? products : [],
      refundAmount: returnOrderData.totalRefundedAmount || returnOrderData.totalReturnAmount || 0,
      bankInfo: "Thông tin ngân hàng sẽ được cập nhật", // TODO: Get from user profile or order
      returnOrderCode: returnOrderData.code,
      reason: mappedReason,
      description: returnOrderData.returnReasonNote || returnOrderData.notes || "",
      images: processedImages,
      statusSteps,
    };
  }, [returnOrderData]);

  // Use data from API only, no fallback to mock data
  const displayData = data;
  const [isCancelled, setIsCancelled] = useState(false);

  // Handle cancel return order
  const handleCancelReturnOrder = async () => {
    if (!requestId) {
      toast.error("Không tìm thấy mã yêu cầu trả hàng");
      return;
    }

    try {
      await customerReturnOrderApi.cancelReturnOrder(requestId);
      setIsCancelled(true);
      toast.success("Hủy yêu cầu trả hàng thành công");
    } catch (error: any) {
      console.error("Error canceling return order:", error);
      toast.error(error?.message || "Không thể hủy yêu cầu trả hàng");
    }
  };

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

  const stepsToRender = useMemo(() => {
    if (!isCancelled) {
      return displayData.statusSteps;
    }

    return [
      ...displayData.statusSteps.map((step) => ({
        ...step,
        completed: step.id === "reviewing",
      })),
      {
        id: "cancelled",
        label: "Yêu cầu đã được hủy",
        completed: true,
      },
    ];
  }, [displayData.statusSteps, isCancelled]);

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
              className="flex flex-col sm:flex-row gap-4 pb-4 last:pb-0"
            >
              <div className="flex-shrink-0">
                <img
                  src={product.imageUrl || "/images/placeholders/no-image.svg"}
                  alt={product.name}
                  className="w-[60px] h-[60px] rounded-lg border border-gray-300 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/placeholders/no-image.svg";
                  }}
                />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-[14px] font-medium text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[14px] font-semibold text-gray-900">
                        {formatCurrencyVND(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[12px] text-gray-500 line-through">
                          {formatCurrencyVND(product.originalPrice)}
                        </span>
                      )}
                      {product.variant && (
                        <span className="inline-block px-3 py-1 rounded-lg bg-gray-100 text-[12px] text-gray-600">
                          {product.variant}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[14px] text-gray-700">
                    Số lượng: {product.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Refund Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-[14px]">
          <h2 className="text-[18px] font-bold text-gray-900 mb-4">
            Thông tin hoàn tiền
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-gray-700">
                Số tiền hoàn nhận được
              </span>
              <span className="text-[14px] font-semibold text-red-600">
                {formatCurrencyVND(displayData.refundAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-gray-700">Hoàn tiền vào</span>
              <span className="text-[14px] text-gray-900">{displayData.bankInfo}</span>
            </div>
          </div>
        </div>

        {/* Reason and Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-[14px]">
          <h2 className="text-[18px] font-bold text-gray-900 mb-3">
            Lý do: {displayData.reason}
          </h2>
          <div className="border-b border-gray-200 mb-4" />
          <p className="text-[14px] text-gray-700 mb-4 whitespace-pre-line">
            {displayData.description || "Không có mô tả"}
          </p>
          {displayData.images && displayData.images.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundDetail;
