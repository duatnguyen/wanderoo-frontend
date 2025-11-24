import React from "react";
import { VoucherCreationCard } from "./VoucherCreationCard";

export interface VoucherType {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface VoucherCreationSectionProps {
  onCreateVoucher: (type: string) => void;
  voucherTypes: {
    conversion: VoucherType[];
    targetCustomer: VoucherType[];
    privateChannel: VoucherType;
  };
  className?: string;
}

export const VoucherCreationSection: React.FC<VoucherCreationSectionProps> = ({
  onCreateVoucher,
  voucherTypes,
  className = "bg-white border border-[#d1d1d1] rounded-[24px] pt-[12px] px-[24px] pb-[24px] flex flex-col w-full mb-6 overflow-x-auto",
}) => {
  return (
    <div className={className}>
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

      {/* Private Channel and Target Customer Sections - Same Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] w-full mt-6">
        {/* Private Channel Section */}
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-[8px] items-start justify-center px-0 py-[10px] w-full flex-shrink-0">
            <h3 className="font-bold text-[20px] text-[#2a2a2a] leading-[1.4] whitespace-nowrap">
              Tập trung vào kênh hiển thị riêng tư
            </h3>
          </div>
          <div className="w-full">
            <VoucherCreationCard
              icon={voucherTypes.privateChannel.icon}
              title={voucherTypes.privateChannel.title}
              description={voucherTypes.privateChannel.description}
              onClick={() => onCreateVoucher(voucherTypes.privateChannel.title)}
              className="bg-white border-2 border-[#E04D30] rounded-[12px] px-[22px] py-[19px] h-[110px] flex flex-col items-start w-full"
            />
          </div>
        </div>

        {/* Target Customer Section */}
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-[8px] items-start justify-center px-0 py-[10px] w-full flex-shrink-0">
            <h3 className="font-bold text-[20px] text-[#2a2a2a] leading-[1.4] whitespace-nowrap">
              Tập trung vào nhóm khách hàng mục tiêu
            </h3>
          </div>
          <div className="w-full">
            <div className="grid grid-cols-1 gap-[20px] w-full">
              {voucherTypes.targetCustomer.map((voucher, index) => (
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
        </div>
      </div>
    </div>
  );
};