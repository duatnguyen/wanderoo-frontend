import React, { useState } from "react";
import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";

interface PaymentSummaryCollapsedViewProps {
  totalAmount: number;
  formatCurrency: (amount: number) => string;
}

const PaymentSummaryCollapsedView: React.FC<PaymentSummaryCollapsedViewProps> = ({
  totalAmount,
  formatCurrency,
}) => {
  return (
    <div className="w-full px-[16px] py-[12px] bg-white text-[#272424] rounded-t-[8px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[12px]">
          <div className="w-[40px] h-[40px] bg-[#f8f9fa] rounded-full flex items-center justify-center">
            <DollarSign className="w-[20px] h-[20px] text-[#28a745]" />
          </div>
          <div className="text-left">
            <p className="font-montserrat font-semibold text-[14px] text-[#272424] leading-tight">
              Tổng tiền hoàn trả
            </p>
            <p className="font-montserrat font-bold text-[16px] text-[#28a745] leading-tight">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-[8px]" />
      </div>
    </div>
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
  return (
    <div className="border border-[#e7e7e7] box-border relative rounded-bl-[6px] rounded-br-[6px] shrink-0 w-full bg-white">
      <PaymentSummaryCollapsedView
        totalAmount={orderData?.totalOrderPrice || 0}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default PaymentSummaryWebsite;