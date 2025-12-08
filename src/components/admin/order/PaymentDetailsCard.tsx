import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Clock, XCircle, HelpCircle, Banknote, Building2 } from 'lucide-react';

interface PaymentDetailsCardProps {
  orderData: {
    totalOrderPrice?: number;
    totalProductPrice?: number;
    shippingFee?: number;
    paymentStatus?: string;
    method?: string;
    discountOrderId?: number | null;
    discountShipId?: number | null;
    orderDiscountAmount?: number | null;
    productDiscountAmount?: number | null;
    shippingDiscountAmount?: number | null;
    totalDiscountAmount?: number | null;
  };
  formatCurrency: (amount: number) => string;
  disabled?: boolean;
}

const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  orderData,
  formatCurrency,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalAmount = orderData?.totalOrderPrice || 0;
  const totalProductPrice = orderData?.totalProductPrice || 0;
  const shippingFee = orderData?.shippingFee || 0;
  const paymentStatus = orderData?.paymentStatus?.toUpperCase() || "";
  const paymentMethod = orderData?.method?.toUpperCase() || "UNDEFINED";

  // Get discount amounts from API
  const orderDiscountAmount = orderData?.orderDiscountAmount || 0;
  const productDiscountAmount = orderData?.productDiscountAmount || 0;
  const shippingDiscountAmount = orderData?.shippingDiscountAmount || 0;
  const totalDiscountAmount = orderData?.totalDiscountAmount || 0;

  // Calculate product price after discount (for display purposes)
  const productPriceAfterDiscount = totalProductPrice - productDiscountAmount;

  // Payment status info
  const getPaymentStatusInfo = useMemo(() => {
    switch (paymentStatus) {
      case "PAID":
        return {
          label: "Đã thanh toán",
          Icon: CheckCircle,
          className: "text-green-700 bg-green-50 border-green-200",
        };
      case "PENDING":
      case "WAITING":
        return {
          label: "Chờ thanh toán",
          Icon: Clock,
          className: "text-yellow-700 bg-yellow-50 border-yellow-200",
        };
      case "FAILED":
        return {
          label: "Thanh toán thất bại",
          Icon: XCircle,
          className: "text-red-700 bg-red-50 border-red-200",
        };
      default:
        return {
          label: "Không xác định",
          Icon: HelpCircle,
          className: "text-gray-700 bg-gray-50 border-gray-200",
        };
    }
  }, [paymentStatus]);

  // Payment method info
  const getPaymentMethodInfo = useMemo(() => {
    switch (paymentMethod) {
      case "CASH":
        return {
          label: "Tiền mặt",
          Icon: Banknote,
          className: "text-blue-700 bg-blue-50 border-blue-200",
        };
      case "BANKING":
        return {
          label: "Chuyển khoản",
          Icon: Building2,
          className: "text-purple-700 bg-purple-50 border-purple-200",
        };
      case "UNDEFINED":
      default:
        return {
          label: "Chưa xác định",
          Icon: HelpCircle,
          className: "text-gray-700 bg-gray-50 border-gray-200",
        };
    }
  }, [paymentMethod]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${disabled ? "opacity-50 pointer-events-none" : ""
      }`}>
      {/* Main Total Display */}
      <div className="px-3 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200" onClick={toggleExpanded}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Tổng thanh toán</h3>
                {totalDiscountAmount > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    Tiết kiệm {formatCurrency(totalDiscountAmount)}
                  </p>
                )}
              </div>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
          <button className="ml-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Left Column: Breakdown */}
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                  Chi tiết đơn hàng
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tổng tiền hàng</span>
                    <span className="font-medium">{formatCurrency(totalProductPrice)}</span>
                  </div>
                  {productDiscountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Giảm giá sản phẩm</span>
                      <span>-{formatCurrency(productDiscountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center font-medium border-t border-dashed border-gray-100 pt-2">
                    <span className="text-blue-700">Thành tiền sản phẩm</span>
                    <span className="text-blue-700">{formatCurrency(productPriceAfterDiscount)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">{formatCurrency(shippingFee)}</span>
                  </div>
                </div>
              </div>

              {(orderDiscountAmount > 0 || shippingDiscountAmount > 0) && (
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                    Khuyến mãi áp dụng
                  </h4>
                  <div className="space-y-2">
                    {orderDiscountAmount > 0 && (
                      <div className="flex justify-between items-center text-orange-600">
                        <div className="flex items-center gap-2">
                          <span>Voucher đơn hàng</span>
                          {orderData?.discountOrderId && <span className="text-[10px] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">#{orderData.discountOrderId}</span>}
                        </div>
                        <span>-{formatCurrency(orderDiscountAmount)}</span>
                      </div>
                    )}
                    {shippingDiscountAmount > 0 && (
                      <div className="flex justify-between items-center text-blue-600">
                        <div className="flex items-center gap-2">
                          <span>Giảm phí vận chuyển</span>
                          {orderData?.discountShipId && <span className="text-[10px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">#{orderData.discountShipId}</span>}
                        </div>
                        <span>-{formatCurrency(shippingDiscountAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Payment & Summary */}
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm h-full flex flex-col">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-purple-500 rounded-full"></div>
                    Thông tin thanh toán
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Trạng thái</span>
                      <div className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 w-fit ${getPaymentStatusInfo.className}`}>
                        <getPaymentStatusInfo.Icon className="w-3.5 h-3.5" />
                        {getPaymentStatusInfo.label}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Phương thức</span>
                      <div className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 w-fit ${getPaymentMethodInfo.className}`}>
                        <getPaymentMethodInfo.Icon className="w-3.5 h-3.5" />
                        {getPaymentMethodInfo.label}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto border-t border-gray-100 pt-3 space-y-2">
                  {totalDiscountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600 text-xs bg-green-50 p-2 rounded">
                      <span className="font-medium">Tổng tiết kiệm</span>
                      <span className="font-bold">-{formatCurrency(totalDiscountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="font-bold text-gray-800">Tổng thanh toán</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsCard;