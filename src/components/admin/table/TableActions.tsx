import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export interface TableActionsProps {
  selectedCount: number;
  itemName?: string; // e.g., "khách hàng", "sản phẩm"
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
    className?: string;
  }>;
  className?: string;
  children?: ReactNode;
}

export const TableActions = ({
  selectedCount,
  itemName = "mục",
  actions = [],
  className = "flex items-center gap-[8px]",
  children,
}: TableActionsProps) => {
  const getButtonStyles = (variant: "primary" | "secondary" | "danger" = "primary") => {
    switch (variant) {
      case "primary":
        return "h-[32px] px-[16px] rounded-[10px] bg-[#e04d30] text-white hover:bg-[#d54933] transition-colors duration-150 text-[12px]";
      case "secondary":
        return "h-[32px] px-[16px] rounded-[10px] border-2 border-[#e04d30] text-[#e04d30] hover:bg-[#ffe9e5] hover:text-[#c73722] transition-colors duration-150 text-[12px]";
      case "danger":
        return "h-[32px] px-[16px] rounded-[10px] bg-red-500 text-white hover:bg-red-600 transition-colors duration-150 text-[12px]";
      default:
        return "h-[32px] px-[16px] rounded-[10px] bg-[#e04d30] text-white hover:bg-[#d54933] transition-colors duration-150 text-[12px]";
    }
  };

  return (
    <div className="flex items-center gap-[12px] flex-1 px-[4px]">
      <span className="font-semibold text-[#272424] text-[13px] leading-[1.4] whitespace-nowrap">
        Đã chọn {selectedCount} {itemName}
      </span>
      <div className={className}>
        {actions.map((action, index) => (
          <Button
            key={index}
            className={action.className || getButtonStyles(action.variant)}
            onClick={action.onClick}
            variant={action.variant === "secondary" ? "ghost" : "default"}
          >
            {action.label}
          </Button>
        ))}
        {children}
      </div>
    </div>
  );
};