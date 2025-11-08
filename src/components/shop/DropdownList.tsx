import React, { useMemo, useRef, useState, useEffect, type FC } from "react";

export type DropdownOption = {
  label: string;
  value: string;
};

export type DropdownListProps = {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
};

const Chevron: FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
      open ? "rotate-180" : "rotate-0"
    }`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const DropdownList: FC<DropdownListProps> = ({
  options,
  value,
  onChange,
  placeholder = "Chọn mục",
  className = "",
  label,
  error,
  helperText,
  required = false,
  fullWidth = true,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found?.label ?? placeholder;
  }, [options, value, placeholder]);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const baseButtonClasses =
    "w-full px-4 py-3 flex items-center justify-between rounded-lg border transition-colors text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400";

  const buttonClasses = `${baseButtonClasses} ${
    error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 hover:border-gray-400"
  } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`;

  const selectedTextColor = value ? "text-gray-900" : "text-gray-400";

  const containerClass = fullWidth ? "w-full" : "";

  return (
    <div className={`${containerClass} ${className}`} data-name="DropdownList">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          className={buttonClasses}
          onClick={() => !disabled && setOpen((s) => !s)}
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
        >
          <span className={`truncate font-medium ${selectedTextColor}`}>
            {selectedLabel}
          </span>
          <Chevron open={open} />
        </button>

        {open && !disabled && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            {/* Dropdown */}
            <div
              ref={dropdownRef}
              className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto"
              role="listbox"
            >
              <ul className="py-1">
                {options.length > 0 ? (
                  options.map((opt) => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={value === opt.value}
                        className={`w-full text-left px-4 py-2.5 text-sm sm:text-base font-medium transition-colors ${
                          value === opt.value
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => handleSelect(opt.value)}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2.5 text-sm text-gray-500">
                    Không có tùy chọn
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default DropdownList;
