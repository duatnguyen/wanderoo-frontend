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
  | "default";

const CHIP_STYLES: Record<
  ChipStatusKey,
  { bg: string; text: string; label: string }
> = {
  processing: { bg: "#cce5ff", text: "#004085", label: "Đang giao dịch" },
  completed: { bg: "#b2ffb4", text: "#04910c", label: "Hoàn thành" },
  not_imported: { bg: "#ffdcdc", text: "#eb2b0b", label: "Chưa nhập" },
  imported: { bg: "#b2ffb4", text: "#04910c", label: "Đã nhập" },
  paid: { bg: "#b2ffb4", text: "#04910c", label: "Đã thanh toán" },
  unpaid: { bg: "#FFDCDC", text: "#FF0000", label: "Chưa thanh toán" },
  cash: { bg: "#DCD2FF", text: "#7F27FF", label: "Tiền mặt" },
  transfer: { bg: "#FFF5C5", text: "#E27D00", label: "Chuyển khoản" },
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
      className={cn("rounded-[10px] px-[8px] py-[6px] w-fit", className)}
      style={{ backgroundColor: styles.bg }}
    >
      <span
        className="font-semibold text-[12px] leading-[1.4]"
        style={{ color: styles.text }}
      >
        {labelOverride ?? styles.label}
      </span>
    </div>
  );
};

export default ChipStatus;
