import React from "react";
import { ChevronDown, Wallet } from "lucide-react";

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
    <div
      className="flex items-center justify-between px-[20px] py-[16px] cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 rounded-t-[6px] group"
      onClick={onToggle}
    >
      <div className="flex items-center gap-[12px]">
        <div className="flex items-center justify-center w-[44px] h-[44px] bg-gradient-to-br from-green-100 to-emerald-100 rounded-[12px] shadow-sm group-hover:shadow-md transition-all duration-300">
          <Wallet className="w-[20px] h-[20px] text-green-600" />
        </div>
        <div className="flex flex-col">
          <p className="font-montserrat font-bold text-[16px] leading-[1.3] text-[#272424] group-hover:text-[#1a1a1a] transition-colors duration-200">
            Doanh thu đơn hàng
          </p>
          <p className="font-montserrat font-medium text-[13px] leading-[1.3] text-[#737373] group-hover:text-[#555555] transition-colors duration-200">
            {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-[12px]">
        <div className="text-right">
          <p className="font-montserrat font-bold text-[20px] leading-[1.2] text-green-600 group-hover:text-green-700 transition-colors duration-200">
            {formatCurrency(totalAmount)}
          </p>
          <p className="font-montserrat font-medium text-[11px] leading-[1.3] text-[#888888] uppercase tracking-wide">
            Tổng cộng
          </p>
        </div>
        <div className="flex items-center justify-center w-[32px] h-[32px] bg-gray-100 group-hover:bg-gray-200 rounded-full transition-all duration-300 group-hover:scale-110">
          <div
            className={`text-[#555555] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          >
            <ChevronDown size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryCollapsedView;
