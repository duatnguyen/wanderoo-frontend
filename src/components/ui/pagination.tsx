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
      "bg-white border border-[#e7e7e7] rounded-[12px] flex items-center justify-between px-[30px] py-[10px]",
      className
    )}>
      {/* Left side - Display info */}
      <div className="flex gap-[3px] items-start">
        <p className="text-[12px] text-[#737373] font-normal leading-[1.5] whitespace-pre">
          Đang hiển thị {start} - {end} trong tổng {totalPages} trang
        </p>
      </div>

      {/* Right side - Page controls */}
      <div className="flex gap-[16px] items-start">
        {/* Page number section */}
        <div className="flex gap-[13px] items-center">
          <p className="text-[12px] text-[#272424] font-normal leading-[1.5] whitespace-pre">
            Trang số
          </p>
          <div className="bg-transparent border border-transparent rounded-[8px] px-[8px] py-[4px]">
            <p className="text-[12px] text-[#272424] font-normal leading-[1.5] whitespace-pre">
              {current}
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex gap-[6px] items-start">
          {/* Previous button */}
          <button
            onClick={handlePrev}
            disabled={current <= 1}
            className={cn(
              "border border-[#b0b0b0] rounded-[8px] px-[6px] py-[4px] flex items-center justify-center w-[20px] h-[20px]",
              "hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-200"
            )}
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-[8px] w-[8px] text-[#d1d1d1]" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={current >= totalPages}
            className={cn(
              "border border-[#b0b0b0] rounded-[8px] px-[6px] py-[4px] flex items-center justify-center w-[20px] h-[20px]",
              "hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-200"
            )}
            aria-label="Trang tiếp"
          >
            <ChevronRight className="h-[8px] w-[8px] text-[#272424]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
