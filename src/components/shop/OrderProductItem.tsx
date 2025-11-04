import React from "react";
import type { OrderProduct } from "../../features/shop/pages/UserProfile/ordersData";

interface OrderProductItemProps {
  product: OrderProduct;
  formatCurrency: (value: number) => string;
}

const OrderProductItem: React.FC<OrderProductItemProps> = ({
  product,
  formatCurrency,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 last:mb-0">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-gray-300 bg-transparent" />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
          {product.name}
        </h3>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-semibold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
          {product.variant && (
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                product.variantColor === "green"
                  ? "bg-green-100 text-green-700"
                  : product.variantColor === "gray"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {product.variant}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderProductItem;
