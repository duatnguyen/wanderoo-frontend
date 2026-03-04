import React from "react";
import { ChevronDown, Wallet } from "lucide-react";

interface PaymentInformationCollapsedViewProps {
  isExpanded: boolean;
  onToggle: () => void;
  totalAmount: number;
  formatCurrency: (amount: number) => string;
}

const PaymentInformationCollapsedView: React.FC<
  PaymentInformationCollapsedViewProps
> = ({ isExpanded, onToggle, totalAmount, formatCurrency }) => {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[16px] px-[20px] sm:px-[28px] py-[18px] cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 rounded-t-[8px] group"
      onClick={onToggle}
    >
      <div className="flex gap-[12px] items-start relative self-stretch shrink-0 min-w-0">
        <div className="flex items-center justify-center w-[48px] h-[48px] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-[14px] shadow-sm group-hover:shadow-md transition-all duration-300">
          <Wallet className="w-[22px] h-[22px] text-blue-600" />
        </div>
        <div className="flex flex-col gap-[2px]">
          <p className="font-montserrat font-bold text-[18px] leading-[1.3] text-[#272424] group-hover:text-[#1a1a1a] transition-colors duration-200">
            Thanh toán của người mua
          </p>
          <p className="font-montserrat font-medium text-[13px] leading-[1.3] text-[#737373] group-hover:text-[#555555] transition-colors duration-200">
            {isExpanded ? "Thu gọn" : "Chi tiết"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-[12px]">
        <div className="text-right">
          <p className="font-montserrat font-bold text-[22px] leading-[1.2] text-green-600 group-hover:text-green-700 transition-colors duration-200">
            {formatCurrency(totalAmount)}
          </p>
          <p className="font-montserrat font-medium text-[11px] leading-[1.3] text-[#888888] uppercase tracking-wide">
            Tổng thanh toán
          </p>
        </div>
        <div className="flex items-center justify-center w-[36px] h-[36px] bg-gray-100 group-hover:bg-gray-200 rounded-full transition-all duration-300 group-hover:scale-110">
          <div
            className={`text-[#555555] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          >
            <ChevronDown size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInformationCollapsedView;
