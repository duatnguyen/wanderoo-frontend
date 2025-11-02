import type { ReactNode } from "react";
import { Pagination } from "@/components/ui/pagination";

export interface TableColumn {
  key: string;
  title: string;
  width?: string;
  minWidth?: string;
  className?: string;
  render?: (value: any, record: any, index: number) => ReactNode;
}

export interface DataTableProps<T = any> {
  columns: TableColumn[];
  data: T[];
  loading?: boolean;
  className?: string;
  // Selection
  selectable?: boolean;
  selectedRows?: Set<string | number>;
  onSelectRow?: (id: string | number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  getRowId?: (record: T) => string | number;
  // Actions
  actions?: ReactNode;
  selectedCount?: number;
  // Pagination
  pagination?: {
    current: number;
    total: number;
    onChange: (page: number) => void;
  };
  // Row events
  onRowClick?: (record: T, index: number) => void;
  // Custom styling
  headerClassName?: string;
  rowClassName?: string | ((record: T, index: number) => string);
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  className = "",
  selectable = false,
  selectedRows = new Set(),
  onSelectRow,
  onSelectAll,
  getRowId = (record) => record.id,
  actions,
  selectedCount = 0,
  pagination,
  onRowClick,
  headerClassName = "",
  rowClassName = "",
}: DataTableProps<T>) => {
  const isAllSelected = data.length > 0 && data.every(record => selectedRows.has(getRowId(record)));

  const handleSelectAll = (checked: boolean) => {
    onSelectAll?.(checked);
  };

  const handleSelectRow = (record: T, checked: boolean) => {
    const id = getRowId(record);
    onSelectRow?.(id, checked);
  };

  const getRowClasses = (record: T, index: number) => {
    let classes = `border-[0px_0px_1px] border-solid flex flex-col items-start justify-center px-[12px] py-0 w-full ${
      index === data.length - 1 ? "border-transparent" : "border-[#e7e7e7]"
    }`;

    if (selectable && selectedRows.has(getRowId(record))) {
      classes += " bg-blue-50";
    } else {
      classes += " hover:bg-gray-50";
    }

    if (onRowClick) {
      classes += " cursor-pointer";
    }

    if (typeof rowClassName === "function") {
      classes += ` ${rowClassName(record, index)}`;
    } else if (rowClassName) {
      classes += ` ${rowClassName}`;
    }

    return classes;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-[12px] ${className}`}>
      {/* Table */}
      <div className="border-[0.5px] border-[#d1d1d1] flex flex-col items-start rounded-[16px] w-full overflow-x-auto">
        {/* Table Header */}
        <div className={`bg-[#f6f6f6] flex items-center px-[12px] py-0 rounded-tl-[16px] rounded-tr-[16px] w-full h-[58px] ${headerClassName}`}>
          <div className="flex flex-row items-center w-full h-full">
            {/* Checkbox column */}
            {selectable && (
              <div className="flex h-full items-center px-[4px] py-[12px] w-8 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-[18px] h-[18px] rounded border-2 border-gray-300"
                />
              </div>
            )}

            {/* If selection active and actions provided, show actions */}
            {selectable && selectedCount > 0 && actions ? (
              <div className="flex items-center gap-[12px] flex-1 px-[4px]">
                <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] whitespace-nowrap">
                  Đã chọn {selectedCount} mục
                </span>
                {actions}
              </div>
            ) : (
              <>
                {columns.map((column) => (
                  <div
                    key={column.key}
                    className={`flex gap-[6px] items-center px-[4px] py-[12px] ${
                      column.width || "flex-1"
                    } ${column.minWidth ? `min-w-[${column.minWidth}]` : ""} ${
                      column.className || ""
                    }`}
                  >
                    <span className="font-semibold text-[#272424] text-[14px] leading-[1.4]">
                      {column.title}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Table Body */}
        {data.map((record, index) => (
          <div
            key={getRowId(record)}
            className={getRowClasses(record, index)}
            onClick={() => onRowClick?.(record, index)}
          >
            <div className="flex items-center w-full">
              <div className="flex flex-row items-center w-full">
                {/* Checkbox column */}
                {selectable && (
                  <div className="flex h-full items-center px-[4px] py-[12px] w-8 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(getRowId(record))}
                      onChange={(e) => handleSelectRow(record, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-[18px] h-[18px] rounded border-2 border-gray-300"
                    />
                  </div>
                )}

                {/* Data columns */}
                {columns.map((column) => (
                  <div
                    key={column.key}
                    className={`flex flex-col gap-[2px] h-full items-start px-[4px] py-[12px] ${
                      column.width || "flex-1"
                    } ${column.minWidth ? `min-w-[${column.minWidth}]` : ""} ${
                      column.className || ""
                    }`}
                  >
                    {column.render
                      ? column.render(record[column.key], record, index)
                      : (
                        <span className="font-medium text-[#272424] text-[14px] leading-[1.4]">
                          {record[column.key]}
                        </span>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="flex items-center justify-center p-8 w-full">
            <div className="text-gray-500">Không có dữ liệu</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          current={pagination.current}
          total={pagination.total}
          onChange={pagination.onChange}
        />
      )}
    </div>
  );
};