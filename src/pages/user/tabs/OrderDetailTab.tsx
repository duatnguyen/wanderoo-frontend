import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderTimeline, {
  type TimelineStep,
} from "../../../components/common/OrderTimeline";
import Button from "../../../features/shop/components/Button";

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

function ArrowLeftIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

const OrderDetailTab: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // Determine if order is delivered based on orderId or status
  // In real app, this would come from API
  const isDelivered = orderId?.includes("delivered") || true; // For demo, set to true

  // Mock order data - in real app, fetch from API using orderId
  const order = {
    id: orderId || "WB0303168522",
    orderDate: "25/08/2025",
    status: isDelivered ? "Đã nhận hàng" : "Chờ xác nhận",
    products: [
      {
        id: "1",
        imageUrl: "/api/placeholder/100/100",
        name: "Lều Dã Ngoại Bền Đẹp Rằn ri - Đồ Câu Simano",
        price: 199000,
        originalPrice: 230000,
        variant: "Đen",
        quantity: 1,
      },
    ],
    customer: {
      name: "Nguyen Thi thanh",
      phone: "0868211760",
      address: "310 Cầu Giấy, P. Dịch Vọng, Q. Cầu Giấy",
      notes: "-",
    },
    payment: {
      productQuantity: 1,
      subtotal: 199000,
      discount: 0,
      shipping: 0,
      total: 199000,
    },
    statusSteps: isDelivered
      ? [
          {
            label: "Đặt hàng thành công",
            completed: true,
            date: "10/09/2024 18:26",
          },
          {
            label: "Đã xác nhận",
            completed: true,
            date: "11/09/2024 18:26",
          },
          {
            label: "Đang vận chuyển",
            completed: true,
            date: "11/09/2024 18:26",
          },
          {
            label: "Đã nhận hàng",
            completed: true,
            date: "13/09/2024 18:26",
          },
        ]
      : ([
          {
            label: "Đặt hàng thành công",
            completed: true,
            date: "10/09/2024 18:26",
          },
          {
            label: "Đã xác nhận",
            completed: false,
          },
          {
            label: "Đang vận chuyển",
            completed: false,
          },
          {
            label: "Đã nhận hàng",
            completed: false,
          },
        ] as TimelineStep[]),
  };

  const totalPayment = order.payment.total;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/user/profile/orders")}
            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Quay lại"
          >
            <ArrowLeftIcon />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Lịch sử mua hàng / Chi tiết đơn hàng
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gray-50 space-y-6">
        {/* Tổng quan (Overview) Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-700">
                <span>Đơn hàng: #{order.id}</span>
                <span className="hidden sm:inline">|</span>
                <span>Ngày đặt hàng: {order.orderDate}</span>
              </div>
              <span className="inline-block px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg whitespace-nowrap">
                {order.status}
              </span>
            </div>
          </div>

          {/* Product Details */}
          {order.products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
            >
              <div className="flex-shrink-0">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/100";
                  }}
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm sm:text-base font-semibold text-red-600">
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
                  <div className="text-sm sm:text-base text-gray-700">
                    Số lượng: {product.quantity}
                  </div>
                </div>

                {/* Action Buttons - Only show for delivered orders */}
                {isDelivered && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => {
                        // Navigate to product page or add to cart
                        navigate(`/shop/products/${product.id}`);
                      }}
                      className="flex-1 sm:flex-none"
                    >
                      Mua lại
                    </Button>
                    <div className="relative">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <span>Thêm</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Status Tracker */}
        <OrderTimeline steps={order.statusSteps} />

        {/* Customer Information */}
        <div className="flex flex-row gap-5 w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 w-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Thông tin khách hàng
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  Họ và tên:{" "}
                </span>
                <span className="text-sm sm:text-base text-gray-900">
                  {order.customer.name}
                </span>
              </div>
              <div>
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  Số điện thoại:{" "}
                </span>
                <span className="text-sm sm:text-base text-gray-900">
                  {order.customer.phone}
                </span>
              </div>
              <div>
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  Địa chỉ:{" "}
                </span>
                <span className="text-sm sm:text-base text-gray-900">
                  {order.customer.address}
                </span>
              </div>
              <div>
                <span className="text-sm sm:text-base font-medium text-gray-700">
                  Ghi chú:{" "}
                </span>
                <span className="text-sm sm:text-base text-gray-900">
                  {order.customer.notes}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 w-full">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Thông tin thanh toán
            </h2>

            {/* Product Sub-section */}
            <div className="mb-6 ">
              <h3 className="text-base font-semibold text-gray-900 mb-3 bg-gray-100 py-2 px-2">
                Sản phẩm
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm sm:text-base text-gray-700">
                  <span>Số lượng sản phẩm</span>
                  <span>{order.payment.productQuantity}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-700">
                  <span>Tổng tiền hàng</span>
                  <span>{formatCurrencyVND(order.payment.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-700">
                  <span>Giảm giá</span>
                  <span>{formatCurrencyVND(order.payment.discount)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-700">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrencyVND(order.payment.shipping)}</span>
                </div>
              </div>
            </div>

            {/* Payment Sub-section */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3 bg-gray-100 py-2 px-2">
                Thanh toán
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  Tổng số tiền
                </span>
                <span className="text-base sm:text-lg font-bold text-red-600">
                  {formatCurrencyVND(totalPayment)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailTab;
