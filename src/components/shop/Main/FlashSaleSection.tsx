import React from "react";
import ProductCard from "../ProductCard";
import Button from "../Button";
import type { Product } from "../../../features/shop/data/productsData";

interface FlashSaleSectionProps {
  products: Product[];
}

const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({ products }) => {
  return (
    <section className="w-full py-6">
      <div className="max-w-[1000px] mx-auto px-4">
        <div className="bg-gray-100 rounded-lg shadow-md p-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-red-600 uppercase flex items-center gap-1">
              F
              <svg
                width="24"
                height="28"
                viewBox="0 0 24 32"
                fill="none"
                className="text-red-600"
              >
                <path
                  d="M13.5 2L3.5 14h7l-1 16 10-12h-7l1-16z"
                  fill="currentColor"
                />
              </svg>
              ASH SALE
            </h2>
          </div>

          <div className="relative flex items-center">
            {/* Product Cards Carousel */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 flex-1">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[200px]">
                  <ProductCard
                    id={product.id}
                    imageUrl={product.imageUrl}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    rating={product.rating}
                    discountPercent={product.discountPercent}
                    product={product}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrow Button */}
            <Button
              variant="icon"
              size="md"
              shape="pill"
              className="absolute right-0 top-1/2 -translate-y-1/2 shadow-lg z-10 bg-white hover:bg-gray-50 border border-gray-200 flex-shrink-0"
              aria-label="Xem thêm sản phẩm flash sale"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-700"
              >
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;
