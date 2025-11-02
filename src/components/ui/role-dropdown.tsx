import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RoleDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  options?: string[];
}

const defaultRoleOptions = [
  "Quản lý",
  "Quản lý hệ thống",
  "Nhân viên",
  "Nhân viên thu ngân",
];

const RoleDropdown: React.FC<RoleDropdownProps> = ({
  value,
  onValueChange,
  placeholder = "Chọn vai trò của nhân viên",
  className = "",
  error = false,
  options = defaultRoleOptions,
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option: string) => {
    onValueChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "bg-white border-2 border-[#e04d30] h-[50px] px-[24px] rounded-[12px] w-full flex items-center justify-between cursor-pointer",
          error && "border-red-500"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={cn(
            "border-0 outline-none bg-transparent text-[14px] font-semibold flex-1 text-left",
            value ? "text-[#272424]" : "text-[#e04d30]"
          )}
        >
          {value || placeholder}
        </span>
        <svg
          className={cn(
            "w-4 h-4 text-[#e04d30] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e04d30] rounded-[12px] shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
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

export default RoleDropdown;


