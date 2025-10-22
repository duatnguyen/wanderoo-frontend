import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  current: number;
  total: number; // total items
  pageSize?: number;
  onChange?: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<Readonly<PaginationProps>> = ({
  current,
  total,
  pageSize = 10,
  onChange,
  className,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const start = Math.min(total, (current - 1) * pageSize + 1);
  const end = Math.min(total, current * pageSize);

  const handlePrev = () => {
    if (current > 1 && onChange) onChange(current - 1);
  };

  const handleNext = () => {
    if (current < totalPages && onChange) onChange(current + 1);
  };

  return (
    <div className={cn("flex items-center justify-between p-4", className)}>
      <p className="text-sm text-gray-500">
        Hiển thị {start}-{end} trong tổng số {total} tài khoản
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={current <= 1}
          aria-label="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" className="bg-[#e04d30] text-white">
          {current}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={current >= totalPages}
          aria-label="Trang tiếp"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
