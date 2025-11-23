import React, { useEffect, useMemo } from "react";
import type { Product } from "../../../features/shop/data/productsData";

interface ProductImagesProps {
  product: Product;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
}

const FALLBACK_IMAGE = "https://via.placeholder.com/600x600?text=No+Image";

const ProductImages: React.FC<ProductImagesProps> = ({
  product,
  selectedImageIndex,
  onImageSelect,
}) => {
  const imagesToRender = useMemo(() => {
    const baseImages =
      product.images && product.images.length > 0
        ? product.images
        : product.imageUrl
        ? [product.imageUrl]
        : [];
    if (!baseImages.length) {
      return [FALLBACK_IMAGE];
    }
    return baseImages.map((image) =>
      image && image.trim().length > 0 ? image : FALLBACK_IMAGE
    );
  }, [product.images, product.imageUrl]);

  useEffect(() => {
    if (selectedImageIndex >= imagesToRender.length) {
      onImageSelect(0);
    }
  }, [selectedImageIndex, imagesToRender, onImageSelect]);

  const mainImage = imagesToRender[selectedImageIndex] || imagesToRender[0];

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-300 bg-white">
        <img
          src={mainImage}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
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
      <div className="flex gap-[5px] overflow-x-auto">
        {imagesToRender.map((image, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(index)}
            type="button"
            className={`w-[90px] h-[90px] rounded-lg border-2 transition-all bg-transparent flex-none ${
              selectedImageIndex === index
                ? "border-[#18345c]"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <img
              src={image}
              alt={`Ảnh sản phẩm ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;

