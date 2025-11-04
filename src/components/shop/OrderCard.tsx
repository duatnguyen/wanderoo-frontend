import React from "react";
import { useNavigate } from "react-router-dom";
import type { Order } from "../../features/shop/pages/UserProfile/ordersData";
import OrderProductItem from "./OrderProductItem";

interface OrderCardProps {
  order: Order;
  formatCurrency: (value: number) => string;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, formatCurrency }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    // If order status is "return", navigate to return/refund detail page
    if (order.status === "return") {
      // In real app, you would have a requestId for the return/refund request
      // For now, using order id as requestId
      navigate(`/user/profile/return-refund/${order.id}`, {
        state: {
          data: {
            orderId: order.id,
            requestDate: `${new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })} ${order.orderDate}`,
            status: "Yêu cầu đang được xem xét",
            statusMessage:
              "Shop đang xem xét yêu cầu trả hàng & hoàn tiền của bạn",
            products: order.products.map((p) => ({
              ...p,
              quantity: 1, // Default quantity
            })),
            refundAmount: order.totalPayment,
            bankInfo: "Ngân hàng Mb -0862684255 -Nguyễn Thị Thanh",
            returnOrderCode: "250618UY3NJWXH",
            reason: "Khác với mô tả",
            description:
              "Mô tả sản phẩm ghi kích thước 2m nhưng tôi nhận được về có 1m9",
            images: ["", "", "", ""],
            statusSteps: [
              {
                id: "reviewing",
                label: "Yêu cầu đang được xem xét",
                completed: true,
                date: order.orderDate,
              },
              {
                id: "accepted",
                label: "Chấp nhận yêu cầu",
                completed: false,
              },
              {
                id: "returning",
                label: "Trả hàng",
                completed: false,
              },
              {
                id: "checking",
                label: "Kiểm tra hàng hoàn",
                completed: false,
              },
              {
                id: "refunded",
                label: "Đã hoàn tiền",
                completed: false,
              },
            ],
          },
        },
      });
    } else {
      // Navigate to regular order detail page
      navigate(`/user/profile/orders/${order.id}`, {
        state: { order },
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Order Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">Đơn hàng: #{order.id}</span>
          <span className="hidden sm:inline">|</span>
          <span>Ngày đặt hàng: {order.orderDate}</span>
        </div>
        <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-lg">
          {order.statusLabel}
        </span>
      </div>

      {/* Order Products */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {order.products.map((product) => (
          <OrderProductItem
            key={product.id}
            product={product}
            formatCurrency={formatCurrency}
          />
        ))}

        {/* Order Footer with Total and View Details Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 pt-4 border-t border-gray-200">
          <div>
            <span className="text-sm font-medium text-gray-700">
              Tổng thanh toán:{" "}
            </span>
            <span className="text-sm sm:text-base font-bold text-red-600">
              {formatCurrency(order.totalPayment)}
            </span>
          </div>
          <button
            onClick={handleViewDetails}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base self-start sm:self-auto transition-colors"
          >
            Xem chi tiết &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
