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
    if (order.status === "return") {
      const returnStepLabels = [
        "Yêu cầu đang được xem xét",
        "Chấp nhận yêu cầu",
        "Trả hàng",
        "Kiểm tra hàng hoàn",
        "Đã hoàn tiền",
      ];
      const statusMessages: Record<string, string> = {
        "Yêu cầu đang được xem xét":
          "Shop đang xem xét yêu cầu trả hàng & hoàn tiền của bạn",
        "Chấp nhận yêu cầu":
          "Yêu cầu của bạn đã được chấp nhận, vui lòng chuẩn bị trả hàng",
        "Trả hàng": "Vui lòng gửi hàng hoàn về shop theo hướng dẫn đã cung cấp",
        "Kiểm tra hàng hoàn":
          "Shop đang kiểm tra sản phẩm hoàn trả, vui lòng chờ thêm nhé",
        "Đã hoàn tiền":
          "Yêu cầu đã hoàn tất và tiền đã được hoàn về tài khoản của bạn",
      };

      const currentStepIndex = Math.max(
        0,
        returnStepLabels.indexOf(order.statusLabel)
      );

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
            status: order.statusLabel,
            statusMessage:
              statusMessages[order.statusLabel] ??
              "Shop đang xử lý yêu cầu trả hàng & hoàn tiền của bạn",
            products: order.products.map((p) => ({
              ...p,
              quantity: 1, // Default quantity
            })),
            refundAmount: order.totalPayment,
            bankInfo: "Ngân hàng Mb - 0862684255 - Nguyễn Thị Thanh",
            returnOrderCode: "250618UY3NJWXH",
            reason: "Khác với mô tả",
            description:
              "Mô tả sản phẩm ghi kích thước 2m nhưng tôi nhận được về có 1m9",
            images: ["", "", "", ""],
            statusSteps: returnStepLabels.map((label, index) => ({
              id: label,
              label,
              completed: index <= currentStepIndex,
              date: index <= currentStepIndex ? order.orderDate : undefined,
            })),
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
      <div
        className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
          hasMoreProducts && onToggleExpand
            ? "cursor-pointer hover:bg-gray-100 transition-colors"
            : ""
        }`}
        onClick={hasMoreProducts && onToggleExpand ? onToggleExpand : undefined}
      >
        <div className="flex flex-wrap items-center gap-2 text-[14px] text-gray-700">
          <span className="font-medium">Đơn hàng: #{order.id}</span>
          <span className="hidden sm:inline">|</span>
          <span>Ngày đặt hàng: {order.orderDate}</span>
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
          <div>
            <span className="text-[14px] font-medium text-gray-700">
              Tổng thanh toán:{" "}
            </span>
            <span className="text-[14px] font-bold text-red-600">
              {formatCurrency(order.totalPayment)}
            </span>
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
