import React from "react";
import { cn } from "@/lib/utils";
import CaretDown from "@/components/ui/caret-down";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StatusButtonProps {
  status: "all" | "active" | "disabled";
  onChange: (status: "all" | "active" | "disabled") => void;
  className?: string;
}

export const StatusButton: React.FC<Readonly<StatusButtonProps>> = ({
  status,
  onChange,
  className,
}) => {
  const getLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Đang kích hoạt";
      case "disabled":
        return "Đã khóa";
      default:
        return "Tất cả trạng thái";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "inline-flex w-full max-w-[240px] items-center gap-2 rounded-lg px-6 py-3 bg-[var(--Background-Light,#fff)]",
            "outline-2 outline-[#E04D30] outline-offset-[-2px]",
            "justify-center cursor-pointer",
            className
          )}
          style={{ borderRadius: 12 }}
        >
          <div className="flex flex-col text-[#E04D30] text-[12px] font-semibold leading-[16.8px] font-montserrat">
            {getLabel(status)}
          </div>
          <CaretDown className="text-[#E04D30]" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onChange("all")}>
          Tất cả trạng thái
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("active")}>
          Đang kích hoạt
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange("disabled")}>
          Đã khóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusButton;
