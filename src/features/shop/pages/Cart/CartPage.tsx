import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import Button from "../../../../components/shop/Button";
import ProductCard from "../../../../components/shop/ProductCard";
import DropdownList from "../../../../components/shop/DropdownList";
import Checkbox from "../../../../components/shop/Checkbox";

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

type CartItem = {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variant?: string;
  variantOptions?: { label: string; value: string }[];
};

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Sample cart data - in real app, fetch from API or context
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Gậy Leo Núi Có Đệm Lò Xo Dài",
      description: "110-135cm, Gậy Trekking",
      imageUrl: "",
      price: 100000,
      quantity: 1,
      variant: "Đen",
      variantOptions: [
        { label: "Đen", value: "Đen" },
        { label: "Xám", value: "Xám" },
        { label: "Cam", value: "Cam" },
      ],
    },
    {
      id: "2",
      name: "Ba lô ngoài trời CAMEL CROWN",
      description: "Túi leo núi chuyên nghiệp",
      imageUrl: "",
      price: 100000,
      quantity: 1,
      variant: "Đen",
      variantOptions: [
        { label: "Đen", value: "Đen" },
        { label: "Xanh", value: "Xanh" },
        { label: "Đỏ", value: "Đỏ" },
      ],
    },
    {
      id: "3",
      name: "Giày thể thao leo núi CAMEL CROWN",
      description: "FB12235182",
      imageUrl: "",
      price: 100000,
      quantity: 1,
      variant: "Xám, Size 35",
      variantOptions: [
        { label: "Đen, Size 35", value: "Đen, Size 35" },
        { label: "Xám, Size 35", value: "Xám, Size 35" },
        { label: "Xám, Size 36", value: "Xám, Size 36" },
      ],
    },
    {
      id: "4",
      name: "Tất Xỏ Ngón Chạy Bộ Chạy Trail",
      description: "Leo Núi- Hạn Chế Phồng",
      imageUrl: "",
      price: 100000,
      quantity: 1,
      variant: "Đen, Size giày 36",
      variantOptions: [
        { label: "Đen, Size giày 36", value: "Đen, Size giày 36" },
        { label: "Đen, Size giày 37", value: "Đen, Size giày 37" },
        { label: "Xám, Size giày 36", value: "Xám, Size giày 36" },
      ],
    },
  ]);

  const handleQuantityChange = (id: string, change: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    }
  };

  const handleDeleteSelected = () => {
    setCartItems((items) =>
      items.filter((item) => !selectedItems.has(item.id))
    );
    setSelectedItems(new Set());
  };

  const handleVariantChange = (id: string, variant: string) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          return { ...item, variant };
        }
        return item;
      })
    );
  };

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.has(item.id)
  );
  const totalSelectedItems = selectedCartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalAmount = selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Recommended products
  const recommendedProducts = [
    {
      id: 6,
      imageUrl: "",
      name: "Ghế xếp du lịch nhẹ",
      price: 320000,
      originalPrice: 450000,
      rating: 4.4,
      discountPercent: 29,
    },
    {
      id: 7,
      imageUrl: "",
      name: "Đèn pin siêu sáng LED",
      price: 280000,
      originalPrice: 380000,
      rating: 4.2,
      discountPercent: 26,
    },
    {
      id: 8,
      imageUrl: "",
      name: "Bộ dụng cụ đa năng",
      price: 180000,
      originalPrice: 250000,
      rating: 4.5,
      discountPercent: 28,
    },
    {
      id: 9,
      imageUrl: "",
      name: "Áo khoác gió chống nước",
      price: 750000,
      originalPrice: 950000,
      rating: 4.7,
      discountPercent: 21,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="w-full bg-gray-50 border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button
                onClick={() => navigate("/shop")}
                className="hover:text-[#18345c] transition-colors"
              >
                Trang chủ
              </button>
              <span>/</span>
              <span className="text-gray-900">Giỏ hàng</span>
            </div>
          </div>
        </section>

        {/* Cart Content */}
        <section className="w-full bg-white py-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-[32px] font-bold text-gray-900 mb-8">
              Giỏ hàng của bạn
            </h1>

            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg mb-4">
                  Giỏ hàng của bạn đang trống
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/shop")}
                >
                  Tiếp tục mua sắm
                </Button>
              </div>
            ) : (
              <div className="w-full">
                {/* Cart Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-gray-100 grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200">
                    <div className="col-span-1"></div>
                    <div className="col-span-4 font-semibold text-gray-700">
                      Sản phẩm
                    </div>
                    <div className="col-span-1 font-semibold text-gray-700 text-center">
                      Đơn giá
                    </div>
                    <div className="col-span-2 font-semibold text-gray-700 text-center">
                      Số lượng
                    </div>
                    <div className="col-span-2 font-semibold text-gray-700 text-center">
                      Thành tiền
                    </div>
                    <div className="col-span-2 font-semibold text-gray-700 text-center">
                      Thao tác
                    </div>
                  </div>

                  {/* Cart Items Rows */}
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-12 gap-4 px-4 py-4 items-start hover:bg-gray-50 transition-colors"
                      >
                        {/* Checkbox */}
                        <div className="col-span-1 flex items-start pt-2">
                          <Checkbox
                            checked={selectedItems.has(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="col-span-4 flex gap-3">
                          <div className="w-20 h-20 rounded border border-gray-300 bg-transparent flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                Phân loại hàng:
                              </span>
                              {item.variantOptions ? (
                                <DropdownList
                                  options={item.variantOptions}
                                  value={item.variant}
                                  onChange={(value) =>
                                    handleVariantChange(item.id, value)
                                  }
                                  fullWidth={false}
                                  className="w-[180px]"
                                />
                              ) : (
                                <span className="text-sm text-gray-700">
                                  {item.variant || "Mặc định"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Unit Price */}
                        <div className="col-span-1 text-center pt-2">
                          <div className="text-gray-900 font-medium">
                            {formatCurrencyVND(item.price)}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex justify-center pt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
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
                            <input
                              type="number"
                              value={item.quantity}
                              readOnly
                              className="w-12 h-8 text-center border border-gray-300 rounded text-sm font-medium"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
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
                        </div>

                        {/* Total */}
                        <div className="col-span-2 text-center pt-2">
                          <div className="text-gray-900 font-semibold">
                            {formatCurrencyVND(item.price * item.quantity)}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <div className="col-span-2 flex justify-center pt-2">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            aria-label="Xóa sản phẩm"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-gray-600"
                            >
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Table Footer */}
                  <div className="bg-white border-t border-gray-200 px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={
                          cartItems.length > 0 &&
                          selectedItems.size === cartItems.length
                        }
                        onChange={handleSelectAll}
                      />
                      <span className="text-gray-700">
                        Chọn tất cả ({cartItems.length})
                      </span>
                      <button
                        onClick={handleDeleteSelected}
                        disabled={selectedItems.size === 0}
                        className="text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          Tổng cộng ({totalSelectedItems} sản phẩm):
                        </div>
                        <div
                          className={`text-xl font-bold ${
                            totalSelectedItems === 0
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {formatCurrencyVND(totalAmount)}
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate("/shop/checkout")}
                        disabled={selectedItems.size === 0}
                      >
                        Mua Hàng
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Recommended Products Section */}
        {cartItems.length > 0 && (
          <section className="w-full bg-gray-50 py-10">
            <div className="max-w-[1200px] mx-auto px-4">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex-1">
                  <div className="inline-block">
                    <h2 className="text-[32px] font-bold text-gray-900">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
