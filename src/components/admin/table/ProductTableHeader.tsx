import React from "react";
import CustomCheckbox from "@/components/ui/custom-checkbox";

interface ProductTableHeaderProps {
    selectAll: boolean;
    isIndeterminate?: boolean;
    selectedCount: number;
    totalCount?: number;
    onSelectAll: (checked: boolean) => void;
    onClearSelection: () => void;
    onBulkDelete?: () => void;
    onBulkHide?: () => void;
    onBulkShow?: () => void;
    onBulkExport?: () => void;
    showSelectionActions?: boolean;
    actionDisabled?: boolean;
}

const ProductTableHeader: React.FC<ProductTableHeaderProps> = ({
    selectAll,
    isIndeterminate = false,
    selectedCount,
    totalCount = 0,
    onSelectAll,
    onClearSelection,
    onBulkDelete,
    onBulkHide,
    onBulkShow,
    onBulkExport,
    showSelectionActions = false,
    actionDisabled = false,
}) => {
    if (showSelectionActions) {
        return (
            <div className="bg-gradient-to-r from-[#e3f2fd] to-[#f3e5f5] border-l-4 border-[#2196f3] flex items-center px-[16px] py-0 rounded-t-[16px] w-full h-[68px] shadow-sm">
                <div className="flex flex-row items-center w-full h-full gap-[16px]">
                    {/* Enhanced Checkbox with indeterminate state */}
                    <div
                        className="flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <CustomCheckbox
                                checked={selectAll}
                                onChange={onSelectAll}
                                className="w-[14px] h-[14px]"
                            />
                            {isIndeterminate && !selectAll && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-2 h-0.5 bg-[#2196f3] rounded"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selection Count with Animation */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#2196f3] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{selectedCount}</span>
                        </div>
                        <span className="font-semibold text-[#1976d2] text-[14px] leading-[1.5] whitespace-nowrap">
                            {selectedCount === totalCount ? `Tất cả ${selectedCount}` : `${selectedCount} / ${totalCount}`} sản phẩm được chọn
                        </span>
                    </div>

                    {/* Bulk Actions with Icons */}
                    <div className="flex gap-[8px] items-center ml-auto">
                        <button
                            onClick={onClearSelection}
                            disabled={actionDisabled}
                            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm flex items-center gap-2"
                            title="Bỏ chọn tất cả (ESC)"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Bỏ chọn
                        </button>

                        <button
                            onClick={onBulkExport}
                            disabled={actionDisabled}
                            className="px-4 py-2 bg-[#4caf50] hover:bg-[#45a049] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                            title="Xuất dữ liệu sản phẩm đã chọn"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Xuất Excel
                        </button>

                        <button
                            onClick={onBulkShow}
                            disabled={actionDisabled}
                            className="px-4 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                            title="Hiện sản phẩm đã chọn"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Hiện ({selectedCount})
                        </button>

                        <button
                            onClick={onBulkHide}
                            disabled={actionDisabled}
                            className="px-4 py-2 bg-[#ff9800] hover:bg-[#f57c00] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                            title="Ẩn sản phẩm đã chọn"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                            Ẩn ({selectedCount})
                        </button>

                        <button
                            onClick={onBulkDelete}
                            disabled={actionDisabled}
                            className="px-4 py-2 bg-[#f44336] hover:bg-[#d32f2f] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                            title="Xóa vĩnh viễn sản phẩm đã chọn (Delete)"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Xóa ({selectedCount})
                        </button>
                    </div>
                </div>
              )}
            </div>
          </div>

          {/* Selection Count with Animation */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#2196f3] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {selectedCount}
              </span>
            </div>
            <span className="font-semibold text-[#1976d2] text-[14px] leading-[1.5] whitespace-nowrap">
              {selectedCount === totalCount
                ? `Tất cả ${selectedCount}`
                : `${selectedCount} / ${totalCount}`}{" "}
              sản phẩm được chọn
            </span>
          </div>

          {/* Bulk Actions with Icons */}
          <div className="flex gap-[8px] items-center ml-auto">
            <button
              onClick={onClearSelection}
              className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm flex items-center gap-2"
              title="Bỏ chọn tất cả (ESC)"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Bỏ chọn
            </button>

            <button
              onClick={onBulkExport}
              className="px-4 py-2 bg-[#4caf50] hover:bg-[#45a049] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
              title="Xuất dữ liệu sản phẩm đã chọn"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Xuất Excel
            </button>

            <button
              onClick={onBulkHide}
              className="px-4 py-2 bg-[#ff9800] hover:bg-[#f57c00] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
              title="Ẩn sản phẩm đã chọn"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
              Ẩn ({selectedCount})
            </button>

            <button
              onClick={onBulkDelete}
              className="px-4 py-2 bg-[#f44336] hover:bg-[#d32f2f] text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
              title="Xóa vĩnh viễn sản phẩm đã chọn (Delete)"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Xóa ({selectedCount})
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f6f6] flex items-center py-0 rounded-t-[16px] w-full h-[68px]">
      <div className="flex flex-row items-center w-full h-full">
        <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-1/4 min-w-48">
          {/* Enhanced Checkbox with indeterminate state */}
          <div
            className="flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
            title={
              isIndeterminate
                ? "Một số sản phẩm được chọn"
                : selectAll
                  ? "Bỏ chọn tất cả"
                  : "Chọn tất cả (Ctrl+A)"
            }
          >
            <div className="relative">
              <CustomCheckbox
                checked={selectAll}
                onChange={onSelectAll}
                className="w-[14px] h-[14px]"
              />
              {isIndeterminate && !selectAll && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-2 h-0.5 bg-[#2196f3] rounded"></div>
                </div>
              )}
            </div>
          </div>

          {/* Space for dropdown button alignment */}
          <div className="w-6 h-6 flex-shrink-0"></div>

          {/* Space for image alignment */}
          <div className="w-[70px] h-[70px] flex-shrink-0"></div>

          <div className="flex-1">
            <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-left">
              Tên sản phẩm
            </span>
          </div>
        </div>

        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/8 min-w-20">
          <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
            SKU
          </span>
        </div>

        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/8 min-w-20">
          <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
            Barcode
          </span>
        </div>

        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/12 min-w-16">
          <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
            Tồn kho
          </span>
        </div>

        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/12 min-w-16">
          <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
            Có bán
          </span>
        </div>

        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
          <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
            SL web
          </span>
        </div>

        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
          <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
            SL POS
          </span>
        </div>

        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
          <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
            Giá bán
          </span>
        </div>

        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
          <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
            Giá vốn
          </span>
        </div>

        <div className="flex gap-[4px] h-full items-center justify-center px-[12px] py-[14px] w-1/8 min-w-20">
          <span className="font-semibold text-[#272424] text-[12px] leading-[1.4] text-center">
            Thao tác
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductTableHeader;
