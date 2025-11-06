import React from "react";
import { Tabs } from "antd";
import type { OrderStatus } from "../../features/shop/pages/UserProfile/ordersData";

interface OrderStatusTabsProps {
  activeTab: OrderStatus;
  onTabChange: (key: OrderStatus) => void;
}

const tabs = [
  { id: "all" as OrderStatus, label: "Tất cả" },
  { id: "pending" as OrderStatus, label: "Chờ xác nhận" },
  { id: "confirmed" as OrderStatus, label: "Đã xác nhận" },
  { id: "shipping" as OrderStatus, label: "Đang vận chuyển" },
  { id: "delivered" as OrderStatus, label: "Đã giao hàng" },
  { id: "cancelled" as OrderStatus, label: "Đã hủy" },
  { id: "return" as OrderStatus, label: "Trả hàng / Hoàn tiền" },
];

const OrderStatusTabs: React.FC<OrderStatusTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <Tabs
      activeKey={activeTab}
      onChange={(key) => onTabChange(key as OrderStatus)}
      type="card"
      size="middle"
      className="mb-4"
      items={tabs.map((tab) => ({
        key: tab.id,
        label: tab.label,
      }))}
    />
  );
};

export default OrderStatusTabs;
