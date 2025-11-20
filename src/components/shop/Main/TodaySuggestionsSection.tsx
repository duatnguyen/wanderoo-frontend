import React from "react";
import ProductCard from "../ProductCard";
import type { Product } from "../../../features/shop/data/productsData";

interface TodaySuggestionsSectionProps {
  products: Product[];
}

const TodaySuggestionsSection: React.FC<TodaySuggestionsSectionProps> = ({
  products,
}) => {
  const displayProducts = products.slice(0, 15);

  return (
    <section className="w-full pt-8 pb-4">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="mb-3 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Gợi ý hôm nay
          </h2>
        </div>

        <div className="grid grid-cols-6 gap-4">
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
      </div>
    </section>
  );
};

export default TodaySuggestionsSection;
