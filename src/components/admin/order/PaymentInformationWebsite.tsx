import React, { useState, useMemo, memo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Wallet,
  CheckCircle,
  Clock,
  XCircle,
  Banknote,
  Building2,
  HelpCircle,
} from "lucide-react";

interface PaymentStatusInfo {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  badgeClassName: string;
  iconClassName: string;
  textClassName: string;
}

interface PaymentInformationCollapsedViewProps {
  isExpanded: boolean;
  onToggle: () => void;
  totalAmount: number;
  formatCurrency: (amount: number) => string;
  paymentStatusInfo: PaymentStatusInfo;
  paymentMethodInfo: PaymentStatusInfo;
}

const PaymentInformationCollapsedView =
  memo<PaymentInformationCollapsedViewProps>(
    ({
      isExpanded,
      onToggle,
      totalAmount,
      formatCurrency,
      paymentStatusInfo,
      paymentMethodInfo,
    }) => {
      const StatusIcon = paymentStatusInfo.Icon;
      const MethodIcon = paymentMethodInfo.Icon;

      return (
        <button
          onClick={onToggle}
          className="w-full px-4 py-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-[#272424] rounded-t-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-expanded={isExpanded}
          aria-label={
            isExpanded
              ? "Thu gọn thông tin thanh toán"
              : "Mở rộng thông tin thanh toán"
          }
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-sm text-[#272424] leading-tight truncate">
                  Thanh toán của người mua
                </p>
                <p className="font-montserrat font-bold text-base text-blue-600 leading-tight truncate">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>

            {/* Payment Status and Method Badges */}
            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              {/* Desktop: Horizontal badges */}
              <div className="hidden sm:flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${paymentStatusInfo.badgeClassName}`}
                >
                  <StatusIcon
                    className={`w-3.5 h-3.5 ${paymentStatusInfo.iconClassName}`}
                  />
                  <span
                    className={`font-montserrat font-semibold text-[10px] ${paymentStatusInfo.textClassName} whitespace-nowrap`}
                  >
                    {paymentStatusInfo.label}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${paymentMethodInfo.badgeClassName}`}
                >
                  <MethodIcon
                    className={`w-3.5 h-3.5 ${paymentMethodInfo.iconClassName}`}
                  />
                  <span
                    className={`font-montserrat font-semibold text-[10px] ${paymentMethodInfo.textClassName} whitespace-nowrap`}
                  >
                    {paymentMethodInfo.label}
                  </span>
                </div>
              </div>

              {/* Mobile: Horizontal compact badges */}
              <div className="flex sm:hidden items-center gap-1.5 flex-1">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded border ${paymentStatusInfo.badgeClassName} flex-1 justify-center`}
                >
                  <StatusIcon
                    className={`w-3 h-3 ${paymentStatusInfo.iconClassName}`}
                  />
                  <span
                    className={`font-montserrat font-semibold text-[10px] ${paymentStatusInfo.textClassName} truncate`}
                  >
                    {paymentStatusInfo.label}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded border ${paymentMethodInfo.badgeClassName} flex-1 justify-center`}
                >
                  <MethodIcon
                    className={`w-3 h-3 ${paymentMethodInfo.iconClassName}`}
                  />
                  <span
                    className={`font-montserrat font-semibold text-[10px] ${paymentMethodInfo.textClassName} truncate`}
                  >
                    {paymentMethodInfo.label}
                  </span>
                </div>
              </div>

              {/* Chevron Icon */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                )}
              </div>
            </div>
          </div>
        </button>
      );
    }
  );

PaymentInformationCollapsedView.displayName = "PaymentInformationCollapsedView";

interface PaymentInformationWebsiteProps {
  orderData: {
    paymentStatus?: string;
    method?: string;
    totalProductPrice?: number;
    shippingFee?: number;
    totalOrderPrice?: number;
    discountOrderId?: number | null;
    discountShipId?: number | null;
  } | null;
  disabled?: boolean;
}

const PaymentInformationWebsite: React.FC<PaymentInformationWebsiteProps> = ({
  orderData,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return (amount: number) => formatter.format(amount);
  }, []);

  // Lấy paymentStatus và method từ API
  const paymentStatus = useMemo(
    () => orderData?.paymentStatus || "PENDING",
    [orderData?.paymentStatus]
  );
  const paymentMethod = useMemo(
    () => orderData?.method || "UNDEFINED",
    [orderData?.method]
  );

  const paymentData = useMemo(() => {
    const productPrice = orderData?.totalProductPrice || 0;
    const shippingFee = orderData?.shippingFee || 0;
    const discountAmount = 0; // Có thể tính từ discountOrderId và discountShipId nếu cần
    const total = orderData?.totalOrderPrice || 0;

    return [
      { label: "Tổng tiền sản phẩm", amount: productPrice, showZero: false },
      { label: "Phí vận chuyển", amount: shippingFee, showZero: false },
      {
        label: "Mã giảm giá của shop",
        amount: -discountAmount,
        showZero: discountAmount === 0,
      },
      {
        label: "Tổng tiền thanh toán",
        amount: total,
        isTotal: true,
        showZero: false,
      },
    ];
  }, [
    orderData?.totalProductPrice,
    orderData?.shippingFee,
    orderData?.totalOrderPrice,
  ]);

  // Hàm lấy thông tin trạng thái thanh toán (memoized)
  const getPaymentStatusInfo = useMemo(() => {
    const status = paymentStatus?.toUpperCase();
    switch (status) {
      case "PAID":
        return {
          label: "Đã thanh toán",
          Icon: CheckCircle,
          badgeClassName: "text-green-700 bg-green-50 border-green-200",
          iconClassName: "text-green-600",
          textClassName: "text-green-700",
        };
      case "PENDING":
        return {
          label: "Chờ thanh toán",
          Icon: Clock,
          badgeClassName: "text-yellow-700 bg-yellow-50 border-yellow-200",
          iconClassName: "text-yellow-600",
          textClassName: "text-yellow-700",
        };
      case "FAILED":
        return {
          label: "Thanh toán thất bại",
          Icon: XCircle,
          badgeClassName: "text-red-700 bg-red-50 border-red-200",
          iconClassName: "text-red-600",
          textClassName: "text-red-700",
        };
      default:
        return {
          label: "Không xác định",
          Icon: HelpCircle,
          badgeClassName: "text-gray-700 bg-gray-50 border-gray-200",
          iconClassName: "text-gray-600",
          textClassName: "text-gray-700",
        };
    }
  }, [paymentStatus]);

  // Hàm lấy thông tin phương thức thanh toán (memoized)
  const getPaymentMethodInfo = useMemo(() => {
    const method = paymentMethod?.toUpperCase();
    switch (method) {
      case "CASH":
        return {
          label: "Tiền mặt",
          Icon: Banknote,
          badgeClassName: "text-blue-700 bg-blue-50 border-blue-200",
          iconClassName: "text-blue-600",
          textClassName: "text-blue-700",
        };
      case "BANKING":
        return {
          label: "Chuyển khoản",
          Icon: Building2,
          badgeClassName: "text-purple-700 bg-purple-50 border-purple-200",
          iconClassName: "text-purple-600",
          textClassName: "text-purple-700",
        };
      case "UNDEFINED":
      default:
        return {
          label: "Chưa xác định",
          Icon: HelpCircle,
          badgeClassName: "text-gray-700 bg-gray-50 border-gray-200",
          iconClassName: "text-gray-600",
          textClassName: "text-gray-700",
        };
    }
  }, [paymentMethod]);

  const handleToggle = useMemo(() => () => setIsExpanded((prev) => !prev), []);

  const StatusIcon = getPaymentStatusInfo.Icon;
  const MethodIcon = getPaymentMethodInfo.Icon;

  return (
    <div
      className={`bg-white border-2 border-gray-200 box-border relative rounded-lg w-full overflow-hidden min-w-0 shadow-sm transition-all duration-200 ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <PaymentInformationCollapsedView
        isExpanded={isExpanded}
        onToggle={handleToggle}
        totalAmount={orderData?.totalOrderPrice || 0}
        formatCurrency={formatCurrency}
        paymentStatusInfo={getPaymentStatusInfo}
        paymentMethodInfo={getPaymentMethodInfo}
      />

      {/* Expanded View - Payment Details */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
          {/* Payment Breakdown */}
          <div className="space-y-2">
            <h3 className="font-montserrat font-semibold text-base text-gray-800 mb-3">
              Chi tiết thanh toán
            </h3>

            <div className="space-y-2">
              {paymentData.slice(0, -1).map((item, index) => {
                if (!item.showZero && item.amount === 0) return null;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-2 hover:bg-gray-100 rounded-md transition-colors duration-150"
                  >
                    <span className="font-montserrat font-medium text-sm text-gray-700">
                      {item.label}
                    </span>
                    <span
                      className={`font-montserrat font-semibold text-sm ${
                        item.amount < 0 ? "text-green-600" : "text-blue-600"
                      }`}
                    >
                      {item.amount < 0 ? "-" : ""}
                      {formatCurrency(Math.abs(item.amount))}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between py-3 px-4 mt-4 border-t-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm">
              <span className="font-montserrat font-bold text-base text-gray-800">
                Tổng tiền thanh toán
              </span>
              <span className="font-montserrat font-bold text-lg text-blue-600">
                {formatCurrency(paymentData[paymentData.length - 1].amount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInformationWebsite;
