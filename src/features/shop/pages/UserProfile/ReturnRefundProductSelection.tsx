import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../../components/shop/Button";
import { Checkbox } from "../../../../components/ui/checkbox";

function formatCurrencyVND(value: number) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("vi-VN")}đ`;
  }
}

interface ProductType {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  originalPrice?: number;
  variant?: string;
  quantity: number;
}

interface OrderData {
  id: string;
  orderDate: string;
  products: ProductType[];
  status?: string;
}

interface SelectedProduct extends ProductType {
  returnQuantity: number;
}

const ReturnRefundProductSelection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get order data from location state
  const { order, option } = (location.state as {
    order?: OrderData;
    option?: "received-with-issue" | "not-received";
  }) || {};

  const requestType = option || "received-with-issue";
  const isNotReceived = requestType === "not-received";

  // Default data if not passed via state
  const defaultOrder: OrderData = {
    id: "WB0303168522",
    orderDate: "25/08/2025",
    products: [
      {
        id: "1",
        imageUrl: "",
        name: "Lều Dã Ngoại Bền Đẹp Rằn ri - Đồ Câu Simano",
        price: 199000,
        originalPrice: 230000,
        variant: "Đen",
        quantity: 1,
      },
    ],
  };

  const orderData = order || defaultOrder;

  // State for selected products with return quantities
  const [selectedProducts, setSelectedProducts] = useState<Map<string, SelectedProduct>>(
    new Map()
  );

  const handleProductToggle = (product: ProductType) => {
    const newSelected = new Map(selectedProducts);
    if (newSelected.has(product.id)) {
      newSelected.delete(product.id);
    } else {
      newSelected.set(product.id, {
        ...product,
        returnQuantity: 1,
      });
    }
    setSelectedProducts(newSelected);
  };

  const handleQuantityChange = (productId: string, change: number) => {
    const product = selectedProducts.get(productId);
    if (!product) return;

    const newQuantity = product.returnQuantity + change;
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      const newSelected = new Map(selectedProducts);
      newSelected.set(productId, {
        ...product,
        returnQuantity: newQuantity,
      });
      setSelectedProducts(newSelected);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === orderData.products.length) {
      // Deselect all
      setSelectedProducts(new Map());
    } else {
      // Select all
      const newSelected = new Map<string, SelectedProduct>();
      orderData.products.forEach((product) => {
        newSelected.set(product.id, {
          ...product,
          returnQuantity: 1,
        });
      });
      setSelectedProducts(newSelected);
    }
  };

  const selectedProductsArray = Array.from(selectedProducts.values());
  const totalProducts = selectedProductsArray.reduce(
    (sum, p) => sum + p.returnQuantity,
    0
  );
  const totalAmount = selectedProductsArray.reduce(
    (sum, p) => sum + p.price * p.returnQuantity,
    0
  );

  const handleContinue = () => {
    if (selectedProductsArray.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để trả hàng");
      return;
    }

    // Convert selected products to format expected by ReturnRefundRequest
    const productsToReturn = selectedProductsArray.map((selectedProduct) => ({
      id: selectedProduct.id,
      imageUrl: selectedProduct.imageUrl,
      name: selectedProduct.name,
      price: selectedProduct.price,
      originalPrice: selectedProduct.originalPrice,
      variant: selectedProduct.variant,
      quantity: selectedProduct.returnQuantity, // Use returnQuantity as quantity
    }));

    // Navigate to return/refund request page with selected products
    navigate("/user/return-refund", {
      state: {
        order: {
          id: orderData.id,
          orderDate: orderData.orderDate,
        },
        products: productsToReturn,
        option: requestType,
      },
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Yêu cầu Trả hàng/Hoàn tiền
          </h1>
        </div>

        <div className="space-y-6">
          {/* Situation Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Tình huống bạn đang gặp?
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              {isNotReceived
                ? "Tôi chưa nhận hàng/thùng hàng rỗng"
                : "Tôi đã nhận hàng nhưng hàng có vấn đề (bể vỡ, sai mẫu, hàng lỗi, khác mô tả...) - Miễn ship hoàn về"}
            </p>
          </div>

          {/* Product Selection Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Chọn sản phẩm cần Trả hàng và Hoàn tiền
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Bạn có thể chọn một hoặc nhiều sản phẩm để yêu cầu trả hàng/hoàn tiền
            </p>

            {/* Order Info */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
              <span>Đơn hàng: #{orderData.id}</span>
              <span>|</span>
              <span>Ngày đặt hàng: {orderData.orderDate}</span>
            </div>

            {/* Products List */}
            <div className="space-y-4">
              {/* Header Row */}
              <div className="hidden sm:grid grid-cols-12 gap-4 pb-2 border-b border-gray-200">
                <div className="col-span-1"></div>
                <div className="col-span-6 text-sm font-semibold text-gray-700">
                  Sản phẩm
                </div>
                <div className="col-span-5 text-sm font-semibold text-gray-700 text-right">
                  Số lượng
                </div>
              </div>

              {/* Product Rows */}
              {orderData.products.map((product) => {
                const isSelected = selectedProducts.has(product.id);
                const selectedProduct = selectedProducts.get(product.id);

                return (
                  <div
                    key={product.id}
                    className="flex flex-col sm:grid sm:grid-cols-12 gap-4 py-4 border-b border-gray-200 last:border-b-0"
                  >
                    {/* Checkbox */}
                    <div className="col-span-1 flex items-start">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleProductToggle(product)}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="col-span-6 flex gap-3">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-gray-300 bg-transparent flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-sm sm:text-base font-semibold text-gray-900">
                            {formatCurrencyVND(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through">
                              {formatCurrencyVND(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        {product.variant && (
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                            {product.variant}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-5 flex items-center justify-end sm:justify-end gap-2">
                      {isSelected ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(product.id, -1)}
                            disabled={selectedProduct?.returnQuantity <= 1}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Giảm số lượng"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M5 12h14" />
                            </svg>
                          </button>
                          <span className="w-12 text-center font-semibold text-sm">
                            {selectedProduct?.returnQuantity || 1}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product.id, 1)}
                            disabled={
                              selectedProduct?.returnQuantity >= product.quantity
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Tăng số lượng"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Số lượng: {product.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer with Select All and Summary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    orderData.products.length > 0 &&
                    selectedProducts.size === orderData.products.length
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium text-gray-700">
                  Chọn tất cả
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Tổng cộng ({totalProducts} sản phẩm):
                </span>
                <span className="text-base sm:text-lg font-bold text-red-600">
                  {formatCurrencyVND(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto"
            >
              Trở lại
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleContinue}
              disabled={selectedProductsArray.length === 0}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp tục
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundProductSelection;

