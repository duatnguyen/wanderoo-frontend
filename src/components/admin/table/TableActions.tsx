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
  className = "flex items-center gap-3",
  children,
}: TableActionsProps) => {
  const getButtonStyles = (variant: "primary" | "secondary" | "danger" = "primary") => {
    const baseStyles = "h-9 px-4 rounded-lg transition-all duration-200 font-medium text-sm";
    
    switch (variant) {
      case "primary":
        return `${baseStyles} bg-[#e04d30] text-white hover:bg-[#d54933] hover:shadow-md active:scale-95`;
      case "secondary":
        return `${baseStyles} border border-[#e04d30] text-[#e04d30] bg-white hover:bg-[#ffe9e5] hover:border-[#d54933] hover:text-[#d54933] hover:shadow-sm`;
      case "danger":
        return `${baseStyles} bg-red-500 text-white hover:bg-red-600 hover:shadow-md active:scale-95`;
      default:
        return `${baseStyles} bg-[#e04d30] text-white hover:bg-[#d54933] hover:shadow-md active:scale-95`;
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-1 min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#e04d30] animate-pulse"></div>
          <span className="font-medium text-[#2d3748] text-sm leading-relaxed whitespace-nowrap">
            Đã chọn <span className="font-semibold text-[#e04d30]">{selectedCount}</span> {itemName}
          </span>
        </div>
      </div>
      
      <div className={className}>
        {actions.map((action, index) => (
          <Button
            key={index}
            className={action.className || getButtonStyles(action.variant)}
            onClick={action.onClick}
            variant={action.variant === "secondary" ? "outline" : "default"}
          >
            {action.label}
          </Button>
        ))}
        {children}
      </div>
    </div>
  );
};