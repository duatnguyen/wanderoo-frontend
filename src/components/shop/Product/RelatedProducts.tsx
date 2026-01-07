import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard";
import { Button } from "@/components/ui/button";
import type { Product } from "../../../features/shop/data/productsData";

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-gray-50 py-10">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex-1">
            <div className="inline-block">
              <h2 className="text-[20px] font-bold text-gray-900">
                Sản phẩm liên quan
              </h2>
            </div>
          </div>
          <Button
            variant="link"
            className="text-blue-600 text-[16px] font-medium hover:text-blue-700 transition-colors whitespace-nowrap p-0 h-auto"
            onClick={() => navigate("/shop")}
          >
            Xem tất cả &gt;&gt;
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              id={relatedProduct.id}
              imageUrl={relatedProduct.imageUrl}
              name={relatedProduct.name}
              price={relatedProduct.price}
              originalPrice={relatedProduct.originalPrice}
              rating={relatedProduct.rating}
              discountPercent={relatedProduct.discountPercent}
              onClick={() => navigate(`/shop/products/${relatedProduct.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
