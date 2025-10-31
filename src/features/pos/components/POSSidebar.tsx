import React from "react";
import {
  ShoppingCart,
  FileText,
  PackageSearch,
  CircleDollarSign,
  BarChart3,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type POSSidebarItemId =
  | "cart"
  | "invoices"
  | "products"
  | "receipts"
  | "payments"
  | "reports";

export type POSSidebarProps = {
  activeItem?: POSSidebarItemId;
  onItemClick?: (itemId: POSSidebarItemId) => void;
  className?: string;
};

const sidebarItems: Array<{
  id: POSSidebarItemId;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  rotated?: boolean;
}> = [
  {
    id: "cart",
    icon: ShoppingCart,
    label: "Cart",
  },
  {
    id: "invoices",
    icon: FileText,
    label: "Invoices",
  },
  {
    id: "products",
    icon: PackageSearch,
    label: "Products",
  },
  {
    id: "receipts",
    icon: Receipt,
    label: "Receipts",
    rotated: true,
  },
  {
    id: "payments",
    icon: CircleDollarSign,
    label: "Payments",
  },
  {
    id: "reports",
    icon: BarChart3,
    label: "Reports",
  },
];

export const POSSidebar: React.FC<POSSidebarProps> = ({
  activeItem = "cart",
  onItemClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative bg-white border-[#454545] border-[0.5px] border-solid h-full w-[75px] flex flex-col items-center pt-3 pb-3 overflow-y-auto",
        className
      )}
    >
      {/* Navigation Items */}
      <div className="flex flex-col items-center gap-[15px] flex-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemClick?.(item.id)}
              className={cn(
                "flex items-center justify-center rounded-[5px] size-[45px] transition-colors",
                isActive ? "bg-[#e04d30]" : "bg-white hover:bg-gray-50"
              )}
              aria-label={item.label}
              title={item.label}
            >
              <Icon
                className={cn(
                  "size-[28.125px]",
                  isActive ? "text-white" : "text-[#454545]",
                  item.rotated && "rotate-[22.647deg]"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default POSSidebar;
