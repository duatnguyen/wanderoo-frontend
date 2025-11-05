import React, { useState } from "react";

export type ActionOption = {
  id: string;
  label: string;
  onClick: () => void;
};

interface ActionButtonProps {
  children: React.ReactNode;
  options?: ActionOption[];
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  options = [],
  variant = "ghost",
  size = "md",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  const baseStyles =
    "px-4 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2";

  const variantStyles = {
    primary: "bg-[#ea5b0c] text-white border-[#ea5b0c] hover:bg-[#d5510b]",
    outline: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
    ghost: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      >
        {children}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && options.length > 0 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.onClick)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ActionButton;
