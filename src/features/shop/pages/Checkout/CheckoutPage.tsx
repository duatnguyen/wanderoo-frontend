import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import Button from "../../../../components/shop/Button";
import { Textarea } from "../../../../components/shop/Input";
import { useCart } from "../../../../context/CartContext";
import { getProductById } from "../../data/productsData";
import ShippingAddress from "../../../../components/shop/Checkout/ShippingAddress";
import ProductsTable from "../../../../components/shop/Checkout/ProductsTable";
import OrderSummary from "../../../../components/shop/Checkout/OrderSummary";

type CheckoutItem = {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  quantity: number;
  variant?: string;
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getCartCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notes, setNotes] = useState("");

  // Sample shipping address - in real app, fetch from API or context
  const shippingAddress = {
    name: "Nguyễn Thị Thanh",
    phone: "(+84) 363875603",
    address: "Số 79 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội",
    isDefault: true,
  };

  // Map cart items to checkout items with product data
  const checkoutItems: CheckoutItem[] = useMemo(() => {
    return cartItems
      .map((cartItem) => {
        const product = getProductById(cartItem.productId);
        if (!product) return null;

        return {
          id: cartItem.productId.toString(),
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl || "",
          price: product.price,
          quantity: cartItem.quantity,
          variant: cartItem.variant,
        } as CheckoutItem;
      })
      .filter((item): item is CheckoutItem => item !== null);
  }, [cartItems]);

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 15000;
  const discountCode = 0;
  const total = subtotal + shippingFee - discountCode;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        cartCount={getCartCount()}
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
              <button
                onClick={() => navigate("/shop/cart")}
                className="hover:text-[#18345c] transition-colors"
              >
                Giỏ hàng
              </button>
              <span>/</span>
              <span className="text-gray-900">Thanh toán</span>
            </div>
          </div>
        </section>

        {/* Checkout Content */}
        <section className="w-full bg-gray-50 py-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-[32px] font-bold text-gray-900 mb-8">
              Thanh toán
            </h1>

            <div className="space-y-6">
              <ShippingAddress
                name={shippingAddress.name}
                phone={shippingAddress.phone}
                address={shippingAddress.address}
                isDefault={shippingAddress.isDefault}
                onChange={() => console.log("Change address")}
              />

              <ProductsTable items={checkoutItems} />

              {/* Discount Code, Notes, and Shipping Method */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Discount Code */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Mã giảm giá :
                        </label>
                        <button
                          onClick={() => console.log("Select discount code")}
                          className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                        >
                          Chọn mã giảm giá
                        </button>
                      </div>
                    </div>

                    {/* Notes */}
                    <Textarea
                      label="Lời nhắn"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Lưu ý cho shop"
                      rows={6}
                      className="h-24"
                    />
                  </div>

                  {/* Right Column */}
                  <div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phương thức vận chuyển:
                      </label>
                      <div className="text-gray-900">Giao hàng tận nơi</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method and Order Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Payment Method */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Phương thức thanh toán
                      </label>
                      <button
                        onClick={() => console.log("Change payment method")}
                        className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
                      >
                        Thay đổi
                      </button>
                    </div>
                    <div className="mt-2 text-gray-900">
                      Thanh toán khi nhận hàng
                    </div>
                  </div>

                  <OrderSummary
                    subtotal={subtotal}
                    shippingFee={shippingFee}
                    discountCode={discountCode}
                    total={total}
                  />
                </div>
              </div>

              {/* Place Order Button */}
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-12"
                  onClick={() => {
                    console.log("Place order");
                    // Navigate to order confirmation page
                  }}
                >
                  Đặt hàng
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
