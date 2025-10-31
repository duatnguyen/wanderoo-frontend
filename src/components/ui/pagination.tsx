import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  current: number;
  total: number; // total pages
  onChange?: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<Readonly<PaginationProps>> = ({
  current,
  total,
  onChange,
  className,
}) => {
  const totalPages = total;
  const pageSize = 10; // Fixed page size for display calculation

  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, totalPages * pageSize);

  const handlePrev = () => {
    if (current > 1 && onChange) onChange(current - 1);
  };

  const handleNext = () => {
    if (current < totalPages && onChange) onChange(current + 1);
  };

  return (
    <div className={cn(
      "bg-white border border-[#e7e7e7] rounded-[12px] flex items-center justify-between px-[30px] py-[10px] w-full",
      className
    )}>
      {/* Left side - Display info (hidden on small screens) */}
      <div className="hidden md:flex gap-[3px] items-start">
        <p className="text-[12px] text-[#737373] font-normal leading-[1.5] whitespace-pre">
          Đang hiển thị {start} - {end} trong tổng {totalPages} trang
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
            "disabled:opacity-40 disabled:cursor-not-allowed",
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
            "disabled:opacity-40 disabled:cursor-not-allowed",
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
