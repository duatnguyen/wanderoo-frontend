import React from "react";
import { Input as AntdInput } from "antd";
import type { InputProps as AntdInputProps } from "antd/es/input";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

const { TextArea: AntdTextArea } = AntdInput;

const baseInputClasses = "px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  required,
  fullWidth = true,
  className = "",
  id,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword,
  type,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputProps: AntdInputProps = {
    id: inputId,
    type:
      showPasswordToggle && type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type,
    className: `${fullWidth ? "w-full" : ""} ${className}`,
    status: error ? "error" : undefined,
    ...props,
  };

  if (showPasswordToggle && type === "password") {
    inputProps.suffix = (
      <button
        type="button"
        onClick={onTogglePassword}
        className="text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer"
        aria-label={showPassword ? "Hiển thị mật khẩu" : "Ẩn mật khẩu"}
      >
        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
      </button>
    );
  }

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <AntdInput {...inputProps} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  required,
  fullWidth = true,
  className = "",
  id,
  ...props
}) => {
  const textareaId =
    id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <AntdTextArea
        id={textareaId}
        className={`${fullWidth ? "w-full" : ""} ${className}`}
        status={error ? "error" : undefined}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  required,
  fullWidth = true,
  options,
  className = "",
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`${baseInputClasses} ${fullWidth ? "w-full" : ""} ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
