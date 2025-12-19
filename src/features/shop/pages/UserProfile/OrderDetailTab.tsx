import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../../../components/ui/button";
import ActionButton from "../../../../components/shop/ActionButton";
import ProductReviewModal from "../../../../components/shop/ProductReviewModal";
import OrderTimeline, { type TimelineStep } from "../../../../components/admin/order/OrderTimeline";
import { ChipStatus } from "../../../../components/ui/chip-status";
import { getCustomerOrderDetail, cancelOrder } from "../../../../api/endpoints/websiteOrderApi";
import { createVNPayPayment } from "../../../../api/endpoints/paymentApi";
import { useAuth } from "../../../../context/AuthContext";
import { createMyReview, getMyReviews } from "../../../../api/endpoints/reviewApi";
import { uploadFile, uploadReturnOrderImages } from "../../../../api/endpoints/fileApi";
import { customerReturnOrderApi } from "../../../../api/customerReturnOrderApi";
import { formatTimelineDate, formatOrderDate } from "../../../../utils/dateUtils";
import type { CustomerOrderResponse } from "../../../../types";
import { toast } from "sonner";
import { Truck, Package, X } from "lucide-react";
import { useCustomerOrderWebSocket } from "../../../../hooks/useCustomerOrderWebSocket";
import { useQueryClient } from "@tanstack/react-query";
import { Select } from "antd";
import MediaUpload from "../../../../components/shop/MediaUpload";
import {
  PageContainer,
  ContentCard,
} from "@/components/common";
import { formatCurrencyVND } from "./utils/formatCurrency";
import { getImageUrl } from "../../../../utils/imageUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";

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
  price: number; // snapshotFinalPrice - giá sau giảm
  originalPrice: number; // snapshotProductPrice - giá gốc
  discountAmount?: number; // snapshotDiscountAmount - số tiền giảm
  variant?: string;
  quantity: number;
  sku?: string;
  isReviewed?: boolean;
  orderDetailId?: number; // Order detail ID for return order
  productDetailId?: number; // Product detail ID for return order
  productId?: number; // Product ID for navigation
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
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set());
  const [productReviews, setProductReviews] = useState<Map<string, { rating: number; comment: string; images?: string[] }>>(new Map());
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [isReturnRefundModalOpen, setIsReturnRefundModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");
  const [returnImages, setReturnImages] = useState<File[]>([]);
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isReturnSingleProduct, setIsReturnSingleProduct] = useState(false);
  const [selectedReturnProducts, setSelectedReturnProducts] = useState<Set<string>>(new Set());

  // Cancel order modal states
  const [isCancelReasonModalOpen, setIsCancelReasonModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);

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

  // Fetch user's reviews to check which products have been reviewed
  const { data: myReviewsData } = useQuery({
    queryKey: ["myReviews", orderData?.id],
    queryFn: () => getMyReviews({ page: 1, size: 100 }), // Get all reviews (up to 100)
    enabled: isAuthenticated && !!orderData?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Populate productReviews state when myReviewsData changes
  useEffect(() => {
    if (myReviewsData?.reviews && orderData?.orderDetails) {
      const newProductReviews = new Map<string, { rating: number; comment: string; images?: string[] }>();
      const newReviewedProducts = new Set<string>();

      myReviewsData.reviews.forEach((review: any) => {
        // Check if review belongs to this order
        const isSameOrder = review.orderCode === orderData.code;

        // Find matching product in order details
        const matchingDetail = orderData.orderDetails?.find(
          (detail: any) => detail.productDetailId === review.productDetailId
        );

        if ((isSameOrder || (!review.orderCode && matchingDetail)) && matchingDetail) {
          const productId = matchingDetail.id?.toString() || matchingDetail.productDetailId?.toString();
          if (productId) {
            newProductReviews.set(productId, {
              rating: review.rating,
              comment: review.judging || "",
              images: review.images || [],
            });
            newReviewedProducts.add(review.productDetailId);
          }
        }
      });

      setProductReviews(newProductReviews);
      // We don't set reviewedProducts here because it's derived in the useMemo below, 
      // but we could if we wanted to sync them. 
      // Actually, let's rely on the useMemo 'isReviewed' property for the UI list,
      // and use productReviews for the modal.
    }
  }, [myReviewsData, orderData]);

  // Transform order data for display
  const order = React.useMemo(() => {
    if (!orderData) return null;

    const incomingOrder = location.state?.order;
    // Consistent status mapping with admin view
    const getStatusDisplayName = (status: string) => {
      switch (status) {
        case "PENDING":
          return "Chờ xác nhận";
        case "CONFIRMED":
          return "Đã xác nhận";
        case "PROCESSING":
          return "Đang xử lý";
        case "SHIPPING":
          return "Đang giao hàng";
        case "COMPLETE":
          return "Đã hoàn thành";
        case "SHIPPING_FAILED":
          return "Giao hàng thất bại";
        case "RETURNED":
          return "Đã trả hàng";
        case "REFUND":
          return "Hoàn tiền";
        case "CANCELED":
          return "Đã hủy";
        default:
          return "Chờ xác nhận";
      }
    };

    const statusLabel = incomingOrder?.statusLabel || getStatusDisplayName(orderData.status || "");

    // Create a set of reviewed productDetailIds for this order
    // Prefer strict match by orderCode; fall back to productDetailId match if orderCode is missing on the review
    const reviewedProductDetailIds = new Set<number>();
    if (myReviewsData?.reviews && orderData.code) {
      myReviewsData.reviews.forEach((review: any) => {
        const sameOrder = review.orderCode === orderData.code;
        const sameProduct = review.productDetailId && (orderData.orderDetails || []).some(
          (detail: any) => detail.productDetailId === review.productDetailId
        );

        // If review belongs to this order (by code) OR review has no orderCode but matches a product in this order
        if ((sameOrder || (!review.orderCode && sameProduct)) && review.productDetailId) {
          reviewedProductDetailIds.add(review.productDetailId);
        }
      });
    }

    const products: ProductType[] = (orderData.orderDetails || []).map((detail: any, idx: number) => {
      // Construct full image URL if productImage exists
      let imageUrl = FALLBACK_IMAGE;
      if (detail.productImage && detail.productImage.trim() !== "") {
        const productImagePath = detail.productImage.trim();
        // Use utility function to get full image URL
        imageUrl = getImageUrl(productImagePath) || FALLBACK_IMAGE;
      }

      return {
        id: detail.id?.toString() || detail.productDetailId?.toString() || String(idx + 1),
        imageUrl,
        name: detail.snapshotProductName || "Sản phẩm không tên",
        price: (detail.snapshotProductPrice || 0) - (detail.snapshotDiscountAmount || 0), // Tính giá cuối = giá gốc - giảm giá
        originalPrice: detail.snapshotProductPrice || 0, // Giá gốc
        discountAmount: detail.snapshotDiscountAmount || 0, // Số tiền giảm
        variant: detail.snapshotVariantAttributes
          ?.map((attr: any) => {
            // Format as "name: value" for better clarity
            if (attr?.name && attr?.value) {
              return `${attr.name}: ${attr.value}`;
            }
            // Fallback to just value if name is missing
            return attr?.value || attr?.name;
          })
          .filter(Boolean)
          .join(" • ") || undefined,
        quantity: detail.quantity || 1,
        sku: detail.snapshotProductSku || undefined,
        isReviewed: reviewedProductDetailIds.has(detail.productDetailId), // Check if this product has been reviewed
        orderDetailId: detail.id, // Order detail ID
        productDetailId: detail.productDetailId, // Product detail ID
        productId: detail.productId, // Product ID for navigation
      };
    });

    return {
      id: orderData.id?.toString() || (orderData as any)?.orderId?.toString?.() || orderId || "N/A",
      code: orderData.code || orderId || "N/A",
      orderDate: orderData.createdAt ? formatOrderDate(orderData.createdAt) : "N/A",
      status: statusLabel,
      statusKey: orderData.status,
      products,
      orderId: orderData.id ?? (orderData as any)?.orderId, // Add orderId for review checking (fallback)
      customer: {
        // Get name from order only (receiverName from order table)
        name: orderData.receiverName || "N/A",
        // Get phone from order only (receiverPhone from order table)
        phone: orderData.receiverPhone || "N/A",
        // Get full address from order data
        address: (orderData as any).fulladdress || orderData.receiverAddress || "N/A",
        notes: orderData.notes || "-",
      },
      payment: {
        productQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
        subtotal: orderData.totalProductPrice || 0,
        // Individual discount amounts from backend
        orderDiscount: orderData.orderDiscountAmount || 0,
        productDiscount: orderData.productDiscountAmount || 0,
        totalDiscount: orderData.totalDiscountAmount || 0,
        shipping: orderData.shippingFee || 0,
        total: orderData.totalOrderPrice || 0,
        hasDiscount: (orderData.totalDiscountAmount && orderData.totalDiscountAmount > 0),
      },
      shippingStatus: orderData.shippingStatus,
      shippingDetail: orderData.shippingDetail,
      shippingOrderCode: orderData.shippingOrderCode,
      trackingNumber: orderData.trackingNumber,
      expectedDeliveryDate: orderData.expectedDeliveryDate,
      paymentStatus: orderData.paymentStatus,
      paymentMethod: orderData.method,
      reasonCancel: orderData.reasonCancel,
    };
  }, [orderData, orderId, location.state?.order]);

  const currentStatus = order ? mapOrderStatusToChipStatus(order.statusKey) : "default";

  // Get order status timeline steps (enhanced timeline - handles all order statuses)
  const getOrderStatusTimelineSteps = (): TimelineStep[] => {
    if (!order || !orderData) return [];

    // Get dates from order data
    const createdAt = orderData.createdAt ? formatTimelineDate(orderData.createdAt) : "";
    const updatedAt = orderData.updatedAt ? formatTimelineDate(orderData.updatedAt) : "";
    const status = order.statusKey?.toUpperCase() || "";

    // Handle special cases for canceled/failed orders
    if (status === "CANCELED") {
      return [
        { label: "Đặt hàng thành công", completed: true, date: createdAt },
        { label: "Đã hủy đơn hàng", completed: true, date: updatedAt },
      ];
    }

    if (status === "SHIPPING_FAILED") {
      return [
        { label: "Đặt hàng thành công", completed: true, date: createdAt },
        { label: "Đã xác nhận", completed: true, date: updatedAt || createdAt },
        { label: "Đang vận chuyển", completed: true, date: updatedAt },
        { label: "Giao hàng thất bại", completed: true, date: updatedAt },
      ];
    }

    if (status === "RETURNED" || status === "REFUND") {
      return [
        { label: "Đặt hàng thành công", completed: true, date: createdAt },
        { label: "Đã xác nhận", completed: true, date: updatedAt || createdAt },
        { label: "Đang vận chuyển", completed: true, date: updatedAt },
        { label: status === "RETURNED" ? "Đã trả hàng" : "Đã hoàn tiền", completed: true, date: updatedAt },
      ];
    }

    // Normal flow timeline for successful orders
    const steps: TimelineStep[] = [
      { label: "Đặt hàng thành công", completed: false },
      { label: "Đã xác nhận", completed: false },
      { label: "Đang vận chuyển", completed: false },
      { label: "Đã nhận hàng", completed: false },
    ];

    // Step 1: Order placed - always completed
    steps[0].completed = true;
    steps[0].date = createdAt;

    // Step 2: Confirmed - completed if status is CONFIRMED or later
    if (["CONFIRMED", "PROCESSING", "SHIPPING", "COMPLETE"].includes(status)) {
      steps[1].completed = true;
      steps[1].date = updatedAt || createdAt;
    }

    // Step 3: Shipping - completed if status is SHIPPING or COMPLETE
    if (["SHIPPING", "COMPLETE"].includes(status)) {
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

    // Step 4: Delivered - completed only if status is COMPLETE
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

  // Map cancel reason enum to Vietnamese (for customer view - using "Tôi" instead of "Khách hàng")
  const getCancelReasonLabel = (reason?: string | null): string => {
    if (!reason) return "Chưa có lý do";
    switch (reason) {
      case "CUSTOMER_CHANGE_MIND":
        return "Tôi đổi ý";
      case "CUSTOMER_NOT_WANT":
        return "Tôi không muốn mua nữa";
      case "CUSTOMER_NOT_RESPONDING":
        return "Không liên lạc được";
      case "CUSTOMER_REFUSED":
        return "Từ chối nhận hàng";
      case "CUSTOMER_FOUND_CHEAPER":
        return "Tôi tìm được giá rẻ hơn";
      case "CUSTOMER_WRONG_ORDER":
        return "Tôi đặt nhầm đơn hàng";
      case "CUSTOMER_ADDRESS_WRONG":
        return "Tôi nhập sai địa chỉ";
      case "CUSTOMER_NO_MONEY":
        return "Tôi không đủ tiền";
      case "CUSTOMER_DELAYED_DELIVERY":
        return "Tôi không hài lòng về thời gian giao hàng";
      case "CUSTOMER_PRODUCT_NOT_MATCH":
        return "Sản phẩm không đúng như mô tả";
      case "CUSTOMER_CANCEL_BEFORE_SHIP":
        return "Tôi hủy trước khi giao hàng";
      case "OUT_OF_STOCK":
        return "Hết hàng";
      case "PRICE_CHANGED":
        return "Giá sản phẩm thay đổi";
      case "DELIVERY_ISSUE":
        return "Vấn đề giao hàng";
      case "PAYMENT_FAILED":
        return "Thanh toán thất bại";
      case "DUPLICATE_ORDER":
        return "Đơn hàng trùng lặp";
      case "SYSTEM_ERROR":
        return "Lỗi hệ thống";
      case "SHOP_CANNOT_FULFILL":
        return "Shop không thể thực hiện đơn hàng";
      case "OTHER":
        return "Lý do khác";
      default:
        return reason;
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

  // Handle open cancel reason modal
  const handleOpenCancelModal = () => {
    if (!order || !order.orderId) {
      toast.error("Không tìm thấy thông tin đơn hàng");
      return;
    }

    // Only allow canceling if status is PENDING or CONFIRMED
    if (order.statusKey !== "PENDING" && order.statusKey !== "CONFIRMED") {
      toast.error("Chỉ có thể hủy đơn hàng khi trạng thái là chờ xác nhận hoặc đã xác nhận");
      return;
    }

    setIsCancelReasonModalOpen(true);
    setCancelReason("");
  };

  // Handle proceed to confirm after selecting reason
  const handleProceedToConfirm = () => {
    if (!cancelReason) {
      toast.error("Vui lòng chọn lý do hủy đơn hàng");
      return;
    }
    setIsCancelReasonModalOpen(false);
    setShowCancelConfirmDialog(true);
  };

  // Handle cancel order (final confirmation)
  const handleCancelOrder = async () => {
    if (!order || !order.orderId) {
      toast.error("Không tìm thấy thông tin đơn hàng");
      return;
    }

    try {
      setIsCancellingOrder(true);
      setShowCancelConfirmDialog(false);
      const response = await cancelOrder(order.orderId, cancelReason || undefined);

      toast.success("Hủy đơn hàng thành công", {
        description: response.message || "Đơn hàng của bạn đã được hủy.",
        duration: 3000,
      });

      // Invalidate and refetch order data for better UX
      await queryClient.invalidateQueries({
        queryKey: ["customerOrderDetail", orderCode]
      });

      // Also invalidate the orders list if user navigates back
      await queryClient.invalidateQueries({
        queryKey: ["customerOrders"]
      });

      setIsCancellingOrder(false);
      setCancelReason("");

      // Optional: Navigate back to orders list after successful cancellation
      // Uncomment the line below if you want to redirect after cancellation
      // navigate("/user/profile/orders", { state: { activeTab: "cancelled" } });
    } catch (error: any) {
      console.error("Error canceling order:", error);

      // Provide specific error messages based on status codes
      let errorMessage = "Không thể hủy đơn hàng. Vui lòng thử lại.";

      if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || "Đơn hàng không thể hủy trong trạng thái hiện tại.";
      } else if (error?.response?.status === 404) {
        errorMessage = "Không tìm thấy đơn hàng.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Bạn không có quyền hủy đơn hàng này.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error("Hủy đơn hàng thất bại", {
        description: errorMessage,
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
            onClick={() => navigate("/user/profile/orders")}
            className="bg-[#E04D30] hover:bg-[#c93d24] text-white border-[#E04D30]"
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
            onClick={() => navigate("/user/profile/orders")}
            className="bg-[#E04D30] hover:bg-[#c93d24] text-white border-[#E04D30]"
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
      <ContentCard>
        {/* Header */}
        <div className="pl-0 pr-3 sm:pr-6 bg-white border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                navigate("/user/profile/orders", {
                  state: { activeTab: currentStatus },
                });
              }}
              className="flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Quay lại"
            >
              <ArrowLeftIcon />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Chi tiết đơn hàng
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 bg-gray-50 rounded-lg w-full">
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
          <ChipStatus status={currentStatus} labelOverride={order.status} />
        </div>

        {/* Product Details */}
        <div className="space-y-4 w-full">
          {order.products.map((product: ProductType, index: number) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row gap-4 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
              onClick={() => {
                if (product.productId) {
                  navigate(`/shop/products/${product.productId}`);
                }
              }}
            >
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

              <div className="flex-1 flex flex-col justify-center gap-2">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
                  {product.name}
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  {/* 1. Giá gốc */}
                  {product.originalPrice && product.originalPrice > 0 && (
                    <span key="original" className="text-sm text-gray-500 line-through">
                      {formatCurrencyVND(product.originalPrice)}
                    </span>
                  )}

                  {/* 2. Giá sau giảm */}
                  {product.price > 0 && (
                    <span key="price" className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded border border-green-200">
                      {formatCurrencyVND(product.price)}
                    </span>
                  )}

                  {/* 3. Số tiền giảm (nếu có) */}
                  {product.discountAmount && product.discountAmount > 0 && (
                    <span key="discount" className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">
                      -{formatCurrencyVND(product.discountAmount)}
                    </span>
                  )}

                  {/* 4. Biến thể */}
                  {product.variant && (
                    <div key="variant" className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-700">
                      <span className="text-xs font-medium">
                        {product.variant}
                      </span>
                    </div>
                  )}

                  {/* 5. Số lượng */}
                  {product.quantity > 0 && (
                    <span className="text-sm text-gray-600 font-medium">
                      x{product.quantity}
                    </span>
                  )}
                </div>

                {product.sku && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>SKU: {product.sku}</span>
                  </div>
                )}

                {/* Reviewed Indicator */}
                {product.isReviewed && (
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 w-fit">
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-medium">Đã đánh giá</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Action Buttons - Only show for delivered orders */}
          {currentStatus === "delivered" && (
            <div className="flex flex-col justify-end sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-100">
              <Button
                onClick={() => {
                  const first = order.products[0];
                  const targetId = first?.productId || first?.productDetailId;
                  if (!targetId) {
                    toast.error("Không tìm thấy sản phẩm để mua lại");
                    return;
                  }
                  navigate(`/shop/products/${targetId}`);
                }}
                className="flex-1 sm:flex-none h-11 bg-[#18345c] hover:bg-[#0f2545] text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a1 1 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
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
                    onClick: async () => {
                      if (!order?.orderId) {
                        toast.error("Không tìm thấy thông tin đơn hàng");
                        return;
                      }

                      try {
                        // Check if order is eligible for return
                        const canReturn = await customerReturnOrderApi.checkReturnEligibility(order.orderId);

                        if (!canReturn) {
                          toast.error("Đơn hàng này không đủ điều kiện để hoàn trả", {
                            description: "Vui lòng liên hệ với bộ phận hỗ trợ để được hỗ trợ thêm.",
                            duration: 5000,
                          });
                          return;
                        }

                        // Open return refund modal
                        setIsReturnRefundModalOpen(true);
                      } catch (error: any) {
                        console.error("Error checking return eligibility:", error);
                        toast.error("Không thể kiểm tra điều kiện hoàn trả", {
                          description: error.message || "Vui lòng thử lại sau",
                          duration: 5000,
                        });
                      }
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

          {/* Cancel Order Button - Only show for pending or confirmed orders */}
          {(currentStatus === "pending" || currentStatus === "confirmed") && (
            <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={handleOpenCancelModal}
                disabled={isCancellingOrder}
                className="mb-5 h-11 bg-white border border-red-300 text-red-600 hover:bg-red-600 hover:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg font-medium transition-colors duration-200 px-6"
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

        {/* Order Status Timeline (Enhanced Timeline - Overview) */}
        <OrderTimeline steps={orderStatusTimelineSteps} orderStatus={order.statusKey || ""} />

        {/* Shipping Timeline (New Timeline - Detailed) - Only show if shippingDetail exists */}
        {order.shippingDetail && (
          <div className="mt-5 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
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
        <div className="mt-5 flex flex-col lg:flex-row gap-6 w-full max-w-none">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-6 sm:px-6 sm:py-8 w-full">
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
              {/* Show cancel reason if order is canceled */}
              {order.statusKey === "CANCELED" && order.reasonCancel && (
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-red-600 block mb-1">
                      Lý do hủy đơn hàng
                    </span>
                    <span className="text-base font-semibold text-red-900">
                      {getCancelReasonLabel(order.reasonCancel)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-6 sm:px-6 sm:py-8 w-full">
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Thông tin thanh toán
              </h2>
            </div>

            {/* Payment Sub-section */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                Thông tin thanh toán
              </h3>
              <div className="space-y-4">
                {/* Payment calculation breakdown */}
                {order.payment.hasDiscount && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-3">Chi tiết tính toán giá</div>
                    <div className="space-y-2 text-sm">
                      {/* Bước 1: Tổng tiền gốc */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">1. Tổng tiền hàng (chưa giảm giá):</span>
                        <span className="font-medium">{formatCurrencyVND(order.payment.subtotal)}</span>
                      </div>

                      {/* Bước 2: Giảm giá sản phẩm */}
                      {order.payment.productDiscount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span className="pl-2">2. Trừ giảm giá sản phẩm:</span>
                          <span className="font-medium">-{formatCurrencyVND(order.payment.productDiscount)}</span>
                        </div>
                      )}

                      {/* Bước 3: Giảm giá đơn hàng */}
                      {order.payment.orderDiscount > 0 && (
                        <div className="flex justify-between text-orange-600">
                          <span className="pl-2">3. Trừ giảm giá đơn hàng (voucher):</span>
                          <span className="font-medium">-{formatCurrencyVND(order.payment.orderDiscount)}</span>
                        </div>
                      )}

                      {/* Tiền sau giảm giá */}
                      <div className="flex justify-between text-green-700 bg-green-50 px-2 py-1 rounded">
                        <span className="font-medium">= Tiền sau giảm giá:</span>
                        <span className="font-semibold">{formatCurrencyVND(order.payment.subtotal - order.payment.totalDiscount)}</span>
                      </div>

                      {/* Bước 4: Phí ship */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">4. Cộng phí vận chuyển:</span>
                        <span className="font-medium">+{formatCurrencyVND(order.payment.shipping)}</span>
                      </div>

                      {/* Kết quả cuối */}
                      <div className="border-t border-gray-300 pt-2 mt-3">
                        <div className="flex justify-between font-semibold text-blue-700">
                          <span>= Tổng cuối cùng phải trả:</span>
                          <span className="text-lg">{formatCurrencyVND(totalPayment)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-600 p-3 rounded-lg text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium opacity-90">
                      Tổng số tiền
                    </span>
                    <span className="text-xl font-bold">
                      {formatCurrencyVND(totalPayment)}
                    </span>
                  </div>
                  {order.payment.hasDiscount && (
                    <div className="text-xs opacity-80 mt-1">
                      Đã bao gồm giảm giá {formatCurrencyVND(order.payment.totalDiscount)}
                    </div>
                  )}
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
              originalPrice: product.originalPrice,
              finalPrice: product.price,
              discountAmount: product.discountAmount,
              quantity: product.quantity,
            }))}
            initialReviews={productReviews}
            isSubmitting={isSubmittingReview}
            onSubmit={async (reviews) => {
              if (!user?.id || !order?.orderId) {
                toast.error("Không thể xác thực thông tin người dùng hoặc đơn hàng");
                return;
              }

              setIsSubmittingReview(true);
              try {
                // Store image URLs for each review
                const reviewImageUrlsMap = new Map<string, string[]>();

                // Submit each review
                for (const review of reviews) {
                  // Find the product detail ID from selectedProducts
                  const product = selectedProducts.find(p => p.id === review.productId);
                  if (!product?.productDetailId) {
                    console.error(`Product detail ID not found for product ${review.productId}`);
                    continue;
                  }

                  // Upload images if any
                  let imageUrls: string[] = [];
                  if (review.images && review.images.length > 0) {
                    try {
                      const uploadPromises = review.images.map(file => uploadFile(file, 'reviews'));
                      imageUrls = await Promise.all(uploadPromises);
                    } catch (uploadError) {
                      console.error("Error uploading review images:", uploadError);
                      toast.error("Không thể tải lên một số hình ảnh");
                      // Continue with review creation even if image upload fails
                    }
                  }

                  // Store image URLs for this review
                  reviewImageUrlsMap.set(review.productId, imageUrls);

                  // Create review via customer API endpoint
                  // This endpoint uses orderId and productDetailId, backend will find orderHistoryId automatically
                  await createMyReview({
                    orderId: order.orderId!,
                    productDetailId: product.productDetailId!,
                    images: imageUrls.length > 0 ? imageUrls : undefined,
                    rating: review.rating,
                    judging: review.comment || undefined,
                  });
                }

                // Update local state
                reviews.forEach((review) => {
                  if (!reviewedProducts.has(review.productId)) {
                    setReviewedProducts((prev) => new Set(prev).add(review.productId));
                  }
                  setProductReviews((prev) => {
                    const newMap = new Map(prev);
                    newMap.set(review.productId, {
                      rating: review.rating,
                      comment: review.comment,
                      images: reviewImageUrlsMap.get(review.productId) || [], // Store the uploaded URLs
                    });
                    return newMap;
                  });
                });

                // Invalidate reviews queries to refresh the reviews list
                await queryClient.invalidateQueries({ queryKey: ["reviews"] });
                await queryClient.invalidateQueries({ queryKey: ["myReviews"] });
                await queryClient.invalidateQueries({ queryKey: ["product-reviews"] });
                await queryClient.invalidateQueries({ queryKey: ["customerOrderDetail", orderCode] });

                setIsReviewModalOpen(false);
                setShowSuccessModal(true);
                setSelectedProducts([]);
                toast.success("Đánh giá đã được gửi thành công!");
              } catch (error: any) {
                console.error("Error submitting reviews:", error);
                const errorMessage = error?.response?.data?.message || error?.message || "Không thể gửi đánh giá. Vui lòng thử lại.";
                toast.error(errorMessage);
              } finally {
                setIsSubmittingReview(false);
              }
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
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
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

        {/* Return/Refund Request Modal */}
        {isReturnRefundModalOpen && order && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setIsReturnRefundModalOpen(false);
                setReturnReason("");
                setReturnDescription("");
                setReturnImages([]);
                setIsReturnSingleProduct(false);
                setSelectedReturnProducts(new Set());
              }}
            />

            {/* Modal Content */}
            <div
              id="return-refund-modal-content"
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Yêu cầu hoàn trả hàng
                  </h2>
                  <button
                    onClick={() => {
                      setIsReturnRefundModalOpen(false);
                      setReturnReason("");
                      setReturnDescription("");
                      setReturnImages([]);
                      setIsReturnSingleProduct(false);
                      setSelectedReturnProducts(new Set());
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    aria-label="Đóng"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Đơn hàng: #{order.code} • Ngày đặt: {order.orderDate}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                {/* Products List */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Sản phẩm trong đơn hàng
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isReturnSingleProduct}
                        onChange={(e) => {
                          setIsReturnSingleProduct(e.target.checked);
                          if (!e.target.checked) {
                            setSelectedReturnProducts(new Set());
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        Hoàn trả một sản phẩm
                      </span>
                    </label>
                  </div>
                  <div className="space-y-3">
                    {order.products.map((product) => (
                      <div
                        key={product.id}
                        className={`flex gap-3 p-3 rounded-lg border transition-all ${isReturnSingleProduct
                          ? selectedReturnProducts.has(product.id)
                            ? "bg-blue-50 border-blue-300"
                            : "bg-gray-50 border-gray-200"
                          : "bg-gray-50 border-gray-200"
                          }`}
                      >
                        {isReturnSingleProduct && (
                          <div className="flex items-center pt-1">
                            <input
                              type="checkbox"
                              checked={selectedReturnProducts.has(product.id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedReturnProducts);
                                if (e.target.checked) {
                                  newSelected.add(product.id);
                                } else {
                                  newSelected.delete(product.id);
                                }
                                setSelectedReturnProducts(newSelected);
                              }}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        )}
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          onError={handleImageError}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-semibold text-red-600">
                              {formatCurrencyVND(product.price)}
                            </span>
                            {product.variant && (
                              <span className="text-xs text-gray-600">
                                • {product.variant}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              x{product.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {isReturnSingleProduct && selectedReturnProducts.size === 0 && (
                    <p className="text-sm text-red-600 mt-2">
                      Vui lòng chọn ít nhất một sản phẩm để hoàn trả
                    </p>
                  )}
                </div>

                {/* Form */}
                <div className="space-y-5">
                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lý do hoàn trả <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={returnReason}
                      onChange={(value) => setReturnReason(value)}
                      placeholder="Chọn lý do hoàn trả"
                      className="w-full"
                      size="large"
                      getPopupContainer={() => {
                        const modalContent = document.getElementById("return-refund-modal-content");
                        return modalContent || document.body;
                      }}
                      popupClassName="!z-[10001]"
                      options={[
                        { value: "EMPTY_PACKAGE", label: "Thùng hàng rỗng" },
                        { value: "NOT_RECEIVED", label: "Chưa nhận được hàng" },
                        { value: "BROKEN", label: "Bể vỡ" },
                        { value: "WRONG_MODEL", label: "Sai mẫu" },
                        { value: "DEFECTIVE", label: "Hàng lỗi" },
                        { value: "DIFFERENT_DESCRIPTION", label: "Khác mô tả" },
                        { value: "WRONG_SIZE", label: "Không đúng kích thước" },
                        { value: "WRONG_COLOR", label: "Không đúng màu sắc" },
                        { value: "NOT_FIT", label: "Không vừa" },
                        { value: "EXPIRED", label: "Hàng hết hạn" },
                        { value: "DAMAGED", label: "Hàng bị hư hỏng" },
                        { value: "MISSING_PARTS", label: "Thiếu phụ kiện" },
                        { value: "OTHER", label: "Lý do khác" },
                      ]}
                    />
                  </div>

                  {/* Return Reason Note */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chi tiết lý do <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={returnDescription}
                      onChange={(e) => setReturnDescription(e.target.value)}
                      placeholder="Vui lòng mô tả chi tiết lý do bạn muốn trả hàng..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Mô tả càng chi tiết sẽ giúp chúng tôi xử lý yêu cầu của bạn nhanh hơn
                    </p>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh minh chứng (tùy chọn)
                    </label>
                    <MediaUpload
                      accept="image"
                      maxFiles={6}
                      files={returnImages}
                      onChange={setReturnImages}
                      variant="dashed"
                      showPreview={true}
                      helperText="Tải lên tối đa 6 ảnh để minh chứng vấn đề"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <Button
                  onClick={() => {
                    setIsReturnRefundModalOpen(false);
                    setReturnReason("");
                    setReturnDescription("");
                    setReturnImages([]);
                    setIsReturnSingleProduct(false);
                    setSelectedReturnProducts(new Set());
                  }}
                  disabled={isSubmittingReturn}
                  variant="outline"
                  className="px-6"
                >
                  Hủy
                </Button>
                <Button
                  onClick={async () => {
                    // Validate
                    if (!returnReason) {
                      toast.error("Vui lòng chọn lý do hoàn trả");
                      return;
                    }
                    if (!returnDescription.trim()) {
                      toast.error("Vui lòng nhập mô tả chi tiết");
                      return;
                    }

                    // Validate: if single product return is selected, must have at least one product selected
                    if (isReturnSingleProduct && selectedReturnProducts.size === 0) {
                      toast.error("Vui lòng chọn ít nhất một sản phẩm để hoàn trả");
                      return;
                    }

                    // Get products to return
                    const productsToReturn = isReturnSingleProduct
                      ? order.products.filter((p) => selectedReturnProducts.has(p.id))
                      : order.products;

                    // Validate products have required IDs
                    const invalidProducts = productsToReturn.filter(
                      (p) => !p.orderDetailId || !p.productDetailId
                    );
                    if (invalidProducts.length > 0) {
                      toast.error("Thông tin sản phẩm không đầy đủ. Vui lòng thử lại.");
                      return;
                    }

                    try {
                      setIsSubmittingReturn(true);

                      // Map reason to returnType and returnReason enum
                      const getReturnType = (): string => {
                        // Return type is usually "RETURN" for most cases
                        return "RETURN";
                      };

                      const getReturnReasonEnum = (reason: string): string => {
                        // Reason is already in enum format (UPPER_SNAKE_CASE)
                        // Just validate and return, default to OTHER if invalid
                        const validReasons = [
                          "EMPTY_PACKAGE", "NOT_RECEIVED", "BROKEN", "WRONG_MODEL",
                          "DEFECTIVE", "DIFFERENT_DESCRIPTION", "WRONG_SIZE", "WRONG_COLOR",
                          "NOT_FIT", "EXPIRED", "DAMAGED", "MISSING_PARTS", "OTHER"
                        ];
                        return validReasons.includes(reason) ? reason : "OTHER";
                      };

                      // Upload images if any
                      let imageUrls: string[] = [];
                      if (returnImages && returnImages.length > 0) {
                        try {
                          imageUrls = await uploadReturnOrderImages(returnImages);
                        } catch (uploadError) {
                          console.error("Error uploading return images:", uploadError);
                          toast.error("Không thể tải lên một số hình ảnh");
                          // Continue with return order creation even if image upload fails
                        }
                      }

                      // Prepare return order details (only selected products if single product return)
                      const returnOrderDetails = productsToReturn.map((product) => ({
                        orderDetailId: product.orderDetailId!,
                        productDetailId: product.productDetailId!,
                        returnQuantity: product.quantity || 1,
                        notes: "", // Notes for individual product detail (optional)
                      }));

                      // Create return order request
                      const request = {
                        orderId: Number(order.orderId ?? (orderData as any)?.orderId),
                        returnType: getReturnType(),
                        returnReason: getReturnReasonEnum(returnReason),
                        returnReasonNote: returnDescription, // Chi tiết lý do từ người dùng
                        notes: "", // General notes (optional, can be empty)
                        images: imageUrls.length > 0 ? imageUrls : undefined,
                        returnOrderDetails,
                      };

                      // Call API to create return order
                      const response = await customerReturnOrderApi.createReturnOrder(request);

                      toast.success("Tạo yêu cầu hoàn trả hàng thành công!", {
                        description: `Mã yêu cầu: ${response.code || response.id}`,
                        duration: 5000,
                      });

                      // Close modal and reset form
                      setIsReturnRefundModalOpen(false);
                      setReturnReason("");
                      setReturnDescription("");
                      setReturnImages([]);
                      setIsReturnSingleProduct(false);
                      setSelectedReturnProducts(new Set());

                      // Refresh order data
                      await queryClient.invalidateQueries({
                        queryKey: ["customerOrderDetail", orderCode]
                      });
                    } catch (error: any) {
                      console.error("Error creating return order:", error);
                      toast.error("Không thể tạo yêu cầu hoàn trả hàng", {
                        description: error.message || "Vui lòng thử lại sau",
                        duration: 5000,
                      });
                    } finally {
                      setIsSubmittingReturn(false);
                    }
                  }}
                  disabled={isSubmittingReturn || !returnReason || !returnDescription.trim()}
                  className="px-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
                >
                  {isSubmittingReturn ? "Đang xử lý..." : "Gửi yêu cầu"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Order Reason Modal */}
        {isCancelReasonModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setIsCancelReasonModalOpen(false);
                setCancelReason("");
              }}
            />

            {/* Modal Content */}
            <div
              id="cancel-reason-modal-content"
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all z-[10000]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Lý do hủy đơn hàng
                  </h2>
                  <button
                    onClick={() => {
                      setIsCancelReasonModalOpen(false);
                      setCancelReason("");
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    aria-label="Đóng"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Đơn hàng: #{order?.code} • Ngày đặt: {order?.orderDate}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vui lòng chọn lý do hủy đơn hàng <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={cancelReason}
                    onChange={(value) => setCancelReason(value)}
                    placeholder="Chọn lý do hủy đơn hàng"
                    className="w-full"
                    size="large"
                    getPopupContainer={() => {
                      const modalContent = document.getElementById("cancel-reason-modal-content");
                      return modalContent || document.body;
                    }}
                    popupClassName="!z-[10001]"
                    options={[
                      { value: "CUSTOMER_CHANGE_MIND", label: "Tôi đổi ý" },
                      { value: "CUSTOMER_NOT_WANT", label: "Tôi không muốn mua nữa" },
                      { value: "CUSTOMER_FOUND_CHEAPER", label: "Tôi tìm được giá rẻ hơn" },
                      { value: "CUSTOMER_WRONG_ORDER", label: "Tôi đặt nhầm đơn hàng" },
                      { value: "CUSTOMER_ADDRESS_WRONG", label: "Tôi nhập sai địa chỉ" },
                      { value: "CUSTOMER_NO_MONEY", label: "Tôi không đủ tiền" },
                      { value: "CUSTOMER_DELAYED_DELIVERY", label: "Tôi không hài lòng về thời gian giao hàng" },
                      { value: "CUSTOMER_PRODUCT_NOT_MATCH", label: "Sản phẩm không đúng như mô tả" },
                      { value: "CUSTOMER_CANCEL_BEFORE_SHIP", label: "Tôi hủy trước khi giao hàng" },
                      { value: "OTHER", label: "Lý do khác" },
                    ]}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <Button
                  onClick={() => {
                    setIsCancelReasonModalOpen(false);
                    setCancelReason("");
                  }}
                  variant="outline"
                  className="px-6"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleProceedToConfirm}
                  disabled={!cancelReason}
                  className="px-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Order Confirmation AlertDialog */}
        <AlertDialog open={showCancelConfirmDialog} onOpenChange={setShowCancelConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn hủy đơn hàng #{order?.code}?
                <br />
                <br />
                <strong>Lý do hủy:</strong> {
                  cancelReason === "CUSTOMER_CHANGE_MIND" ? "Khách hàng đổi ý" :
                    cancelReason === "CUSTOMER_NOT_WANT" ? "Khách hàng không muốn mua nữa" :
                      cancelReason === "CUSTOMER_FOUND_CHEAPER" ? "Khách hàng tìm được giá rẻ hơn" :
                        cancelReason === "CUSTOMER_WRONG_ORDER" ? "Khách hàng đặt nhầm đơn hàng" :
                          cancelReason === "CUSTOMER_ADDRESS_WRONG" ? "Khách hàng nhập sai địa chỉ" :
                            cancelReason === "CUSTOMER_NO_MONEY" ? "Khách hàng không đủ tiền" :
                              cancelReason === "CUSTOMER_DELAYED_DELIVERY" ? "Khách hàng không hài lòng về thời gian giao hàng" :
                                cancelReason === "CUSTOMER_PRODUCT_NOT_MATCH" ? "Sản phẩm không đúng như mô tả" :
                                  cancelReason === "CUSTOMER_CANCEL_BEFORE_SHIP" ? "Khách hàng hủy trước khi giao hàng" :
                                    cancelReason === "OTHER" ? "Lý do khác" :
                                      "Chưa chọn lý do"
                }
                <br />
                <br />
                <span className="text-red-600 font-semibold">
                  Lưu ý: Sau khi hủy, đơn hàng sẽ không thể khôi phục được.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowCancelConfirmDialog(false);
                  setCancelReason("");
                }}
                disabled={isCancellingOrder}
              >
                Không, giữ lại đơn hàng
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelOrder}
                disabled={isCancellingOrder}
                className="bg-red-600 hover:bg-red-700"
              >
                {isCancellingOrder ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  "Có, hủy đơn hàng"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ContentCard>
    </PageContainer>
  );
};

export default OrderDetailTab;
