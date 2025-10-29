import React from "react";
import { cn } from "@/lib/utils";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  className,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative w-[24px] h-[24px] rounded-[6px] border-2 transition-all duration-200 cursor-pointer",
        checked
          ? "bg-[#e04d30] border-[#e04d30]"
          : "bg-white border-[#d1d1d1] hover:border-[#e04d30]",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-checked={checked}
      aria-label={checked ? "Checked" : "Unchecked"}
    >
      {/* Checkmark */}
      <svg
        className={cn(
          "absolute inset-0 w-full h-full transition-all duration-200",
          checked ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 6L9 17L4 12"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default CustomCheckbox;
