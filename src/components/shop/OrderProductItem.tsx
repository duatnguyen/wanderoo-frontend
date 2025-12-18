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
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-[60px] h-[60px] rounded-lg border border-gray-300 bg-gray-50 object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholders/no-image.svg";
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="text-[14px] font-medium text-gray-900 mb-2">
          {product.name}
        </h3>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="flex items-center gap-2">
            {product.price > 0 && (
              <span className="text-[14px] font-semibold text-gray-900">
                {formatCurrency(product.price)}
              </span>
            )}
            {product.originalPrice && product.originalPrice > 0 && product.originalPrice > product.price && (
              <span className="text-[12px] text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            {product.discountAmount && product.discountAmount > 0 && (
              <span className="text-[12px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-medium">
                -{formatCurrency(product.discountAmount)}
              </span>
            )}
          </div>
          {product.variant && (
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded ${product.variantColor === "green"
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
        {product.sku && (
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>SKU: {product.sku}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderProductItem;
