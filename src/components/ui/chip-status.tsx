import React from "react";
import { cn } from "@/lib/utils";

// Centralized status tokens and their styles/labels for reuse across the app
export type ChipStatusKey =
  | "processing"
  | "completed"
  | "not_imported"
  | "imported"
  | "paid"
  | "unpaid"
  | "cash"
  | "transfer"
  | "active"
  | "disabled"
  | "pending"
  | "shipping"
  | "cancelled"
  | "default";

const CHIP_STYLES: Record<
  ChipStatusKey,
  { bg: string; text: string; label: string }
> = {
  // Order statuses - from Figma
  completed: { bg: "#b2ffb4", text: "#04910c", label: "Đã hoàn thành" }, // Green
  pending: { bg: "#e7e7e7", text: "#737373", label: "Chờ xác nhận" }, // Gray
  paid: { bg: "#b2ffb4", text: "#04910c", label: "Đã thanh toán" }, // Green
  unpaid: { bg: "#ffdcdc", text: "#eb2b0b", label: "Chưa thanh toán" }, // Red/Pink
  shipping: { bg: "#cce5ff", text: "#004085", label: "Đang giao" }, // Blue
  cancelled: { bg: "#ffdcdc", text: "#eb2b0b", label: "Đã hủy" }, // Red/Pink
  transfer: { bg: "#fff5c5", text: "#e27d00", label: "Chuyển khoản" }, // Yellow/Orange
  cash: { bg: "#dcd2ff", text: "#7f27ff", label: "Tiền mặt" }, // Purple
  
  // Warehouse/import statuses
  processing: { bg: "#cce5ff", text: "#004085", label: "Đang giao dịch" },
  not_imported: { bg: "#ffdcdc", text: "#eb2b0b", label: "Chưa nhập" },
  imported: { bg: "#b2ffb4", text: "#04910c", label: "Đã nhập" },
  active: { bg: "#b2ffb4", text: "#04910c", label: "Đang kích hoạt" },
  disabled: { bg: "#ffdcdc", text: "#eb2b0b", label: "Đã khóa" },
  default: { bg: "#f1f5f9", text: "#0f172a", label: "Trạng thái" },
};

export interface ChipStatusProps {
  status: ChipStatusKey;
  labelOverride?: string;
  className?: string;
}

export const ChipStatus: React.FC<Readonly<ChipStatusProps>> = ({
  status,
  labelOverride,
  className,
}) => {
  const styles = CHIP_STYLES[status] ?? CHIP_STYLES.default;

  return (
    <div
      className={cn("rounded-[10px] px-[8px] h-[24px] w-fit flex items-center", className)}
      style={{ backgroundColor: styles.bg }}
    >
      <span
        className="font-semibold text-[12px] leading-[1.4] whitespace-nowrap"
        style={{ color: styles.text }}
      >
        {labelOverride ?? styles.label}
      </span>
    </div>
  );
};

export default ChipStatus;
