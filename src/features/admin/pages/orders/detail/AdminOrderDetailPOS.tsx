// src/pages/admin/AdminOrderDetailPOS.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Wallet,
  Package,
  FileText,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Truck,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageContainer, ContentCard } from "@/components/common";
import AdminPaymentTable, { type AdminPaymentItem } from "@/components/admin/order/AdminPaymentTable";
import { getAdminCustomerOrderDetail } from "@/api/endpoints/orderApi";
import type { CustomerOrderResponse } from "@/types/orders";
// Map order status code to Vietnamese label (giống với list)
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
    case "REFUND":
      return "Hoàn tiền";
    case "CANCELED":
      return "Đã hủy";
    default:
      return status || "Chờ xác nhận";
  }
};

// Payment Summary Component với Dropdown cho POS (dùng dữ liệu thật từ API)
const PaymentSummaryPOS: React.FC<{ orderData: CustomerOrderResponse | null }> = ({
  orderData,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const totalAmount = orderData?.totalOrderPrice || 0; // Khách phải trả
  const summaryData = [
    { label: "Tổng tiền hàng", amount: orderData?.totalProductPrice || 0 },
    {
      label: "Giảm giá",
      amount:
        (orderData?.totalProductPrice || 0) +
        (orderData?.shippingFee || 0) -
        (orderData?.totalOrderPrice || 0),
    },
    { label: "Khách phải trả", amount: totalAmount, isTotal: true },
    { label: "Tiền khách đưa", amount: orderData?.cashReceived || 0 },
    { label: "Tiền thừa trả khách", amount: orderData?.changeAmount || 0 },
  ];

  return (
    <div className="border border-[#e7e7e7] box-border relative rounded-bl-[6px] rounded-br-[6px] shrink-0 w-full bg-white">
      {/* Collapsed View - Always Visible */}
      <div
        className="flex items-center justify-between px-[16px] py-[12px] cursor-pointer hover:bg-[#f8f9fa] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center justify-center w-[32px] h-[32px] bg-[#e8f5e8] rounded-[6px]">
            <Wallet className="w-[16px] h-[16px] text-[#28a745]" />
          </div>
          <div className="flex flex-col">
            <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424]">
              Tổng thanh toán
            </p>
            <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
              {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[8px]">
          <p className="font-montserrat font-bold text-[18px] leading-[1.3] text-[#28a745]">
            {formatCurrency(totalAmount)}
          </p>
          <div className="flex items-center justify-center w-[24px] h-[24px] text-[#737373]">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Expanded View - Payment Details */}
      {isExpanded && (
        <div className="border-t border-[#e7e7e7] px-[16px] py-[12px] bg-[#fafbfc]">
          <div className="space-y-[8px]">
            {summaryData.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between py-[4px] ${item.isTotal ? "border-t border-[#e7e7e7] pt-[8px]" : ""
                  }`}
              >
                <p
                  className={`font-montserrat ${item.isTotal
                    ? "font-semibold text-[14px] text-[#272424]"
                    : "font-medium text-[13px] text-[#737373]"
                    }`}
                >
                  {item.label}
                </p>
                <p
                  className={`font-montserrat ${item.isTotal
                    ? "font-bold text-[16px] text-[#28a745]"
                    : "font-medium text-[13px] text-[#272424]"
                    }`}
                >
                  {formatCurrency(item.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminOrderDetailPOS: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams<{ orderId: string }>();

  // URL param hiện đang giữ tên orderId nhưng giá trị thực là order code (string)
  const orderCode = (orderId || "").trim();

  const [orderData, setOrderData] = useState<CustomerOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleConfirmOrder = () => {
    // Xử lý xác nhận đơn hàng
    console.log("Confirming order:", orderId);

    // Hiển thị thông báo xác nhận
    if (window.confirm("Bạn có chắc chắn muốn xác nhận đơn hàng này?")) {
      // TODO: Thêm API call để cập nhật trạng thái đơn hàng
      alert("Đơn hàng đã được xác nhận thành công!");

      // Có thể redirect về trang danh sách đơn hàng
      // navigate("/admin/orders");
    }
  };

  const handleCancelOrder = () => {
    // Xử lý hủy đơn hàng
    console.log("Canceling order:", orderId);

    // Hiển thị thông báo xác nhận hủy
    if (
      window.confirm(
        "Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác."
      )
    ) {
      const reason = prompt("Vui lòng nhập lý do hủy đơn hàng:");
      if (reason) {
        // TODO: Thêm API call để hủy đơn hàng với lý do
        alert(`Đơn hàng đã được hủy với lý do: ${reason}`);

        // Có thể redirect về trang danh sách đơn hàng
        // navigate("/admin/orders");
      }
    }
  };

  // Load order detail from API
  const loadOrderDetail = async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      const trimmedCode = code.trim();
      const response = await getAdminCustomerOrderDetail(trimmedCode);
      setOrderData(response);
    } catch (err) {
      console.error("Error loading POS order detail:", err);
      setError("Không thể tải thông tin đơn hàng POS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderCode) {
      loadOrderDetail(orderCode);
    }
  }, [orderCode]);

  // Map dữ liệu API sang cấu trúc dùng trong UI POS hiện tại
  const currentOrder = useMemo(() => {
    if (!orderData) return null;

    const rawItems =
      (orderData.orderDetails && orderData.orderDetails.length > 0
        ? orderData.orderDetails
        : orderData.items && orderData.items.length > 0
          ? orderData.items
          : []) || [];

    const mappedItems = rawItems.map((item: any) => {
      const unitPrice =
        item.snapshotProductPrice != null
          ? item.snapshotProductPrice
          : item.price || 0;
      const quantity = item.quantity || 0;

      return {
        id: item.id,
        name:
          item.snapshotProductName ||
          item.name ||
          "Sản phẩm không tên",
        price: unitPrice,
        quantity,
        total: unitPrice * quantity,
        image: item.image || "/api/placeholder/80/80",
      };
    });

    return {
      source: orderData.source || "POS",
      customer: {
        name: orderData.userInfo?.name || "Khách lẻ",
        avatar: orderData.userInfo?.image || "",
      },
      id: orderData.code || String(orderData.id),
      status: getStatusDisplayName(orderData.status || "PENDING"),
      items: mappedItems,
    };
  }, [orderData]);

  // Get status card styling based on order status
  const getStatusCardStyle = () => {
    switch (currentOrder?.status) {
      case "Đang giao":
        return {
          bg: "bg-[#cce5ff]",
          text: "text-[#004085]",
        };
      case "Đã hoàn thành":
        return {
          bg: "bg-[#b2ffb4]",
          text: "text-[#04910c]",
        };
      case "Chờ xác nhận":
        return {
          bg: "bg-[#e7e7e7]",
          text: "text-[#737373]",
        };
      case "Đã xác nhận":
        return {
          bg: "bg-[#D1E7DD]",
          text: "text-[#28A745]",
        };
      case "Đã hủy":
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

  const statusCardStyle = currentOrder
    ? getStatusCardStyle()
    : { bg: "bg-[#e7e7e7]", text: "text-[#737373]" };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e04d30] mx-auto mb-4"></div>
            <p className="text-gray-600">
              Đang tải thông tin đơn hàng POS...
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !currentOrder) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không thể tải dữ liệu đơn hàng POS
            </h3>
            <p className="text-gray-600 mb-4">
              {error || "Đơn hàng này không tồn tại hoặc đã bị xóa."}
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-[10px] items-center w-full mx-auto">
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
        <ContentCard>
          {/* Status Cards */}
          <div className="flex flex-col lg:flex-row gap-[16px] w-full">
            {/* Order Status Card */}
            <div className="flex-1 min-w-0">
              <div
                className={`${statusCardStyle.bg} border-2 border-opacity-20 box-border flex gap-[12px] items-center p-[16px] relative rounded-[12px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-white bg-opacity-80 rounded-full">
                  {currentOrder.status === "Đang giao" ? (
                    <Truck className="w-5 h-5 text-[#004085]" />
                  ) : currentOrder.status === "Đã hoàn thành" ? (
                    <Package className="w-5 h-5 text-[#04910c]" />
                  ) : currentOrder.status === "Chờ xác nhận" ? (
                    <svg
                      className="w-5 h-5 text-[#737373]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : currentOrder.status === "Đã xác nhận" ? (
                    <svg
                      className="w-5 h-5 text-[#28A745]"
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
                      className="w-5 h-5 text-[#eb2b0b]"
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
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[14px] text-black text-opacity-70 leading-[1.4]">
                    Trạng thái đơn hàng
                  </p>
                  <p
                    className={`font-montserrat font-bold ${statusCardStyle.text} text-[18px] leading-[1.2] truncate`}
                  >
                    {currentOrder.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Source Card */}
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 box-border flex gap-[12px] items-center p-[16px] relative rounded-[12px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full shadow-sm">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2a1 1 0 000 2h.01a1 1 0 100-2H5zm3 0a1 1 0 000 2h3a1 1 0 100-2H8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[14px] text-orange-700 leading-[1.4]">
                    Nguồn đơn hàng
                  </p>
                  <p className="font-montserrat font-bold text-orange-800 text-[18px] leading-[1.2] truncate">
                    {currentOrder.source}
                  </p>
                </div>
              </div>
            </div>

            {/* Order ID Card */}
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 box-border flex gap-[12px] items-center p-[16px] relative rounded-[12px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full shadow-sm">
                  <svg
                    className="w-5 h-5 text-purple-600"
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
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[14px] text-purple-700 leading-[1.4]">
                    Mã đơn hàng
                  </p>
                  <p className="font-montserrat font-bold text-purple-800 text-[18px] leading-[1.2] truncate font-mono">
                    #{currentOrder.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* POS Order Info - styled similar to WebsiteOrderInfo, but với thông tin POS */}
          {orderData && (
            <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[20px] items-start p-[20px] sm:p-[28px] rounded-[8px] w-full overflow-hidden min-w-0">
              {/* Header */}
              <div className="flex items-center gap-[8px] w-full">
                <div className="w-[4px] h-[20px] bg-[#e04d30] rounded-[2px]"></div>
                <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
                  Thông tin POS
                </h3>
              </div>

              {/* Created By Section */}
              <div className="flex gap-[14px] items-start w-full">
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#fff5f0] rounded-[8px] shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                      stroke="#e04d30"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                      stroke="#e04d30"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
                    Nhân viên tạo đơn
                  </p>
                  <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424]">
                    {orderData.picInfo
                      ? `${orderData.picInfo.name} (ID #${orderData.picInfo.id})`
                      : "Chưa có dữ liệu"}
                  </p>
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
                <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
                    Ngày tạo đơn
                  </p>
                  <p className="font-montserrat font-semibold text-[13px] leading-[1.3] text-[#272424]">
                    {orderData.createdAt
                      ? new Date(orderData.createdAt).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      : "Chưa có dữ liệu"}
                  </p>
                </div>
              </div>

              {/* Notes Section */}
              <div className="flex gap-[14px] items-start w-full">
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f8f9fa] rounded-[8px] shrink-0">
                  <FileText className="h-[20px] w-[20px] text-[#6c757d]" />
                </div>
                <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
                    Ghi chú đơn hàng
                  </p>
                  <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#737373] italic">
                    {orderData.notes && orderData.notes.trim() !== ""
                      ? orderData.notes
                      : "Không có ghi chú"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Table */}
          <AdminPaymentTable
            items={currentOrder.items.map(
              (item): AdminPaymentItem => ({
                id: item.id,
                name: item.name,
                image: item.image,
                unitPrice: item.price,
                quantity: item.quantity,
                total: item.total,
                variantText: undefined,
              })
            )}
            formatCurrency={formatCurrency}
            summary={<PaymentSummaryPOS orderData={orderData} />}
            disabled={currentOrder.status === "Đã hủy"}
          />
        </ContentCard>
      </div>
    </PageContainer>
  );
};

export default AdminOrderDetailPOS;
