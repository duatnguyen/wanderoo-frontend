import React from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  right?: React.ReactNode;
  className?: string;
}

export const SearchBar: React.FC<Readonly<SearchBarProps>> = ({
  value = "",
  placeholder = "Tìm kiếm...",
  onChange,
  right,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-[500px] bg-[var(--Background-Light,#fff)] rounded-xl px-4 py-2 flex items-center justify-between border border-[#E04D30]">
        <div className="flex items-center gap-2 relative flex-1">
          <div
            className={`text-neutral-400 text-[10px] font-medium font-['Montserrat'] leading-3 ${
              value ? "opacity-0" : ""
            }`}
          >
            {placeholder}
          </div>

          {/* invisible input overlay to capture typing */}
          <input
            value={value}
            onChange={onChange}
            className="absolute left-0 top-0 w-[500px] h-full bg-transparent border-0 outline-none px-4 py-2 text-sm"
            aria-label={placeholder}
          />
        </div>

        <div className="w-6 h-6 relative">
          <div className="w-3.5 h-3.5 left-[4px] top-[4px] absolute border border-neutral-400" />
        </div>
      </div>

      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
};

export default SearchBar;
