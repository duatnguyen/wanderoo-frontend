import React from "react";
import CustomCheckbox from "@/components/ui/custom-checkbox";

interface ProductTableHeaderProps {
    selectAll: boolean;
    selectedCount: number;
    onSelectAll: (checked: boolean) => void;
    onClearSelection: () => void;
    showSelectionActions?: boolean;
}

const ProductTableHeader: React.FC<ProductTableHeaderProps> = ({
    selectAll,
    selectedCount,
    onSelectAll,
    onClearSelection,
    showSelectionActions = false,
}) => {
    if (showSelectionActions) {
        return (
            <div className="bg-[#f6f6f6] flex items-center px-[5px] py-0 rounded-tl-[24px] rounded-tr-[24px] w-full h-[68px]">
                <div className="flex flex-row items-center w-full h-full gap-[12px]">
                    <div
                        className="flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CustomCheckbox
                            checked={selectAll}
                            onChange={onSelectAll}
                            className="w-[14px] h-[14px]"
                        />
                    </div>
                    <span className="font-semibold text-[#272424] text-[12px] leading-[1.5] whitespace-nowrap">
                        Đã chọn {selectedCount} sản phẩm
                    </span>
                    <div className="flex gap-[6px] items-center">
                        <button
                            onClick={onClearSelection}
                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm transition-colors"
                        >
                            Xóa
                        </button>
                        <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors">
                            Ẩn
                        </button>
                        <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm transition-colors">
                            Thao tác khác
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f6f6f6] flex items-center py-0 rounded-tl-[24px] rounded-tr-[24px] w-full h-[68px]">
            <div className="flex flex-row items-center w-full h-full">
                <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-1/4 min-w-48">
                    {/* Checkbox at the beginning to match ProductItem */}
                    <div
                        className="flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CustomCheckbox
                            checked={selectAll}
                            onChange={onSelectAll}
                            className="w-[14px] h-[14px]"
                        />
                    </div>

                    {/* Space for dropdown button alignment */}
                    <div className="w-6 h-6 flex-shrink-0"></div>

                    {/* Space for image alignment */}
                    <div className="w-[70px] h-[70px] flex-shrink-0"></div>

                    <div className="flex-1">
                        <span className="font-semibold text-[#272424] text-[12px] leading-[1.4]">
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