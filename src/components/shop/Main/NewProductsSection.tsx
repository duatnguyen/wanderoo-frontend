import React from "react";
import ProductCard from "../ProductCard";
import type { Product } from "../../../features/shop/data/productsData";

interface NewProductsSectionProps {
  products: Product[];
}

const NewProductsSection: React.FC<NewProductsSectionProps> = ({
  products,
}) => {
  // Filter valid products and ensure exactly 6 items
  const displayProducts = products
    .filter((p): p is Product => !!p && !!p.id && !!p.name && !!p.imageUrl)
    .slice(0, 6);

  // Debug log
  React.useEffect(() => {
    console.log("=== DEBUG NewProductsSection ===");
    console.log("Products received:", products.length);
    console.log("Display products (after filter & slice):", displayProducts.length);
    console.log("Product IDs:", displayProducts.map(p => p.id));
    console.log("Product names:", displayProducts.map(p => p.name));
    if (displayProducts.length !== 6) {
      console.warn("⚠️ WARNING: Should display 6 products but showing", displayProducts.length);
    }
  }, [products, displayProducts]);

  // Show loading or empty state if not enough products
  if (displayProducts.length === 0) {
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
          <div className="text-center py-8 text-gray-500">Đang tải sản phẩm...</div>
        </div>
      </section>
    );
  }

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
              discountValue={product.discountValue}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewProductsSection;
