import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReturnStatusIconProps {
  isSuccess: boolean;
  className?: string;
}

export const ReturnStatusIcon: React.FC<ReturnStatusIconProps> = ({
  isSuccess,
  className,
}) => {
  if (isSuccess) {
    return (
      <Check
        className={cn("w-5 h-5 text-[#e04d30] flex-shrink-0", className)}
        strokeWidth={3}
      />
    );
  }

  return (
    <X
      className={cn("w-5 h-5 text-[#737373] flex-shrink-0", className)}
      strokeWidth={3}
    />
  );
};

export default ReturnStatusIcon;
