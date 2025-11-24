import React, { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Eye } from "lucide-react";
import CustomCheckbox from "@/components/ui/custom-checkbox";
import type { Product, ProductVariant } from "../../../types/types";

interface ProductItemProps {
    product: Product;
    isSelected: boolean;
    onSelect: (productId: string) => void;
    onUpdate: (productId: string) => void;
    onView?: (productId: string) => void;
    onLoadVariants?: (productId: string) => Promise<ProductVariant[]>;
    isVariantsLoading?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({
    product,
    isSelected,
    onSelect,
    onUpdate,
    onView,
    onLoadVariants,
    isVariantsLoading,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasVariants = Boolean(product.variants && product.variants.length > 0);
    const canExpand = Boolean(onLoadVariants) || hasVariants;

    const toggleExpanded = () => {
        if (!canExpand) return;
        if (!isExpanded && onLoadVariants) {
            onLoadVariants(product.id).catch(() => undefined);
        }
        setIsExpanded((prev) => !prev);
    };

    return (
        <>
            {/* Main Product Row */}
            <div className="border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-50">
                <div className="flex flex-row items-center w-full h-full">
                    {/* Product Name with Image and Checkbox */}
                    <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-1/4 min-w-48">
                        {/* Checkbox at the beginning */}
                        <div
                            className="flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CustomCheckbox
                                checked={isSelected}
                                onChange={() => onSelect(product.id)}
                                className="w-[14px] h-[14px]"
                            />
                        </div>

                        {/* Dropdown button positioned before image for better UX */}
                        <button
                            onClick={toggleExpanded}
                            className={`flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors ${!canExpand ? 'opacity-50 cursor-default' : ''}`}
                            title={canExpand ? (isExpanded ? "Thu gọn biến thể" : "Xem biến thể") : "Sản phẩm không có biến thể"}
                            disabled={!canExpand}
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-3 h-3 text-gray-500" />
                            ) : (
                                <ChevronRight className="w-3 h-3 text-gray-500" />
                            )}
                        </button>

                        <div className="w-[60px] h-[60px] border-[0.5px] border-[#d1d1d1] rounded-[8px] bg-gray-100 flex-shrink-0 overflow-hidden">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <p className="font-medium text-[#272424] text-[10px] leading-[1.4]">
                                {product.name}
                            </p>
                        </div>
                    </div>

                    {/* SKU */}
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/8 min-w-20">
                        <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                            {product.sku}
                        </span>
                    </div>

                    {/* Barcode */}
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/8 min-w-20">
                        <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                            {product.barcode || "---"}
                        </span>
                    </div>

                    {/* Inventory */}
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/12 min-w-16">
                        <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                            {product.inventory}
                        </span>
                    </div>

                    {/* Available to Sell */}
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/12 min-w-16">
                        <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                            {product.availableToSell}
                        </span>
                    </div>

                    {/* Web Quantity */}
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
                        <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                            {product.webQuantity.toLocaleString()}
                        </span>
                    </div>

                    {/* POS Quantity */}
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
                        <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                            {product.posQuantity.toLocaleString()}
                        </span>
                    </div>

                    {/* Selling Price */}
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
                        <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                            {product.sellingPrice}
                        </span>
                    </div>

                    {/* Cost Price */}
                    <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
                        <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                            {product.costPrice}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-[4px] h-full items-center justify-center px-[12px] py-[14px] w-1/8 min-w-20">
                        {onView && (
                            <button
                                onClick={() => onView(product.id)}
                                className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                                title="Xem chi tiết"
                            >
                                <Eye className="w-4 h-4 text-[#12A454] hover:text-[#0B7036]" />
                            </button>
                        )}
                        <button
                            onClick={() => onUpdate(product.id)}
                            className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                            title="Cập nhật"
                        >
                            <Edit className="w-4 h-4 text-[#2B73F0] hover:text-[#1C57C0]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Variant Rows */}
            {isExpanded && (
                <>
                    {isVariantsLoading && (
                        <div className="bg-[#f6f6f6] border-b-[0.5px] border-[#e7e7e7] flex items-center justify-center px-0 py-6 w-full text-sm text-gray-500">
                            Đang tải biến thể...
                        </div>
                    )}
                    {!isVariantsLoading && (!product.variants || product.variants.length === 0) && (
                        <div className="bg-[#f6f6f6] border-b-[0.5px] border-[#e7e7e7] flex items-center justify-center px-0 py-6 w-full text-sm text-gray-500">
                            Sản phẩm này chưa có biến thể
                        </div>
                    )}
                </>
            )}
            {isExpanded && !isVariantsLoading && product.variants?.map((variant) => (
                <div key={variant.id} className="bg-[#f6f6f6] border-b-[0.5px] border-[#e7e7e7] flex items-center px-0 py-0 w-full hover:bg-gray-100">
                    <div className="flex flex-row items-center w-full h-full">
                        {/* Variant Name */}
                        <div className="flex gap-[8px] h-full items-center px-[5px] py-[14px] w-1/4 min-w-48">
                            {/* Empty space for checkbox alignment */}
                            <div className="w-[14px] h-[14px] flex-shrink-0"></div>

                            {/* Empty space for dropdown alignment */}
                            <div className="w-6 h-6 flex-shrink-0"></div>

                            <div className="w-[60px] h-[60px] flex-shrink-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                                    <span className="text-xs text-gray-500 font-medium">V</span>
                                </div>
                            </div>

                            <div className="flex-1 flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-gray-300"></div> {/* Visual connection line */}
                                <p className="font-medium text-[#272424] text-[10px] leading-[1.4] flex-1 text-gray-600">
                                    {variant.name}
                                </p>
                            </div>
                        </div>

                        {/* SKU */}
                        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/8 min-w-20">
                            <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center whitespace-pre-line">
                                SKU phân loại:{"\n"}{variant.sku}
                            </span>
                        </div>

                        {/* Barcode */}
                        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/8 min-w-20">
                            <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                                {variant.barcode}
                            </span>
                        </div>

                        {/* Inventory */}
                        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/12 min-w-16">
                            <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                                {variant.inventory}
                            </span>
                        </div>

                        {/* Available to Sell */}
                        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/12 min-w-16">
                            <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                                {variant.availableToSell}
                            </span>
                        </div>

                        {/* Web Quantity */}
                        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
                            <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                                {variant.webQuantity.toLocaleString()}
                            </span>
                        </div>

                        {/* POS Quantity */}
                        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
                            <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                                {variant.posQuantity.toLocaleString()}
                            </span>
                        </div>

                        {/* Selling Price */}
                        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
                            <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                                {variant.sellingPrice}
                            </span>
                        </div>

                        {/* Cost Price */}
                        <div className="flex h-full items-center justify-center px-[12px] py-[14px] w-1/10 min-w-20">
                            <span className="font-medium text-[#272424] text-[10px] leading-[1.4] text-center">
                                {variant.costPrice}
                            </span>
                        </div>

                        {/* Empty Actions Column */}
                        <div className="flex gap-[4px] h-full items-center justify-center px-[12px] py-[14px] w-1/8 min-w-20">
                            {/* No actions for variants */}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ProductItem;