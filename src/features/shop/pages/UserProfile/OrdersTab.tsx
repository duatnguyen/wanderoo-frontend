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
import { getCustomerOrders } from "../../../../api/endpoints/websiteOrderApi";
import { useAuth } from "../../../../context/AuthContext";
import type {
  CustomerOrderResponse,
  OrderDetailItemResponse,
  VariantAttribute,
} from "../../../../types";
import type { Order, OrderProduct, OrderStatus } from "./ordersData";
import { useWebSocket } from "../../../../hooks/useWebSocket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  PageContainer,
  ContentCard,
  PageHeader,
} from "@/components/common";
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
    .map((attr) => {
      if (!attr) return null;
      // Format: "name: value" if both exist, otherwise just value or name
      if (attr.name && attr.value) {
        return `${attr.name}: ${attr.value}`;
      }
      return attr.value ?? attr.name ?? null;
    })
    .filter((item): item is string => Boolean(item))
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
  const queryClient = useQueryClient();

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

  const orderCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((order) => order.status === "pending").length,
      confirmed: orders.filter((order) => order.status === "confirmed").length,
      shipping: orders.filter((order) => order.status === "shipping").length,
      delivered: orders.filter((order) => order.status === "delivered").length,
      cancelled: orders.filter((order) => order.status === "cancelled").length,
      return: orders.filter((order) => order.status === "return").length,
    };
  }, [orders]);

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

  // WebSocket subscription for real-time order updates
  useWebSocket({
    autoConnect: isAuthenticated,
    topics: ["/topic/customer/orders/updates"],
    onMessage: (message: CustomerOrderResponse) => {
      // Invalidate orders query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      toast.success("Đơn hàng đã được cập nhật", {
        description: `Đơn hàng #${message.code} đã được cập nhật`,
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error("[OrdersTab] WebSocket error:", error);
    },
  });

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
      <PageContainer>
        <ContentCard>
          <div className="text-center py-6">
            <p className="text-gray-700">
              Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn.
            </p>
          </div>
        </ContentCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentCard>
        {/* Header */}
        <div className="flex flex-col gap-[10px] items-center w-full mb-[10px]">
          <PageHeader
            title="Đơn mua"
            subtitle="Quản lý và theo dõi đơn hàng của bạn"
          />
        </div>

        {/* Filters Card */}
        <div className="flex flex-col w-full">
          <OrderStatusTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={orderCounts}
          />
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        {/* Orders List Card */}
        <div className="w-full space-y-4">
          {isError && (
            <div className="text-center py-6 text-red-600">
              <p className="mb-2">Không thể tải danh sách đơn hàng.</p>
              <button
                onClick={() => refetch()}
                className="text-blue-600 underline text-sm hover:text-blue-700"
              >
                Thử lại
              </button>
            </div>
          )}
          {isLoading ? (
            <div className="py-16 text-center text-gray-500">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 shadow-sm border border-gray-200 mb-3">
                <svg
                  className="w-6 h-6 text-[#E04D30] animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.364 6.364l-2.828-2.828M8.464 8.464L5.636 5.636m12.728 0l-2.828 2.828M8.464 15.536l-2.828 2.828"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Đang tải danh sách đơn hàng...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <p className="text-gray-700 font-semibold text-lg mb-1">Chưa có đơn hàng</p>
              <p className="text-gray-500 text-sm">
                Hãy mua sắm và quay lại đây để theo dõi đơn hàng của bạn.
              </p>
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
      </ContentCard>
    </PageContainer >
  );
};

export default OrdersTab;
