import React, { useState } from "react";
import { formatCurrencyVND } from "../../../features/shop/pages/Product/utils/formatCurrency";
import type { Product } from "../../../features/shop/data/productsData";
import type { ProductDetailsResponse, VariantDetailIdResponse } from "../../../types";

interface ExtendedProduct extends Product {
  sku?: string;
  status?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  originalPriceRange?: {
    min: number;
    max: number;
  };
}

interface ProductInfoProps {
  product: Product;
  productDetail?: ProductDetailsResponse | null;
  quantity: number;
  onQuantityChange: (change: number) => void;
  onAddToCart: () => void;
  selectedAttributeIds?: number[];
  onAttributeSelect?: (attributeIndex: number, valueId: number) => void;
  variantData?: VariantDetailIdResponse | null;
  isLoadingVariant?: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  productDetail,
  quantity,
  onQuantityChange,
  onAddToCart,
  selectedAttributeIds = [],
  onAttributeSelect,
  variantData,
  isLoadingVariant = false,
}) => {
  const extendedProduct = product as ExtendedProduct;
  const attributes = productDetail?.attributes || [];
  const totalAttributes = attributes.length;
  // If no attributes, product can be purchased directly
  const hasSelectedAllAttributes = totalAttributes === 0 || 
    (totalAttributes > 0 && selectedAttributeIds.length === totalAttributes && selectedAttributeIds.every(id => id > 0));

  // Determine stock and status from variant or product
  const stock = variantData?.productDetailQuantity ?? product.stock ?? 0;
  const isInStock = stock > 0;
  const statusLabel = isInStock ? "Còn hàng" : "Hết hàng";
  // SKU mapping: priority: variantData.productDetailSku > productDetail.barcode
  // If barcode is null, show "Đang cập nhật" instead of fallback
  const skuLabel = variantData?.productDetailSku 
    || productDetail?.barcode 
    || "Đang cập nhật";

  // Helper function to parse price from string (may contain "đ" or just number)
  const parsePriceFromString = (priceStr: string | null | undefined): number => {
    if (!priceStr) return 0;
    // Remove all non-digit characters (including "đ", spaces, dots used as thousand separators)
    const cleaned = priceStr.toString().replace(/[^\d]/g, "");
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Helper function to parse price range from string like "7000000đ - 8000000đ"
  const parsePriceRangeFromString = (priceStr: string | null | undefined): { min: number; max: number } | null => {
    if (!priceStr) return null;
    const cleaned = priceStr.toString().replace(/[^\d\s-]/g, ""); // Keep digits, spaces, and dash
    const parts = cleaned.split("-").map(p => parseInt(p.trim().replace(/\s/g, ""), 10)).filter(n => !isNaN(n));
    if (parts.length === 0) return null;
    if (parts.length === 1) return { min: parts[0], max: parts[0] };
    return { min: Math.min(...parts), max: Math.max(...parts) };
  };

  // Helper function to map price from productDetail API response
  const mapPriceFromProductDetail = (pd: ProductDetailsResponse | null | undefined) => {
    if (!pd) return null;
    
    const priceRange = parsePriceRangeFromString(pd.price);
    const discountPriceRange = pd.discountPrice ? parsePriceRangeFromString(pd.discountPrice) : null;
    
    if (!priceRange) return null;
    
    const hasDiscount = discountPriceRange && pd.discountValue;
    
    return {
      currentPrice: discountPriceRange 
        ? `${formatCurrencyVND(discountPriceRange.min)} - ${formatCurrencyVND(discountPriceRange.max)}`
        : `${formatCurrencyVND(priceRange.min)} - ${formatCurrencyVND(priceRange.max)}`,
      originalPrice: hasDiscount ? `${formatCurrencyVND(priceRange.min)} - ${formatCurrencyVND(priceRange.max)}` : null,
      discountPercent: pd.discountValue ? extractDiscountPercent(pd.discountValue) : undefined,
      showDiscount: !!hasDiscount,
    };
  };

  // Helper function to extract discount percent
  const extractDiscountPercent = (discountValue: string | null | undefined): number | undefined => {
    if (!discountValue) return undefined;
    const discountStr = discountValue.toString();
    const match = discountStr.match(/(\d+(?:\.\d+)?)%/);
    if (match) {
      return Math.round(Number(match[1]));
    }
    const numMatch = discountStr.match(/(\d+(?:\.\d+)?)/);
    if (numMatch) {
      return Math.round(Number(numMatch[1]));
    }
    return undefined;
  };

  // Price display logic
  let currentPrice: string;
  let originalPrice: string | null = null;
  let discountPercent: number | undefined;
  let showDiscount = false;
  let showPlaceholderMessage = false; // Flag to show "Vui lòng chọn phân loại hàng" below

  if (hasSelectedAllAttributes && variantData && variantData.productDetailPrice) {
    // When variant is selected, use variant price
    const originalPriceNum = parsePriceFromString(variantData.productDetailPrice);
    const discountPriceNum = variantData.productDetailDiscountPrice 
      ? parsePriceFromString(variantData.productDetailDiscountPrice)
      : null;

    if (originalPriceNum <= 0 || isNaN(originalPriceNum)) {
      // Fallback to productDetail price if variant price invalid
      const pdPrice = mapPriceFromProductDetail(productDetail);
      if (pdPrice) {
        currentPrice = pdPrice.currentPrice;
        originalPrice = pdPrice.originalPrice;
        discountPercent = pdPrice.discountPercent;
        showDiscount = pdPrice.showDiscount;
      } else {
        currentPrice = "Vui lòng chọn phân loại hàng";
        showPlaceholderMessage = true;
      }
    } else if (!discountPriceNum && !variantData.discountValue) {
      // No discount: show only original price
      currentPrice = formatCurrencyVND(originalPriceNum);
      originalPrice = null;
      discountPercent = undefined;
      showDiscount = false;
    } else {
      // Has discount: show discounted price, strikethrough original, show discount tag
      currentPrice = discountPriceNum && discountPriceNum > 0 
        ? formatCurrencyVND(discountPriceNum) 
        : formatCurrencyVND(originalPriceNum);
      originalPrice = formatCurrencyVND(originalPriceNum);
      discountPercent = extractDiscountPercent(variantData.discountValue);
      showDiscount = true;
    }
  } else {
    // When no variant selected or product has no attributes, use productDetail price
    const pdPrice = mapPriceFromProductDetail(productDetail);
    if (pdPrice) {
      currentPrice = pdPrice.currentPrice;
      originalPrice = pdPrice.originalPrice;
      discountPercent = pdPrice.discountPercent;
      showDiscount = pdPrice.showDiscount;
      
      // Show placeholder message if attributes exist but not all selected
      if (totalAttributes > 0 && !hasSelectedAllAttributes) {
        showPlaceholderMessage = true;
      }
    } else {
      // Fallback
      currentPrice = extendedProduct.priceRange
        ? `${formatCurrencyVND(extendedProduct.priceRange.min)} - ${formatCurrencyVND(extendedProduct.priceRange.max)}`
        : formatCurrencyVND(product.price);
      originalPrice = extendedProduct.originalPriceRange
        ? `${formatCurrencyVND(extendedProduct.originalPriceRange.min)} - ${formatCurrencyVND(extendedProduct.originalPriceRange.max)}`
        : product.originalPrice
        ? formatCurrencyVND(product.originalPrice)
        : null;
      discountPercent = product.discountPercent;
      showDiscount = !!discountPercent;
      
      if (totalAttributes > 0 && !hasSelectedAllAttributes) {
        showPlaceholderMessage = true;
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-[20px] leading-tight font-semibold text-[#333333]">
          {product.name}
        </h1>
        <div className="text-[14px] text-[#4d4d4d]">
          <span className="font-medium text-[#3a3a3a]">Thương hiệu:</span>{" "}
          <span className="font-semibold">
            {product.brand || "Đang cập nhật"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[14px] text-[#4d4d4d]">
          <span>
            <span className="font-medium text-[#3a3a3a]">Trạng thái:</span>{" "}
            <span className={isInStock ? "text-[#2b8a3e]" : "text-red-500"}>
              {statusLabel}
            </span>
          </span>
          <span className="text-gray-300">|</span>
          <span>
            <span className="font-medium text-[#3a3a3a]">Mã SKU:</span>{" "}
            <span className="font-semibold">{skuLabel}</span>
          </span>
        </div>
        {/* Attribute Selection */}
        {attributes.length > 0 && attributes.map((attribute, attrIndex) => (
          <div key={attrIndex} className="flex gap-3">
            <span className="text-[14px] font-medium text-[#3a3a3a] shrink-0 pt-2">
              {attribute.name}:
            </span>
            <div className="flex flex-wrap gap-2 items-start">
              {attribute.values?.map((value) => {
                const isSelected = selectedAttributeIds[attrIndex] === value.id;
                return (
                  <button
                    key={value.id}
                    type="button"
                    onClick={() => onAttributeSelect?.(attrIndex, value.id)}
                    disabled={isLoadingVariant}
                    className={`px-4 py-2 rounded-md border-2 text-[14px] transition-colors bg-white ${
                      isSelected
                        ? "border-[#e9502c] text-[#e9502c] font-bold"
                        : "border-[#d9d9d9] text-[#4d4d4d] hover:border-[#d9d9d9]"
                    } ${isLoadingVariant ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {value.value}
                  </button>
                );
              })}
            </div>
            {isLoadingVariant && attrIndex === attributes.length - 1 && (
              <span className="text-xs text-gray-500 ml-2">Đang tải...</span>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[#f4c8b5] bg-[#fff6f1] px-5 py-4">
        {isLoadingVariant && hasSelectedAllAttributes ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#e9502c]"></div>
            <span className="text-[14px] text-[#4d4d4d]">Đang tải giá...</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <span className={`text-[26px] font-semibold ${
              hasSelectedAllAttributes || totalAttributes === 0 ? "text-[#e9502c]" : "text-[#9e9e9e]"
            }`}>
              {currentPrice}
            </span>
            {originalPrice && showDiscount && (
              <span className="text-[14px] text-[#9e9e9e] line-through">
                {originalPrice}
              </span>
            )}
            {discountPercent && showDiscount && (
              <span className="rounded-[4px] bg-[#e9502c] px-2 py-1 text-[14px] font-semibold text-white uppercase">
                -{discountPercent}%
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-[14px] font-medium text-[#3a3a3a]">Số lượng:</span>
        <div className="flex items-center border border-[#d9d9d9] rounded-md overflow-hidden bg-white">
          <button
            onClick={() => onQuantityChange(-1)}
            className="w-10 h-10 flex items-center justify-center text-2xl font-semibold text-[#4d4d4d] hover:bg-[#f5f5f5] transition-colors disabled:text-[#c4c4c4]"
            disabled={quantity <= 1}
          >
            <span>-</span>
          </button>
          <span className="w-10 text-center text-[14px] font-semibold text-[#333333]">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(1)}
            className="w-10 h-10 flex items-center justify-center text-2xl font-semibold text-[#4d4d4d] hover:bg-[#f5f5f5] transition-colors disabled:text-[#c4c4c4]"
            disabled={quantity >= stock}
          >
            <span>+</span>
          </button>
        </div>
        <span className="text-[14px] text-[#808080]">
          {totalAttributes === 0
            ? stock > 0
              ? `Còn lại: ${stock} sản phẩm`
              : "Hết hàng"
            : hasSelectedAllAttributes && variantData
            ? stock > 0
              ? `Còn lại: ${stock} sản phẩm`
              : "Hết hàng"
            : ""}
        </span>
      </div>

      {/* Placeholder message above action buttons */}
      {showPlaceholderMessage && totalAttributes > 0 && !hasSelectedAllAttributes && (
        <p className="text-[14px] font-semibold text-[#e9502c] text-left pt-2">
          Vui lòng chọn phân loại hàng
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={onAddToCart}
          disabled={(totalAttributes > 0 && !hasSelectedAllAttributes) || !isInStock || isLoadingVariant}
          className={`!h-12 !border-2 !text-[14px] !font-semibold !px-6 rounded-md flex items-center justify-center gap-2 transition-colors ${
            hasSelectedAllAttributes && isInStock && !isLoadingVariant
              ? "!bg-[#fff2eb] !border-[#e9502c] !text-[#e9502c] hover:!bg-[#ffe8d9]"
              : "!bg-gray-200 !border-gray-300 !text-gray-400 cursor-not-allowed"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="10" y1="11" x2="14" y2="11" />
          </svg>
          <span>Thêm Vào Giỏ Hàng</span>
        </button>
        <button
          onClick={() => {
            if (hasSelectedAllAttributes && isInStock) {
              console.log("Buy now", variantData);
            }
          }}
          disabled={(totalAttributes > 0 && !hasSelectedAllAttributes) || !isInStock || isLoadingVariant}
          className={`!h-12 !text-[14px] !font-semibold !px-6 rounded-md transition-colors ${
            hasSelectedAllAttributes && isInStock && !isLoadingVariant
              ? "!bg-[#e9502c] !border-[#e9502c] !text-white hover:!bg-[#d34221]"
              : "!bg-gray-200 !border-gray-300 !text-gray-400 cursor-not-allowed"
          }`}
        >
          Mua Ngay
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;

