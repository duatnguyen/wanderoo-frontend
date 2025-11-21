import React from "react";
import ProductCard from "../ProductCard";
import type { Product } from "../../../features/shop/data/productsData";

interface NewProductsSectionProps {
  products: Product[];
}

const NewProductsSection: React.FC<NewProductsSectionProps> = ({
  products,
}) => {
  const displayProducts = products.slice(0, 5);

  return (
    <section className="w-full py-6">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex-1">
            <div className="inline-block">
              <h2 className="text-2xl font-bold text-gray-900">Sản phẩm mới</h2>
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

export default NewProductsSection;
