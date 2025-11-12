import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard";

interface RecommendedProduct {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  discountPercent?: number;
}

interface RecommendedProductsProps {
  products: RecommendedProduct[];
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  products,
}) => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-gray-50 py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex-1">
            <div className="inline-block">
              <h2 className="text-[20px] font-bold text-gray-900">
                Sản phẩm gợi ý
              </h2>
            </div>
          </div>
          <a
            href="#"
            className="text-blue-600 text-[16px] font-medium hover:text-blue-700 transition-colors whitespace-nowrap"
            onClick={(e) => {
              e.preventDefault();
              navigate("/shop");
            }}
          >
            Xem tất cả &gt;&gt;
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
              onClick={() => navigate(`/shop/products/${product.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedProducts;

