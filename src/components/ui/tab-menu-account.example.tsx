// Example usage of TabMenuAccount component
import React, { useState } from "react";
import TabMenuAccount, { type TabItem } from "./tab-menu-account";

const ExampleTabMenuAccount: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs: TabItem[] = [
    { id: "all", label: "Tất cả" },
    { id: "returns", label: "Trả hàng hoàn tiền" },
    { id: "cancelled", label: "Đơn hủy" },
    { id: "failed", label: "Đơn giao hàng không thành công" },
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Tab Menu Account Example</h3>
      <TabMenuAccount
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-4"
      />
      <div className="mt-4">
        <p>Active tab: {activeTab}</p>
        <p>Selected: {tabs.find(tab => tab.id === activeTab)?.label}</p>
      </div>
    </div>
  );
};

export default ExampleTabMenuAccount;
