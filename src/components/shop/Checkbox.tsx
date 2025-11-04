import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className = "",
  id,
  checked,
  ...props
}) => {
  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const prevChecked = React.useRef(checked);

  // Trigger ripple effect when checked changes from false to true
  useEffect(() => {
    if (checked && !prevChecked.current) {
      setShowRipple(true);
      const timer = setTimeout(() => setShowRipple(false), 500);
      return () => clearTimeout(timer);
    }
    prevChecked.current = checked;
  }, [checked]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <div className="relative inline-flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            checked={checked}
            className="sr-only"
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={cn(
              "relative w-5 h-5",
              "flex items-center justify-center",
              "border-2 rounded-[5px]",
              "cursor-pointer",
              "transition-all duration-200 ease-in-out",
              "select-none",
              checked
                ? "bg-[#18345c] border-[#18345c] shadow-sm"
                : "bg-white border-gray-300 hover:border-[#18345c]/50",
              "focus-within:ring-2 focus-within:ring-[#18345c]/20 focus-within:ring-offset-1",
              isPressed && "scale-90",
              "active:scale-95",
              props.disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            {/* Checkmark Icon */}
            <Check
              className={cn(
                "w-3.5 h-3.5 text-white",
                "transition-all duration-200 ease-in-out",
                checked ? "opacity-100 scale-100" : "opacity-0 scale-50"
              )}
              strokeWidth={3}
            />
            {/* Ripple effect when checked */}
            {showRipple && checked && (
              <span
                className={cn(
                  "absolute inset-0 rounded-[5px]",
                  "bg-[#18345c]",
                  "animate-ping",
                  "opacity-30"
                )}
                style={{
                  animationDuration: "0.5s",
                  animationIterationCount: "1",
                }}
                aria-hidden="true"
              />
            )}
          </label>
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm sm:text-base text-gray-700 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
      {error && <span className="text-sm text-red-600 mt-1">{error}</span>}
    </div>
  );
};

export default Checkbox;
