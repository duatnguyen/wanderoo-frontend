import { type FC } from "react";
import { Pagination as AntdPagination } from "antd";

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
  label,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {label && <span className="text-gray-700">{label}</span>}
      <AntdPagination
        current={currentPage}
        total={totalPages}
        pageSize={1}
        onChange={(page) => onPageChange?.(page)}
        showSizeChanger={false}
        showQuickJumper={false}
        simple
      />
    </div>
  );
};

export default Pagination;
