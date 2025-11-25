import React from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  onClick?: () => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder = "Search",
  className,
  onClick,
  onFocus,
  readOnly = false,
}) => {
  const handleChange =
    onChange ??
    (() => {
      /* noop */
    });

  return (
    <div
      className={cn(
        "border-2 bg-white border-[#e04d30] flex items-center gap-2 h-[40px] px-[12px] rounded-[10px] min-w-0 focus-within:border-[#e04d30] focus-within:ring-2 focus-within:ring-[#e04d30]/20",
        className
      )}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="w-4 h-4 text-[#737373]"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        onFocus={onFocus}
        readOnly={readOnly}
        className="grow min-w-0 bg-transparent outline-none border-none text-[12px] text-[#272424] placeholder:text-[#737373]"
        aria-label="Search"
      />
    </div>
  );
};

export default SearchBar;
