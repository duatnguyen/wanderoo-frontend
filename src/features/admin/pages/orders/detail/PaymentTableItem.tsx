import React from 'react';

interface PaymentTableItemProps {
  item: any; // TODO: Define proper type for item
  index: number;
  formatCurrency: (value: number) => string;
}

const PaymentTableItem: React.FC<PaymentTableItemProps> = ({ item, index, formatCurrency }) => {
  return (
    <div
      className="flex items-center relative shrink-0 w-full min-w-[700px] border-b border-[#e7e7e7] hover:bg-gray-50 transition-colors duration-150"
    >
      <div className="border-r border-[#e7e7e7] box-border flex items-center justify-center py-[12px] px-[8px] relative shrink-0 w-[60px] min-w-[60px]">
        <span className="font-montserrat font-medium text-[12px] text-[#272424]">
          {index + 1}
        </span>
      </div>
      <div className="border-r border-[#e7e7e7] box-border flex gap-[8px] items-center justify-start py-[12px] px-[12px] relative flex-1 min-w-[200px]">
        <div className="border border-[#d1d1d1] relative shrink-0 size-[40px] rounded-[4px] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-0 items-start min-w-0 flex-1">
          <p className="font-montserrat font-medium leading-[1.4] text-[#272424] text-[12px] truncate">
            {item.name}
          </p>
          <p className="font-montserrat font-medium text-[10px] leading-[1.4] text-[#737373] -mt-[2px]">
            Phân loại hàng: Size M, Màu cam
          </p>
        </div>
      </div>
      <div className="border-r border-[#e7e7e7] box-border flex items-center justify-center py-[12px] px-[12px] relative w-[100px] min-w-[100px]">
        <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
          {formatCurrency(item.price)}
        </p>
      </div>
      <div className="border-r border-[#e7e7e7] box-border flex items-center justify-center py-[12px] px-[12px] relative w-[80px] min-w-[80px]">
        <span className="font-montserrat font-medium text-[12px] text-[#272424]">
          {item.quantity}
        </span>
      </div>
      <div className="box-border flex items-center justify-end py-[12px] px-[12px] relative w-[120px] min-w-[120px]">
        <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
          {formatCurrency(item.total)}
        </p>
      </div>
    </div>
  );
};

export default PaymentTableItem;