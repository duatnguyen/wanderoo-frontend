import React from "react";
import type { Product } from "../../../features/shop/data/productsData";

interface ProductDescriptionProps {
  product: Product;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-3">Mô tả sản phẩm</h2>
      <div className="prose max-w-none">
        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {product.description}
        </p>
      </div>
    </div>
  );
};

export default ProductDescription;

