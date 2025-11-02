import React from "react";
import { Plus, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { POSPagination } from "./POSPagination";

export type CashBookTransaction = {
  id: string;
  amount: number;
  dateTime: string;
  type: "income" | "expense";
};

export type CashBookSearchPanelProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  totalIncome: number;
  totalExpense: number;
  transactions: CashBookTransaction[];
  selectedTransactionId?: string;
  onTransactionSelect: (transactionId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCreateVoucher: () => void;
  className?: string;
};

export const CashBookSearchPanel: React.FC<CashBookSearchPanelProps> = ({
  searchValue,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  totalIncome,
  totalExpense,
  transactions,
  selectedTransactionId,
  onTransactionSelect,
  currentPage,
  totalPages,
  onPageChange,
  onCreateVoucher,
  className,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      {/* Search Bar */}
      <div className="p-4 border-b border-[#e7e7e7]">
        <SearchBar
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Nhập mã phiếu"
        />
      </div>

      {/* Date Range Filter */}
      <div className="p-4 border-b border-[#e7e7e7]">
        <div className="flex items-center gap-2">
          <DatePicker
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            containerClassName="flex-1"
          />
          <span className="text-[#272424] font-medium px-2">-</span>
          <DatePicker
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            containerClassName="flex-1"
          />
        </div>
      </div>

      {/* Summary Section */}
      <div className="p-4 border-b border-[#e7e7e7] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600 rotate-0" />
            <span className="text-sm font-medium text-[#272424]">Tổng thu</span>
          </div>
          <span className="text-sm font-bold text-[#272424]">
            {formatCurrency(totalIncome)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
            <span className="text-sm font-medium text-[#272424]">Tổng chi</span>
          </div>
          <span className="text-sm font-bold text-[#272424]">
            {formatCurrency(totalExpense)}
          </span>
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#737373] text-sm">Không có giao dịch nào</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e7e7e7]">
            {transactions.map((transaction) => {
              const isSelected = transaction.id === selectedTransactionId;
              return (
                <button
                  key={transaction.id}
                  onClick={() => onTransactionSelect(transaction.id)}
                  className={cn(
                    "w-full p-4 text-left hover:bg-gray-50 transition-colors",
                    isSelected && "bg-gray-100"
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-[#272424]">
                      {transaction.id}
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#272424]">
                        {formatCurrency(transaction.amount)}
                      </span>
                      <span className="text-xs text-[#737373]">
                        {formatDate(transaction.dateTime)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Button */}
      <div className="p-4 border-t border-[#e7e7e7]">
        <Button onClick={onCreateVoucher} className="w-full">
          <Plus className="w-4 h-4" />
          <span>Tạo phiếu</span>
        </Button>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-[#e7e7e7]">
        <POSPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default CashBookSearchPanel;
