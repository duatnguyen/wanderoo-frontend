import React, { useMemo, useRef, useState, type FC } from "react";

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
};

const Chevron: FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`w-5 h-5 text-gray-600 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DropdownList: FC<DropdownListProps> = ({
  options,
  value,
  onChange,
  placeholder = "Chọn mục",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found?.label ?? placeholder;
  }, [options, value, placeholder]);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpen(false);
  };

  // If className includes width classes, don't apply default width
  const hasWidthOverride = className.includes("w-") || className.includes("!w-");
  const containerClass = hasWidthOverride 
    ? `relative ${className}` 
    : `relative w-[190px] ${className}`;
  
  return (
    <div className={containerClass} data-name="DropdownList">
      <button
        ref={buttonRef}
        type="button"
        className="w-full h-[30px] px-3 flex items-center justify-between rounded-[5px] border border-[#454545] bg-white text-[14px] text-[#454545]"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate font-medium">{selectedLabel}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-[5px] border border-black bg-white shadow-sm"
          role="listbox"
        >
          <ul className="py-1">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === opt.value}
                  className={`w-full text-left px-3 py-2 text-[14px] font-medium text-[#454545] hover:bg-gray-100 ${
                    value === opt.value ? "bg-gray-50" : "bg-[#fffefe]"
                  }`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownList;
