import React, { type FC } from "react";
import DropdownList from "./DropdownList";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  label?: string;
  className?: string;
};

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  label = "Trang hiện tại",
  className = "",
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pageOptions = pages.map((page) => ({
    value: page.toString(),
    label: page.toString(),
  }));

  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageChange = (value: string) => {
    const page = parseInt(value, 10);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="text-gray-700">{label}</span>
      <DropdownList
        options={pageOptions}
        value={currentPage.toString()}
        onChange={handlePageChange}
        fullWidth={false}
        className="w-auto min-w-[80px]"
      />
      <button
        onClick={handlePrevious}
        disabled={currentPage <= 1}
        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        aria-label="Trang trước"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        aria-label="Trang sau"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;

