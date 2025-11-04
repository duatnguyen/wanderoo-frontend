import React, { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Steps } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import Button from "../../../../components/shop/Button";
import ActionButton from "../../../../components/shop/ActionButton";
import ProductReviewModal from "../../../../components/shop/ProductReviewModal";
import ReturnRefundModal from "../../../../components/shop/ReturnRefundModal";
import StarRating from "../../../../components/shop/StarRating";
import { getOrderById, type Order } from "./ordersData";

export type TimelineStep = {
  label: string;
  completed: boolean;
  date?: string;
};

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
  const navigate = useNavigate();
  const location = useLocation();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReturnRefundModalOpen, setIsReturnRefundModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(
    new Set()
  );
  const [productReviews, setProductReviews] = useState<
    Map<string, { rating: number; comment: string }>
  >(new Map());

  // Get order data from location state or find by orderId
  const orderFromLocation = (location.state as { order?: Order })?.order;
  const orderFromData = orderId ? getOrderById(orderId) : null;
  const sourceOrder = orderFromLocation || orderFromData;

  // Generate status steps based on order status
  const generateStatusSteps = (
    status: string,
    orderDate?: string
  ): TimelineStep[] => {
    const baseSteps = [
      { label: "Đặt hàng thành công", completed: true, date: orderDate || "" },
      { label: "Đã xác nhận", completed: false },
      { label: "Đang vận chuyển", completed: false },
      { label: "Đã nhận hàng", completed: false },
    ];

    switch (status) {
      case "delivered":
        return [
          { ...baseSteps[0], completed: true },
          { ...baseSteps[1], completed: true, date: orderDate || "" },
          { ...baseSteps[2], completed: true, date: orderDate || "" },
          { ...baseSteps[3], completed: true, date: orderDate || "" },
        ];
      case "shipping":
        return [
          { ...baseSteps[0], completed: true },
          { ...baseSteps[1], completed: true, date: orderDate || "" },
          { ...baseSteps[2], completed: true, date: orderDate || "" },
          { ...baseSteps[3], completed: false },
        ];
      case "confirmed":
        return [
          { ...baseSteps[0], completed: true },
          { ...baseSteps[1], completed: true, date: orderDate || "" },
          { ...baseSteps[2], completed: false },
          { ...baseSteps[3], completed: false },
        ];
      case "cancelled":
        return [
          { ...baseSteps[0], completed: true },
          { ...baseSteps[1], completed: false },
          { ...baseSteps[2], completed: false },
          { ...baseSteps[3], completed: false },
        ];
      default:
        return baseSteps;
    }
  };

  // Transform Order data to OrderDetailTab format
  const order = useMemo(() => {
    if (!sourceOrder) {
      // Fallback if no order found
      return {
        id: orderId || "WB0303168522",
        orderDate: "25/08/2025",
        status: "Chờ xác nhận",
        products: [],
        customer: {
          name: "Nguyen Thi thanh",
          phone: "0868211760",
          address: "310 Cầu Giấy, P. Dịch Vọng, Q. Cầu Giấy",
          notes: "-",
        },
        payment: {
          productQuantity: 0,
          subtotal: 0,
          discount: 0,
          shipping: 0,
          total: 0,
        },
        statusSteps: generateStatusSteps("pending"),
      };
    }

    const totalProducts = sourceOrder.products.length;
    const subtotal = sourceOrder.products.reduce(
      (sum, product) => sum + product.price,
      0
    );

    return {
      id: sourceOrder.id,
      orderDate: sourceOrder.orderDate,
      status: sourceOrder.statusLabel,
      products: sourceOrder.products.map((product) => ({
        id: product.id,
        imageUrl: product.imageUrl,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        variant: product.variant,
        quantity: 1, // Default quantity, can be adjusted if needed
        isReviewed: false,
      })),
      customer: {
        name: "Nguyen Thi thanh", // Default customer info, can be extended in ordersData if needed
        phone: "0868211760",
        address: "310 Cầu Giấy, P. Dịch Vọng, Q. Cầu Giấy",
        notes: "-",
      },
      payment: {
        productQuantity: totalProducts,
        subtotal: subtotal,
        discount: 0,
        shipping: 0,
        total: sourceOrder.totalPayment,
      },
      statusSteps: generateStatusSteps(
        sourceOrder.status,
        sourceOrder.orderDate
      ),
    };
  }, [sourceOrder, orderId]);

  const totalPayment = order.payment.total;

  // Determine if order is delivered based on status
  const isDelivered = sourceOrder?.status === "delivered" || false;

  // Check if a product has been reviewed
  const isProductReviewed = (productId: string) => {
    return reviewedProducts.has(productId);
  };

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
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-gray-300 bg-transparent" />
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

                {/* Review Display or Action Buttons - Only show for delivered orders */}
                {isDelivered && (
                  <>
                    {/* Show existing review if reviewed */}
                    {isProductReviewed(product.id) &&
                    productReviews.has(product.id) ? (
                      <div className="space-y-3">
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <StarRating
                                value={
                                  productReviews.get(product.id)?.rating || 0
                                }
                                onChange={() => {}}
                                size="sm"
                                readonly={true}
                              />
                              {productReviews.get(product.id)?.comment && (
                                <p className="text-sm text-gray-700 mt-2">
                                  {productReviews.get(product.id)?.comment}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsReviewModalOpen(true);
                              }}
                              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                            >
                              Sửa
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-end sm:flex-row gap-2">
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => {
                            navigate(`/shop/products/${product.id}`);
                          }}
                          className="flex-1 sm:flex-none"
                        >
                          Mua lại
                        </Button>
                        <ActionButton
                          variant="ghost"
                          size="md"
                          options={[
                            {
                              id: "return-refund",
                              label: "Yêu cầu hoàn hàng/Trả tiền",
                              onClick: () => {
                                setSelectedProduct(product);
                                setIsReturnRefundModalOpen(true);
                              },
                            },
                            {
                              id: "review",
                              label: "Đánh giá",
                              onClick: () => {
                                setSelectedProduct(product);
                                setIsReviewModalOpen(true);
                              },
                            },
                          ]}
                        >
                          Thêm
                        </ActionButton>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Status Tracker */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <Steps
            direction="horizontal"
            current={order.statusSteps.filter((s) => s.completed).length - 1}
            items={order.statusSteps.map((step) => ({
              status: step.completed ? "finish" : "wait",
              title: (
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`text-sm font-semibold ${
                      step.completed ? "text-[#ea5b0c]" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </div>
                  {step.date && step.completed && (
                    <div className="text-xs text-gray-500 mt-1">
                      {step.date}
                    </div>
                  )}
                </div>
              ),
              icon: step.completed ? (
                <div className="w-8 h-8 rounded-lg bg-orange-200 flex items-center justify-center">
                  <CheckOutlined className="text-white text-sm" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-white border-2 border-gray-300" />
              ),
            }))}
          />
        </div>

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

      {/* Review Modal */}
      {selectedProduct && (
        <ProductReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedProduct(null);
          }}
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            imageUrl: selectedProduct.imageUrl,
            classification: selectedProduct.variant,
          }}
          initialRating={
            productReviews.get(selectedProduct.id)?.rating || undefined
          }
          initialComment={
            productReviews.get(selectedProduct.id)?.comment || undefined
          }
          onSubmit={(review) => {
            console.log("Review submitted:", review);
            setIsReviewModalOpen(false);
            if (!isProductReviewed(selectedProduct.id)) {
              setReviewedProducts((prev) =>
                new Set(prev).add(selectedProduct.id)
              );
            }
            setProductReviews((prev) => {
              const newMap = new Map(prev);
              newMap.set(selectedProduct.id, {
                rating: review.rating,
                comment: review.comment,
              });
              return newMap;
            });
            setShowSuccessModal(true);
            // In real app, here you would submit the review to the API
          }}
          isEditMode={isProductReviewed(selectedProduct.id)}
          onDelete={
            isProductReviewed(selectedProduct.id)
              ? () => {
                  console.log(
                    "Deleting review for product:",
                    selectedProduct.id
                  );
                  setReviewedProducts((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(selectedProduct.id);
                    return newSet;
                  });
                  setProductReviews((prev) => {
                    const newMap = new Map(prev);
                    newMap.delete(selectedProduct.id);
                    return newMap;
                  });
                  setIsReviewModalOpen(false);
                  setSelectedProduct(null);
                  // In real app, here you would delete the review from the API
                }
              : undefined
          }
        />
      )}

      {/* Return/Refund Modal */}
      <ReturnRefundModal
        isOpen={isReturnRefundModalOpen}
        onClose={() => {
          setIsReturnRefundModalOpen(false);
          setSelectedProduct(null);
        }}
        order={{
          id: order.id,
          orderDate: order.orderDate,
        }}
        product={selectedProduct || undefined}
        allProducts={order.products}
      />

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
