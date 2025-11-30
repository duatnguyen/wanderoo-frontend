// src/pages/admin/AdminOrderDetailWebsite.tsx
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Truck,
  Wallet,
  Package,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer, ContentCard } from "@/components/common";
import { getAdminCustomerOrderDetail, confirmOrder, createShippingOrder, cancelAdminOrder, updateShippingStatus } from "@/api/endpoints/websiteOrderApi";
import type { CustomerOrderResponse } from "@/types/orders";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import PaymentTableHeader from '../../../../../components/admin/order/PaymentTableHeader';
import PaymentTableItem from '../../../../../components/admin/order/PaymentTableItem';
import PaymentSummaryWebsite from '../../../../../components/admin/order/PaymentSummaryWebsite';
import PaymentInformationWebsite from '../../../../../components/admin/order/PaymentInformationWebsite';
import DeliveryConfirmationPopupWebsite from '../../../../../components/admin/order/DeliveryConfirmationPopupWebsite';
import ActionButtonsWebsite from '../../../../../components/admin/order/ActionButtonsWebsite';
import WebsiteOrderInfo from '../../../../../components/admin/order/WebsiteOrderInfo';
import { toast } from "sonner";
import { useWebSocket } from "@/hooks/useWebSocket";
// Map shipping status (GHN) to Vietnamese for admin view
const mapShippingStatusToLabel = (status?: string | null): string => {
  if (!status) return "Chưa có thông tin";
  const normalized = status.toLowerCase();
  const map: Record<string, string> = {
    ready_to_pick: "Chờ lấy hàng",
    picking: "Đang lấy hàng",
    cancel: "Đã hủy vận chuyển",
    money_collect_picking: "Shipper tương tác với người gửi",
    picked: "Đã lấy hàng",
    storing: "Đang ở kho GHN",
    transporting: "Đang trung chuyển",
    sorting: "Đang phân loại tại kho",
    delivering: "Đang giao hàng",
    money_collect_delivering: "Shipper tương tác với người nhận",
    delivered: "Giao hàng thành công",
    delivery_fail: "Giao hàng thất bại",
    waiting_to_return: "Chờ giao lại / chuyển hoàn",
    return: "Chờ chuyển hoàn",
    return_transporting: "Hàng hoàn đang trung chuyển",
    return_sorting: "Hàng hoàn đang phân loại",
    returning: "Đang hoàn hàng",
    return_fail: "Chuyển hoàn thất bại",
    returned: "Đã hoàn hàng cho người bán",
    exception: "Đơn hàng ngoại lệ",
    damage: "Hàng hư hỏng",
    lost: "Hàng thất lạc",
  };
  return map[normalized] || status;
};

const AdminOrderDetailWebsite: React.FC = () => {
  const navigate = useNavigate();
  // URL param hiện đang giữ tên orderId nhưng giá trị thực là order code (string)
  const { orderId } = useParams<{ orderId: string }>();
  const orderCode = (orderId || "").trim();

  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [showConfirmOrderDialog, setShowConfirmOrderDialog] = useState(false);
  const [showCancelOrderDialog, setShowCancelOrderDialog] = useState(false);
  const [confirmingOrder, setConfirmingOrder] = useState(false);
  const [orderData, setOrderData] = useState<CustomerOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingShippingStatus, setIsEditingShippingStatus] = useState(false);
  const [selectedShippingStatus, setSelectedShippingStatus] = useState<string>("");
  const [updatingShippingStatus, setUpdatingShippingStatus] = useState(false);
  const [showUpdateShippingStatusDialog, setShowUpdateShippingStatusDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPING":
        return "Đang giao";
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
        return status;
    }
  };

  useEffect(() => {
    if (orderCode) {
      loadOrderDetail(orderCode);
    }
  }, [orderCode]);

  // WebSocket subscription for real-time order updates
  useWebSocket({
    autoConnect: true,
    topics: [
      "/topic/orders/updates",
      `/topic/orders/detail/${orderCode}`,
    ],
    onMessage: (message: CustomerOrderResponse) => {
      // Only update if this is the current order
      if (message.code === orderCode || message.code === orderData?.code) {
        setOrderData(message);
        toast.success("Đơn hàng đã được cập nhật", {
          description: `Trạng thái: ${getStatusDisplayName(message.status || "")}`,
          duration: 3000,
        });
      }
    },
    onError: (error) => {
      console.error("[AdminOrderDetailWebsite] WebSocket error:", error);
    },
  });

  const loadOrderDetail = async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      const trimmedCode = code.trim();
      const response = await getAdminCustomerOrderDetail(trimmedCode);
      setOrderData(response);
    } catch (err) {
      console.error('Error loading order detail:', err);
      setError('Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };


  const handleConfirmOrder = () => {
    // Nếu trạng thái là PENDING, chỉ xác nhận đơn hàng (không tạo vận đơn)
    if (orderData?.status === "PENDING") {
      setShowConfirmOrderDialog(true);
    } else {
      // Nếu trạng thái là CONFIRMED, mở popup xác nhận giao hàng và tạo vận đơn
    setShowDeliveryPopup(true);
    }
  };

  const handleConfirmOrderConfirm = async () => {
    if (!orderData?.id) return;

    try {
      setConfirmingOrder(true);
      await confirmOrder(orderData.id);
      // Reload order data after confirmation
      await loadOrderDetail(orderData.code || orderCode);
      setShowConfirmOrderDialog(false);
      toast.success("Đơn hàng đã được xác nhận thành công!");
    } catch (error: any) {
      console.error("Error confirming order:", error);
      const errorMessage = error?.response?.data?.message
        || error?.message
        || "Có lỗi xảy ra khi xác nhận đơn hàng";
      toast.error(errorMessage);
    } finally {
      setConfirmingOrder(false);
    }
  };

  const handleDeliveryConfirm = async (data: {
    pickShift: number[];
    requiredNote: string;
    paymentTypeId: number;
    serviceTypeId: number;
    note?: string;
  }) => {
    if (!orderData?.id) return;

    try {
      // API create shipping dùng numeric id từ orderData
      await createShippingOrder(orderData.id, data);
      // Reload order data after confirmation theo order code
      await loadOrderDetail(orderData.code || orderCode);
      // Toast success is already shown in DeliveryConfirmationPopupWebsite
    } catch (error: any) {
      console.error("Error confirming order:", error);
      // Extract error message from response
      const errorMessage = error?.response?.data?.message
        || error?.message
        || "Có lỗi xảy ra khi xác nhận đơn hàng";
      // Re-throw to let DeliveryConfirmationPopupWebsite handle the toast
      throw new Error(errorMessage);
    }
  };

  const handleCancelOrder = () => {
    // Hiển thị dialog xác nhận hủy đơn hàng
    setShowCancelOrderDialog(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderData?.id) return;

    try {
      setConfirmingOrder(true);
      await cancelAdminOrder(orderData.id);
      // Reload order data after cancellation
      await loadOrderDetail(orderData.code || orderCode);
      setShowCancelOrderDialog(false);
      toast.success("Đơn hàng đã được hủy thành công!");
    } catch (error: any) {
      console.error("Error canceling order:", error);
      const errorMessage = error?.response?.data?.message
        || error?.message
        || "Có lỗi xảy ra khi hủy đơn hàng";
      toast.error(errorMessage);
    } finally {
      setConfirmingOrder(false);
    }
  };

  const handleEditShippingStatus = () => {
    setIsEditingShippingStatus(true);
    // Ensure the status is in uppercase to match enum values
    setSelectedShippingStatus((orderData?.shippingStatus || "").toUpperCase());
  };

  const handleCancelEditShippingStatus = () => {
    setIsEditingShippingStatus(false);
    setSelectedShippingStatus("");
  };

  const handleUpdateShippingStatus = () => {
    if (!orderData?.id || !selectedShippingStatus) return;
    // Show confirmation dialog
    setShowUpdateShippingStatusDialog(true);
  };

  const handleConfirmUpdateShippingStatus = async () => {
    if (!orderData?.id || !selectedShippingStatus) return;

    try {
      setUpdatingShippingStatus(true);
      setShowUpdateShippingStatusDialog(false);
      await updateShippingStatus(orderData.id, selectedShippingStatus);
      // Reload order data after update
      await loadOrderDetail(orderData.code || orderCode);
      setIsEditingShippingStatus(false);
      setSelectedShippingStatus("");
      toast.success("Cập nhật trạng thái vận chuyển thành công!");
    } catch (error: any) {
      console.error("Error updating shipping status:", error);
      const errorMessage = error?.response?.data?.message
        || error?.message
        || "Có lỗi xảy ra khi cập nhật trạng thái vận chuyển";
      toast.error(errorMessage);
    } finally {
      setUpdatingShippingStatus(false);
    }
  };

  // Get status card styling based on order status
  const getStatusCardStyle = () => {
    switch (orderData!.status) {
      case "PENDING":
        return {
          bg: "bg-[#e7e7e7]",
          text: "text-[#737373]",
        };
      case "CONFIRMED":
        return {
          bg: "bg-[#D1E7DD]",
          text: "text-[#28A745]",
        };
      case "PROCESSING":
        return {
          bg: "bg-[#D1E7DD]",
          text: "text-[#28A745]",
        };
      case "SHIPPING":
        return {
          bg: "bg-[#cce5ff]",
          text: "text-[#004085]",
        };
      case "COMPLETE":
        return {
          bg: "bg-[#b2ffb4]",
          text: "text-[#04910c]",
        };
      case "SHIPPING_FAILED":
        return {
          bg: "bg-[#f8d7da]",
          text: "text-[#721c24]",
        };
      case "RETURNED":
        return {
          bg: "bg-[#fff3cd]",
          text: "text-[#856404]",
        };
      case "REFUND":
        return {
          bg: "bg-[#d1ecf1]",
          text: "text-[#0c5460]",
        };
      case "CANCELED":
        return {
          bg: "bg-[#ffdcdc]",
          text: "text-[#eb2b0b]",
        };
      default:
        return {
          bg: "bg-[#e7e7e7]",
          text: "text-[#737373]",
        };
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e04d30] mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                if (orderCode) {
                  loadOrderDetail(orderCode);
                }
              }}
              className="px-4 py-2 bg-[#e04d30] text-white rounded-lg hover:bg-[#d63924] transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!orderData) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
            <p className="text-gray-600">Đơn hàng này không tồn tại hoặc đã bị xóa.</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  const statusCardStyle = getStatusCardStyle();

  return (
    <PageContainer>
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
            <h1 className="font-montserrat font-bold text-[#272424] text-[24px] leading-[1.5] whitespace-nowrap">
              Chi tiết đơn hàng
            </h1>
          </div>
        </div>

        {/* Status Cards */}
        <ContentCard>
          <div className="flex flex-col lg:flex-row gap-[12px] w-full">
            {/* Order Status Card */}
            <div className="flex-1 min-w-0">
              <div
                className={`${statusCardStyle.bg} border-2 border-opacity-20 box-border flex gap-[10px] items-center p-[12px] relative rounded-[10px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center justify-center w-[36px] h-[36px] bg-white bg-opacity-80 rounded-full shrink-0">
                  {orderData.status === "PENDING" ? (
                    <svg
                      className="w-[18px] h-[18px] text-[#737373]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : orderData.status === "CONFIRMED" || orderData.status === "PROCESSING" ? (
                    <svg
                      className="w-[18px] h-[18px] text-[#28A745]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : orderData.status === "SHIPPING" ? (
                    <Truck className="w-[18px] h-[18px] text-[#004085]" />
                  ) : orderData.status === "COMPLETE" ? (
                    <Package className="w-[18px] h-[18px] text-[#04910c]" />
                  ) : orderData.status === "SHIPPING_FAILED" ? (
                    <svg
                      className="w-[18px] h-[18px] text-[#721c24]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : orderData.status === "RETURNED" ? (
                    <svg
                      className="w-[18px] h-[18px] text-[#856404]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : orderData.status === "REFUND" ? (
                    <svg
                      className="w-[18px] h-[18px] text-[#0c5460]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.177 1.2V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.177-1.2V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : orderData.status === "CANCELED" ? (
                    <svg
                      className="w-[18px] h-[18px] text-[#eb2b0b]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <Package className="w-[18px] h-[18px] text-gray-600" />
                  )}
                </div>
                <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[13px] text-black text-opacity-70 leading-[1.3]">
                    Trạng thái đơn hàng
                  </p>
                  <p
                    className={`font-montserrat font-bold ${statusCardStyle.text} text-[16px] leading-[1.2] truncate`}
                  >
                    {getStatusDisplayName(orderData.status)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Source Card */}
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 box-border flex gap-[10px] items-center p-[12px] relative rounded-[10px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-[36px] h-[36px] bg-white rounded-full shadow-sm shrink-0">
                  <svg
                    className="w-[18px] h-[18px] text-[#272424]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                      clipRule="evenodd"
                    />
                    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-1V7z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[13px] text-gray-600 leading-[1.3]">
                    Nguồn đơn hàng
                  </p>
                  <p className="font-montserrat font-bold text-[#272424] text-[16px] leading-[1.2] truncate">
                    Website
                  </p>
                </div>
              </div>
            </div>

            {/* Order ID Card */}
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 box-border flex gap-[10px] items-center p-[12px] relative rounded-[10px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-[36px] h-[36px] bg-white rounded-full shadow-sm shrink-0">
                  <svg
                    className="w-[18px] h-[18px] text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[13px] text-blue-700 leading-[1.3]">
                    Mã đơn hàng
                  </p>
                  <p className="font-montserrat font-bold text-blue-800 text-[16px] leading-[1.2] truncate font-mono">
                    #{orderData.code}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Website Order Info */}
          <WebsiteOrderInfo
            orderData={orderData!}
            onCreateShipping={handleConfirmOrder}
          />

          {/* Payment Table */}
          <div
            className={`bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start sm:p-[20px] relative rounded-[8px] w-full ${orderData!.status === "CANCELED" ? "opacity-50" : ""
              }`}
          >
            <div className="w-full">
              <div className="box-border flex gap-[6px] items-center px-[6px] py-0 mb-4 relative shrink-0 w-full">
                <Wallet className="relative shrink-0 size-[24px]" />
                <h2 className="font-montserrat font-semibold text-[#272424] text-[18px] leading-[1.4]">
                  Thông tin thanh toán
                </h2>
              </div>
              <div className="w-full overflow-x-auto">
                <div className="flex flex-col items-start relative rounded-[8px] w-full min-w-[700px] border border-[#e7e7e7] overflow-hidden bg-white">
                  <PaymentTableHeader />
                  {(orderData.orderDetails || []).map((item, index) => (
                    <PaymentTableItem key={item.id} item={item} index={index} formatCurrency={formatCurrency} />
                  ))}
                  {/* Summary Row - Website */}
                  <PaymentSummaryWebsite orderData={orderData!} formatCurrency={formatCurrency} />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information Card */}
          <PaymentInformationWebsite
            orderData={orderData!}
            disabled={orderData!.status === "CANCELED"}
          />

          {/* Action Buttons */}
          <ActionButtonsWebsite
            status={orderData!.status}
            source={orderData!.source || "WEBSITE"}
            onConfirm={handleConfirmOrder}
            onCancel={handleCancelOrder}
          />
        </ContentCard>
      </div>

      {/* Delivery Confirmation Popup */}
      <DeliveryConfirmationPopupWebsite
        isOpen={showDeliveryPopup}
        onClose={() => setShowDeliveryPopup(false)}
        onConfirm={handleDeliveryConfirm}
        orderData={orderData!}
      />

      {/* Confirm Order Dialog */}
      <AlertDialog open={showConfirmOrderDialog} onOpenChange={setShowConfirmOrderDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đơn hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xác nhận đơn hàng <strong>#{orderData?.code}</strong> không?
              <br />
              <br />
              Sau khi xác nhận, đơn hàng sẽ chuyển sang trạng thái "Đã xác nhận" và bạn có thể tạo mã vận đơn sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirmingOrder}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmOrderConfirm}
              disabled={confirmingOrder}
              className="bg-[#28a745] hover:bg-[#218838]"
            >
              {confirmingOrder ? "Đang xác nhận..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Order Dialog */}
      <AlertDialog open={showCancelOrderDialog} onOpenChange={setShowCancelOrderDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy đơn hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng <strong>#{orderData?.code}</strong> không?
              <br />
              <br />
              Hành động này không thể hoàn tác. Đơn hàng sẽ chuyển sang trạng thái "Đã hủy".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirmingOrder}>
              Không hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              disabled={confirmingOrder}
              className="bg-[#dc3545] hover:bg-[#c82333]"
            >
              {confirmingOrder ? "Đang hủy..." : "Xác nhận hủy"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Shipping Status Confirmation Dialog */}
      <AlertDialog open={showUpdateShippingStatusDialog} onOpenChange={setShowUpdateShippingStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cập nhật trạng thái vận chuyển</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn cập nhật trạng thái vận chuyển từ{" "}
              <strong>{mapShippingStatusToLabel(orderData?.shippingStatus || "")}</strong> sang{" "}
              <strong>{mapShippingStatusToLabel(selectedShippingStatus)}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updatingShippingStatus}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmUpdateShippingStatus}
              disabled={updatingShippingStatus}
              className="bg-[#28a745] hover:bg-[#218838]"
            >
              {updatingShippingStatus ? "Đang cập nhật..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default AdminOrderDetailWebsite;
