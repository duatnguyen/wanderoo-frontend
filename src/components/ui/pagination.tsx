import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  current: number;
  total: number; // total pages
  onChange?: (page: number) => void;
  className?: string;
  pageSize?: number; // Optional: page size for display calculation
  totalElements?: number; // Optional: total number of items
}

export const Pagination: React.FC<Readonly<PaginationProps>> = ({
  current,
  total,
  onChange,
  className,
  pageSize: propPageSize,
  totalElements: propTotalElements,
}) => {
  const totalPages = total;
  const pageSize = propPageSize ?? 10; // Use provided pageSize or default to 10
  const totalElements = propTotalElements ?? totalPages * pageSize; // Use provided totalElements or calculate

  const start = totalElements > 0 ? (current - 1) * pageSize + 1 : 0;
  const end = Math.min(current * pageSize, totalElements);

  const handlePrev = () => {
    if (current > 1 && onChange) onChange(current - 1);
  };

  const handleNext = () => {
    if (current < totalPages && onChange) onChange(current + 1);
  };

  return (
    <div
      className={cn(
        "bg-white border border-[#e7e7e7] rounded-[12px] flex items-center justify-between px-[30px] py-[10px] w-full",
        className
      )}
    >
      {/* Left side - Display info (hidden on small screens) */}
      <div className="hidden md:flex gap-[3px] items-start">
        <p className="text-[12px] text-[#737373] font-normal leading-[1.5] whitespace-pre">
          {totalElements > 0 ? (
            <>Đang hiển thị {start} - {end} trong tổng {totalElements} sản phẩm ({totalPages} trang)</>
          ) : (
            <>Không có dữ liệu</>
          )}
        </p>
      </div>

      <div className="w-full flex items-center justify-center gap-2">
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={current <= 1}
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center text-[#9ca3af]",
            "hover:bg-gray-50 hover:text-[#6b7280] transition-colors",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          aria-label="Trang trước"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Current page number */}
        <div
          aria-live="polite"
          className="h-8 w-8 rounded-full flex items-center justify-center bg-[#E04D30] text-white font-semibold text-[13px]"
        >
          {current}
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={current >= totalPages}
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center text-[#9ca3af]",
            "hover:bg-gray-50 hover:text-[#6b7280] transition-colors",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          aria-label="Trang tiếp"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
