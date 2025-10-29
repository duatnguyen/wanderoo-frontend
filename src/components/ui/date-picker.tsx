import React from "react";
import { cn } from "@/lib/utils";

export type DatePickerProps = React.ComponentProps<"input"> & {
  containerClassName?: string;
  label?: string;
  error?: string;
};

export function DatePicker({
  className,
  containerClassName,
  label,
  error,
  ...props
}: DatePickerProps) {
  return (
    <div className={cn("flex flex-col gap-[8px]", containerClassName)}>
      {label && (
        <label className="font-semibold text-[14px] text-[#272424]">
          {label}
        </label>
      )}
      <div
        className={cn(
          "bg-white border-2 border-[#e04d30] flex items-center p-[16px] rounded-[12px] w-full",
          error && "border-red-500"
        )}
      >
        <input
          {...props}
          type="datetime-local"
          className={cn(
            "border-0 outline-none bg-transparent text-[12px] font-semibold placeholder:text-[#888888] text-[#272424] flex-1",
            className
          )}
        />
      </div>
      {error && (
        <span className="text-red-500 text-[12px] font-medium">{error}</span>
      )}
    </div>
  );
}

export default DatePicker;
