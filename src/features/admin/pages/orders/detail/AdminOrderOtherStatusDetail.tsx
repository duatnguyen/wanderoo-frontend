import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ClipboardCopy, Package, RefreshCw, CheckCircle, XCircle, Clock, Truck, FileText, User, Calendar, AlertTriangle, CreditCard, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { PageContainer, ContentCard } from "@/components/common";
import { ChipStatus } from "@/components/ui/chip-status";
import { getImageUrl } from "@/utils/imageUtils";
import apiClient from "@/api/apiClient";

// API Response interface matching backend ReturnOrderResponseDTO
interface ApiReturnOrderResponse {
  id: number;
  code: string;
  orderId: number;
  userId: number;
  picId?: number;
  status: string; // Raw status from DB
  statusKey?: string; // Mapped status key (UNDER_REVIEW, RETURNING, COMPLETED, INVALID)
  statusLabel?: string; // Mapped status label in Vietnamese
  returnReason?: string; // Raw return reason enum name
  returnReasonLabel?: string; // Mapped return reason description in Vietnamese
  returnReasonNote?: string;
  notes?: string;
  returnType?: string; // Raw return type from DB
  returnTypeLabel?: string; // Mapped return type label in Vietnamese
  category?: string; // Mapped category (RETURN, CANCEL, FAILED)
  totalProductAmount?: number;
  shippingFee?: number;
  totalRefundedAmount?: number;
  totalReturnAmount?: number;
  createdDate?: string;
  updatedDate?: string;
  images?: string[];
  receiverName?: string; // From orders.receiver_name
  receiverPhone?: string; // From orders.receiver_phone
  receiverAddress?: string; // From orders.receiver_address
  forwardShippingStatus?: string; // From orders.shipping_status
  shippingOrderCode?: string; // From orders.shipping_order_code
  shippingProvider?: string; // From orders.shipping_provider
  returnOrderDetails?: Array<{
    id: number;
    returnOrderId: number;
    productDetailId?: number;
    orderDetailId?: number;
    returnQuantity: number;
    returnQuantityField?: number;
    quantityReceived?: number;
    receivedStatus?: string;
    refundedStatus?: string;
    refundedAmount?: number;
    notes?: string;
    returnPrice?: number;
    totalReturnPrice?: number;
    snapshotProductName?: string;
    snapshotProductPrice?: number;
    snapshotProductSku?: string;
    snapshotProductImageUrl?: string;
    snapshotVariantAttributes?: string;
    createdDate?: string;
    updatedDate?: string;
  }>;
}

// Define types for ReturnOrder from the list page
type ReturnOrderCategory = "RETURN" | "CANCEL" | "FAILED";
type ReturnOrderStatus = "UNDER_REVIEW" | "RETURNING" | "COMPLETED" | "INVALID";
type RefundStatus = "WAITING" | "PARTIAL" | "DONE";

interface ReturnOrder {
  id: string;
  orderCode: string;
  createdAt: string;
  receiverName?: string; // From orders.receiver_name
  receiverPhone?: string; // From orders.receiver_phone
  receiverAddress?: string; // From orders.receiver_address
  customerId: string;
  customerName: string;
  customerUsername: string;
  productName: string;
  productVariant?: string;
  productImage?: string;
  totalAmount: number;
  paymentMethod: string;
  reason: string; // Keep for backward compatibility
  returnReason?: string; // Raw enum name
  returnReasonLabel?: string; // Mapped return reason description in Vietnamese
  returnReasonNote?: string; // Lý do chi tiết (return_reason_note)
  buyerOptions: string[];
  statusLabel: string;
  statusKey: ReturnOrderStatus;
  resolutionNote: string;
  forwardShippingStatus: string;
  returnShippingStatus: string;
  shippingOrderCode?: string; // From orders.shipping_order_code
  shippingProvider?: string; // From orders.shipping_provider
  refundStatus: RefundStatus;
  refundStatusLabel: string;
  source: "Website" | "POS";
  category: ReturnOrderCategory;
  returnTypeLabel?: string; // Mapped return type label in Vietnamese
  sourceNote?: string;
  images?: string[]; // Images array from JSON
}



const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const formatCurrency = (value: number) =>
  currencyFormatter.format(value).replace(" ₫", "₫");

// Map status from backend to frontend status key
const mapStatusToStatusKey = (status?: string): ReturnOrderStatus => {
  if (!status) return "UNDER_REVIEW";
  const normalized = status.toUpperCase();
  if (normalized === "PENDING" || normalized === "WAITING_APPROVAL" || normalized === "UNDER_REVIEW") {
    return "UNDER_REVIEW";
  }
  if (normalized === "APPROVED" || normalized === "IN_TRANSIT" || normalized === "RETURNING") {
    return "RETURNING";
  }
  if (normalized === "COMPLETED" || normalized === "REFUNDED") {
    return "COMPLETED";
  }
  if (normalized === "REJECTED" || normalized === "CANCELLED" || normalized === "EXPIRED" || normalized === "INVALID") {
    return "INVALID";
  }
  return "UNDER_REVIEW";
};

// Map status to label
const mapStatusToLabel = (status?: string): string => {
  if (!status) return "Đang xem xét";
  const normalized = status.toUpperCase();
  const statusMap: Record<string, string> = {
    "PENDING": "Chờ xử lý",
    "WAITING_APPROVAL": "Chờ phê duyệt",
    "UNDER_REVIEW": "Đang chờ xét duyệt",
    "APPROVED": "Đã chấp nhận",
    "IN_TRANSIT": "Đang vận chuyển",
    "RETURNING": "Đang trả hàng",
    "COMPLETED": "Hoàn thành",
    "REFUNDED": "Đã hoàn tiền",
    "REJECTED": "Đã từ chối",
    "CANCELLED": "Đã hủy",
    "EXPIRED": "Đã hết hạn",
    "INVALID": "Yêu cầu bị huỷ/không hợp lệ",
  };
  return statusMap[normalized] || "Đang xem xét";
};

// Map return type to category
const mapReturnTypeToCategory = (returnType?: string): ReturnOrderCategory => {
  if (!returnType) return "RETURN";
  const normalized = returnType.toUpperCase();
  if (normalized === "RETURN" || normalized === "EXCHANGE") {
    return "RETURN";
  }
  if (normalized === "CANCEL" || normalized === "CANCELLATION") {
    return "CANCEL";
  }
  if (normalized === "FAILED_DELIVERY" || normalized === "DELIVERY_FAILED") {
    return "FAILED";
  }
  return "RETURN";
};

// Map refund status
const mapRefundStatus = (status?: string): RefundStatus => {
  if (!status) return "WAITING";
  const normalized = status.toUpperCase();
  if (normalized === "PENDING" || normalized === "WAITING_APPROVAL" || normalized === "APPROVED" || normalized === "IN_TRANSIT" || normalized === "RETURNING") {
    return "WAITING";
  }
  if (normalized === "PARTIALLY_REFUNDED") {
    return "PARTIAL";
  }
  if (normalized === "COMPLETED" || normalized === "REFUNDED") {
    return "DONE";
  }
  return "WAITING";
};


// Map API ReturnOrderResponseDTO to component ReturnOrder format
const mapApiResponseToReturnOrder = (apiResponse: ApiReturnOrderResponse): ReturnOrder => {
  const firstDetail = apiResponse.returnOrderDetails?.[0];

  // Parse variant attributes
  let productVariant: string | undefined;
  if (firstDetail?.snapshotVariantAttributes) {
    try {
      const attrs = typeof firstDetail.snapshotVariantAttributes === 'string'
        ? JSON.parse(firstDetail.snapshotVariantAttributes)
        : firstDetail.snapshotVariantAttributes;
      if (Array.isArray(attrs)) {
        productVariant = attrs.map((attr: any) => {
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

  // Use mapped values from backend
  const statusKey = (apiResponse.statusKey || mapStatusToStatusKey(apiResponse.status)) as ReturnOrderStatus;
  const refundStatus = mapRefundStatus(apiResponse.status);

  return {
    id: apiResponse.id?.toString() || apiResponse.code || "",
    orderCode: apiResponse.code || "",
    createdAt: apiResponse.createdDate ? new Date(apiResponse.createdDate).toLocaleString("vi-VN") : "",
    customerId: apiResponse.userId?.toString() || "",
    customerName: "", // Will need to fetch from order if needed
    customerUsername: "", // Will need to fetch from order if needed
    receiverName: apiResponse.receiverName || "", // From orders.receiver_name
    receiverPhone: apiResponse.receiverPhone || "", // From orders.receiver_phone
    receiverAddress: apiResponse.receiverAddress || "", // From orders.receiver_address
    productName: firstDetail?.snapshotProductName || "Sản phẩm không tên",
    productVariant,
    productImage: firstDetail?.snapshotProductImageUrl ? getImageUrl(firstDetail.snapshotProductImageUrl) : undefined,
    totalAmount: apiResponse.totalReturnAmount || apiResponse.totalProductAmount || 0,
    paymentMethod: "BANKING", // Default, would need to get from order
    reason: apiResponse.returnReasonNote || "", // Keep for backward compatibility
    returnReason: apiResponse.returnReason || "", // Raw enum name
    returnReasonLabel: apiResponse.returnReasonLabel || "", // Mapped from backend
    returnReasonNote: apiResponse.returnReasonNote || "", // Lý do chi tiết
    buyerOptions: ["Trả hàng & hoàn tiền"], // Default
    statusLabel: apiResponse.statusLabel || mapStatusToLabel(apiResponse.status), // Use mapped from backend, fallback to frontend map
    statusKey,
    resolutionNote: apiResponse.notes || "",
    returnTypeLabel: apiResponse.returnTypeLabel || "", // Mapped from backend
    forwardShippingStatus: apiResponse.forwardShippingStatus || "", // From orders.shipping_status
    returnShippingStatus: "", // Will be set from backend if available
    shippingOrderCode: apiResponse.shippingOrderCode, // From orders.shipping_order_code
    shippingProvider: apiResponse.shippingProvider, // From orders.shipping_provider
    refundStatus,
    refundStatusLabel: refundStatus === "WAITING" ? "Chờ hoàn tiền" : refundStatus === "PARTIAL" ? "Hoàn tiền 1 phần" : "Đã hoàn tiền",
    source: "Website", // Default, would need to get from order
    category: (apiResponse.category || mapReturnTypeToCategory(apiResponse.returnType)) as ReturnOrderCategory, // Use mapped from backend, fallback to frontend map
    sourceNote: undefined,
    images: apiResponse.images?.map(img => getImageUrl(img)).filter((img): img is string => Boolean(img)) || [],
  };
};

const AdminOrderOtherStatusDetail = () => {
  document.title = "Chi tiết yêu cầu trả hàng | Wanderoo";
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ orderId: string }>();
  const [copied, setCopied] = useState(false);
  const [isProductExpanded, setIsProductExpanded] = useState(true);

  // Get returnOrderCode from URL params (orderId is actually returnOrderCode)
  const returnOrderCode = params.orderId;

  // Fetch return order detail from API
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useQuery<ApiReturnOrderResponse>({
    queryKey: ["return-order-detail", returnOrderCode],
    queryFn: async () => {
      if (!returnOrderCode) {
        throw new Error("Return order code is required");
      }
      const response = await apiClient.get<{ status: number; message: string; data: ApiReturnOrderResponse }>(
        `/auth/v1/private/return-orders/${returnOrderCode}`
      );
      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch return order detail');
      }
    },
    enabled: !!returnOrderCode,
    staleTime: 60 * 1000, // 1 minute
  });

  // Map API data to component format
  const orderFromState = (location.state as { fakeOrder?: ReturnOrder })
    ?.fakeOrder;
  const order = useMemo(() => {
    // Prefer API data, fallback to state data
    if (apiResponse) {
      const mappedOrder = mapApiResponseToReturnOrder(apiResponse);
      // returnShippingStatus will be set from backend if available
      if (!mappedOrder.returnShippingStatus) {
        mappedOrder.returnShippingStatus = "Chưa có thông tin";
      }
      return mappedOrder;
    }
    return orderFromState;
  }, [apiResponse, orderFromState]);

  const statusBannerStyle = useMemo(() => {
    if (!order) {
      return {
        border: "border-[#e5e5e5]",
        bg: "bg-[#fbfbfb]",
        heading: "text-[#272424]",
      };
    }
    switch (order.statusKey) {
      case "UNDER_REVIEW":
        return {
          border: "border-[#f6d7a6]",
          bg: "bg-[#fff9f0]",
          heading: "text-[#b5721f]",
        };
      case "RETURNING":
        return {
          border: "border-[#c3e6cb]",
          bg: "bg-[#f2fff4]",
          heading: "text-[#1a7a33]",
        };
      case "COMPLETED":
        return {
          border: "border-[#b8daff]",
          bg: "bg-[#f1f8ff]",
          heading: "text-[#0f62c0]",
        };
      case "INVALID":
        return {
          border: "border-[#f5c2c7]",
          bg: "bg-[#fff5f5]",
          heading: "text-[#c11f2f]",
        };
      default:
        return {
          border: "border-[#e5e5e5]",
          bg: "bg-[#fbfbfb]",
          heading: "text-[#272424]",
        };
    }
  }, [order]);

  const handleCopyBankInfo = async () => {
    if (!order) return;
    // Mock bank info for demo
    const payload = [
      `Mã đơn hàng: ${order.orderCode}`,
      `Khách hàng: ${order.customerName}`,
      `Số tiền hoàn: ${formatCurrency(order.totalAmount)}`,
      `Phương thức thanh toán: ${order.paymentMethod}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Clipboard error:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <PageContainer className="flex flex-col gap-6">
        <ContentCard className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e04d30] mb-4"></div>
          <p className="text-[18px] font-semibold text-[#272424]">
            Đang tải thông tin đơn trả hàng...
          </p>
        </ContentCard>
      </PageContainer>
    );
  }

  // Error state
  if (isError || !order) {
    return (
      <PageContainer className="flex flex-col gap-6">
        <ContentCard className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-[18px] font-semibold text-[#272424]">
            {isError ? "Không thể tải thông tin đơn trả hàng" : "Không tìm thấy yêu cầu"}
          </p>
          <p className="text-[13px] text-[#737373] max-w-[480px]">
            {isError
              ? (error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.")
              : "Vui lòng quay lại danh sách đơn trạng thái khác và chọn lại yêu cầu."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-[10px] bg-[#272424] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[#1a1a1a] transition-colors"
          >
            Quay lại
          </button>
        </ContentCard>
      </PageContainer>
    );
  }

  const preferredResolution = order.buyerOptions[0] || "Trả hàng & hoàn tiền";

  return (
    <PageContainer>
      <div className="flex flex-col gap-[10px] items-center w-full">
        {/* Header */}
        <div className="flex flex-col gap-[8px] items-start justify-center w-full">
          <div className="flex gap-[4px] items-center">
            <button
              onClick={() => navigate(-1)}
              className="relative shrink-0 size-[24px] flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-[#737373]" />
            </button>
            <h1 className="font-montserrat font-bold text-[#272424] text-[24px] leading-[1.5] whitespace-nowrap">
              Chi tiết yêu cầu trả hàng
            </h1>
          </div>
        </div>

        {/* Status Cards */}
        <ContentCard>
          <div className="flex flex-col lg:flex-row gap-[16px] w-full mb-6">
            {/* Return Status Card */}
            <div className="flex-1 min-w-0">
              <div
                className={`${statusBannerStyle.bg} border-2 border-opacity-20 box-border flex gap-[12px] items-center p-[16px] relative rounded-[12px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-white bg-opacity-80 rounded-full">
                  {order.statusKey === "UNDER_REVIEW" ? (
                    <Clock className="w-5 h-5 text-[#b5721f]" />
                  ) : order.statusKey === "RETURNING" ? (
                    <RotateCcw className="w-5 h-5 text-[#1a7a33]" />
                  ) : order.statusKey === "COMPLETED" ? (
                    <CheckCircle className="w-5 h-5 text-[#0f62c0]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#c11f2f]" />
                  )}
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[14px] text-black text-opacity-70 leading-[1.4]">
                    Trạng thái yêu cầu
                  </p>
                  <p className={`font-montserrat font-bold ${statusBannerStyle.heading} text-[18px] leading-[1.2] truncate`}>
                    {order.statusLabel}
                  </p>
                </div>
              </div>
            </div>

            {/* Category Card */}
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 box-border flex gap-[12px] items-center p-[16px] relative rounded-[12px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full shadow-sm">
                  {order.category === "RETURN" ? (
                    <Package className="w-5 h-5 text-purple-600" />
                  ) : order.category === "CANCEL" ? (
                    <XCircle className="w-5 h-5 text-purple-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[14px] text-purple-700 leading-[1.4]">
                    Loại yêu cầu
                  </p>
                  <p className="font-montserrat font-bold text-purple-800 text-[18px] leading-[1.2] truncate">
                    {order.returnTypeLabel || (order.category === "RETURN" ? "Trả hàng" : order.category === "CANCEL" ? "Hủy đơn" : "Giao thất bại")}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Code Card */}
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 box-border flex gap-[12px] items-center p-[16px] relative rounded-[12px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full shadow-sm">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[14px] text-orange-700 leading-[1.4]">
                    Mã đơn hàng
                  </p>
                  <p className="font-montserrat font-bold text-orange-800 text-[18px] leading-[1.2] truncate font-mono">
                    #{order.orderCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Return Information Section */}
          <div className="bg-gradient-to-br from-[#fafafa] to-white border border-[#e7e7e7] box-border relative rounded-[12px] w-full overflow-hidden min-w-0 shadow-sm transition-all duration-200 mb-6">
            {/* Collapsed View Header */}
            <button
              onClick={() => setIsProductExpanded(!isProductExpanded)}
              className="w-full px-4 py-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-[#272424] rounded-t-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-expanded={isProductExpanded}
              aria-label={isProductExpanded ? "Thu gọn thông tin sản phẩm" : "Mở rộng thông tin sản phẩm"}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-montserrat font-semibold text-sm text-[#272424] leading-tight truncate">
                      Sản phẩm trả hàng
                    </p>
                    <p className="font-montserrat font-bold text-base text-purple-600 leading-tight truncate">
                      {order.productName}
                    </p>
                  </div>
                </div>

                {/* Product Info Badges */}
                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Desktop: Horizontal badges */}
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-indigo-700 bg-indigo-50 border-indigo-200">
                      <Package className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-montserrat font-semibold text-[10px] text-indigo-700 whitespace-nowrap">
                        Số lượng: 1
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-green-700 bg-green-50 border-green-200">
                      <CreditCard className="w-3.5 h-3.5 text-green-600" />
                      <span className="font-montserrat font-semibold text-[10px] text-green-700 whitespace-nowrap">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Mobile: Horizontal compact badges */}
                  <div className="flex sm:hidden items-center gap-1.5 flex-1">
                    <div className="flex items-center gap-1 px-2 py-1 rounded border text-indigo-700 bg-indigo-50 border-indigo-200 flex-1 justify-center">
                      <Package className="w-3 h-3 text-indigo-600" />
                      <span className="font-montserrat font-semibold text-[10px] text-indigo-700 truncate">
                        SL: 1
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded border text-green-700 bg-green-50 border-green-200 flex-1 justify-center">
                      <CreditCard className="w-3 h-3 text-green-600" />
                      <span className="font-montserrat font-semibold text-[10px] text-green-700 truncate">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Chevron Icon */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isProductExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                    )}
                  </div>
                </div>
              </div>
            </button>

            {/* Expanded View - Product Details */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isProductExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="px-4 sm:px-6 py-4 bg-[#fafbfc]">
                {/* Product Card */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100 box-border flex gap-[16px] items-center p-[20px] relative rounded-[12px] w-full overflow-hidden shadow-sm mb-4">
                  {/* Product Image */}
                  <div className="flex items-center justify-center w-[80px] h-[80px] bg-white rounded-[12px] shadow-sm shrink-0 overflow-hidden border-2 border-indigo-200">
                    {order.productImage ? (
                      <img
                        src={order.productImage}
                        alt={order.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-indigo-400" />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col gap-[8px] flex-1 min-w-0">
                    <div className="flex flex-col gap-[4px]">
                      <p className="font-montserrat font-bold text-[16px] text-indigo-800 leading-[1.4] truncate">
                        {order.productName}
                      </p>
                      {order.productVariant && (
                        <p className="font-montserrat font-medium text-[12px] text-indigo-600 leading-[1.4]">
                          Phân loại: {order.productVariant}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                        <span className="text-[12px] font-medium text-indigo-700">
                          Số lượng: 1
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-[12px] font-medium text-purple-700">
                          Giá trị: {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Product Status Badge */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 rounded-full">
                        <span className="text-[11px] font-semibold text-orange-700 uppercase tracking-wide">
                          Sản phẩm trả hàng
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-20"></div>
                  </div>
                  <div className="absolute bottom-4 right-6">
                    <div className="w-4 h-4 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-30"></div>
                  </div>
                </div>

                {/* Additional Product Information */}
                <div className="space-y-2">
                  <h3 className="font-montserrat font-semibold text-[14px] text-gray-800 mb-3">
                    Thông tin chi tiết
                  </h3>

                  <div className="space-y-1.5">
                    {/* Condition Note */}
                    <div className="flex items-center justify-between py-2 px-2 rounded-md transition-colors duration-150 bg-white/60 hover:bg-white border border-transparent hover:border-gray-200">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-[16px] w-[16px] text-[#1976d2]" />
                        <span className="font-montserrat font-medium text-[13px] text-gray-700">
                          Tình trạng sản phẩm
                        </span>
                      </div>
                      <span className="font-montserrat font-semibold text-sm text-blue-600">
                        Cần kiểm tra khi nhận hàng
                      </span>
                    </div>

                    {/* Return Method */}
                    <div className="flex items-center justify-between py-2 px-2 rounded-md transition-colors duration-150 bg-white/60 hover:bg-white border border-transparent hover:border-gray-200">
                      <div className="flex items-center gap-3">
                        <RotateCcw className="h-[16px] w-[16px] text-[#7b1fa2]" />
                        <span className="font-montserrat font-medium text-[13px] text-gray-700">
                          Phương thức trả hàng
                        </span>
                      </div>
                      <span className="font-montserrat font-semibold text-sm text-purple-600">
                        Gửi qua đơn vị vận chuyển
                      </span>
                    </div>

                    {/* Return Category */}
                    <div className="flex items-center justify-between py-2 px-2 rounded-md transition-colors duration-150 bg-white/60 hover:bg-white border border-transparent hover:border-gray-200">
                      <div className="flex items-center gap-3">
                        <FileText className="h-[16px] w-[16px] text-[#dc3545]" />
                        <span className="font-montserrat font-medium text-[13px] text-gray-700">
                          Loại yêu cầu
                        </span>
                      </div>
                      <span className="font-montserrat font-semibold text-sm text-red-600">
                        {order.returnTypeLabel || (order.category === "RETURN" ? "Trả hàng" : order.category === "CANCEL" ? "Hủy đơn" : "Giao thất bại")}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="flex items-center justify-between py-3 px-4 mt-4 border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-[10px] shadow-sm">
                    <span className="font-montserrat font-bold text-[14px] text-gray-800">
                      Tổng giá trị sản phẩm
                    </span>
                    <span className="font-montserrat font-bold text-[16px] text-purple-600">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Return Request Info Section */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[20px] items-start p-[20px] sm:p-[28px] rounded-[8px] w-full overflow-hidden min-w-0 mb-6">
            {/* Header */}
            <div className="flex items-center gap-[8px] w-full">
              <div className="w-[4px] h-[20px] bg-[#e04d30] rounded-[2px]"></div>
              <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
                Thông tin yêu cầu trả hàng
              </h3>
            </div>

            {/* Customer Info */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#e8f5e8] rounded-[8px] shrink-0">
                <User className="h-[20px] w-[20px] text-[#28a745]" />
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-[1.4]">
                  Tên người nhận: {order.receiverName || "Chưa có thông tin"}
                </p>
                <p className="font-montserrat font-medium text-[12px] text-[#737373] leading-[1.4]">
                  Số điện thoại: {order.receiverPhone || "Chưa có thông tin"}
                </p>
                {order.receiverAddress && (
                  <p className="font-montserrat font-medium text-[12px] text-[#737373] leading-[1.4] break-words">
                    Địa chỉ: {order.receiverAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Request Date */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f8f9fa] rounded-[8px] shrink-0">
                <Calendar className="h-[20px] w-[20px] text-[#6c757d]" />
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-[1.4]">
                  Ngày tạo yêu cầu
                </p>
                <p className="font-montserrat font-medium text-[12px] text-[#737373] leading-[1.4]">
                  {order.createdAt}
                </p>
              </div>
            </div>

            {/* Reason Section */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#fff3cd] rounded-[8px] shrink-0">
                <FileText className="h-[20px] w-[20px] text-[#856404]" />
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-[1.4]">
                  Lý do trả hàng
                </p>
                {order.returnReason && (
                  <p className="font-montserrat font-semibold text-[13px] text-[#272424] leading-[1.4]">
                    Lý do chính: <span className="font-medium text-[#856404]">
                      {order.returnReasonLabel || order.returnReason}
                    </span>
                  </p>
                )}
                {order.returnReasonNote && (
                  <p className="font-montserrat font-medium text-[12px] text-[#737373] leading-[1.4] break-words">
                    Chi tiết: {order.returnReasonNote}
                  </p>
                )}
                {!order.returnReason && !order.returnReasonNote && (
                  <p className="font-montserrat font-medium text-[12px] text-[#737373] leading-[1.4] break-words">
                    {order.reason || "Chưa có thông tin"}
                  </p>
                )}
              </div>
            </div>

            {/* Images Section */}
            {order.images && order.images.length > 0 && (
              <div className="flex gap-[14px] items-start w-full">
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#e7f3ff] rounded-[8px] shrink-0">
                  <svg
                    className="h-[20px] w-[20px] text-[#1976d2]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-[8px] items-start flex-1 min-w-0">
                  <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-[1.4]">
                    Hình ảnh đính kèm
                  </p>
                  <div className="flex flex-wrap gap-[8px] w-full">
                    {order.images.map((imageUrl, index) => {
                      const fullImageUrl = imageUrl ? getImageUrl(imageUrl) : "https://via.placeholder.com/100";
                      return (
                        <div
                          key={index}
                          className="relative group cursor-pointer"
                          onClick={() => {
                            // Open image in new tab or modal
                            window.open(fullImageUrl, "_blank");
                          }}
                        >
                          <img
                            src={fullImageUrl}
                            alt={`Hình ảnh minh chứng ${index + 1}`}
                            className="w-[100px] h-[100px] rounded-[8px] border-2 border-[#e7e7e7] object-cover hover:border-[#1976d2] transition-all duration-200 hover:shadow-md"
                            loading="eager"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/100";
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-[8px] transition-all duration-200 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                              />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Resolution Note */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#d1ecf1] rounded-[8px] shrink-0">
                <AlertTriangle className="h-[20px] w-[20px] text-[#0c5460]" />
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-[1.4]">
                  Ghi chú xử lý
                </p>
                <p className="font-montserrat font-medium text-[12px] text-[#737373] leading-[1.4] break-words">
                  {order.resolutionNote || "Không có thông tin"}
                </p>
              </div>
            </div>
          </div>
          {/* Shipping Status Section */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[20px] items-start p-[20px] sm:p-[28px] rounded-[8px] w-full overflow-hidden min-w-0 mb-6">
            {/* Header */}
            <div className="flex items-center gap-[8px] w-full">
              <div className="w-[4px] h-[20px] bg-[#17a2b8] rounded-[2px]"></div>
              <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
                Thông tin vận chuyển
              </h3>
            </div>

            {/* Forward Shipping */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#d1ecf1] rounded-[8px] shrink-0">
                <Truck className="h-[20px] w-[20px] text-[#0c5460]" />
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-[1.4]">
                  Trạng thái giao hàng
                </p>
                <p className="font-montserrat font-medium text-[12px] text-[#737373] leading-[1.4]">
                  {order.forwardShippingStatus || "Chưa có thông tin"}
                </p>
                {(order.shippingOrderCode || order.shippingProvider) && (
                  <p className="font-montserrat font-medium text-[11px] text-[#6c757d] leading-[1.4]">
                    {order.shippingOrderCode && `Mã vận đơn: ${order.shippingOrderCode}`}
                    {order.shippingOrderCode && order.shippingProvider && " • "}
                    {order.shippingProvider && `Đơn vị: ${order.shippingProvider}`}
                  </p>
                )}
                {!order.shippingOrderCode && !order.shippingProvider && (
                  <p className="font-montserrat font-medium text-[11px] text-[#6c757d] leading-[1.4]">
                    {order.sourceNote || "Thông tin vận chuyển đang cập nhật"}
                  </p>
                )}
              </div>
            </div>

            {/* Return Shipping */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#fff3cd] rounded-[8px] shrink-0">
                <RotateCcw className="h-[20px] w-[20px] text-[#856404]" />
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-[1.4]">
                  Trạng thái trả hàng
                </p>
                <p className="font-montserrat font-medium text-[12px] text-[#737373] leading-[1.4]">
                  {order?.returnShippingStatus && order.returnShippingStatus.trim() !== ""
                    ? order.returnShippingStatus
                    : "Chưa có thông tin"}
                </p>
              </div>
            </div>

            {/* Preferred Resolution */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f8d7da] rounded-[8px] shrink-0">
                <RefreshCw className="h-[20px] w-[20px] text-[#721c24]" />
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-[1.4]">
                  Phương án cho người mua
                </p>
                <p className="font-montserrat font-medium text-[12px] text-[#737373] leading-[1.4]">
                  {preferredResolution}
                </p>
              </div>
            </div>
          </div>

          {/* Refund Information Section */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[20px] items-start p-[20px] sm:p-[28px] rounded-[8px] w-full overflow-hidden min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-[8px]">
                <div className="w-[4px] h-[20px] bg-[#28a745] rounded-[2px]"></div>
                <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
                  Thông tin hoàn tiền
                </h3>
              </div>
              <button
                onClick={handleCopyBankInfo}
                className="flex items-center gap-2 rounded-[12px] border border-[#d9d9d9] bg-[#f9f9f9] px-4 py-2 text-[13px] font-semibold text-[#272424] hover:bg-white transition-colors"
              >
                <ClipboardCopy size={16} />
                {copied ? "Đã sao chép" : "Copy thông tin"}
              </button>
            </div>

            {/* Payment Method */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#e8f5e8] rounded-[8px] shrink-0">
                <CreditCard className="h-[20px] w-[20px] text-[#28a745]" />
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-[1.4]">
                  Phương thức thanh toán gốc
                </p>
                <p className="font-montserrat font-medium text-[12px] text-[#737373] leading-[1.4]">
                  {order.paymentMethod}
                </p>
              </div>
            </div>

            {/* Refund Status */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#fff3cd] rounded-[8px] shrink-0">
                <RefreshCw className="h-[20px] w-[20px] text-[#856404]" />
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-[1.4]">
                  Trạng thái hoàn tiền
                </p>
                <div className="flex items-center gap-2">
                  <ChipStatus
                    status={order.refundStatus === "WAITING" ? "pending" : order.refundStatus === "PARTIAL" ? "transfer" : "completed"}
                    labelOverride={order.refundStatusLabel}
                  />
                </div>
              </div>
            </div>

            {/* Refund Amount */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#d1ecf1] rounded-[8px] shrink-0">
                <Package className="h-[20px] w-[20px] text-[#0c5460]" />
              </div>
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-[1.4]">
                  Số tiền hoàn dự kiến
                </p>
                <p className="font-montserrat font-bold text-[16px] text-[#28a745] leading-[1.4]">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-[#e7e7e7]"></div>

            <p className="text-[12px] text-[#737373] leading-[1.4]">
              <strong>Lưu ý:</strong> Bộ phận kế toán sẽ xử lý hoàn tiền sau khi xác nhận hàng hoàn về đầy đủ và đúng điều kiện. Thời gian hoàn tiền: 3-5 ngày làm việc.
            </p>
          </div>

          {/* Action Buttons Section */}
          {order.statusKey === "UNDER_REVIEW" && (
            <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[20px] items-start p-[20px] sm:p-[28px] rounded-[8px] w-full overflow-hidden min-w-0">
              {/* Header */}
              <div className="flex items-center gap-[8px] w-full">
                <div className="w-[4px] h-[20px] bg-[#dc3545] rounded-[2px]"></div>
                <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
                  Hành động xử lý
                </h3>
              </div>

              <div className="flex flex-wrap gap-3 items-center justify-start w-full">
                {/* Approve Button */}
                <button
                  onClick={() => {
                    console.log("Approve return request for order:", order.orderCode);
                    // Handle approve action
                  }}
                  className="flex items-center gap-2 rounded-[12px] bg-[#28a745] hover:bg-[#218838] px-6 py-3 text-[14px] font-semibold text-white transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <CheckCircle size={18} />
                  Chấp nhận yêu cầu
                </button>

                {/* Reject Button */}
                <button
                  onClick={() => {
                    console.log("Reject return request for order:", order.orderCode);
                    // Handle reject action
                  }}
                  className="flex items-center gap-2 rounded-[12px] bg-[#dc3545] hover:bg-[#c82333] px-6 py-3 text-[14px] font-semibold text-white transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <XCircle size={18} />
                  Từ chối yêu cầu
                </button>

                {/* Request More Info Button */}
                <button
                  onClick={() => {
                    console.log("Request more info for order:", order.orderCode);
                    // Handle request more info action
                  }}
                  className="flex items-center gap-2 rounded-[12px] border-2 border-[#ffc107] bg-[#fff3cd] hover:bg-[#ffeaa7] px-6 py-3 text-[14px] font-semibold text-[#856404] transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <AlertTriangle size={18} />
                  Yêu cầu thêm thông tin
                </button>
              </div>

              <div className="w-full h-px bg-[#e7e7e7]"></div>

              <p className="text-[12px] text-[#737373] leading-[1.4]">
                <strong>Chú ý:</strong> Sau khi chấp nhận yêu cầu, khách hàng sẽ nhận được email hướng dẫn gửi hàng hoàn trả. Vui lòng xác nhận kỹ thông tin trước khi thực hiện.
              </p>
            </div>
          )}

          {order.statusKey === "RETURNING" && (
            <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[20px] items-start p-[20px] sm:p-[28px] rounded-[8px] w-full overflow-hidden min-w-0">
              {/* Header */}
              <div className="flex items-center gap-[8px] w-full">
                <div className="w-[4px] h-[20px] bg-[#17a2b8] rounded-[2px]"></div>
                <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
                  Xác nhận hàng hoàn trả
                </h3>
              </div>

              <div className="flex flex-wrap gap-3 items-center justify-start w-full">
                {/* Confirm Receipt Button */}
                <button
                  onClick={() => {
                    console.log("Confirm receipt for order:", order.orderCode);
                    // Handle confirm receipt action
                  }}
                  className="flex items-center gap-2 rounded-[12px] bg-[#17a2b8] hover:bg-[#138496] px-6 py-3 text-[14px] font-semibold text-white transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <Package size={18} />
                  Xác nhận đã nhận hàng
                </button>

                {/* Process Refund Button */}
                <button
                  onClick={() => {
                    console.log("Process refund for order:", order.orderCode);
                    // Handle process refund action
                  }}
                  className="flex items-center gap-2 rounded-[12px] bg-[#28a745] hover:bg-[#218838] px-6 py-3 text-[14px] font-semibold text-white transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  <CreditCard size={18} />
                  Xử lý hoàn tiền
                </button>
              </div>

              <div className="w-full h-px bg-[#e7e7e7]"></div>

              <p className="text-[12px] text-[#737373] leading-[1.4]">
                <strong>Quy trình:</strong> Xác nhận đã nhận hàng hoàn trả → Kiểm tra tình trạng hàng hóa → Xử lý hoàn tiền cho khách hàng.
              </p>
            </div>
          )}
        </ContentCard>
      </div>
    </PageContainer>
  );
};

export default AdminOrderOtherStatusDetail;