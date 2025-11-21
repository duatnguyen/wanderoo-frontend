import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import OrderTimeline, {
  type TimelineStep,
} from "../../../../components/admin/order/OrderTimeline";
import Button from "../../../../components/shop/Button";
import ActionButton from "../../../../components/shop/ActionButton";
import ProductReviewModal from "../../../../components/shop/ProductReviewModal";
import StarRating from "../../../../components/shop/StarRating";
import { ChipStatus } from "../../../../components/ui/chip-status";

function formatCurrencyVND(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
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

type ProductType = {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  originalPrice?: number;
  variant?: string;
  quantity: number;
  isReviewed?: boolean;
};

const OrderDetailTab: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation() as { state?: { order?: any } };
  const incomingOrder = location.state?.order;
  const navigate = useNavigate();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(
    new Set()
  );
  const [productReviews, setProductReviews] = useState<
    Map<string, { rating: number; comment: string }>
  >(new Map());

  // Determine status from navigation state if available
  const currentStatus:
    | "pending"
    | "confirmed"
    | "shipping"
    | "delivered"
    | "cancelled"
    | "return"
    | "default" = incomingOrder?.status ?? "default";

  // Mock order data - in real app, fetch from API using orderId
  const [order] = useState({
    id: orderId || incomingOrder?.id || "WB0303168522",
    orderDate: incomingOrder?.orderDate || "25/08/2025",
    status:
      incomingOrder?.statusLabel ||
      (currentStatus === "delivered" ? "Đã giao hàng" : "Chờ xác nhận"),
    products: (incomingOrder?.products &&
      incomingOrder.products.map((p: any, idx: number) => ({
        id: p.id?.toString?.() || p.productId?.toString?.() || String(idx + 1),
        imageUrl: p.imageUrl || "/api/placeholder/100/100",
        name: p.name,
        price: p.price ?? 0,
        originalPrice: p.originalPrice,
        variant: p.variant,
        quantity: p.quantity ?? 1,
        isReviewed: false,
      }))) || [
      {
        id: "1",
        imageUrl: "/api/placeholder/100/100",
        name: "Lều Dã Ngoại Bền Đẹp Rằn ri - Đồ Câu Simano",
        price: 199000,
        originalPrice: 230000,
        variant: "Đen",
        quantity: 1,
        isReviewed: false,
      },
    ],
    customer: {
      name: incomingOrder?.customer?.name || "Nguyen Thi thanh",
      phone: incomingOrder?.customer?.phone || "0868211760",
      address:
        incomingOrder?.customer?.address ||
        "310 Cầu Giấy, P. Dịch Vọng, Q. Cầu Giấy",
      notes: incomingOrder?.customer?.notes || "-",
    },
    payment: {
      productQuantity: incomingOrder?.payment?.productQuantity ?? 1,
      subtotal: incomingOrder?.payment?.subtotal ?? 199000,
      discount: incomingOrder?.payment?.discount ?? 0,
      shipping: incomingOrder?.payment?.shipping ?? 0,
      total: incomingOrder?.payment?.total ?? 199000,
    },
    statusSteps: (() => {
      // Base steps
      const steps: TimelineStep[] = [
        { label: "Đặt hàng thành công", completed: false },
        { label: "Đã xác nhận", completed: false },
        { label: "Đang vận chuyển", completed: false },
        { label: "Đã nhận hàng", completed: false },
      ];

      // Example demo dates
      const dates = [
        "10/09/2024 18:26",
        "11/09/2024 18:26",
        "11/09/2024 18:26",
        "13/09/2024 18:26",
      ];

      // Determine how many steps are completed based on currentStatus
      let completedCount = 1; // at least "Đặt hàng thành công"
      if (currentStatus === "confirmed") completedCount = 2;
      if (currentStatus === "shipping") completedCount = 3;
      if (currentStatus === "delivered") completedCount = 4;

      for (let i = 0; i < completedCount; i++) {
        steps[i].completed = true;
        steps[i].date = dates[i];
      }
      return steps;
    })(),
  });

  const totalPayment = order.payment.total;

  // Check if a product has been reviewed
  const isProductReviewed = (productId: string) => {
    return reviewedProducts.has(productId);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 border-b border-gray-200 h-[60px] flex items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              // Always return to orders page with correct tab pre-selected
              navigate("/user/profile/orders", {
                state: { activeTab: currentStatus },
              });
            }}
            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Quay lại"
          >
            <ArrowLeftIcon />
          </button>
          <h1 className="text-[20px] font-normal text-gray-900">
            Lịch sử mua hàng / Chi tiết đơn hàng
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gray-50 space-y-6">
        {/* Tổng quan (Overview) Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-[14px]">
          <div className="mb-4">
            <h2 className="text-[18px] font-bold text-gray-900 mb-0">
              Tổng quan
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
              <div className="flex flex-wrap items-center gap-2 text-[14px] text-gray-700">
                <span>Đơn hàng: #{order.id}</span>
                <span className="hidden sm:inline">|</span>
                <span>Ngày đặt hàng: {order.orderDate}</span>
              </div>
              <ChipStatus status={currentStatus} labelOverride={order.status} />
            </div>
          </div>

          {/* Product Details */}
          {order.products.map((product: ProductType) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row gap-4 pb-4 last:pb-0"
            >
              <div className="flex-shrink-0">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-[60px] h-[60px] object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/60";
                  }}
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-[14px] font-medium text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[14px] font-semibold text-gray-900">
                        {formatCurrencyVND(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[12px] text-gray-500 line-through">
                          {formatCurrencyVND(product.originalPrice)}
                        </span>
                      )}
                      {product.variant && (
                        <span className="inline-block px-3 py-1 rounded-lg bg-gray-100 text-[12px] text-gray-600">
                          {product.variant}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[14px] text-gray-700">
                    Số lượng: {product.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons - Only show for delivered orders, placed after all products */}
          {currentStatus === "delivered" && (
            <div className="flex flex-col justify-end sm:flex-row gap-2 mt-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  // Navigate to first product or handle buy all
                  if (order.products.length > 0) {
                    navigate(`/shop/products/${order.products[0].id}`);
                  }
                }}
                className="flex-1 sm:flex-none !h-[36px] !bg-[#E04D30] !border-[#E04D30] hover:!bg-[#c93d24] hover:!border-[#c93d24]"
              >
                Mua lại
              </Button>
              <ActionButton
                variant="outline"
                size="md"
                options={[
                  {
                    id: "return-refund",
                    label: "Yêu cầu hoàn hàng/trả tiền",
                    onClick: () => {
                      navigate("/user/profile/return-refund/products", {
                        state: {
                          order: {
                            id: order.id,
                            orderDate: order.orderDate,
                            products: order.products,
                          },
                        },
                      });
                    },
                  },
                  {
                    id: "review",
                    label: "Đánh giá",
                    onClick: () => {
                      // Open review modal with all products
                      if (order.products.length > 0) {
                        setSelectedProducts(order.products);
                        setIsReviewModalOpen(true);
                      }
                    },
                  },
                ]}
                className="!h-[36px] !bg-white !border-[#E04D30] !text-[#E04D30] hover:!bg-white"
              >
                Thêm
              </ActionButton>
            </div>
          )}

          {/* Cancel Order Button - Only show for pending and confirmed orders */}
          {(currentStatus === "pending" || currentStatus === "confirmed") && (
            <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  // Handle cancel order
                  console.log("Cancel order:", order.id);
                  // In real app, this would show a confirmation modal and call API
                }}
                className="!h-[36px] !bg-white !border-[#E04D30] !text-[#E04D30] hover:!bg-[#E04D30] hover:!text-white"
              >
                Hủy đơn hàng
              </Button>
            </div>
          )}
        </div>

        {/* Order Status Tracker */}
        <OrderTimeline steps={order.statusSteps} />

        {/* Customer Information */}
        <div className="flex flex-row gap-5 w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 w-full text-[14px] -mt-2">
            <h2 className="text-[18px] font-bold text-gray-900 mb-4">
              Thông tin khách hàng
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <span className="text-[14px] font-medium text-gray-700">
                  Họ và tên:
                </span>
                <span className="text-[14px] text-gray-900 text-right">
                  {order.customer.name}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-[14px] font-medium text-gray-700">
                  Số điện thoại:
                </span>
                <span className="text-[14px] text-gray-900 text-right">
                  {order.customer.phone}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-[14px] font-medium text-gray-700">
                  Địa chỉ:
                </span>
                <span className="text-[14px] text-gray-900 text-right">
                  {order.customer.address}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-[14px] font-medium text-gray-700">
                  Ghi chú:
                </span>
                <span className="text-[14px] text-gray-900 text-right">
                  {order.customer.notes}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 w-full text-[14px] -mt-2">
            <h2 className="text-[18px] font-bold text-gray-900 mb-4">
              Thông tin thanh toán
            </h2>

            {/* Product Sub-section */}
            <div className="mb-6 ">
              <h3 className="text-[14px] font-semibold text-gray-900 mb-3 bg-gray-100 py-2 px-2">
                Sản phẩm
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[14px] text-gray-700">
                  <span>Số lượng sản phẩm</span>
                  <span>{order.payment.productQuantity}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-700">
                  <span>Tổng tiền hàng</span>
                  <span>{formatCurrencyVND(order.payment.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-700">
                  <span>Giảm giá</span>
                  <span>{formatCurrencyVND(order.payment.discount)}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-700">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrencyVND(order.payment.shipping)}</span>
                </div>
              </div>
            </div>

            {/* Payment Sub-section */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-[14px] font-semibold text-gray-900 mb-3 bg-gray-100 py-2 px-2">
                Thanh toán
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-[14px] font-normal text-gray-900">
                  Tổng số tiền
                </span>
                <span className="text-[14px] font-normal text-gray-700">
                  {formatCurrencyVND(totalPayment)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Reason - Only show for cancelled orders */}
        {currentStatus === "cancelled" && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="text-[18px] text-gray-900">
              <span className="font-bold">Lý do:</span>{" "}
              <span className="font-normal">
                {incomingOrder?.cancellationReason ||
                  "Tôi muốn cập nhật địa chỉ/sđt nhận hàng"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedProducts.length > 0 && (
        <ProductReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedProducts([]);
          }}
          products={selectedProducts.map((product) => ({
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            classification: product.variant,
          }))}
          initialReviews={productReviews}
          onSubmit={(reviews) => {
            console.log("Reviews submitted:", reviews);
            setIsReviewModalOpen(false);
            reviews.forEach((review) => {
              if (!isProductReviewed(review.productId)) {
                setReviewedProducts((prev) =>
                  new Set(prev).add(review.productId)
                );
              }
              setProductReviews((prev) => {
                const newMap = new Map(prev);
                newMap.set(review.productId, {
                  rating: review.rating,
                  comment: review.comment,
                });
                return newMap;
              });
            });
            setShowSuccessModal(true);
            setSelectedProducts([]);
            // In real app, here you would submit the reviews to the API
          }}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <div
            className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-[#ea5b0c] rounded-full flex items-center justify-center">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Cảm ơn bạn đã đánh giá!
              </h2>
              <p className="text-gray-600">
                Đánh giá của bạn đã được gửi thành công.
              </p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setSelectedProduct(null);
                  }}
                  className="px-8"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailTab;
