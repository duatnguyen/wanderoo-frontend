import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const wardOptions = [
  "Phường 1",
  "Phường 2",
  "Phường 3",
  "Phường 4",
  "Phường 5",
  "Phường 6",
  "Phường 7",
  "Phường 8",
  "Phường 9",
  "Phường 10",
  "Đinh Tiên Hoàng",
  "Phường Phố Huế",
];

interface WardDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

const WardDropdown: React.FC<WardDropdownProps> = ({
  value,
  onValueChange,
  placeholder = "Chọn phường/xã",
  className = "",
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    onValueChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "bg-white border-2 border-[#e04d30] h-[36px] px-[12px] rounded-[12px] w-full flex items-center justify-between cursor-pointer",
          error && "border-red-500"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={cn(
            "border-0 outline-none bg-transparent text-[14px] font-semibold flex-1",
            value ? "text-[#272424]" : "text-[#888888]"
          )}
        >
          {value || placeholder}
        </span>
        <svg
          className={cn(
            "w-4 h-4 text-[#272424] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e04d30] rounded-[12px] shadow-lg z-50 max-h-60 overflow-y-auto">
          {wardOptions.map((option) => (
            <div
              key={option}
              className="px-[16px] py-[12px] text-[14px] font-medium text-[#272424] hover:bg-[#f5f5f5] cursor-pointer first:rounded-t-[12px] last:rounded-b-[12px]"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WardDropdown;
