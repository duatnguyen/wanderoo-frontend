import React from "react";
import { cn } from "@/lib/utils";

export type ChipStatusVariant = 
  | "pending" 
  | "confirmed" 
  | "shipping" 
  | "completed" 
  | "cancelled" 
  | "paid" 
  | "unpaid" 
  | "refunded"
  | "active"
  | "disabled"
  | "cash"
  | "bank-transfer";

export interface ChipStatusProps {
  variant: ChipStatusVariant;
  children: React.ReactNode;
  className?: string;
}

const chipStatusVariants: Record<ChipStatusVariant, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200", 
  shipping: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  paid: "bg-green-100 text-green-800 border-green-200",
  unpaid: "bg-yellow-100 text-yellow-800 border-yellow-200",
  refunded: "bg-blue-100 text-blue-800 border-blue-200",
  active: "bg-green-100 text-green-800 border-green-200",
  disabled: "bg-gray-100 text-gray-800 border-gray-200",
  cash: "bg-purple-100 text-purple-800 border-purple-200",
  "bank-transfer": "bg-orange-100 text-orange-800 border-orange-200",
};

export const ChipStatus: React.FC<ChipStatusProps> = ({ 
  variant, 
  children, 
  className 
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border",
        chipStatusVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default ChipStatus;
