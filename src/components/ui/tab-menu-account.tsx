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
        "bg-white border border-[#d1d1d1] flex gap-[8px] items-center px-[12px] py-[8px] rounded-[14px] w-full",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex gap-[6px] items-center justify-center px-[6px] py-[4px] rounded-[8px] flex-1 min-w-0",
              "font-bold text-[14px] leading-[100%] font-montserrat transition-colors",
              isActive
                ? "bg-[#ffcdc3] text-[#e04d30]"
                : "text-[#737373] hover:text-[#e04d30] hover:bg-[#ffcdc3]/50"
            )}
          >
            <span className="whitespace-nowrap truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabMenuAccount;
