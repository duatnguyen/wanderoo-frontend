import React, { memo } from "react";
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
  size?: "sm" | "md" | "lg";
  variant?: "default" | "pills" | "underline";
  justifyTabs?: "start" | "between" | "evenly";
}

const TabMenuWithBadge: React.FC<TabMenuWithBadgeProps> = memo(({
  tabs,
  activeTab,
  onTabChange,
  className,
  badgeColor = "bg-red-500",
  badgeTextColor = "text-white",
  showBadgeWhenZero = false,
  size = "md",
  variant = "default",
  justifyTabs = "between",
}) => {
  const sizeClasses = {
    sm: {
      container: "px-3 py-1.5",
      tab: "px-3 py-1 text-xs h-6",
      badge: "text-[9px] min-w-[14px] h-[14px] -top-1 -right-1",
    },
    md: {
      container: "px-4 py-2",
      tab: "px-4 py-1.5 text-sm h-7",
      badge: "text-[10px] min-w-[16px] h-[16px] -top-1.5 -right-1.5",
    },
    lg: {
      container: "px-6 py-2.5",
      tab: "px-6 py-2 text-base h-8",
      badge: "text-xs min-w-[18px] h-[18px] -top-2 -right-2",
    },
  };

  const variantClasses = {
    default: {
      container: "bg-white border border-gray-200 rounded-xl shadow-sm",
      tab: "rounded-lg",
      active: "bg-orange-50 text-orange-600 shadow-sm",
      inactive: "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50",
    },
    pills: {
      container: "bg-gray-100 border-0 rounded-full p-1",
      tab: "rounded-full",
      active: "bg-white text-orange-600 shadow-sm",
      inactive: "text-gray-600 hover:text-orange-600 hover:bg-white/50",
    },
    underline: {
      container: "bg-transparent border-b border-gray-200 rounded-none px-0 py-0",
      tab: "rounded-none border-b-2 border-transparent",
      active: "text-orange-600 border-orange-500",
      inactive: "text-gray-600 hover:text-orange-600 border-transparent",
    },
  };

  return (
    <div className="w-full shrink-0 mb-3 overflow-x-auto scrollbar-hide">
      <div
        className={cn(
          "flex items-center w-full min-w-0",
          justifyTabs === "between" && "justify-between gap-2",
          justifyTabs === "evenly" && "justify-evenly gap-2",
          justifyTabs === "start" && "justify-start gap-2",
          sizeClasses[size].container,
          variantClasses[variant].container,
          className
        )}
        role="tablist"
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
              className={cn(
                "relative flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1",
                (justifyTabs === "between" || justifyTabs === "evenly") && "flex-1",
                sizeClasses[size].tab,
                variantClasses[variant].tab,
                isActive
                  ? variantClasses[variant].active
                  : variantClasses[variant].inactive
              )}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              <span className="truncate max-w-[120px]">{tab.label}</span>
              {shouldShowBadge && (
                <span
                  className={cn(
                    "absolute flex items-center justify-center rounded-full px-1 font-bold shadow-sm border border-white",
                    sizeClasses[size].badge,
                    badgeColor,
                    badgeTextColor
                  )}
                  aria-label={`${badgeValue} items`}
                >
                  {typeof badgeValue === "number" && badgeValue > 99 ? "99+" : badgeValue}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

TabMenuWithBadge.displayName = "TabMenuWithBadge";

export default TabMenuWithBadge;
