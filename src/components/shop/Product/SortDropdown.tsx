import React, { useEffect, useRef, useState } from "react";

export type SortOption = {
  value: string;
  label: string;
};

export const SORT_OPTIONS: SortOption[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "PRICE_ASC", label: "Giá tăng dần" },
  { value: "PRICE_DESC", label: "Giá giảm dần" },
  { value: "IN_STOCK", label: "Còn hàng" },
  { value: "RATING", label: "Đánh giá cao" },
];

type SortDropdownProps = {
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
};

const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  options,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 rounded-2xl border-2 px-4 py-2 text-sm font-medium transition-all ${
          isOpen
            ? "border-[#f97316] bg-white shadow-sm"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <span className="text-[#454545]">{selectedOption.label}</span>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-full min-w-[180px] rounded-xl border border-gray-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                  option.value === value
                    ? "bg-blue-500 text-white font-medium"
                    : "text-[#454545] hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;

