import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Button from "../../../../components/shop/Button";
import ActionButton from "../../../../components/shop/ActionButton";
import ProductReviewModal from "../../../../components/shop/ProductReviewModal";
import OrderTimeline, { type TimelineStep } from "../../../../components/admin/order/OrderTimeline";
import { ChipStatus } from "../../../../components/ui/chip-status";
import { getCustomerOrderDetail, cancelOrder } from "../../../../api/endpoints/orderApi";
import { createVNPayPayment } from "../../../../api/endpoints/paymentApi";
import { useAuth } from "../../../../context/AuthContext";
import { formatTimelineDate, formatOrderDate } from "../../../../utils/dateUtils";
import type { CustomerOrderResponse } from "../../../../types";
import { toast } from "sonner";
import { Truck, Package } from "lucide-react";

function formatCurrencyVND(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

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

// Map shipping status to Vietnamese
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

// Map order status to ChipStatus format
const mapOrderStatusToChipStatus = (status?: string | null): "pending" | "confirmed" | "shipping" | "delivered" | "cancelled" | "return" | "default" => {
  if (!status) return "default";
  const normalized = status.toUpperCase();
  switch (normalized) {
    case "PENDING":
      return "pending";
    case "CONFIRMED":
      return "confirmed";
    case "SHIPPING":
      return "shipping";
    case "COMPLETE":
      return "delivered";
    case "CANCELED":
      return "cancelled";
    case "REFUND":
      return "return";
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
          orderData.status === "CONFIRMED" ? "Đã xác nhận" :
            orderData.status === "CANCELED" ? "Đã hủy" :
              orderData.status === "REFUND" ? "Hoàn trả" : "Chờ xác nhận");

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

    if (status === "CONFIRMED" || status === "SHIPPING" || status === "COMPLETE") {
      steps[1].completed = true;
      steps[1].date = updatedAt || createdAt;
    }

    if (status === "SHIPPING" || status === "COMPLETE") {
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
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 border-b border-gray-200 h-[60px] flex items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              navigate("/user/profile/orders", {
                state: { activeTab: currentStatus },
              });
            }}
            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Quay lại"
          >
            <ArrowLeftIcon />
          </button>
          <h1 className="text-[20px] font-normal text-gray-900">
            Lịch sử mua hàng / Chi tiết đơn hàng
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gray-50 space-y-6">
        {/* Tổng quan (Overview) Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-[14px]">
          <div className="mb-4">
            <h2 className="text-[18px] font-bold text-gray-900 mb-0">Tổng quan</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
              <div className="flex flex-wrap items-center gap-2 text-[14px] text-gray-700">
                <span>Đơn hàng: #{order.code}</span>
                <span className="hidden sm:inline">|</span>
                <span>Ngày đặt hàng: {order.orderDate}</span>
              </div>
              <ChipStatus status={currentStatus} labelOverride={order.status} />
            </div>
          </div>

          {/* Product Details */}
          {order.products.map((product: ProductType) => (
            <div key={product.id} className="flex flex-col sm:flex-row gap-4 pb-4 last:pb-0">
              <div className="flex-shrink-0">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-[60px] h-[60px] object-cover rounded-lg border border-gray-300"
                  onError={handleImageError}
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

          {/* Action Buttons - Only show for delivered orders */}
          {currentStatus === "delivered" && (
            <div className="flex flex-col justify-end sm:flex-row gap-2 mt-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (order.products.length > 0) {
                    navigate(`/shop/products/${order.products[0].id}`);
                  }
                }}
                className="flex-1 sm:flex-none !h-[36px] !bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c93d24] hover:!border-[#c93d24]"
              >
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
                className="!h-[36px] !bg-white !border-[#E04D30] !text-[#E04D30] hover:!bg-white"
              >
                Thêm
              </ActionButton>
            </div>
          )}

          {/* Cancel Order Button - Only show for pending orders */}
          {currentStatus === "pending" && (
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="md"
                onClick={handleCancelOrder}
                disabled={isCancellingOrder}
                className="!h-[36px] !bg-white !border-[#E04D30] !text-[#E04D30] hover:!bg-[#E04D30] hover:!text-white disabled:!bg-gray-300 disabled:!border-gray-300 disabled:!text-gray-500 disabled:!cursor-not-allowed"
              >
                {isCancellingOrder ? (
                  <>
                    <div className="h-4 w-4 border-2 border-[#E04D30] border-t-transparent rounded-full animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  "Hủy đơn hàng"
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Order Status Timeline (Old Timeline - Overview) */}
        <OrderTimeline steps={orderStatusTimelineSteps} />

        {/* Shipping Timeline (New Timeline - Detailed) - Only show if shippingDetail exists */}
        {order.shippingDetail && (
          <div className="border border-[#e7e7e7] box-border flex flex-col relative rounded-[8px] w-full overflow-hidden min-w-0 bg-white">
            {/* Timeline Header */}
            <div className="flex flex-col sm:flex-row items-start justify-between p-[16px] gap-[12px] sm:gap-0">
              <div className="box-border flex gap-[12px] items-center relative shrink-0 min-w-0 flex-1">
                {/* Status Icon */}
                <div className={`flex items-center justify-center w-[40px] h-[40px] rounded-full border shrink-0 ${order.shippingStatus === "SHIPPING" || order.statusKey === "SHIPPING"
                    ? "bg-blue-50 border-blue-200"
                    : order.shippingStatus === "COMPLETE" || order.statusKey === "COMPLETE"
                      ? "bg-green-50 border-green-200"
                      : order.shippingStatus === "PENDING" || order.statusKey === "PENDING"
                        ? "bg-amber-50 border-amber-200"
                        : order.shippingStatus === "CONFIRMED" || order.statusKey === "CONFIRMED"
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-gray-50 border-gray-200"
                  }`}>
                  {order.shippingStatus === "SHIPPING" || order.statusKey === "SHIPPING" ? (
                    <Truck className="w-5 h-5 text-blue-600" />
                  ) : order.shippingStatus === "COMPLETE" || order.statusKey === "COMPLETE" ? (
                    <Package className="w-5 h-5 text-green-600" />
                  ) : (
                    <Package className="w-5 h-5 text-gray-600" />
                  )}
                </div>

                {/* Status Text */}
                <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                  <p className="font-semibold text-[16px] leading-[1.3] text-[#272424]">
                    {shippingTimelineText.status}
                  </p>
                  {shippingTimelineText.date && (
                    <div className="flex items-center gap-[6px]">
                      <svg className="w-3 h-3 text-[#737373]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-[12px] leading-[1.3] text-[#737373]">
                        {shippingTimelineText.date}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
                className="box-border flex gap-[6px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 whitespace-nowrap cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <span className="font-medium text-[13px] leading-[normal] text-[#555555]">
                  {isTimelineExpanded ? "Thu gọn" : "Xem chi tiết"}
                </span>
                <svg
                  className={`w-4 h-4 text-[#555555] transition-transform ${isTimelineExpanded ? "rotate-180" : ""}`}
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
              <div className="border-t border-[#e7e7e7] p-[16px] bg-white">
                <div className="flex flex-col gap-[16px]">
                  <div className="flex items-center gap-[8px]">
                    <div className="w-[3px] h-[16px] bg-[#e04d30] rounded-full"></div>
                    <h3 className="font-semibold text-[16px] text-[#272424]">
                      Lịch sử đơn hàng
                    </h3>
                  </div>
                  <div className="flex flex-col gap-[12px] pl-[6px]">
                    {shippingTimelineSteps.length > 0 ? (
                      shippingTimelineSteps.map((step) => (
                        <div key={step.id} className="flex items-start gap-[12px]">
                          <div className="flex items-center justify-center w-[24px] h-[24px] rounded-full bg-blue-50 border border-blue-200 shrink-0 mt-0.5">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                          <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                            <p className="font-medium text-[14px] leading-[1.3] text-[#272424]">
                              {step.status}
                            </p>
                            {step.date && (
                              <p className="font-normal text-[12px] leading-[1.3] text-[#737373]">
                                {step.date}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="font-normal text-[14px] text-[#888888] pl-[30px]">
                        Chưa có lịch sử cập nhật
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer Information & Payment Information */}
        <div className="flex flex-col lg:flex-row gap-5 w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 w-full text-[14px]">
            <h2 className="text-[18px] font-bold text-gray-900 mb-4">
              Thông tin khách hàng
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <span className="text-[14px] font-medium text-gray-700">
                  Họ và tên:
                </span>
                <span className="text-[14px] text-gray-900 text-right">
                  {order.customer.name}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-[14px] font-medium text-gray-700">
                  Số điện thoại:
                </span>
                <span className="text-[14px] text-gray-900 text-right">
                  {order.customer.phone}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-[14px] font-medium text-gray-700">
                  Địa chỉ:
                </span>
                <span className="text-[14px] text-gray-900 text-right break-words">
                  {order.customer.address}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-[14px] font-medium text-gray-700">
                  Ghi chú:
                </span>
                <span className="text-[14px] text-gray-900 text-right">
                  {order.customer.notes}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 w-full text-[14px]">
            <h2 className="text-[18px] font-bold text-gray-900 mb-4">
              Thông tin thanh toán
            </h2>

            {/* Product Sub-section */}
            <div className="mb-6">
              <h3 className="text-[14px] font-semibold text-gray-900 mb-3 bg-gray-100 py-2 px-2">
                Sản phẩm
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[14px] text-gray-700">
                  <span>Số lượng sản phẩm</span>
                  <span>{order.payment.productQuantity}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-700">
                  <span>Tổng tiền hàng</span>
                  <span>{formatCurrencyVND(order.payment.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-700">
                  <span>Giảm giá</span>
                  <span>{formatCurrencyVND(order.payment.discount)}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-700">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrencyVND(order.payment.shipping)}</span>
                </div>
              </div>
            </div>

            {/* Payment Sub-section */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-[14px] font-semibold text-gray-900 mb-3 bg-gray-100 py-2 px-2">
                Thanh toán
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-normal text-gray-900">
                    Tổng số tiền
                  </span>
                  <span className="text-[14px] font-normal text-gray-700">
                    {formatCurrencyVND(totalPayment)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-medium text-gray-700">
                    Phương thức thanh toán:
                  </span>
                  <span className="text-[14px] font-medium text-gray-900">
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-medium text-gray-700">
                    Trạng thái thanh toán:
                  </span>
                  <span className="text-[14px] font-medium text-gray-900">
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </span>
                </div>
                {shouldShowPaymentButton() && (
                  <div className="pt-3 border-t border-gray-200 mt-3">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handlePayment}
                      disabled={isProcessingPayment}
                      className="w-full !h-[40px] !bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c93d24] hover:!border-[#c93d24] disabled:!bg-gray-400 disabled:!cursor-not-allowed"
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Đang xử lý...
                        </>
                      ) : (
                        "Thanh toán ngay"
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
            className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
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
            className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-fade-in"
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
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrderDetailTab;
