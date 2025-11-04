import React, { type FC } from "react";
import { Search } from "lucide-react";

export type SearchFormProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  variant?: "default" | "secondary";
  className?: string;
};

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
        <Search className="w-5 h-5 text-gray-400" />
      </button>
    </form>
  );
};

export default SearchForm;
