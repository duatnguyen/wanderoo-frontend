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
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageContainer, ContentCard } from "@/components/common";
import { getAdminCustomerOrderDetail, confirmOrderAndCreateShipping, cancelAdminOrder } from "@/api/endpoints/orderApi";
import type { CustomerOrderResponse } from "@/types/orders";

import PaymentTableHeader from '../../../../../components/admin/order/PaymentTableHeader';
import PaymentTableItem from '../../../../../components/admin/order/PaymentTableItem';
import PaymentSummaryWebsite from '../../../../../components/admin/order/PaymentSummaryWebsite';
import PaymentInformationWebsite from '../../../../../components/admin/order/PaymentInformationWebsite';
import DeliveryConfirmationPopupWebsite from '../../../../../components/admin/order/DeliveryConfirmationPopupWebsite';
import CancelOrderConfirmationPopupWebsite from '../../../../../components/admin/order/CancelOrderConfirmationPopupWebsite';
import ActionButtonsWebsite from '../../../../../components/admin/order/ActionButtonsWebsite';
import WebsiteOrderInfo from '../../../../../components/admin/order/WebsiteOrderInfo';

interface ReturnToState {
  pathname?: string;
  activePrimaryTab?: string;
  activeStatusTab?: string;
  activeCancelSubTab?: string;
  activeFailedSubTab?: string;
  searchTerm?: string;
}

const buildFakeOrderFromOtherStatus = (fakeOrder: any, orderId?: string): CustomerOrderResponse => {
  const parsedCustomerId =
    typeof fakeOrder?.customerId === "string"
      ? Number.parseInt(fakeOrder.customerId.replace(/\D/g, ""), 10) || 0
      : Number(fakeOrder?.customerId ?? 0);
  const fallbackId =
    typeof orderId === "string" && orderId.length > 0
      ? Number.parseInt(orderId.replace(/\D/g, ""), 10) || Date.now()
      : Date.now();
  const totalAmount = fakeOrder?.totalAmount ?? 0;
  const productName = fakeOrder?.productName ?? "Sản phẩm demo";
  const orderCode = fakeOrder?.orderCode ?? `RET-${fallbackId}`;

  // Thiết lập trạng thái/thanh toán hiển thị trong card "Thanh toán của người mua"
  // - Đơn hủy chuyển khoản (WEB-0156): Đã thanh toán + Chuyển khoản
  // - Đơn hủy tiền mặt (WEB-0160): Chờ thanh toán + Tiền mặt
  let paymentStatusCode = "WAITING";
  let paymentMethodCode = "CASH";

  if (fakeOrder?.category === "CANCEL") {
    if (fakeOrder.paymentMethod === "Chuyển khoản") {
      paymentStatusCode = "PAID";
      paymentMethodCode = "BANKING";
    } else if (fakeOrder.paymentMethod === "Tiền mặt") {
      paymentStatusCode = "WAITING";
      paymentMethodCode = "CASH";
    }
  }

  // Map trạng thái hiển thị cho card "Trạng thái đơn hàng" trên màn chi tiết
  // 1. Đơn huỷ (CANCEL):
  //    - refundStatus === "WAITING" → Đã hủy - Đang chờ xét duyệt
  //    - refundStatus === "DONE"    → Đã hủy - Đã xử lý
  // 2. Đơn Trả hàng/Hoàn tiền (RETURN):
  //    - statusKey === "COMPLETED" hoặc refundStatus === "DONE"
  //        → coi như đã hoàn tất xử lý → map sang "COMPLETE" để hiển thị màu xanh
  //    - statusKey === "UNDER_REVIEW" → "PENDING"
  //    - statusKey === "RETURNING"    → "SHIPPING" (đang xử lý / đang giao trả hàng)
  //    - statusKey === "INVALID"      → "CANCELED_PENDING" (yêu cầu không hợp lệ)
  // 3. Đơn Giao hàng không thành công (FAILED):
  //    - hiển thị như một trạng thái riêng "DELIVERY_FAILED" để card trên cùng luôn màu đỏ
  const isCancelCategory = fakeOrder?.category === "CANCEL";
  const isReturnCategory = fakeOrder?.category === "RETURN";
  const isFailedCategory = fakeOrder?.category === "FAILED";
  const isCancelProcessed = isCancelCategory && fakeOrder?.refundStatus === "DONE";

  let statusCode: CustomerOrderResponse["status"] = "PENDING";

  if (isCancelCategory) {
    statusCode = isCancelProcessed ? "CANCELED" : "CANCELED_PENDING";
  } else if (isReturnCategory) {
    const statusKey = fakeOrder?.statusKey;
    if (statusKey === "COMPLETED" || fakeOrder?.refundStatus === "DONE") {
      statusCode = "COMPLETE";
    } else if (statusKey === "RETURNING") {
      statusCode = "SHIPPING";
    } else if (statusKey === "INVALID") {
      statusCode = "CANCELED_PENDING";
    } else {
      statusCode = "PENDING";
    }
  } else if (isFailedCategory) {
    statusCode = "DELIVERY_FAILED";
  }

  // Đơn WEB-0043: hiển thị trạng thái màu xám "Đang chờ kiểm hàng" trên card trạng thái
  if (fakeOrder?.orderCode === "WEB-0043") {
    statusCode = "PENDING";
  }

  return {
    id: fallbackId,
    code: orderCode,
    customerId: parsedCustomerId,
    totalAmount,
    status: statusCode,
    paymentStatus: paymentStatusCode,
    createdAt: fakeOrder?.createdAt ?? new Date().toISOString(),
    updatedAt: fakeOrder?.createdAt ?? new Date().toISOString(),
    userInfo: {
      id: parsedCustomerId,
      name: fakeOrder?.customerName ?? "Khách hàng demo",
      image: "",
      username: fakeOrder?.customerUsername ?? "user_demo",
      phone: fakeOrder?.customerUsername,
    },
    items: [
      {
        id: 1,
        productId: 0,
        quantity: 1,
        price: totalAmount,
        total: totalAmount,
        name: productName,
        image: fakeOrder?.productImage,
      },
    ],
    source: (fakeOrder?.source || "WEBSITE").toUpperCase(),
    method: paymentMethodCode,
    shippingFee: 0,
    totalProductPrice: totalAmount,
    totalOrderPrice: totalAmount,
    notes: fakeOrder?.reason ?? "Thông tin đơn hàng bị hủy.",
    shippingStatus: fakeOrder?.forwardShippingStatus ?? "Đang xử lý",
    receiverName: fakeOrder?.customerName ?? "Khách hàng demo",
    receiverPhone: fakeOrder?.customerUsername ?? "",
    receiverAddress: fakeOrder?.sourceNote ?? "Địa chỉ cập nhật sau",
  };
};

const AdminOrderDetailWebsite: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigationState =
    (location.state as { fakeOrder?: any; returnTo?: ReturnToState } | null) || null;
  const fakeOrderFromOtherStatus = navigationState?.fakeOrder;
  const returnToState = navigationState?.returnTo;

  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [orderData, setOrderData] = useState<CustomerOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const getStatusDisplayName = (status: string) => {
    // Nếu điều hướng từ màn Trả hàng/Hoàn tiền/Huỷ:
    // - Nhóm RETURN: ưu tiên dùng nhãn trạng thái chi tiết từ mock (ví dụ WEB-0001)
    // - Nhóm FAILED: luôn hiển thị "Giao hàng không thành công" màu đỏ
    if (fakeOrderFromOtherStatus?.category === "RETURN" && fakeOrderFromOtherStatus?.statusLabel) {
      return fakeOrderFromOtherStatus.statusLabel;
    }
    if (fakeOrderFromOtherStatus?.category === "FAILED") {
      return "Giao hàng không thành công";
    }

    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "SHIPPING":
        return "Đang giao";
      case "COMPLETE":
        return "Đã hoàn thành";
      case "CANCELED":
        return "Đã hủy - Đã xử lý";
      case "CANCELED_PENDING":
        return "Đã hủy - Đang chờ xét duyệt";
      case "REFUND":
        return "Hoàn tiền";
      default:
        return status;
    }
  };

  useEffect(() => {
    if (fakeOrderFromOtherStatus) {
      const fakeData = buildFakeOrderFromOtherStatus(fakeOrderFromOtherStatus, orderId);
      setOrderData(fakeData);
      setLoading(false);
      setError(null);
      return;
    }

    if (orderId) {
      loadOrderDetail();
    }
  }, [fakeOrderFromOtherStatus, orderId]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminCustomerOrderDetail(parseInt(orderId!));
      setOrderData(response);
    } catch (err) {
      console.error('Error loading order detail:', err);
      setError('Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (returnToState?.pathname) {
      navigate(returnToState.pathname, { state: returnToState });
    } else {
      navigate(-1);
    }
  };



  const handleConfirmOrder = () => {
    // Mở popup xác nhận giao hàng
    setShowDeliveryPopup(true);
  };

  const handleDeliveryConfirm = async (data: {
    pickShift: number[];
    requiredNote: string;
    paymentTypeId: number;
    serviceTypeId: number;
  }) => {
    if (!orderId) return;

    try {
      await confirmOrderAndCreateShipping(parseInt(orderId), data);
      // Reload order data after confirmation
      await loadOrderDetail();
      alert(`Đơn hàng đã được xác nhận thành công!`);
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Có lỗi xảy ra khi xác nhận đơn hàng!");
    }
  };

  const handleCancelOrder = () => {
    // Mở popup xác nhận hủy đơn hàng
    setShowCancelPopup(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderId) return;

    try {
      await cancelAdminOrder(parseInt(orderId));
      // Reload order data after cancellation
      await loadOrderDetail();
      alert(`Đơn hàng đã được hủy thành công!`);
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Có lỗi xảy ra khi hủy đơn hàng!");
    }
  };





  // Get status card styling based on order status
  const getStatusCardStyle = () => {
    switch (orderData!.status) {
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
      case "CANCELED":
      case "CANCELED_PENDING":
      case "DELIVERY_FAILED":
        return {
          bg: "bg-[#ffdcdc]",
          text: "text-[#eb2b0b]",
        };
      default:
        return {
          bg: "bg-[#b2ffb4]",
          text: "text-[#04910c]",
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
              onClick={loadOrderDetail}
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
  const actionButtonsStatus =
    orderData.status === "CANCELED_PENDING" ? "PENDING" : orderData.status;

  // Trạng thái truyền xuống component ActionButtonsWebsite cho card "Thao tác với đơn hàng"
  // - Với các đơn RETURN (bao gồm POS-1205) ta luôn dùng "PENDING" để hiển thị nút thao tác
  //   bất kể status nội bộ đang là PENDING hay SHIPPING...
  // - Các loại đơn khác giữ nguyên logic cũ.
  const actionsComponentStatus =
    fakeOrderFromOtherStatus?.category === "RETURN" ? "PENDING" : actionButtonsStatus;

  // Ẩn card "Thao tác với đơn hàng" cho một số case đặc biệt khi đi từ màn Trả hàng/Hoàn tiền/Huỷ
  // - Đơn huỷ đã xử lý (ví dụ WEB-0160)
  // - Đơn RETURN cụ thể WEB-0042 (đã hoàn tiền đủ cho người mua)
  // - Đơn RETURN cụ thể WEB-0099 (yêu cầu không hợp lệ, chỉ xem thông tin)
  const shouldHideActionsFromOtherStatus =
    !!fakeOrderFromOtherStatus &&
    ((fakeOrderFromOtherStatus.orderCode === "WEB-0042" ||
      fakeOrderFromOtherStatus.orderCode === "WEB-0099") ||
      (fakeOrderFromOtherStatus.category === "CANCEL" &&
        fakeOrderFromOtherStatus.refundStatus === "DONE"));

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
          {/* Banner cho các yêu cầu Trả hàng/Hoàn tiền (RETURN) – ví dụ WEB-0001 */}
          {fakeOrderFromOtherStatus?.category === "RETURN" && (
            <div className="w-full mb-[12px] rounded-[10px] border border-green-200 bg-green-50 px-4 py-3 flex flex-col gap-1">
              <p className="font-montserrat font-semibold text-[14px] text-green-800">
                {fakeOrderFromOtherStatus.statusLabel || "Yêu cầu đang chờ xét duyệt"}
              </p>
              {fakeOrderFromOtherStatus.orderCode === "WEB-0099" ? (
                <p className="font-montserrat text-[12px] text-green-900">
                  <span className="font-semibold">Lý do huỷ yêu cầu: </span>
                  Khách không thật thà
                </p>
              ) : (
                fakeOrderFromOtherStatus.buyerOptions &&
                Array.isArray(fakeOrderFromOtherStatus.buyerOptions) &&
                fakeOrderFromOtherStatus.buyerOptions.length > 0 && (
                  <p className="font-montserrat text-[12px] text-green-900">
                    <span className="font-semibold">Phương án cho người mua: </span>
                    {fakeOrderFromOtherStatus.buyerOptions.join(" · ")}
                  </p>
                )
              )}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-[12px] w-full">
            {/* Order Status Card */}
            <div className="flex-1 min-w-0">
              <div
                className={`${statusCardStyle.bg} border-2 border-opacity-20 box-border flex gap-[10px] items-center p-[12px] relative rounded-[10px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center justify-center w-[36px] h-[36px] bg-white bg-opacity-80 rounded-full shrink-0">
                  {orderData.status === "SHIPPING" ? (
                    <Truck className="w-[18px] h-[18px] text-[#004085]" />
                  ) : orderData.status === "COMPLETE" ? (
                    <Package className="w-[18px] h-[18px] text-[#04910c]" />
                  ) : orderData.status === "PENDING" ? (
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
                  ) : orderData.status === "CONFIRMED" ? (
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
                  ) : (
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
            hideReceiverInfo={!!fakeOrderFromOtherStatus}
            buyerReasonTitle={
              fakeOrderFromOtherStatus?.category === "RETURN" ? "Lý do từ Người mua" : undefined
            }
            buyerReasonText={
              fakeOrderFromOtherStatus?.category === "RETURN"
                ? (fakeOrderFromOtherStatus.reason || "")
                : undefined
            }
            // Với đơn POS-2211: ẩn placeholder hình ảnh trong box "Lý do từ Người mua"
            hideBuyerMediaPlaceholders={fakeOrderFromOtherStatus?.orderCode === "POS-2211"}
          />

          {/* Customer */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex gap-[8px] items-center px-[16px] sm:px-[24px] py-[8px] relative rounded-[8px] w-full overflow-hidden min-w-0">
            <div className="basis-0 box-border flex gap-[6px] grow items-center min-h-px min-w-px px-[6px] py-[4px] relative shrink-0 min-w-0">
              <div className="flex gap-[10px] items-center relative shrink-0 min-w-0">
                <Avatar className="relative rounded-full size-[54px]">
                  <AvatarFallback className="bg-gray-200 rounded-full">
                    {orderData.userInfo?.name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-[4px] relative shrink-0 min-w-0">
                  <span className="font-montserrat font-bold text-[#2a2a2a] text-[14px] leading-[1.5] truncate">
                    {orderData.userInfo?.name || "Unknown"}
                  </span>
                  <span className="font-montserrat font-medium text-[#666666] text-[12px] leading-[1.4] truncate">
                    @{orderData.userInfo?.username || "unknown"}
                  </span>
                  {orderData.userInfo?.phone && (
                    <span className="font-montserrat font-medium text-[#666666] text-[12px] leading-[1.4] truncate">
                      📞 {orderData.userInfo.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Table */}
          <div
            className={`bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[16px] items-start sm:p-[20px] relative rounded-[8px] w-full ${orderData!.status === "CANCELED" ? "opacity-50" : ""
              }`}
          >
            <div className="w-full">
              <div className="box-border flex gap-[6px] items-center px-[6px] py-0 mb-4 relative shrink-0 w-full">
                <Wallet className="relative shrink-0 size-[24px]" />
                <h2 className="font-montserrat font-semibold text-[#272424] text-[18px] leading-[1.4]">
                  {fakeOrderFromOtherStatus?.category === "RETURN" ? "Sản phẩm hoàn trả" : "Thông tin thanh toán"}
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

          {/* Payment Information Card – ẩn với nhóm RETURN (ví dụ WEB-0001), giữ nguyên cho đơn khác */}
          {(!fakeOrderFromOtherStatus || fakeOrderFromOtherStatus.category !== "RETURN") && (
            <PaymentInformationWebsite
              orderData={orderData!}
              disabled={orderData!.status === "CANCELED"}
            />
          )}

          {/* Với đơn RETURN (ví dụ WEB-0001, WEB-0042): luôn hiển thị card thông tin tài khoản hoàn tiền */}
          {fakeOrderFromOtherStatus?.category === "RETURN" && (
            <ActionButtonsWebsite
              // Card "Thông tin tài khoản hoàn tiền" không phụ thuộc vào trạng thái xử lý backend,
              // nên luôn truyền "PENDING" để component hiển thị, kể cả với đơn đã hoàn tất (ví dụ WEB-0042)
              status="PENDING"
              source={(orderData!.source || "WEBSITE").toUpperCase()}
              onConfirm={handleConfirmOrder}
              onCancel={handleCancelOrder}
              variant="refundAccount"
            />
          )}

          {/* Card "Thao tác với đơn hàng" – ẩn với đơn đã hoàn tiền đủ khi đi từ màn khác (ví dụ WEB-0160, WEB-0042) */}
          {!shouldHideActionsFromOtherStatus && (
            <ActionButtonsWebsite
              status={actionsComponentStatus}
              source={(orderData!.source || "WEBSITE").toUpperCase()}
              onConfirm={handleConfirmOrder}
              onCancel={handleCancelOrder}
              variant="actions"
              // Tuỳ chỉnh label nút thao tác cho một số đơn mock
              customActionLabels={
                fakeOrderFromOtherStatus?.orderCode === "POS-1205"
                  ? {
                      reject: "Giao hàng không thành công",
                      confirm: "Giao hàng thành công",
                    }
                  : fakeOrderFromOtherStatus?.orderCode === "WEB-0043"
                  ? {
                      confirm: "Xác nhận hoàn tiền",
                    }
                  : undefined
              }
            />
          )}
        </ContentCard>
      </div>

      {/* Delivery Confirmation Popup */}
      <DeliveryConfirmationPopupWebsite
        isOpen={showDeliveryPopup}
        onClose={() => setShowDeliveryPopup(false)}
        onConfirm={handleDeliveryConfirm}
        orderData={orderData!}
      />

      {/* Cancel Order Confirmation Popup */}
      <CancelOrderConfirmationPopupWebsite
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleCancelConfirm}
        orderData={orderData!}
      />
    </PageContainer>
  );
};

export default AdminOrderDetailWebsite;
