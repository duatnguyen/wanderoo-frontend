import { type FC } from "react";
import { Pagination as AntdPagination } from "antd";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalElements?: number; // Optional: total number of items
  pageSize?: number; // Optional: items per page (default: 12)
  onPageChange?: (page: number) => void;
  label?: string;
  className?: string;
};

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize = 12, // Default page size
  onPageChange,
  label,
  className = "",
}) => {
  // Use totalElements if provided, otherwise calculate from totalPages and pageSize
  const total = totalElements ?? totalPages * pageSize;
  
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {label && <span className="text-gray-700">{label}</span>}
      <AntdPagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={(page) => onPageChange?.(page)}
        showSizeChanger={false}
        showQuickJumper={false}
        simple
      />
    </div>
  );
};

export default Pagination;
