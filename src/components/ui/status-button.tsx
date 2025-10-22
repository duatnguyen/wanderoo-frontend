import React from "react";
import { cn } from "@/lib/utils";

interface StatusButtonProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  label?: string;
}

export const StatusButton: React.FC<Readonly<StatusButtonProps>> = ({
  label = "Trạng thái tài khoản",
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "inline-flex w-full max-w-[240px] items-center gap-2 rounded-lg px-6 py-3 bg-[var(--Background-Light,#fff)]",
        "outline-2 outline-[#E04D30] outline-offset-[-2px]",
        "justify-center",
        className
      )}
      style={{ borderRadius: 12 }}
    >
      <div className="flex flex-col text-[#E04D30] text-[12px] font-semibold leading-[16.8px] font-montserrat">
        {label}
      </div>
      <div className="relative w-[11px] h-[5px] overflow-hidden">
        <div
          className="absolute"
          style={{
            left: 5,
            top: -0.5,
            width: 8.51,
            height: 5.12,
            background: "#E04D30",
          }}
        />
      </div>
    </div>
  );
};

export default StatusButton;
