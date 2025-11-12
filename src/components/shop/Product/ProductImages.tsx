import React from "react";
import type { Product } from "../../../features/shop/data/productsData";

interface ProductImagesProps {
  product: Product;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  product,
  selectedImageIndex,
  onImageSelect,
}) => {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden">
        <div className="absolute inset-0 border border-gray-300 rounded-lg" />
        {product.discountPercent && (
          <div className="absolute right-2 top-2 bg-[#ffe8a3] text-red-600 font-semibold text-[16px] rounded-[4px] px-3 py-1 flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="text-red-600"
            >
              <path
                d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                fill="currentColor"
              />
            </svg>
            -{product.discountPercent}%
          </div>
        )}
      </div>
      <div className="flex gap-[5px]">
        {(product.images || []).map((_, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(index)}
            className={`w-[90px] h-[90px] rounded-lg border-2 transition-all bg-transparent flex-none ${
              selectedImageIndex === index
                ? "border-[#18345c]"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;

