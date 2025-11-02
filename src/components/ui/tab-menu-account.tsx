import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
}

interface TabMenuAccountProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const TabMenuAccount: React.FC<TabMenuAccountProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white border border-[#d1d1d1] flex items-center justify-center gap-[8px] px-[12px] py-[8px] rounded-[14px] w-full min-w-0",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{ height: '24px' }}
            className={cn(
              "flex gap-[6px] items-center justify-center px-2 py-0 h-[24px] rounded-[8px] flex-1 whitespace-nowrap",
              "font-bold text-[14px] leading-[100%] font-montserrat transition-colors",
              isActive
                ? "bg-[#ffcdc3] text-[#e04d30]"
                : "text-[#737373] hover:text-[#e04d30] hover:bg-[#ffcdc3]/50"
            )}
          >
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabMenuAccount;
