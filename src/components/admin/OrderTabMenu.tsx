import { cn } from "@/lib/utils";
import { CardContent } from "@/components/ui/card";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  color?: string;
}

interface OrderTabMenuProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function OrderTabMenu({
  tabs,
  activeTab,
  onTabChange,
  className,
}: OrderTabMenuProps) {
  return (
    <CardContent className={cn("p-0", className)}>
      <div className="flex items-center justify-between gap-2 bg-card rounded-lg overflow-hidden p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-3 py-1 text-sm font-medium text-center transition-all duration-200 relative whitespace-nowrap rounded-md",
              "hover:bg-gray-100",
              activeTab === tab.id ? "text-white bg-black" : "text-gray-600",
            )}
          >
            <span className="flex items-center justify-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium min-w-[18px] h-4",
                    activeTab === tab.id
                      ? "bg-white text-black"
                      : "bg-gray-200 text-gray-600",
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
  );
}
