import React, { useState } from "react";
import { formatCurrencyVND } from "../../../features/shop/pages/Product/utils/formatCurrency";
import type { Product } from "../../../features/shop/data/productsData";

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
  quantity: number;
  onQuantityChange: (change: number) => void;
  onAddToCart: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
}) => {
  const extendedProduct = product as ExtendedProduct;
  // Default size options if not provided
  const defaultSizes = [
    { label: "35", value: "35" },
    { label: "36", value: "36" },
    { label: "37", value: "37" },
    { label: "38", value: "38" },
    { label: "39", value: "39" },
    { label: "40", value: "40" },
    { label: "41", value: "41" },
    { label: "42", value: "42" },
    { label: "43", value: "43" },
  ];
  const variantOptions = product.variantOptions || defaultSizes;
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    variantOptions[0]?.value || null
  );

  const isInStock = (product.stock || 0) > 0;
  const statusLabel =
    extendedProduct.status || (isInStock ? "Còn hàng" : "Hết hàng");
  const skuLabel =
    extendedProduct.sku || `WD-${String(product.id || "0000").toUpperCase()}`;

  const currentPrice = extendedProduct.priceRange
    ? `${formatCurrencyVND(
        extendedProduct.priceRange.min
      )} - ${formatCurrencyVND(extendedProduct.priceRange.max)}`
    : formatCurrencyVND(product.price);

  const originalPrice = extendedProduct.originalPriceRange
    ? `${formatCurrencyVND(
        extendedProduct.originalPriceRange.min
      )} - ${formatCurrencyVND(extendedProduct.originalPriceRange.max)}`
    : product.originalPrice
    ? formatCurrencyVND(product.originalPrice)
    : null;

  const discountPercent = product.discountPercent;

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
        <div className="flex gap-3">
          <span className="text-[14px] font-medium text-[#3a3a3a] shrink-0 pt-2">Size:</span>
          <div className="flex flex-wrap gap-2 items-start">
            {variantOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedVariant(option.value)}
                className={`px-4 py-2 rounded-md border-2 text-[14px] transition-colors bg-white ${
                  selectedVariant === option.value
                    ? "border-[#e9502c] text-[#e9502c] font-bold"
                    : "border-[#d9d9d9] text-[#4d4d4d] hover:border-[#d9d9d9]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#f4c8b5] bg-[#fff6f1] px-5 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[26px] font-semibold text-[#e9502c]">
            {currentPrice}
          </span>
          {originalPrice && (
            <span className="text-[14px] text-[#9e9e9e] line-through">
              {originalPrice}
            </span>
          )}
          {discountPercent && (
            <span className="rounded-[4px] bg-[#e9502c] px-2 py-1 text-[14px] font-semibold text-white uppercase">
              -{discountPercent}%
            </span>
          )}
        </div>
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
            disabled={quantity >= (product.stock || 999)}
          >
            <span>+</span>
          </button>
        </div>
        <span className="text-[14px] text-[#808080]">
          Còn lại: {product.stock || 0} sản phẩm
        </span>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={onAddToCart}
          className="!h-12 !bg-[#fff2eb] !border-2 !border-[#e9502c] !text-[#e9502c] !text-[14px] !font-semibold hover:!bg-[#ffe8d9] !px-6 rounded-md flex items-center justify-center gap-2 transition-colors"
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
          onClick={() => console.log("Buy now")}
          className="!h-12 !bg-[#e9502c] !border-[#e9502c] !text-white !text-[14px] !font-semibold hover:!bg-[#d34221] !px-6 rounded-md transition-colors"
        >
          Mua Ngay
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;

