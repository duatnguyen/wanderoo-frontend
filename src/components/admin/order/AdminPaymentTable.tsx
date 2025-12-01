import React from "react";
import { Wallet } from "lucide-react";

export interface AdminPaymentItem {
  id: string | number;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  total: number;
  variantText?: string;
}

interface AdminPaymentTableProps {
  items: AdminPaymentItem[];
  formatCurrency: (value: number) => string;
  summary: React.ReactNode;
  disabled?: boolean;
}

const AdminPaymentTable: React.FC<AdminPaymentTableProps> = ({
  items,
  formatCurrency,
  summary,
  disabled = false,
}) => {
  return (
    <div
      className={`bg-gradient-to-br from-[#fafafa] to-[#ffffff] border border-[#e5e5e5] box-border flex flex-col gap-[12px] items-start p-[16px] sm:p-[20px] relative rounded-[12px] w-full overflow-hidden min-w-0 shadow-sm ${disabled ? "opacity-60" : ""
        }`}
    >
      {/* Card header */}
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#fff3ef] border border-[#ffd5c7] shadow-[0_0_0_1px_rgba(255,213,199,0.4)]">
            <Wallet className="w-[16px] h-[16px] text-[#e04d30]" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-montserrat font-semibold text-[#272424] text-[15px] sm:text-[16px] leading-[1.4]">
              Thông tin thanh toán
            </h2>
            <p className="hidden sm:block font-montserrat text-[11px] text-[#888888] leading-[1.3]">
              Chi tiết sản phẩm và số tiền khách phải thanh toán
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 rounded-full border border-dashed border-[#ffd5c7] bg-[#fff9f6] px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e04d30]" />
          <span className="font-montserrat text-[11px] text-[#c0562b]">
            {items.length} dòng
          </span>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="w-full overflow-x-auto rounded-[10px] border border-[#e7e7e7] bg-white">
        <div className="flex flex-col items-start relative w-full min-w-[700px]">
          {/* Header */}
          <div className="flex items-center relative shrink-0 w-full bg-[#f9fafb] border-b border-[#e7e7e7]">
            <div className="border-r border-[#e7e7e7] relative self-stretch shrink-0 w-[60px] min-w-[60px]">
              <div className="box-border flex h-full items-center justify-center overflow-clip py-[8px] px-[8px] relative">
                <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#4b5563] text-[12px] text-center">
                  STT
                </p>
              </div>
            </div>
            <div className="border-r border-[#e7e7e7] box-border flex items-center justify-start py-[8px] px-[10px] relative self-stretch flex-1 min-w-[200px]">
              <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#4b5563] text-[12px]">
                Sản phẩm
              </p>
            </div>
            <div className="border-r border-[#e7e7e7] box-border flex items-center justify-center py-[8px] px-[10px] relative self-stretch w-[100px] min-w-[100px]">
              <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#4b5563] text-[12px]">
                Đơn giá
              </p>
            </div>
            <div className="border-r border-[#e7e7e7] box-border flex items-center justify-center py-[8px] px-[10px] relative self-stretch w-[80px] min-w-[80px]">
              <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#4b5563] text-[12px]">
                SL
              </p>
            </div>
            <div className="box-border flex items-center justify-end py-[8px] px-[10px] relative self-stretch w-[120px] min-w-[120px]">
              <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#4b5563] text-[12px]">
                Thành tiền
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="w-full max-h-[320px] overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center relative shrink-0 w-full min-w-[700px] border-b border-[#f0f0f0] ${index % 2 === 0 ? "bg-white" : "bg-[#fcfcfc]"
                  } hover:bg-[#fff7f3] transition-colors duration-150`}
              >
                {/* STT */}
                <div className="box-border flex gap-[8px] items-center justify-center p-[10px] relative shrink-0 w-[60px] min-w-[60px]">
                  <span className="inline-flex items-center justify-center rounded-full bg-[#f3f4f6] text-[#4b5563] font-montserrat text-[11px] min-w-[22px] h-[22px]">
                    {index + 1}
                  </span>
                </div>

                {/* Product info */}
                <div className="box-border flex gap-[8px] items-start justify-start p-[12px] relative flex-1 min-w-[200px]">
                  <div className="border border-[#e5e7eb] relative shrink-0 size-[40px] rounded-[8px] overflow-hidden bg-gray-50 flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-montserrat font-semibold text-[9px] text-gray-400 text-center px-1">
                        No Image
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-[2px] items-start min-w-0 flex-1">
                    <p className="font-montserrat font-medium leading-[1.4] text-[#111827] text-[12px] truncate">
                      {item.name}
                    </p>
                    {item.variantText && (
                      <p className="font-montserrat font-medium text-[10px] leading-[1.4] text-[#6b7280]">
                        {item.variantText}
                      </p>
                    )}
                  </div>
                </div>
                {/* Unit price */}
                <div className="box-border flex gap-[4px] items-center justify-center p-[10px] relative w-[100px] min-w-[100px]">
                  <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#111827] text-[12px] text-nowrap">
                    {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                {/* Quantity */}
                <div className="box-border flex gap-[4px] items-center justify-center p-[10px] relative w-[80px] min-w-[80px]">
                  <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#111827] text-[12px] text-nowrap">
                    {item.quantity}
                  </p>
                </div>
                {/* Total */}
                <div className="box-border flex gap-[4px] items-center justify-end p-[10px] pr-[14px] relative w-[120px] min-w-[120px]">
                  <p className="font-montserrat font-semibold leading-[1.4] relative shrink-0 text-[#111827] text-[12px] text-nowrap">
                    {formatCurrency(item.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Row */}
          {summary}
        </div>
      </div>
    </div>
  );
};
export default AdminPaymentTable;

