import React from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  success = false,
  children,
  className = "",
  hint,
}) => {
  return (
    <div
      className={`flex flex-col gap-2 transition-all duration-200 ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {required && (
          <span className="text-[12px] font-bold text-[#ff4444] font-montserrat">
            *
          </span>
        )}
        <label className="text-[14px] font-semibold text-[#2d2d2d] font-montserrat leading-[140%]">
          {label}
        </label>
        {success && !error && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-green-500"
          >
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {error && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-red-500"
          >
            <path
              d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <div
        className={`transition-all duration-200 ${error ? "scale-[1.01]" : ""}`}
      >
        {children}
      </div>

      {hint && !error && (
        <span className="text-[12px] text-gray-500 font-medium leading-relaxed">
          {hint}
        </span>
      )}

      {error && (
        <div className="flex items-center gap-1.5 animate-fadeIn">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="text-red-500 flex-shrink-0"
          >
            <path
              d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[12px] text-red-600 font-medium leading-relaxed">
            {error}
          </span>
        </div>
      )}
    </div>
  );
};

export default FormField;
