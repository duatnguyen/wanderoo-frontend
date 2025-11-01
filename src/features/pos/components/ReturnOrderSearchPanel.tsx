import React from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ReturnOrder = {
  id: string;
  originalOrderId: string;
  status: string;
  subStatus?: string;
  dateTime: string;
  totalAmount: number;
};

export type ReturnOrderSearchPanelProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  returnOrders: ReturnOrder[];
  selectedReturnOrderId?: string;
  onReturnOrderSelect: (returnOrderId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCreateReturnOrder: () => void;
  className?: string;
};

export const ReturnOrderSearchPanel: React.FC<ReturnOrderSearchPanelProps> = ({
  searchValue,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  returnOrders,
  selectedReturnOrderId,
  onReturnOrderSelect,
  currentPage,
  totalPages,
  onPageChange,
  onCreateReturnOrder,
  className,
}) => {
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
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm đơn trả hàng"
            className="w-full pl-4 pr-10 py-2 border border-[#e7e7e7] rounded-lg text-sm text-[#272424] placeholder:text-[#737373] focus:outline-none focus:border-[#e04d30]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="w-4 h-4 text-[#737373]" />
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="p-4 border-b border-[#e7e7e7]">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-[#e7e7e7] rounded-lg text-sm text-[#272424] focus:outline-none focus:border-[#e04d30]"
          />
          <span className="text-[#272424] font-medium">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-[#e7e7e7] rounded-lg text-sm text-[#272424] focus:outline-none focus:border-[#e04d30]"
          />
        </div>
      </div>

      {/* Return Order List */}
      <div className="flex-1 overflow-y-auto">
        {returnOrders.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#737373] text-sm">Không có đơn trả hàng nào</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e7e7e7]">
            {returnOrders.map((returnOrder) => {
              const isSelected = returnOrder.id === selectedReturnOrderId;
              return (
                <button
                  key={returnOrder.id}
                  onClick={() => onReturnOrderSelect(returnOrder.id)}
                  className={cn(
                    "w-full p-4 text-left hover:bg-gray-50 transition-colors",
                    isSelected && "bg-gray-100"
                  )}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#272424]">
                        #{returnOrder.id}
                      </span>
                      <span className="text-xs text-[#272424] font-medium">
                        {returnOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#737373]">
                        {formatDate(returnOrder.dateTime)}
                      </span>
                      {returnOrder.subStatus && (
                        <span className="text-xs text-[#272424] font-medium">
                          {returnOrder.subStatus}
                        </span>
                      )}
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
        <button
          onClick={onCreateReturnOrder}
          className="w-full bg-[#e04d30] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#d0442a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Tạo đơn hàng trả</span>
        </button>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-[#e7e7e7]">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-[#272424]" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#272424]">Trang số</span>
            <button className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100">
              <span className="text-sm font-medium text-[#272424]">
                {currentPage}
              </span>
              <ChevronDown className="w-4 h-4 text-[#272424]" />
            </button>
          </div>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-[#272424]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnOrderSearchPanel;
