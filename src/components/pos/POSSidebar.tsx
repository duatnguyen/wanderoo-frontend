import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ShoppingCartSidebarIcon } from "./icons/ShoppingCartSidebarIcon";
import { FileInvoiceSidebarIcon } from "./icons/FileInvoiceSidebarIcon";
import { PackageSearchSidebarIcon } from "./icons/PackageSearchSidebarIcon";
import { ReturnSidebarIcon } from "./icons/ReturnSidebarIcon";
import { UsdCircleSidebarIcon } from "./icons/UsdCircleSidebarIcon";

export type POSSidebarItemId =
  | "cart"
  | "invoices"
  | "products"
  | "receipts"
  | "payments";

export type POSSidebarProps = {
  activeItem?: POSSidebarItemId;
  onItemClick?: (itemId: POSSidebarItemId) => void;
  className?: string;
};

const sidebarItems: Array<{
  id: POSSidebarItemId;
  icon: React.ComponentType<{ className?: string; isActive?: boolean }>;
  label: string;
  to: string;
  rotated?: boolean;
}> = [
  {
    id: "cart",
    icon: ShoppingCartSidebarIcon,
    label: "Cart",
    to: "/pos/sales",
  },
  {
    id: "invoices",
    icon: FileInvoiceSidebarIcon,
    label: "Invoices",
    to: "/pos/orders",
  },
  {
    id: "products",
    icon: PackageSearchSidebarIcon,
    label: "Products",
    to: "/pos/inventory",
  },
  {
    id: "receipts",
    icon: ReturnSidebarIcon,
    label: "Receipts",
    rotated: true,
    to: "/pos/returns",
  },
  {
    id: "payments",
    icon: UsdCircleSidebarIcon,
    label: "Payments",
    to: "/pos/cashbook",
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
        "relative bg-white border-r border-[#e7e7e7] h-full w-[75px] flex flex-col items-center pt-3 pb-3 overflow-y-auto",
        className
      )}
    >
      {/* Navigation Items */}
      <div className="flex flex-col items-center gap-[15px] flex-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <NavLink
              key={item.id}
              to={item.to}
              onClick={() => onItemClick?.(item.id)}
              className={({ isActive: navActive }) =>
                cn(
                  "flex items-center justify-center rounded-[5px] size-[45px] transition-colors",
                  navActive || isActive
                    ? "bg-[#e04d30]"
                    : "bg-white hover:bg-gray-50"
                )
              }
              aria-label={item.label}
              title={item.label}
            >
              <Icon
                className={cn(item.rotated && "rotate-[22.647deg]")}
                isActive={isActive}
              />
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default POSSidebar;
