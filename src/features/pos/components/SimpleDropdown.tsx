import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SimpleDropdownProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
};

export const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  value,
  onValueChange,
  options,
  placeholder = "Chọn...",
  className,
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
          "bg-white border-2 border-[#e04d30] h-[52px] px-[16px] rounded-[12px] w-full flex items-center justify-between cursor-pointer"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[12px] font-semibold text-[#272424] flex-1">
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#272424] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e04d30] rounded-[12px] shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleOptionClick(option)}
              className={cn(
                "px-[16px] py-3 cursor-pointer hover:bg-gray-50 transition-colors text-[12px] font-semibold",
                value === option && "bg-gray-50 text-[#e04d30]"
              )}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleDropdown;

