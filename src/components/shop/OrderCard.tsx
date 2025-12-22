import React from "react";
import { useNavigate } from "react-router-dom";
import type { Order } from "../../features/shop/pages/UserProfile/ordersData";
import type { ChipStatusKey } from "../ui/chip-status";
import { ChipStatus } from "../ui/chip-status";
import OrderProductItem from "./OrderProductItem";

interface OrderCardProps {
  order: Order;
  formatCurrency: (value: number) => string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  statusLabelOverride?: string;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  formatCurrency,
  isExpanded = false,
  onToggleExpand,
  statusLabelOverride,
}) => {
  const navigate = useNavigate();

  // Determine which products to display
  const displayedProducts = isExpanded
    ? order.products
    : order.products.slice(0, 1);

  // Check if there are more products to show
  const hasMoreProducts = order.products.length > 1;

  // Map order status to chip status
  const getChipStatus = (status: string): ChipStatusKey => {
    switch (status) {
      case "pending":
        return "pending";
      case "confirmed":
        return "confirmed";
      case "shipping":
        return "shipping";
      case "delivered":
        return "delivered";
      case "cancelled":
        return "cancelled";
      case "return":
        return "return";
      default:
        return "default";
    }
  };

  const handleViewDetails = () => {
    // If order status is "return", navigate to return/refund detail page
    // The detail page will fetch data from API using the order.id (which is the return order code)
    if (order.status === "return") {
      navigate(`/user/profile/return-refund/${order.id}`);
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
      <div
        className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${hasMoreProducts && onToggleExpand
            ? "cursor-pointer hover:bg-gray-100 transition-colors"
            : ""
          }`}
        onClick={hasMoreProducts && onToggleExpand ? onToggleExpand : undefined}
      >
        <div className="flex flex-wrap items-center gap-2 text-[14px] text-gray-700">
          <span className="font-medium">Đơn hàng: #{order.id}</span>
          <span className="hidden sm:inline">|</span>
          <span>Ngày đặt hàng: {order.orderDate}</span>
          <span className="hidden sm:inline">|</span>
          <span>Số lượng: {order.products.length} sản phẩm</span>
          {hasMoreProducts && (
            <>
              <span className="hidden sm:inline">|</span>
              <span className="text-blue-600 text-[12px] sm:text-[14px]">
                {isExpanded
                  ? `Thu gọn (${order.products.length} sản phẩm)`
                  : `Xem thêm ${order.products.length - 1} sản phẩm`}
              </span>
            </>
          )}
        </div>
        <ChipStatus
          status={getChipStatus(order.status)}
          labelOverride={statusLabelOverride ?? order.statusLabel}
        />
      </div>

      {/* Order Products */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 text-[14px]">
        {displayedProducts.map((product) => (
          <OrderProductItem
            key={product.id}
            product={product}
            formatCurrency={formatCurrency}
          />
        ))}

        {/* Order Footer with Total and View Details Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col gap-1">
            {order.shippingFee !== undefined && order.shippingFee > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-gray-600">
                  Phí vận chuyển:{" "}
                </span>
                <span className="text-[14px] font-medium text-gray-700">
                  {formatCurrency(order.shippingFee)}
                </span>
              </div>
            )}
            <div>
              <span className="text-[14px] font-medium text-gray-700">
                Tổng thanh toán:{" "}
              </span>
              <span className="text-[14px] font-bold text-red-600">
                {formatCurrency(order.totalPayment)}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="text-blue-600 hover:text-blue-700 font-medium text-[14px] self-start sm:self-auto transition-colors"
          >
            Xem chi tiết &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
