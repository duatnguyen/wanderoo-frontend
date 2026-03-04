import React from "react";
import { Tabs } from "antd";
import type { OrderStatus } from "../../features/shop/pages/UserProfile/ordersData";

interface OrderStatusTabsProps {
  activeTab: OrderStatus;
  onTabChange: (key: OrderStatus) => void;
  counts?: {
    all?: number;
    pending?: number;
    confirmed?: number;
    shipping?: number;
    delivered?: number;
    cancelled?: number;
    return?: number;
  };
}

const tabs = [
  { id: "all" as OrderStatus, label: "Tất cả" },
  { id: "pending" as OrderStatus, label: "Chờ xác nhận" },
  { id: "confirmed" as OrderStatus, label: "Đã xác nhận" },
  { id: "shipping" as OrderStatus, label: "Đang vận chuyển" },
  { id: "delivered" as OrderStatus, label: "Đã giao hàng" },
  { id: "cancelled" as OrderStatus, label: "Đã hủy" },
  { id: "return" as OrderStatus, label: "Trả hàng/Hoàn tiền" },
];

const OrderStatusTabs: React.FC<OrderStatusTabsProps> = ({
  activeTab,
  onTabChange,
  counts = {},
}) => {
  const getCount = (tabId: OrderStatus): number => {
    return counts[tabId] ?? 0;
  };

  return (
    <Tabs
      activeKey={activeTab}
      onChange={(key) => onTabChange(key as OrderStatus)}
      type="card"
      size="middle"
      className="w-full [&_.ant-tabs-tab-btn]:text-gray-700 [&_.ant-tabs-tab:hover_.ant-tabs-tab-btn]:!text-[#E04D30] [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-[#E04D30] [&_.ant-tabs-ink-bar]:!bg-[#E04D30] [&_.ant-tabs-tab:hover]:!border-[#E04D30] [&_.ant-tabs-tab.ant-tabs-tab-active]:!border-[#E04D30]"
      items={tabs.map((tab) => {
        const count = getCount(tab.id);
        return {
          key: tab.id,
          label: (
            <span className="flex items-center gap-2">
              <span>{tab.label}</span>
              {count > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                  {count}
                </span>
              )}
            </span>
          ),
        };
      })}
    />
  );
};

export default OrderStatusTabs;
