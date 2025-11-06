import React from "react";
import ProductCard from "../ProductCard";
import type { Product } from "../../../features/shop/data/productsData";

interface TodaySuggestionsSectionProps {
  products: Product[];
}

const TodaySuggestionsSection: React.FC<TodaySuggestionsSectionProps> = ({
  products,
}) => {
  return (
    <section className="w-full bg-white py-6">
      <div className="max-w-[1000px] mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1">
            <div className="inline-block">
              <h2 className="text-2xl font-bold text-gray-900">
                Gợi ý hôm nay
              </h2>
            </div>
          </div>
          <a
            href="#"
            className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors whitespace-nowrap"
            onClick={(e) => {
              e.preventDefault();
              console.log("See all new products");
            }}
          >
            Xem tất cả &gt;&gt;
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
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
      </div>
    </section>
  );
};

export default TodaySuggestionsSection;

