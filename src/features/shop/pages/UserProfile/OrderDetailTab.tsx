import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Button from "../../../../components/shop/Button";
import ActionButton from "../../../../components/shop/ActionButton";
import ProductReviewModal from "../../../../components/shop/ProductReviewModal";
import OrderTimeline, { type TimelineStep } from "../../../../components/admin/order/OrderTimeline";
import { ChipStatus } from "../../../../components/ui/chip-status";
import { getCustomerOrderDetail, cancelOrder } from "../../../../api/endpoints/websiteOrderApi";
import { createVNPayPayment } from "../../../../api/endpoints/paymentApi";
import { useAuth } from "../../../../context/AuthContext";
import { formatTimelineDate, formatOrderDate } from "../../../../utils/dateUtils";
import type { CustomerOrderResponse } from "../../../../types";
import { toast } from "sonner";
import { Truck, Package } from "lucide-react";
import { useCustomerOrderWebSocket } from "../../../../hooks/useCustomerOrderWebSocket";
import { useQueryClient } from "@tanstack/react-query";
import {
  PageContainer,
} from "@/components/common";
import { formatCurrencyVND } from "./utils/formatCurrency";
import { CardContent } from "@/components/ui/card";

function ArrowLeftIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

type ProductType = {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  originalPrice?: number;
  variant?: string;
  quantity: number;
  isReviewed?: boolean;
};

const FALLBACK_IMAGE = "/images/placeholders/no-image.svg";

// Map shipping status to Vietnamese (GHN status list)
const mapShippingStatusToLabel = (status: string | null | undefined): string => {
  if (!status) return "Chưa có thông tin";

  const normalizedStatus = status.toLowerCase();
  const statusMap: Record<string, string> = {
    // GHN official statuses
    ready_to_pick: "Đơn hàng vừa được tạo, chờ lấy hàng",
    picking: "Shipper đang đến lấy hàng",
    cancel: "Đơn vận chuyển đã bị hủy",
    money_collect_picking: "Shipper đang tương tác với người gửi",
    picked: "Shipper đã lấy hàng",
    storing: "Hàng đang ở kho phân loại GHN",
    transporting: "Hàng đang luân chuyển",
    sorting: "Hàng đang được phân loại tại kho",
    delivering: "Shipper đang giao hàng cho khách",
    money_collect_delivering: "Shipper đang tương tác với người nhận",
    delivered: "Hàng đã giao thành công cho khách",
    delivery_fail: "Giao hàng không thành công",
    waiting_to_return: "Chờ giao lại / chờ chuyển hoàn",
    return: "Chờ chuyển hoàn về cho người bán",
    return_transporting: "Hàng hoàn đang luân chuyển",
    return_sorting: "Hàng hoàn đang phân loại tại kho",
    returning: "Shipper đang hoàn hàng cho người bán",
    return_fail: "Chuyển hoàn thất bại",
    returned: "Hàng đã được hoàn lại cho người bán",
    exception: "Đơn hàng gặp ngoại lệ, cần xử lý thêm",
    damage: "Hàng hóa bị hư hỏng",
    lost: "Hàng hóa bị thất lạc",

    // Internal/extra statuses (nếu GHN trả về)
    created: "Đơn vận chuyển mới tạo",
  };

  return statusMap[normalizedStatus] || status;
};

// Map order status to ChipStatus format
const mapOrderStatusToChipStatus = (status?: string | null): "pending" | "confirmed" | "shipping" | "delivered" | "cancelled" | "return" | "default" => {
  if (!status) return "default";
  const normalized = status.toUpperCase();
  switch (normalized) {
    case "PENDING":
      return "pending";
    case "CONFIRMED":
      return "confirmed";
    case "PROCESSING":
      return "confirmed"; // Processing is similar to confirmed
    case "SHIPPING":
      return "shipping";
    case "COMPLETE":
      return "delivered";
    case "SHIPPING_FAILED":
      return "return"; // Shipping failed maps to return status
    case "RETURNED":
      return "return";
    case "REFUND":
      return "return";
    case "CANCELED":
      return "cancelled";
    default:
      return "default";
  }
};

const OrderDetailTab: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation() as { state?: { order?: any } };
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set());
  const [productReviews, setProductReviews] = useState<Map<string, { rating: number; comment: string }>>(new Map());
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

  // Payment result popup state
  const [showPaymentResultModal, setShowPaymentResultModal] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    status: "success" | "failed";
    message: string;
    orderCode?: string;
  } | null>(null);
  const [paymentResultCountdown, setPaymentResultCountdown] = useState(5);

  // Auto close popup after this many seconds (configurable)
  const PAYMENT_RESULT_POPUP_AUTO_CLOSE_SECONDS = 5;

  // Use orderId from URL params as orderCode (it's actually the code, not id)
  const orderCode = orderId?.trim() || null;

  // WebSocket subscription for real-time order updates
  const { isConnected: wsConnected } = useCustomerOrderWebSocket({
    enabled: isAuthenticated && !!orderCode,
    orderCode: orderCode || undefined,
    enableNotifications: true,
    onOrderDetailUpdate: (updatedOrder) => {
      // Update query cache with new order data
      queryClient.setQueryData(["customerOrderDetail", orderCode], updatedOrder);
      console.log("[OrderDetailTab] Order updated via WebSocket:", updatedOrder);
      
      // Show success toast
      toast.success("Đơn hàng được cập nhật!", {
        description: `Đơn hàng #${updatedOrder.code} vừa được cập nhật`,
        duration: 3000,
      });
    },
    shouldProcessUpdate: (order) => {
      // Only process updates for the current order
      console.log("[OrderDetailTab] Checking if should process update:", {
        orderCode: order.code,
        currentOrderCode: orderCode,
        shouldProcess: order.code === orderCode
      });
      return order.code === orderCode;
    },
  });

  // Debug WebSocket connection
  React.useEffect(() => {
    console.log("[OrderDetailTab] WebSocket connection status:", {
      isAuthenticated,
      orderCode,
      wsConnected,
      enabled: isAuthenticated && !!orderCode,
    });
  }, [isAuthenticated, orderCode, wsConnected]);

  // Fetch order detail from API
  const {
    data: orderData,
    isLoading,
    isError,
    error,
  } = useQuery<CustomerOrderResponse>({
    queryKey: ["customerOrderDetail", orderCode],
    queryFn: () => {
      if (!orderCode) {
        throw new Error("Order code is missing");
      }
      return getCustomerOrderDetail(orderCode);
    },
    enabled: !!orderCode && isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Transform order data for display
  const order = React.useMemo(() => {
    if (!orderData) return null;

    const incomingOrder = location.state?.order;
    const statusLabel = incomingOrder?.statusLabel ||
      (orderData.status === "COMPLETE" ? "Đã giao hàng" :
        orderData.status === "SHIPPING" ? "Đang vận chuyển" :
          orderData.status === "PROCESSING" ? "Đang xử lý" :
            orderData.status === "CONFIRMED" ? "Đã xác nhận" :
              orderData.status === "SHIPPING_FAILED" ? "Giao hàng thất bại" :
                orderData.status === "RETURNED" ? "Đã trả hàng" :
                  orderData.status === "REFUND" ? "Hoàn trả" :
                    orderData.status === "CANCELED" ? "Đã hủy" : "Chờ xác nhận");

    const products: ProductType[] = (orderData.orderDetails || []).map((detail: any, idx: number) => ({
      id: detail.id?.toString() || detail.productDetailId?.toString() || String(idx + 1),
      imageUrl: FALLBACK_IMAGE,
      name: detail.snapshotProductName || "Sản phẩm không tên",
      price: detail.snapshotProductPrice || 0,
      variant: detail.snapshotVariantAttributes?.map((attr: any) => attr?.value || attr?.name).filter(Boolean).join(", ") || undefined,
      quantity: detail.quantity || 1,
      isReviewed: false,
    }));

    return {
      id: orderData.id?.toString() || orderId || "N/A",
      code: orderData.code || orderId || "N/A",
      orderDate: orderData.createdAt ? formatOrderDate(orderData.createdAt) : "N/A",
      status: statusLabel,
      statusKey: orderData.status,
      products,
      customer: {
        // Get name from order only (receiverName from order table)
        name: orderData.receiverName || "N/A",
        // Get phone from order only (receiverPhone from order table)
        phone: orderData.receiverPhone || "N/A",
        // Build address from order fields only (not from shippingDetail or address table)
        address: (() => {
          const addressParts: string[] = [];
          if (orderData.receiverAddress) {
            addressParts.push(orderData.receiverAddress);
          }
          if (orderData.receiverWardName) {
            addressParts.push(orderData.receiverWardName);
          }
          if (orderData.receiverDistrictName) {
            addressParts.push(orderData.receiverDistrictName);
          }
          if (orderData.receiverProvinceName) {
            addressParts.push(orderData.receiverProvinceName);
          }
          return addressParts.length > 0 ? addressParts.join(", ") : "N/A";
        })(),
        notes: orderData.notes || "-",
      },
      payment: {
        productQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
        subtotal: orderData.totalProductPrice || 0,
        discount: 0, // TODO: Get from orderData if available
        shipping: orderData.shippingFee || 0,
        total: orderData.totalOrderPrice || 0,
      },
      shippingStatus: orderData.shippingStatus,
      shippingDetail: orderData.shippingDetail,
      shippingOrderCode: orderData.shippingOrderCode,
      trackingNumber: orderData.trackingNumber,
      expectedDeliveryDate: orderData.expectedDeliveryDate,
      paymentStatus: orderData.paymentStatus,
      paymentMethod: orderData.method,
      orderId: orderData.id,
    };
  }, [orderData, orderId, location.state?.order]);

  const currentStatus = order ? mapOrderStatusToChipStatus(order.statusKey) : "default";

  // Get order status timeline steps (old timeline - based on order status)
  const getOrderStatusTimelineSteps = (): TimelineStep[] => {
    if (!order || !orderData) return [];

    const steps: TimelineStep[] = [
      { label: "Đặt hàng thành công", completed: false },
      { label: "Đã xác nhận", completed: false },
      { label: "Đang vận chuyển", completed: false },
      { label: "Đã nhận hàng", completed: false },
    ];

    // Get dates from order data
    const createdAt = orderData.createdAt ? formatTimelineDate(orderData.createdAt) : "";
    const updatedAt = orderData.updatedAt ? formatTimelineDate(orderData.updatedAt) : "";

    // Determine completed steps based on order status
    const status = order.statusKey?.toUpperCase() || "";

    // At least "Đặt hàng thành công" is always completed
    steps[0].completed = true;
    steps[0].date = createdAt;

    // Only mark "Đã xác nhận" as completed if status is NOT PENDING
    if (status === "CONFIRMED" || status === "PROCESSING" || status === "SHIPPING" || status === "COMPLETE") {
      steps[1].completed = true;
      steps[1].date = updatedAt || createdAt;
    }

    if (status === "SHIPPING" || status === "COMPLETE" || status === "SHIPPING_FAILED" || status === "RETURNED") {
      steps[2].completed = true;
      // Use shipping detail date if available, otherwise use updatedAt
      if (order.shippingDetail && order.shippingDetail.log && Array.isArray(order.shippingDetail.log) && order.shippingDetail.log.length > 0) {
        const sortedLog = [...order.shippingDetail.log].sort((a: any, b: any) => {
          const dateA = a.updated_date ? new Date(a.updated_date).getTime() : 0;
          const dateB = b.updated_date ? new Date(b.updated_date).getTime() : 0;
          return dateA - dateB;
        });
        const firstLogDate = sortedLog[0]?.updated_date;
        steps[2].date = firstLogDate ? formatTimelineDate(firstLogDate) : updatedAt;
      } else {
        steps[2].date = updatedAt;
      }
    }

    if (status === "COMPLETE") {
      steps[3].completed = true;
      // Use latest shipping log date if available
      if (order.shippingDetail && order.shippingDetail.log && Array.isArray(order.shippingDetail.log) && order.shippingDetail.log.length > 0) {
        const sortedLog = [...order.shippingDetail.log].sort((a: any, b: any) => {
          const dateA = a.updated_date ? new Date(a.updated_date).getTime() : 0;
          const dateB = b.updated_date ? new Date(b.updated_date).getTime() : 0;
          return dateA - dateB;
        });
        const deliveredLog = sortedLog.find((log: any) => {
          const statusLower = (log.status || "").toLowerCase();
          return statusLower.includes("delivered") || statusLower.includes("giao hàng thành công");
        });
        const lastLog = sortedLog[sortedLog.length - 1];
        const logDate = deliveredLog?.updated_date || lastLog?.updated_date;
        steps[3].date = logDate ? formatTimelineDate(logDate) : updatedAt;
      } else {
        steps[3].date = updatedAt;
      }
    }

    return steps;
  };

  // Get shipping timeline steps from shippingDetail.log (new timeline - detailed shipping info)
  const getShippingTimelineSteps = () => {
    if (!order || !order.shippingDetail) return [];

    const rawLog = order.shippingDetail.log || [];
    if (!Array.isArray(rawLog) || rawLog.length === 0) return [];

    // Sort log by updated_date (oldest first)
    const sortedLog = [...rawLog].sort((a: any, b: any) => {
      const dateA = a.updated_date ? new Date(a.updated_date).getTime() : 0;
      const dateB = b.updated_date ? new Date(b.updated_date).getTime() : 0;
      return dateA - dateB;
    });

    return sortedLog.map((logEntry: any, index: number) => ({
      id: index + 1,
      status: mapShippingStatusToLabel(logEntry.status),
      date: logEntry.updated_date ? formatTimelineDate(logEntry.updated_date) : "",
      isCompleted: true,
    }));
  };

  // Get timeline text for shipping timeline header
  const getShippingTimelineText = () => {
    if (!order) return { status: "Chưa có thông tin", date: "" };

    const shippingStatus = order.shippingStatus;
    const steps = getShippingTimelineSteps();
    const latestLogDate = steps.length > 0 ? steps[steps.length - 1].date : undefined;

    return {
      status: mapShippingStatusToLabel(shippingStatus),
      date: latestLogDate || (orderData?.updatedAt ? formatTimelineDate(orderData.updatedAt) : ""),
    };
  };

  // Handle image error
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.currentTarget;
    if (target.dataset.fallbackApplied === "true") return;
    target.dataset.fallbackApplied = "true";
    target.src = FALLBACK_IMAGE;
  };

  // Map payment status to Vietnamese
  const getPaymentStatusLabel = (status?: string | null): string => {
    if (!status) return "Chưa thanh toán";
    const normalized = status.toUpperCase();
    switch (normalized) {
      case "PAID":
        return "Đã thanh toán";
      case "PENDING":
        return "Chưa thanh toán";
      case "FAILED":
        return "Thanh toán thất bại";
      default:
        return "Chưa thanh toán";
    }
  };

  // Map payment method to Vietnamese
  const getPaymentMethodLabel = (method?: string | null): string => {
    if (!method) return "Chưa xác định";
    const normalized = method.toUpperCase();
    switch (normalized) {
      case "CASH":
        return "Tiền mặt";
      case "BANKING":
        return "Chuyển khoản";
      default:
        return method;
    }
  };

  // Handle payment button click
  const handlePayment = async () => {
    if (!order?.orderId) {
      toast.error("Không tìm thấy thông tin đơn hàng");
      return;
    }

    try {
      setIsProcessingPayment(true);
      const response = await createVNPayPayment(order.orderId);

      if (response.url) {
        // Redirect to VNPay payment URL
        window.location.href = response.url;
      } else {
        toast.error("Không thể tạo liên kết thanh toán");
        setIsProcessingPayment(false);
      }
    } catch (error: any) {
      console.error("Error creating payment:", error);
      toast.error(error?.response?.data?.message || "Không thể tạo liên kết thanh toán");
      setIsProcessingPayment(false);
    }
  };

  // Check if payment button should be shown
  const shouldShowPaymentButton = (): boolean => {
    if (!order) return false;
    return (
      order.paymentMethod === "BANKING" &&
      order.paymentStatus !== "PAID" &&
      order.statusKey !== "CANCELED" &&
      order.statusKey !== "COMPLETE"
    );
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!order || !order.orderId) {
      toast.error("Không tìm thấy thông tin đơn hàng");
      return;
    }

    // Only allow canceling if status is PENDING
    if (order.statusKey !== "PENDING") {
      toast.error("Chỉ có thể hủy đơn hàng khi trạng thái là chờ xác nhận");
      return;
    }

    // Confirm cancellation
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      setIsCancellingOrder(true);
      const response = await cancelOrder(order.orderId);

      toast.success("Hủy đơn hàng thành công", {
        description: response.message || "Đơn hàng của bạn đã được hủy.",
        duration: 3000,
      });

      // Refresh order data
      window.location.reload();
    } catch (error: any) {
      console.error("Error canceling order:", error);
      toast.error("Hủy đơn hàng thất bại", {
        description: error?.response?.data?.message || "Không thể hủy đơn hàng. Vui lòng thử lại.",
        duration: 4000,
      });
      setIsCancellingOrder(false);
    }
  };

  // Check for new order creation success notification
  useEffect(() => {
    const isNewOrder = searchParams.get("newOrder") === "true";
    if (isNewOrder && orderData) {
      toast.success("Đặt hàng thành công!", {
        description: `Đơn hàng #${orderData.code || orderCode} đã được tạo và đang được xử lý.`,
        duration: 5000,
      });
      // Remove query param after showing notification
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("newOrder");
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, orderData, orderCode, setSearchParams]);

  // Check for payment result in URL query params and show popup
  useEffect(() => {
    const paymentStatus = searchParams.get("paymentStatus");
    const paymentMessage = searchParams.get("paymentMessage");
    const paymentOrderCode = searchParams.get("paymentOrderCode");

    if (paymentStatus && (paymentStatus === "success" || paymentStatus === "failed")) {
      setPaymentResult({
        status: paymentStatus as "success" | "failed",
        message: paymentMessage || (paymentStatus === "success" ? "Thanh toán thành công" : "Thanh toán thất bại"),
        orderCode: paymentOrderCode || undefined,
      });
      setShowPaymentResultModal(true);

      // Remove query params after showing popup
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("paymentStatus");
      newSearchParams.delete("paymentMessage");
      newSearchParams.delete("paymentOrderCode");
      setSearchParams(newSearchParams, { replace: true });

      // Reset countdown
      setPaymentResultCountdown(PAYMENT_RESULT_POPUP_AUTO_CLOSE_SECONDS);

      // Countdown timer
      let countdownValue = PAYMENT_RESULT_POPUP_AUTO_CLOSE_SECONDS;
      const countdownInterval = setInterval(() => {
        countdownValue -= 1;
        setPaymentResultCountdown(countdownValue);
        if (countdownValue <= 0) {
          clearInterval(countdownInterval);
          setShowPaymentResultModal(false);
        }
      }, 1000);

      // Auto close popup after configured seconds (backup timer)
      const timer = setTimeout(() => {
        clearInterval(countdownInterval);
        setShowPaymentResultModal(false);
      }, PAYMENT_RESULT_POPUP_AUTO_CLOSE_SECONDS * 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [searchParams, setSearchParams]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e04d30] mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if orderCode is missing
  if (!orderCode && orderId) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Mã đơn hàng không hợp lệ</h3>
          <p className="text-red-600 mb-4">
            Mã đơn hàng không được để trống. Vui lòng kiểm tra lại.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/user/profile/orders")}
            className="!bg-[#E04D30] !border-[#E04D30]"
          >
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || (!order && !isLoading)) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Không thể tải đơn hàng</h3>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải thông tin đơn hàng"}
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/user/profile/orders")}
            className="!bg-[#E04D30] !border-[#E04D30]"
          >
            Quay lại danh sách đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  // Early return if order is still null after loading
  if (!order) {
    return null;
  }

  const totalPayment = order.payment.total;
  const orderStatusTimelineSteps = getOrderStatusTimelineSteps();
  const shippingTimelineSteps = getShippingTimelineSteps();
  const shippingTimelineText = getShippingTimelineText();

  return (
    <PageContainer>
      <CardContent>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-3 sm:px-6 py-6 bg-white border-b border-gray-100">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  navigate("/user/profile/orders", {
                    state: { activeTab: currentStatus },
                  });
                }}
                className="flex items-center justify-center w-9 h-9 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Quay lại"
              >
                <ArrowLeftIcon />
              </button>
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Chi tiết đơn hàng
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Theo dõi trạng thái và thông tin đơn hàng
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-3 sm:px-6 py-6 sm:py-8 bg-gray-50/50 space-y-6">
            {/* Tổng quan (Overview) Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Tổng quan đơn hàng</h2>
                  <ChipStatus status={currentStatus} labelOverride={order.status} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Mã đơn: #{order.code}</span>
                    </div>
                    <span className="hidden sm:inline text-gray-400">•</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>Ngày đặt: {order.orderDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                {order.products.map((product: ProductType, index: number) => (
                  <div key={product.id} className="flex flex-col sm:flex-row gap-4 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200"
                          onError={handleImageError}
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {index + 1}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-lg font-bold text-blue-600">
                              {formatCurrencyVND(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatCurrencyVND(product.originalPrice)}
                              </span>
                            )}
                            {product.variant && (
                              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-sm font-medium text-blue-700">
                                {product.variant}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-700">
                            SL: {product.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons - Only show for delivered orders */}
              {currentStatus === "delivered" && (
                <div className="flex flex-col justify-end sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-100">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      if (order.products.length > 0) {
                        navigate(`/shop/products/${order.products[0].id}`);
                      }
                    }}
                    className="flex-1 sm:flex-none h-11 bg-blue-600 hover:bg-blue-700 border-transparent text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    Mua lại
                  </Button>
                  <ActionButton
                    variant="outline"
                    size="md"
                    options={[
                      {
                        id: "return-refund",
                        label: "Yêu cầu hoàn hàng/trả tiền",
                        onClick: () => {
                          navigate("/user/profile/return-refund/products", {
                            state: {
                              order: {
                                id: order.id,
                                code: order.code,
                                orderDate: order.orderDate,
                                products: order.products,
                              },
                            },
                          });
                        },
                      },
                      {
                        id: "review",
                        label: "Đánh giá",
                        onClick: () => {
                          if (order.products.length > 0) {
                            setSelectedProducts(order.products);
                            setIsReviewModalOpen(true);
                          }
                        },
                      },
                    ]}
                    className="h-11 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Thêm
                  </ActionButton>
                </div>
              )}

              {/* Cancel Order Button - Only show for pending orders */}
              {currentStatus === "pending" && (
                <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleCancelOrder}
                    disabled={isCancellingOrder}
                    className="h-11 bg-white border border-red-300 text-red-600 hover:bg-red-600 hover:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors duration-200 px-6"
                  >
                    {isCancellingOrder ? (
                      <>
                        <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Hủy đơn hàng
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Order Status Timeline (Old Timeline - Overview) */}
            <OrderTimeline steps={orderStatusTimelineSteps} />

            {/* Shipping Timeline (New Timeline - Detailed) - Only show if shippingDetail exists */}
            {order.shippingDetail && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Timeline Header */}
                <div className="flex flex-col sm:flex-row items-start justify-between p-4 gap-4 bg-gray-50">
                  <div className="flex gap-4 items-center flex-1">
                    {/* Status Icon */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 shadow-lg transition-all duration-300 ${order.shippingStatus === "SHIPPING" || order.statusKey === "SHIPPING"
                      ? "bg-blue-500 border-blue-400 animate-pulse"
                      : order.shippingStatus === "COMPLETE" || order.statusKey === "COMPLETE"
                        ? "bg-green-500 border-green-400"
                        : order.shippingStatus === "SHIPPING_FAILED" || order.statusKey === "SHIPPING_FAILED" || order.statusKey === "RETURNED"
                          ? "bg-red-500 border-red-400"
                          : order.shippingStatus === "PENDING" || order.statusKey === "PENDING"
                            ? "bg-amber-500 border-amber-400"
                            : order.shippingStatus === "CONFIRMED" || order.shippingStatus === "PROCESSING" || order.statusKey === "CONFIRMED" || order.statusKey === "PROCESSING"
                              ? "bg-emerald-500 border-emerald-400"
                              : "bg-gray-500 border-gray-400"
                      }`}>
                      {order.shippingStatus === "SHIPPING" || order.statusKey === "SHIPPING" ? (
                        <Truck className="w-6 h-6 text-white" />
                      ) : order.shippingStatus === "COMPLETE" || order.statusKey === "COMPLETE" ? (
                        <Package className="w-6 h-6 text-white" />
                      ) : order.shippingStatus === "SHIPPING_FAILED" || order.statusKey === "SHIPPING_FAILED" || order.statusKey === "RETURNED" ? (
                        <Package className="w-6 h-6 text-white" />
                      ) : (
                        <Package className="w-6 h-6 text-white" />
                      )}
                    </div>

                    {/* Status Text */}
                    <div className="flex flex-col gap-2 flex-1">
                      <h3 className="font-bold text-lg text-gray-800">
                        {shippingTimelineText.status}
                      </h3>
                      {shippingTimelineText.date && (
                        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow-sm">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium text-sm text-gray-700">
                            {shippingTimelineText.date}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
                    className="flex gap-2 items-center justify-center px-4 py-2 rounded-lg font-medium bg-white hover:bg-gray-50 transition-colors duration-200 border border-gray-300 text-gray-700 hover:text-gray-900"
                  >
                    <span className="text-sm">
                      {isTimelineExpanded ? "Thu gọn" : "Xem chi tiết"}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${isTimelineExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expanded Timeline Steps */}
                {isTimelineExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-white animate-fadeIn">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>
                        <h3 className="font-bold text-lg text-gray-800">
                          Lịch sử vận chuyển
                        </h3>
                      </div>
                      <div className="space-y-4 pl-2">
                        {shippingTimelineSteps.length > 0 ? (
                          shippingTimelineSteps.map((step, index) => (
                            <div key={step.id} className="flex items-start gap-4 group">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 border-2 border-white shadow-lg shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                              <div className="flex-1 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                                <p className="font-semibold text-gray-800 mb-1">
                                  {step.status}
                                </p>
                                {step.date && (
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-gray-600 font-medium">
                                      {step.date}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {/* Connecting Line */}
                              {index < shippingTimelineSteps.length - 1 && (
                                <div className="absolute left-8 top-8 w-0.5 h-12 bg-gradient-to-b from-green-300 to-blue-300 -z-10"></div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-gray-500 font-medium">
                                Chưa có lịch sử cập nhật
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Customer Information & Payment Information */}
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 w-full">
                <div className="mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Thông tin khách hàng
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-600 block mb-1">
                        Họ và tên
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {order.customer.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-600 block mb-1">
                        Số điện thoại
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {order.customer.phone}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-600 block mb-1">
                        Địa chỉ giao hàng
                      </span>
                      <span className="text-base font-semibold text-gray-900 break-words">
                        {order.customer.address}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-600 block mb-1">
                        Ghi chú
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {order.customer.notes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 w-full">
                <div className="mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Thông tin thanh toán
                  </h2>
                </div>

                {/* Product Sub-section */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-800 mb-4">
                    Chi tiết sản phẩm
                  </h3>
                  <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center text-gray-700">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        Số lượng sản phẩm
                      </span>
                      <span className="font-semibold">{order.payment.productQuantity}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Tổng tiền hàng</span>
                      <span className="font-semibold">{formatCurrencyVND(order.payment.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Giảm giá</span>
                      <span className="font-semibold text-green-600">{formatCurrencyVND(order.payment.discount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Phí vận chuyển</span>
                      <span className="font-semibold">{formatCurrencyVND(order.payment.shipping)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Sub-section */}
                <div className="border-t-2 border-gray-100 pt-6">
                  <h3 className="text-base font-semibold text-gray-800 mb-4">
                    Thông tin thanh toán
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-blue-600 p-3 rounded-lg text-white">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium opacity-90">
                          Tổng số tiền
                        </span>
                        <span className="text-xl font-bold">
                          {formatCurrencyVND(totalPayment)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-700">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                          Phương thức thanh toán
                        </span>
                        <span className="font-semibold text-gray-900">
                          {getPaymentMethodLabel(order.paymentMethod)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-700">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Trạng thái thanh toán
                        </span>
                        <span className="font-semibold text-gray-900">
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </span>
                      </div>
                    </div>
                    {shouldShowPaymentButton() && (
                      <div className="pt-2">
                        <Button
                          variant="primary"
                          size="md"
                          onClick={handlePayment}
                          disabled={isProcessingPayment}
                          className="w-full h-12 bg-blue-600 hover:bg-blue-700 border-transparent text-white font-semibold rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {isProcessingPayment ? (
                            <>
                              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                              Thanh toán ngay
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Modal */}
          {selectedProducts.length > 0 && (
            <ProductReviewModal
              isOpen={isReviewModalOpen}
              onClose={() => {
                setIsReviewModalOpen(false);
                setSelectedProducts([]);
              }}
              products={selectedProducts.map((product) => ({
                id: product.id,
                name: product.name,
                imageUrl: product.imageUrl,
                classification: product.variant,
              }))}
              initialReviews={productReviews}
              onSubmit={(reviews) => {
                console.log("Reviews submitted:", reviews);
                setIsReviewModalOpen(false);
                reviews.forEach((review) => {
                  if (!reviewedProducts.has(review.productId)) {
                    setReviewedProducts((prev) => new Set(prev).add(review.productId));
                  }
                  setProductReviews((prev) => {
                    const newMap = new Map(prev);
                    newMap.set(review.productId, {
                      rating: review.rating,
                      comment: review.comment,
                    });
                    return newMap;
                  });
                });
                setShowSuccessModal(true);
                setSelectedProducts([]);
              }}
            />
          )}

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowSuccessModal(false)}
              />
              <div
                className="relative z-50 bg-white rounded-lg shadow-lg w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-[#ea5b0c] rounded-full flex items-center justify-center">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Cảm ơn bạn đã đánh giá!
                  </h2>
                  <p className="text-gray-600">
                    Đánh giá của bạn đã được gửi thành công.
                  </p>
                  <div className="mt-6">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => {
                        setShowSuccessModal(false);
                        setSelectedProducts([]);
                      }}
                      className="px-8"
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Result Popup Modal */}
          {showPaymentResultModal && paymentResult && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => {
                  setShowPaymentResultModal(false);
                  setPaymentResultCountdown(PAYMENT_RESULT_POPUP_AUTO_CLOSE_SECONDS);
                }}
              />
              <div
                className="relative z-50 bg-white rounded-lg shadow-lg w-full max-w-md mx-4 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-8 text-center">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center ${paymentResult.status === "success"
                        ? "bg-green-100"
                        : "bg-red-100"
                        }`}
                    >
                      {paymentResult.status === "success" ? (
                        <svg
                          className="w-12 h-12 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-12 h-12 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h2
                    className={`text-2xl font-bold mb-4 ${paymentResult.status === "success"
                      ? "text-green-700"
                      : "text-red-700"
                      }`}
                  >
                    {paymentResult.status === "success"
                      ? "Thanh toán thành công"
                      : "Thanh toán thất bại"}
                  </h2>

                  {/* Message */}
                  <p className="text-gray-600 mb-4 text-base leading-relaxed">
                    {paymentResult.message}
                  </p>

                  {/* Order Code */}
                  {paymentResult.orderCode && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {paymentResult.orderCode}
                      </p>
                    </div>
                  )}

                  {/* Countdown Info */}
                  <p className="text-sm text-gray-500 mb-6">
                    Popup sẽ tự động đóng sau{" "}
                    <span className="font-semibold text-gray-700">{paymentResultCountdown}</span> giây
                  </p>

                  {/* Close Button */}
                  <div className="mt-6">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => {
                        setShowPaymentResultModal(false);
                        setPaymentResultCountdown(PAYMENT_RESULT_POPUP_AUTO_CLOSE_SECONDS);
                      }}
                      className={`px-8 ${paymentResult.status === "success"
                        ? "!bg-green-600 hover:!bg-green-700"
                        : "!bg-[#E04D30] hover:!bg-[#c93d24]"
                        } !border-transparent`}
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Smooth transitions */
        .transition-colors {
          transition-property: color, background-color, border-color;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 200ms;
        }
        
        /* Focus states */
        button:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .text-xl {
            font-size: 1.125rem;
          }
          .text-2xl {
            font-size: 1.25rem;
          }
          .p-3 {
            padding: 0.5rem;
          }
          .p-4 {
            padding: 0.75rem;
          }
          .p-6 {
            padding: 1rem;
          }
        }
      `}</style>
        </div>
      </CardContent>
    </PageContainer>
  );
};

export default OrderDetailTab;
