import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderTab = {
  id: string;
  label: string;
};

export type POSOrderTabsProps = {
  orders: OrderTab[];
  currentOrderId: string;
  onOrderSelect?: (orderId: string) => void;
  onOrderClose?: (orderId: string) => void;
  onOrderAdd?: () => void;
  className?: string;
};

export const POSOrderTabs: React.FC<POSOrderTabsProps> = ({
  orders,
  currentOrderId,
  onOrderSelect,
  onOrderClose,
  onOrderAdd,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      {/* Order Tabs Container with Scroll */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide min-w-0 flex-1">
        {orders.map((order) => {
          const isActive = order.id === currentOrderId;
          return (
            <div
              key={order.id}
              className={cn(
                "flex items-center gap-1 sm:gap-2 rounded-md px-2 sm:px-3 py-1.5 transition-colors cursor-pointer flex-shrink-0",
                isActive ? "bg-white" : "bg-white/50 hover:bg-white/75"
              )}
              onClick={() => onOrderSelect?.(order.id)}
            >
              <span
                className={cn(
                  "text-xs sm:text-sm font-medium whitespace-nowrap",
                  isActive ? "text-[#272424]" : "text-[#272424]/70"
                )}
              >
                {order.label}
              </span>
              {orders.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOrderClose?.(order.id);
                  }}
                  className="text-[#454545] hover:text-[#272424] transition-colors flex-shrink-0"
                  aria-label="Close order"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default POSOrderTabs;
