import React from "react";
import { cn } from "@/lib/utils";

export interface TabItemWithBadge {
  id: string;
  label: string;
  count?: number;
  badge?: string | number;
}

interface TabMenuWithBadgeProps {
  tabs: TabItemWithBadge[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  showBadgeWhenZero?: boolean;
}

const TabMenuWithBadge: React.FC<TabMenuWithBadgeProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  badgeColor = "bg-[#e04d30]",
  badgeTextColor = "text-white",
  showBadgeWhenZero = false,
}) => {
  return (
    <div className="w-full shrink-0 mb-[10px] overflow-x-auto">
      <div
        className={cn(
          "bg-white border border-[#d1d1d1] flex items-center justify-center gap-[8px] px-[12px] py-[8px] rounded-[14px] w-full min-w-0 min-w-[600px]",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const badgeValue = tab.badge !== undefined ? tab.badge : tab.count;
          const shouldShowBadge =
            badgeValue !== undefined &&
            (showBadgeWhenZero ||
              (typeof badgeValue === "number"
                ? badgeValue > 0
                : badgeValue !== ""));

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{ height: "24px" }}
              className={cn(
                "relative flex gap-[6px] items-center justify-center px-2 py-0 h-[24px] rounded-[8px] flex-1 whitespace-nowrap",
                "font-bold text-[14px] leading-[100%] font-montserrat transition-colors",
                isActive
                  ? "bg-[#ffcdc3] text-[#e04d30]"
                  : "text-[#737373] hover:text-[#e04d30] hover:bg-[#ffcdc3]/50"
              )}
            >
              <span className="whitespace-nowrap">{tab.label}</span>
              {shouldShowBadge && (
                <span
                  className={cn(
                    "absolute -top-[8px] -right-[8px] text-[10px] font-semibold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1",
                    badgeColor,
                    badgeTextColor
                  )}
                >
                  {badgeValue}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabMenuWithBadge;
