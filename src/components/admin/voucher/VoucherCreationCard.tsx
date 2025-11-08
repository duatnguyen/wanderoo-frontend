import React from "react";
import { Button } from "@/components/ui/button";

export interface VoucherCreationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

export const VoucherCreationCard: React.FC<VoucherCreationCardProps> = ({
  icon,
  title,
  description,
  onClick,
  className = "bg-white border-2 border-[#E04D30] rounded-[12px] px-[22px] py-[19px] h-[110px] flex flex-col items-start min-w-[300px] max-w-[500px] flex-1 flex-shrink-0",
}) => {
  return (
    <div className={className}>
      <div className="flex gap-[10px] items-start">
        <div className="flex items-center justify-center w-[24px] h-[24px]">
          {icon}
        </div>
        <div className="font-semibold text-[16px] text-[#2a2a2a] leading-[1.4]">
          {title}
        </div>
      </div>
      <p className="font-medium text-[13px] text-[#322f30] leading-[1.4] -mt-[4px] flex-1 overflow-hidden">
        {description}
      </p>
      <div className="flex justify-end w-full mt-auto">
        <Button 
          className="h-[28px] px-[16px] text-[14px] rounded-[8px]" 
          onClick={onClick}
        >
          Tạo
        </Button>
      </div>
    </div>
  );
};