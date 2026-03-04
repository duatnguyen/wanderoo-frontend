import React from "react";
import { VoucherCreationCard } from "./VoucherCreationCard";
import {
  PageContainer,
  ContentCard,
  PageHeader,
  OrderTable,
  TabMenuWithBadge,
  type OrderTableColumn,
  type TabItemWithBadge,
} from "@/components/common";

export interface VoucherType {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface VoucherCreationSectionProps {
  onCreateVoucher: (type: string) => void;
  voucherTypes: {
    conversion: VoucherType[];
  };
  className?: string;
}

export const VoucherCreationSection: React.FC<VoucherCreationSectionProps> = ({
  onCreateVoucher,
  voucherTypes,
}) => {
  return (
    <ContentCard>
      {/* Create Voucher Header */}
      <div className="flex flex-col gap-[2px] items-start justify-center px-0 py-0 w-full flex-shrink-0">
        <div className="flex gap-[20px] items-center px-0 py-0 w-full">
          <h2 className="font-bold text-[20px] text-[#272424] leading-[normal]">
            Tạo voucher
          </h2>
        </div>
        <p className="font-medium text-[13px] text-[#e04d30] leading-[1.4] -mt-[2px] whitespace-nowrap">
          Tạo Mã giảm giá toàn shop hoặc Mã giảm giá sản phẩm ngay bây giờ để thu hút người mua.
        </p>
      </div>

      {/* Conversion Section */}
      <div className="w-full mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] w-full">
          {voucherTypes.conversion.map((voucher, index) => (
            <VoucherCreationCard
              key={index}
              icon={voucher.icon}
              title={voucher.title}
              description={voucher.description}
              onClick={() => onCreateVoucher(voucher.title)}
              className="bg-white border-2 border-[#E04D30] rounded-[12px] px-[22px] py-[19px] h-[110px] flex flex-col items-start w-full"
            />
          ))}
        </div>
      </div>
    </ContentCard>
  );
};