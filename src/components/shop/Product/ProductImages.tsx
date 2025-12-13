import React, { useEffect, useMemo } from "react";
import type { Product } from "../../../features/shop/data/productsData";

interface ProductImagesProps {
  product: Product;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
  variantImageUrl?: string | null; // Optional variant image URL
}

const FALLBACK_IMAGE = "/images/placeholders/no-image.svg";

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl) return undefined;
  
  // If already a full URL (http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If relative path starting with /, add base URL
  if (imageUrl.startsWith('/')) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    return `${baseUrl}${imageUrl}`;
  }
  
  // If relative path not starting with /, assume it's from uploads
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${baseUrl}/static/${imageUrl}`;
};

const ProductImages: React.FC<ProductImagesProps> = ({
  product,
  selectedImageIndex,
  onImageSelect,
  variantImageUrl,
}) => {
  const imagesToRender = useMemo(() => {
    // If variant has its own image, use it as the first image
    let baseImages: string[] = [];
    
    if (variantImageUrl) {
      // Variant has its own image - use it as primary, then add product images
      const variantImage = getImageUrl(variantImageUrl) || variantImageUrl;
      baseImages = [variantImage];
      
      // Add product images if they exist and are different from variant image
      if (product.images && product.images.length > 0) {
        const productImages = product.images
          .map(img => getImageUrl(img) || img)
          .filter(img => img !== variantImage && img && img.trim().length > 0);
        baseImages = [...baseImages, ...productImages];
      } else if (product.imageUrl) {
        const productImage = getImageUrl(product.imageUrl) || product.imageUrl;
        if (productImage !== variantImage) {
          baseImages.push(productImage);
        }
      }
    } else {
      // No variant image, use product images
      baseImages =
        product.images && product.images.length > 0
          ? product.images
          : product.imageUrl
          ? [product.imageUrl]
          : [];
    }
    
    if (!baseImages.length) {
      return [FALLBACK_IMAGE];
    }
    
    return baseImages.map((image) => {
      if (!image || image.trim().length === 0) {
        return FALLBACK_IMAGE;
      }
      // Convert relative URL to full URL
      return getImageUrl(image) || image;
    });
  }, [product.images, product.imageUrl, variantImageUrl]);

  useEffect(() => {
    if (selectedImageIndex >= imagesToRender.length) {
      onImageSelect(0);
    }
  }, [selectedImageIndex, imagesToRender, onImageSelect]);

  const mainImage = imagesToRender[selectedImageIndex] || imagesToRender[0];
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = event.currentTarget;
    if (target.dataset.fallbackApplied === "true") {
      return;
    }
    target.dataset.fallbackApplied = "true";
    target.src = FALLBACK_IMAGE;
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-300 bg-white">
        <img
          src={mainImage}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          onError={handleImageError}
        />
        {(product.discountValue || product.discountPercent) && (
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
            {product.discountValue || `-${product.discountPercent}%`}
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
              onError={handleImageError}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;

