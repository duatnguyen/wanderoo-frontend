import React from "react";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/ui/form-input";

export type POSFooterProps = {
  note: string;
  onNoteChange: (value: string) => void;
  employee: string;
  className?: string;
};

export const POSFooter: React.FC<POSFooterProps> = ({
  note,
  onNoteChange,
  employee,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white border-t border-[#e7e7e7] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 px-3 sm:px-4 lg:px-6 py-3 sm:py-4",
        className
      )}
    >
      {/* Note */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <label className="text-xs  sm:text-sm text-[#272424] font-medium whitespace-nowrap flex-shrink-0">
          Ghi chú
        </label>
        <FormInput
          type="text"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Nhập ghi chú đơn hàng"
          containerClassName="flex-1 min-w-0"
        />
      </div>

      {/* Employee */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <label className="text-xs sm:text-sm text-[#272424] font-medium whitespace-nowrap">
          Nhân viên
        </label>
        <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 border border-[#e7e7e7] rounded-lg text-xs sm:text-sm text-[#272424] min-w-[100px] sm:min-w-[150px] truncate">
          {employee}
        </div>
      </div>
    </div>
  );
};

export default POSFooter;
