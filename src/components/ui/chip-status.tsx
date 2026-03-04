import React from "react";
import { cn } from "@/lib/utils";

// Centralized status tokens and their styles/labels for reuse across the app
export type ChipStatusKey =
  | "processing"
  | "completed"
  | "not_imported"
  | "imported"
  | "not_exported"
  | "exported"
  | "paid"
  | "unpaid"
  | "cash"
  | "transfer"
  | "active"
  | "disabled"
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled"
  | "return"
  | "default";

const CHIP_STYLES: Record<
  ChipStatusKey,
  { bg: string; text: string; label: string }
> = {
  // Order statuses - from Figma
  completed: { bg: "#b2ffb4", text: "#04910c", label: "Đã hoàn thành" }, // Green
  pending: { bg: "#e7e7e7", text: "#737373", label: "Chờ xác nhận" }, // Gray
  confirmed: { bg: "#D1E7DD", text: "#28A745", label: "Đã xác nhận" }, // Light Green
  paid: { bg: "#b2ffb4", text: "#04910c", label: "Đã thanh toán" }, // Green
  unpaid: { bg: "#ffdcdc", text: "#eb2b0b", label: "Chưa thanh toán" }, // Red/Pink
  shipping: { bg: "#cce5ff", text: "#004085", label: "Đang giao" }, // Blue
  delivered: { bg: "#b2ffb4", text: "#04910c", label: "Đã giao hàng" }, // Green
  cancelled: { bg: "#ffdcdc", text: "#eb2b0b", label: "Đã hủy" }, // Red/Pink
  return: { bg: "#fff5c5", text: "#e27d00", label: "Trả hàng/Hoàn tiền" }, // Yellow/Orange
  transfer: { bg: "#fff5c5", text: "#e27d00", label: "Chuyển khoản" }, // Yellow/Orange
  cash: { bg: "#dcd2ff", text: "#7f27ff", label: "Tiền mặt" }, // Purple

  // Warehouse/import statuses
  processing: { bg: "#cce5ff", text: "#004085", label: "Đang giao dịch" },
  not_imported: { bg: "#ffdcdc", text: "#eb2b0b", label: "Chưa nhập" },
  imported: { bg: "#b2ffb4", text: "#04910c", label: "Đã nhập" },
  // Warehouse/export statuses
  not_exported: { bg: "#ffdcdc", text: "#eb2b0b", label: "Chưa xuất" },
  exported: { bg: "#b2ffb4", text: "#04910c", label: "Đã xuất" },
  active: { bg: "#b2ffb4", text: "#04910c", label: "Đang kích hoạt" },
  disabled: { bg: "#ffdcdc", text: "#eb2b0b", label: "Đã khóa" },
  default: { bg: "#f1f5f9", text: "#0f172a", label: "Trạng thái" },
};

export interface ChipStatusProps {
  status: ChipStatusKey;
  labelOverride?: string;
  className?: string;
  size?: "default" | "small";
  textClassName?: string;
}

export const ChipStatus: React.FC<Readonly<ChipStatusProps>> = ({
  status,
  labelOverride,
  className,
  size = "default",
  textClassName,
}) => {
  const styles = CHIP_STYLES[status] ?? CHIP_STYLES.default;

  const sizeClasses = {
    default: "rounded-[10px] px-[8px] h-[28px]",
    small: "rounded-[8px] px-[6px] h-[22px]",
  };

  const textSizeClasses = {
    default: "text-[14px]",
    small: "text-[11px]",
  };

  return (
    <div
      className={cn("w-fit flex items-center", sizeClasses[size], className)}
      style={{ backgroundColor: styles.bg }}
    >
      <span
        className={cn(
          "font-semibold leading-[1.2] whitespace-nowrap",
          textSizeClasses[size],
          textClassName
        )}
        style={{ color: styles.text }}
      >
        {labelOverride ?? styles.label}
      </span>
    </div>
  );
};

export default ChipStatus;
