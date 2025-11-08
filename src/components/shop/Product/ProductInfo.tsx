import React from "react";
import Button from "../Button";
import { formatCurrencyVND } from "../../../features/shop/pages/Product/utils/formatCurrency";
import type { Product } from "../../../features/shop/data/productsData";

const Star: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg
    viewBox="0 0 20 20"
    width="20"
    height="20"
    className={filled ? "text-yellow-400" : "text-gray-300"}
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
  </svg>
);

interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (change: number) => void;
  onAddToCart: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
}) => {
  const stars = Array.from(
    { length: 5 },
    (_, i) => i < Math.round(product.rating || 0)
  );

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs text-gray-500">{product.brand}</span>
          <span className="text-gray-300">|</span>
          <span className="text-xs text-gray-500">{product.category}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            {stars.map((filled, idx) => (
              <Star key={idx} filled={filled} />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviews} đánh giá)
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-2xl font-bold text-[#18345c]">
            {formatCurrencyVND(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-lg text-gray-400 line-through">
                {formatCurrencyVND(product.originalPrice)}
              </span>
              <span className="text-sm text-red-600 font-semibold">
                Tiết kiệm{" "}
                {formatCurrencyVND(product.originalPrice - product.price)}
              </span>
            </>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-gray-700 font-medium">Số lượng:</span>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
              <button
                onClick={() => onQuantityChange(-1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                </svg>
              </button>
              <span className="w-10 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => onQuantityChange(1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                disabled={quantity >= (product.stock || 999)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
            <span className="text-xs text-gray-500 ml-3">
              Còn lại: {product.stock || 0} sản phẩm
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="primary"
            size="md"
            shape="rounded"
            className="flex-1"
            onClick={onAddToCart}
          >
            Thêm vào giỏ hàng
          </Button>
          <Button
            variant="secondary"
            size="md"
            shape="rounded"
            className="flex-1"
            onClick={() => console.log("Buy now")}
          >
            Mua ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;

