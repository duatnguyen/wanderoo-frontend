// src/components/common/TabMenu.tsx
import { cn } from "@/lib/utils";
import { CardContent } from "@/components/ui/card";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  color?: string;
}

interface TabMenuProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: "card" | "underline";
}

export function TabMenu({
  tabs,
  activeTab,
  onTabChange,
  className,
  variant = "card",
}: TabMenuProps) {
  if (variant === "underline") {
    return (
      <div
        className={cn(
          "flex space-x-4 border-b border-gray-200 border-gray-700",
          className,
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "pb-2 px-1 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 text-gray-400 hover:text-gray-300",
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("border rounded-lg", className)}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between gap-2 bg-card rounded-lg overflow-hidden p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-3 py-1 text-sm font-medium text-center transition-all duration-200 relative whitespace-nowrap rounded-md",
                "hover:bg-gray-100 hover:bg-gray-700",
                activeTab === tab.id
                  ? "text-white bg-black text-black bg-white"
                  : "text-gray-600 text-gray-400",
              )}
            >
              <span className="flex items-center justify-center gap-1.5">
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium min-w-[18px] h-4",
                      activeTab === tab.id
                        ? "bg-white text-black bg-black text-white"
                        : "bg-gray-200 bg-gray-600 text-gray-600 text-gray-300",
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </div>
  );
}

// Export for backward compatibility
export { TabMenu as OrderTabMenu };
export type { TabMenuProps as OrderTabMenuProps };
