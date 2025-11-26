import React, { useState, useMemo, useEffect } from "react";
import type { Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { filterOrders } from "./utils/filterOrders";
import { formatCurrencyVND } from "./utils/formatCurrency";
import OrderStatusTabs from "../../../../components/shop/OrderStatusTabs";
import DateRangeFilter from "../../../../components/shop/DateRangeFilter";
import OrderCard from "../../../../components/shop/OrderCard";
import Pagination from "../../../../components/ui/pagination";
import { getCustomerOrders } from "../../../../api/endpoints/orderApi";
import { useAuth } from "../../../../context/AuthContext";
import type {
  CustomerOrderResponse,
  OrderDetailItemResponse,
  VariantAttribute,
} from "../../../../types";
import type { Order, OrderProduct, OrderStatus } from "./ordersData";

const FALLBACK_IMAGE = "/images/placeholders/no-image.svg";

const STATUS_MAPPING: Record<
  string,
  { status: OrderStatus; label: string }
> = {
  PENDING: { status: "pending", label: "Chờ xác nhận" },
  CONFIRMED: { status: "confirmed", label: "Đã xác nhận" },
  SHIPPING: { status: "shipping", label: "Đang vận chuyển" },
  COMPLETE: { status: "delivered", label: "Đã giao hàng" },
  REFUND: { status: "return", label: "Đang hoàn trả" },
  CANCELED: { status: "cancelled", label: "Đã hủy" },
  SHIPPING_FAILED: { status: "shipping", label: "Giao hàng thất bại" },
};

const mapStatusFromBackend = (
  status?: string | null
): { status: OrderStatus; label: string } => {
  if (!status) {
    return { status: "pending", label: "Đang xử lý" };
  }
  const normalized = status.toUpperCase();
  return (
    STATUS_MAPPING[normalized] ?? { status: "pending", label: "Đang xử lý" }
  );
};

const formatOrderDate = (date?: string | null) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString("vi-VN");
};

const buildVariantLabel = (attributes?: VariantAttribute[]) => {
  if (!attributes || !attributes.length) return undefined;
  const label = attributes
    .map((attr) => attr?.value ?? attr?.name)
    .filter(Boolean)
    .join(", ");
  return label || undefined;
};

const mapDetailToProduct = (
  detail: OrderDetailItemResponse,
  orderId: number | string,
  index: number
): OrderProduct => {
  return {
    id: detail.id?.toString() ?? `${orderId}-${index}`,
    imageUrl: FALLBACK_IMAGE,
    name:
      detail.snapshotProductName ??
      detail.snapshotProductSku ??
      `Sản phẩm ${index + 1}`,
    price: detail.snapshotProductPrice ?? 0,
    variant: buildVariantLabel(detail.snapshotVariantAttributes),
  };
};

const mapOrderItemsToProducts = (
  order: CustomerOrderResponse
): OrderProduct[] => {
  if (order.orderDetails && order.orderDetails.length > 0) {
    return order.orderDetails.map((detail, index) =>
      mapDetailToProduct(detail, order.id, index)
    );
  }

  if (order.items && order.items.length > 0) {
    return order.items.map((item, index) => ({
      id: item.id?.toString() ?? `${order.id}-${index}`,
      imageUrl: item.image || FALLBACK_IMAGE,
      name: item.name ?? `Sản phẩm ${item.productId}`,
      price: item.price ?? item.total ?? 0,
      variant: undefined,
    }));
  }

  return [
    {
      id: `${order.id}-placeholder`,
      imageUrl: FALLBACK_IMAGE,
      name: "Sản phẩm đang cập nhật",
      price: order.totalAmount ?? 0,
    },
  ];
};

const mapCustomerOrderToOrder = (
  order: CustomerOrderResponse
): Order | null => {
  if (!order) return null;
  const { status, label } = mapStatusFromBackend(order.status);
  return {
    id: order.code || order.id?.toString() || "",
    orderDate:
      formatOrderDate(order.createdAt) ||
      formatOrderDate(order.updatedAt) ||
      "",
    status,
    statusLabel: label,
    products: mapOrderItemsToProducts(order),
    totalPayment:
      order.totalOrderPrice ??
      order.totalAmount ??
      order.totalProductPrice ??
      0,
  };
};

const OrdersTab: React.FC = () => {
  const location = useLocation() as {
    state?: {
      activeTab?: OrderStatus;
      statusOverride?: { orderId: string; label: string };
    };
  };
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");
  const [statusOverride, setStatusOverride] = useState<
    { orderId: string; label: string } | undefined
  >(undefined);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const { isAuthenticated } = useAuth();

  // Fetch all orders from backend with pagination
  // We'll fetch all pages to enable frontend filtering
  const {
    data: customerOrders,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["customer-orders", currentPage],
    queryFn: () => {
      return getCustomerOrders({
        page: currentPage,
        size: PAGE_SIZE,
      });
    },
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const orders = useMemo(() => {
    if (!customerOrders?.orders?.length) {
      return [] as Order[];
    }
    return customerOrders.orders
      .map(mapCustomerOrderToOrder)
      .filter((order): order is Order => Boolean(order));
  }, [customerOrders]);

  // Initialize active tab from navigation state if present
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    if (location.state?.statusOverride) {
      setStatusOverride(location.state.statusOverride);
    }
  }, [location.state]);

  // Reset currentPage to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, startDate, endDate]);

  // Note: Filtering is done on frontend, but pagination is server-side
  // This means filters only apply to the current page's orders
  // For proper filtering with pagination, filters should be moved to backend
  const filteredOrders = useMemo(() => {
    return filterOrders(orders, activeTab, startDate, endDate);
  }, [orders, activeTab, startDate, endDate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 sm:px-6 py-6 text-center">
          <p className="text-gray-700">
            Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Đơn mua
        </h1>

        {/* Order Status Tabs */}
        <OrderStatusTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Date Range Filter */}
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {/* Orders List */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gray-50 space-y-4">
        {isError && (
          <div className="text-center py-6 text-red-600">
            <p className="mb-2">Không thể tải danh sách đơn hàng.</p>
            <button
              onClick={() => refetch()}
              className="text-blue-600 underline text-sm"
            >
              Thử lại
            </button>
          </div>
        )}
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">Đang tải...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Không có đơn hàng nào.</p>
          </div>
        ) : (
          <>
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                formatCurrency={formatCurrencyVND}
                isExpanded={expandedOrders.has(order.id)}
                onToggleExpand={() => handleToggleExpand(order.id)}
                statusLabelOverride={
                  statusOverride?.orderId === order.id
                    ? statusOverride.label
                    : undefined
                }
              />
            ))}
            {/* Pagination */}
            {customerOrders && customerOrders.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  current={customerOrders.pageNumber}
                  total={customerOrders.totalPages}
                  onChange={handlePageChange}
                />
              </div>
            )}
            {/* Show pagination info even if only 1 page if there are many orders */}
            {customerOrders && customerOrders.totalElements > 0 && customerOrders.totalPages === 1 && customerOrders.totalElements > PAGE_SIZE && (
              <div className="mt-4 text-center text-sm text-gray-600">
                Hiển thị tất cả {customerOrders.totalElements} đơn hàng
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
