import React from "react";
import ProductCard from "../ProductCard";
import type { Product } from "../../../features/shop/data/productsData";

interface FlashSaleSectionProps {
  products: Product[];
}

const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({ products }) => {
  const displayProducts = products.slice(0, 5);

  return (
    <section className="w-full py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-gray-100 rounded-lg shadow-md p-4 relative">
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

          <div className="grid grid-cols-6 gap-4 pr-4">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.imageUrl}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating}
                discountPercent={product.discountPercent}
                product={product}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Next"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-700"
            >
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;
