import React, { useState, useMemo, useEffect } from "react";
import type { Dayjs } from "dayjs";
import { ordersData, type OrderStatus } from "./ordersData";
import { formatCurrencyVND } from "./utils/formatCurrency";
import { filterOrders } from "./utils/filterOrders";
import OrderStatusTabs from "../../../../components/shop/OrderStatusTabs";
import DateRangeFilter from "../../../../components/shop/DateRangeFilter";
import OrderCard from "../../../../components/shop/OrderCard";
import { useLocation } from "react-router-dom";

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

  // Use shared orders data
  const orders = ordersData;

  // Initialize active tab from navigation state if present
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    if (location.state?.statusOverride) {
      setStatusOverride(location.state.statusOverride);
    }
  }, [location.state]);

  // Filter orders by status and date range
  const filteredOrders = useMemo(
    () => filterOrders(orders, activeTab, startDate, endDate),
    [orders, activeTab, startDate, endDate]
  );

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
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Không có đơn hàng nào.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              formatCurrency={formatCurrencyVND}
              isExpanded={expandedOrders.has(order.id)}
              onToggleExpand={() => handleToggleExpand(order.id)}
              statusLabelOverride={
                statusOverride?.orderId === order.id ? statusOverride.label : undefined
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
