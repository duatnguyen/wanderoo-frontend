import React, { FC } from "react";

export type SearchFormProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  variant?: "default" | "secondary";
  className?: string;
};

const SearchIcon: FC = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-6.15z"
    />
  </svg>
);

const SearchForm: FC<SearchFormProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Tìm kiếm mã đơn hàng trả, tên và SDT khách hàng ",
  variant = "default",
  className = "",
}) => {
  return (
    <form
      className={`relative w-full ${className}`}
      onSubmit={onSubmit}
      autoComplete="off"
    >
      <input
        type="text"
        className={`w-full pr-10 pl-4 py-2 text-[14px] rounded-[5px] border border-[#454545] outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 placeholder:text-gray-400 ${
          {
            default: "bg-white",
            secondary: "bg-[#f6f6f6] border-[#454545]",
          }[variant]
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        data-testid="search-input"
      />
      <button
        type="submit"
        className="absolute top-1/2 right-3 -translate-y-1/2 p-0 bg-transparent border-none cursor-pointer"
        tabIndex={-1}
        aria-label="Tìm kiếm"
        data-testid="search-submit"
      >
        <SearchIcon />
      </button>
    </form>
  );
};

export default SearchForm;
