import React, { useState } from "react";
import { ChevronDown, ChevronUp, Wallet, CreditCard, CheckCircle, Clock, XCircle, DollarSign } from "lucide-react";

interface PaymentInformationCollapsedViewProps {
  isExpanded: boolean;
  onToggle: () => void;
  totalAmount: number;
  formatCurrency: (amount: number) => string;
}

const PaymentInformationCollapsedView: React.FC<PaymentInformationCollapsedViewProps> = ({
  isExpanded,
  onToggle,
  totalAmount,
  formatCurrency,
}) => {
  return (
    <button
      onClick={onToggle}
      className="w-full px-[16px] py-[12px] bg-white hover:bg-gray-50 text-[#272424] rounded-t-[8px] transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <div className="w-[40px] h-[40px] bg-[#f8f9fa] rounded-full flex items-center justify-center">
            <Wallet className="w-[20px] h-[20px] text-[#007bff]" />
          </div>
          <div className="text-left">
            <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-tight">
              Thanh toán của người mua
            </p>
            <p className="font-montserrat font-bold text-[16px] text-[#007bff] leading-tight">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-[8px]">
          {isExpanded ? (
            <ChevronUp className="w-[16px] h-[16px] text-[#737373] transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-[16px] h-[16px] text-[#737373] transition-transform duration-200" />
          )}
        </div>
      </div>
    </button>
  );
};

interface PaymentInformationWebsiteProps {
  orderData: any;
  disabled?: boolean;
}

const PaymentInformationWebsite: React.FC<PaymentInformationWebsiteProps> = ({
  orderData,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const paymentStatus = orderData?.paymentStatus || "UNKNOWN";
  const paymentMethod = orderData?.paymentMethod || "Không xác định";

  const paymentData = [
    { label: "Tổng tiền sản phẩm", amount: orderData?.totalProductPrice || 0 },
    { label: "Phí vận chuyển", amount: orderData?.shippingFee || 0 },
    { label: "Mã giảm giá của shop", amount: 0 },
    {
      label: "Tổng tiền thanh toán",
      amount: orderData?.totalOrderPrice || 0,
      isTotal: true,
    },
  ];

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "FAILED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600 bg-green-50 border-green-200";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "FAILED":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div
      className={`bg-white border-2 border-[#e7e7e7] box-border relative rounded-[8px] w-full overflow-hidden min-w-0 ${disabled ? "opacity-50" : ""
        }`}
    >
      <PaymentInformationCollapsedView
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        totalAmount={orderData?.totalOrderPrice || 0}
        formatCurrency={formatCurrency}
      />

      {/* Expanded View - Payment Details */}
      {isExpanded && (
        <div className="border-t border-[#e7e7e7] px-[16px] sm:px-[24px] py-[15px] bg-[#fafbfc]">
          {/* Payment Status and Method */}
          <div className="space-y-[12px] mb-[20px]">
            <div className="flex items-center justify-between p-[12px] bg-white rounded-[8px] border border-[#e7e7e7]">
              <span className="font-montserrat font-medium text-[14px] text-[#272424]">
                Trạng thái thanh toán
              </span>
              <span className={`font-montserrat font-semibold text-[14px] ${
                paymentStatus === "PAID" ? "text-green-600" :
                paymentStatus === "PENDING" ? "text-yellow-600" :
                paymentStatus === "FAILED" ? "text-red-600" : "text-gray-600"
              }`}>
                {paymentStatus === "PAID" ? "Đã thanh toán" :
                 paymentStatus === "PENDING" ? "Chờ thanh toán" :
                 paymentStatus === "FAILED" ? "Thanh toán thất bại" : "Không xác định"}
              </span>
            </div>

            <div className="flex items-center justify-between p-[12px] bg-white rounded-[8px] border border-[#e7e7e7]">
              <span className="font-montserrat font-medium text-[14px] text-[#272424]">
                Phương thức thanh toán
              </span>
              <span className="font-montserrat font-semibold text-[14px] text-[#007bff]">
                {paymentMethod}
              </span>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="space-y-[8px]">
            <h3 className="font-montserrat font-semibold text-[16px] text-[#272424] mb-[12px]">
              Chi tiết thanh toán
            </h3>

            {paymentData.slice(0, -1).map((item, index) => (
              <div key={index} className="flex items-center justify-between py-[8px]">
                <span className="font-montserrat font-medium text-[14px] text-[#272424]">
                  {item.label}
                </span>
                <span className="font-montserrat font-semibold text-[14px] text-[#007bff]">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}

            {/* Total Amount */}
            <div className="flex items-center justify-between py-[12px] border-t-2 border-[#007bff] bg-[#f8f9ff] px-[12px] rounded-[8px]">
              <span className="font-montserrat font-bold text-[16px] text-[#272424]">
                Tổng tiền thanh toán
              </span>
              <span className="font-montserrat font-bold text-[16px] text-[#007bff]">
                {formatCurrency(paymentData[paymentData.length - 1].amount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentInformationWebsite;