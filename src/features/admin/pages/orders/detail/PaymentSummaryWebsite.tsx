import React, { useState } from "react";
import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";

interface PaymentSummaryCollapsedViewProps {
  isExpanded: boolean;
  onToggle: () => void;
  totalAmount: number;
  formatCurrency: (amount: number) => string;
}

const PaymentSummaryCollapsedView: React.FC<
  PaymentSummaryCollapsedViewProps
> = ({ isExpanded, onToggle, totalAmount, formatCurrency }) => {
  return (
    <button
      onClick={onToggle}
      className="w-full px-[16px] py-[12px] bg-white hover:bg-gray-50 text-[#272424] rounded-t-[8px] transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <div className="w-[40px] h-[40px] bg-[#f8f9fa] rounded-full flex items-center justify-center">
            <DollarSign className="w-[20px] h-[20px] text-[#28a745]" />
          </div>
          <div className="text-left">
            <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-tight">
              Doanh thu đơn hàng
            </p>
            <p className="font-montserrat font-bold text-[16px] text-[#28a745] leading-tight">
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

interface PaymentSummaryWebsiteProps {
  orderData: any;
  formatCurrency: (amount: number) => string;
}

const PaymentSummaryWebsite: React.FC<PaymentSummaryWebsiteProps> = ({
  orderData,
  formatCurrency,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const summaryData = [
    { label: "Tổng tiền sản phẩm", amount: orderData?.totalProductPrice || 0 },
    { label: "Tổng phí vận chuyển", amount: orderData?.shippingFee || 0 },
    { label: "Phụ phí", amount: 0 },
    {
      label: "Doanh thu đơn hàng",
      amount: orderData?.totalOrderPrice || 0,
      isTotal: true,
    },
  ];

  return (
    <div className="border border-[#e7e7e7] box-border relative rounded-bl-[6px] rounded-br-[6px] shrink-0 w-full bg-white">
      <PaymentSummaryCollapsedView
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        totalAmount={orderData?.totalOrderPrice || 0}
        formatCurrency={formatCurrency}
      />

      {/* Expanded View - Payment Details */}
      {isExpanded && (
        <div className="border-t border-[#e7e7e7] px-[16px] py-[12px] bg-[#fafbfc]">
          <div className="space-y-[8px]">
            {summaryData.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between py-[4px] ${
                  item.isTotal ? "border-t border-[#e7e7e7] pt-[8px]" : ""
                }`}
              >
                <p
                  className={`font-montserrat ${
                    item.isTotal
                      ? "font-semibold text-[14px] text-[#272424]"
                      : "font-medium text-[13px] text-[#737373]"
                  }`}
                >
                  {item.label}
                </p>
                <p
                  className={`font-montserrat ${
                    item.isTotal
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

export default PaymentSummaryWebsite;
