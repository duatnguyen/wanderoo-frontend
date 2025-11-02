import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notes, setNotes] = useState("");

  // Sample shipping address - in real app, fetch from API or context
  const shippingAddress = {
    name: "Nguyễn Thị Thanh",
    phone: "(+84) 363875603",
    address: "Số 79 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội",
    isDefault: true,
  };

  // Sample cart items - in real app, fetch from cart context
  const checkoutItems: CheckoutItem[] = [
    {
      id: "1",
      name: "Lều Dã Ngoại Bền Đẹp Rằn ri - Đồ Câu Simano",
      imageUrl: "https://via.placeholder.com/80x80?text=Tent",
      price: 100000,
      quantity: 1,
      variant: "Đen, Size S",
    },
    {
      id: "2",
      name: "Lều mái vòm 2 người Snowline Shelter Dom...",
      imageUrl: "https://via.placeholder.com/80x80?text=Tent2",
      price: 100000,
      quantity: 1,
      variant: "Đen, Size S",
    },
    {
      id: "3",
      name: "Lều Dã Ngoại Bến Đẹp Rần ri - Đồ Câu Simano",
      imageUrl: "https://via.placeholder.com/80x80?text=Pole",
      price: 100000,
      quantity: 1,
      variant: "Đen, Size S",
    },
    {
      id: "4",
      name: "Giày leo núi cổ cao Clorts Trekking Shoes....",
      imageUrl: "https://via.placeholder.com/80x80?text=Shoes",
      price: 100000,
      quantity: 1,
      variant: "Đỏ đen, Size 37",
    },
  ];

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 15000;
  const discountCode = 0;
  const total = subtotal + shippingFee - discountCode;

  const totalItems = checkoutItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        cartCount={totalItems}
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
        <section className="w-full bg-white py-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-[32px] font-bold text-gray-900 mb-8">
              Thanh toán
            </h1>

            <div className="space-y-6">
              {/* Shipping Address Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Địa chỉ nhận hàng
                </h2>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">
                        {shippingAddress.name}
                      </span>
                      <span className="text-gray-600">
                        {shippingAddress.phone}
                      </span>
                    </div>
                    <p className="text-gray-700">{shippingAddress.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {shippingAddress.isDefault && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">
                        Mặc định
                      </span>
                    )}
                    <button
                      onClick={() => console.log("Change address")}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Thay đổi
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Table Section */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Sản phẩm
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Sản phẩm
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Đơn giá
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Số lượng
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {checkoutItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-16 h-16 rounded object-cover border border-gray-200"
                              />
                              <div>
                                <p className="font-medium text-gray-900 mb-1">
                                  {item.name}
                                </p>
                                {item.variant && (
                                  <p className="text-sm text-gray-500">
                                    Phân loại hàng: {item.variant}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-gray-900 font-medium">
                              {formatCurrencyVND(item.price)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-gray-900">{item.quantity}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-gray-900 font-semibold">
                              {formatCurrencyVND(item.price * item.quantity)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lời nhắn
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Lưu ý cho shop"
                        className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none resize-none"
                      />
                    </div>
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

                  {/* Order Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Tổng tiền hàng</span>
                      <span>{formatCurrencyVND(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tổng tiền phí vận chuyển</span>
                      <span>{formatCurrencyVND(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Mã giảm giá</span>
                      <span>{formatCurrencyVND(discountCode)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">
                          Tổng tiền thanh toán
                        </span>
                        <span className="font-bold text-[#18345c] text-lg">
                          {formatCurrencyVND(total)}
                        </span>
                      </div>
                    </div>
                  </div>
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

