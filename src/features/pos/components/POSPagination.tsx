import React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type POSPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export const POSPagination: React.FC<POSPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
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
  );
};

export default POSPagination;

