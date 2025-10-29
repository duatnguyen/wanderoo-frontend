import * as React from "react";
import { cn } from "@/lib/utils";

export interface CustomRadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  containerClassName?: string;
}

const CustomRadio = React.forwardRef<HTMLInputElement, CustomRadioProps>(
  (
    { className, containerClassName, label, checked, onChange, ...props },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <label
        className={cn(
          "flex items-center gap-[20px] cursor-pointer group",
          containerClassName
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            type="radio"
            checked={checked}
            onChange={handleChange}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              "relative w-[24px] h-[24px] rounded-full border-2 transition-all duration-200 ease-in-out",
              checked
                ? "border-[#e04d30] bg-[#e04d30]"
                : "border-[#d1d1d1] bg-white group-hover:border-[#e04d30]",
              "focus-within:ring-2 focus-within:ring-[#e04d30]/30 focus-within:ring-offset-1",
              className
            )}
          >
            {/* Inner dot when checked */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out",
                checked ? "opacity-100 scale-100" : "opacity-0 scale-0"
              )}
            >
              <div className="w-[8px] h-[8px] rounded-full bg-white" />
            </div>
          </div>
        </div>
        {label && (
          <span
            className={cn(
              "font-semibold text-[12px] leading-[1.4] transition-colors duration-200",
              checked ? "text-[#e04d30]" : "text-[#272424]"
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

CustomRadio.displayName = "CustomRadio";

export default CustomRadio;
