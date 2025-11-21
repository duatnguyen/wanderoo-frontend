import React from "react";
import type { OrderDetailItemResponse } from "@/types/orders";

interface PaymentTableItemProps {
  item: OrderDetailItemResponse;
  index: number;
  formatCurrency: (value: number) => string;
}

const PaymentTableItem: React.FC<PaymentTableItemProps> = ({
  item,
  index,
  formatCurrency,
}) => {
  // Calculate total price
  const totalPrice = item.snapshotProductPrice * item.quantity;

  return (
    <div className="flex items-center relative shrink-0 w-full min-w-[700px] border-b border-[#e7e7e7] hover:bg-gray-50 transition-colors duration-150">
      <div className="border-r border-[#e7e7e7] box-border flex items-center justify-center py-[8px] px-[8px] relative shrink-0 w-[60px] min-w-[60px]">
        <span className="font-montserrat font-medium text-[12px] text-[#272424]">
          {index + 1}
        </span>
      </div>
      <div className="border-r border-[#e7e7e7] box-border flex gap-[8px] items-center justify-start py-[8px] px-[10px] relative flex-1 min-w-[200px]">
        <div className="border border-[#d1d1d1] relative shrink-0 size-[40px] rounded-[4px] overflow-hidden bg-gray-100 flex items-center justify-center">
          {item.snapshotProductSku && (
            <span className="font-montserrat font-semibold text-[8px] text-gray-500 text-center px-1">
              {item.snapshotProductSku}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-[2px] items-start min-w-0 flex-1">
          <p className="font-montserrat font-medium leading-[1.4] text-[#272424] text-[12px] truncate">
            {item.snapshotProductName || "Sản phẩm không tên"}
          </p>
          {item.snapshotVariantAttributes &&
          item.snapshotVariantAttributes.length > 0 ? (
            <div className="flex flex-wrap gap-x-1 gap-y-0.5 mt-0.5">
              {item.snapshotVariantAttributes
                .sort((a, b) => (a.groupLevel || 0) - (b.groupLevel || 0))
                .map((attr, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200"
                    title={`${attr.name}: ${attr.value}`}
                  >
                    <span className="font-montserrat font-medium text-[9px] leading-[1.2] whitespace-nowrap">
                      <span className="text-[#666] font-semibold">
                        {attr.name}:
                      </span>
                      <span className="text-[#1a71f6] ml-0.5">
                        {attr.value}
                      </span>
                    </span>
                  </span>
                ))}
            </div>
          ) : null}
          {item.snapshotProductSku && (
            <p className="font-montserrat font-medium text-[9px] leading-[1.4] text-[#999999] mt-0.5">
              SKU: {item.snapshotProductSku}
            </p>
          )}
        </div>
      </div>
      <div className="border-r border-[#e7e7e7] box-border flex items-center justify-center py-[8px] px-[10px] relative w-[100px] min-w-[100px]">
        <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
          {formatCurrency(item.snapshotProductPrice)}
        </p>
      </div>
      <div className="border-r border-[#e7e7e7] box-border flex items-center justify-center py-[8px] px-[10px] relative w-[80px] min-w-[80px]">
        <span className="font-montserrat font-medium text-[12px] text-[#272424]">
          {item.quantity}
        </span>
      </div>
      <div className="box-border flex items-center justify-end py-[8px] px-[10px] relative w-[120px] min-w-[120px]">
        <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
          {formatCurrency(totalPrice)}
        </p>
      </div>
    </div>
  );
};

export default PaymentTableItem;
