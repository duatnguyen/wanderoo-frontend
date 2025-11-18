import React from 'react';

const PaymentTableHeader: React.FC = () => {
  return (
    <div className="flex items-center relative shrink-0 w-full bg-[#f6f6f6] border-b border-[#e7e7e7]">
      <div className="border-r border-[#e7e7e7] relative self-stretch shrink-0 w-[60px] min-w-[60px]">
        <div className="box-border flex h-full items-center justify-center overflow-clip py-[8px] px-[8px] relative">
          <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-center">
            STT
          </p>
        </div>
      </div>
      <div className="border-r border-[#e7e7e7] box-border flex items-center justify-start py-[8px] px-[10px] relative self-stretch flex-1 min-w-[200px]">
        <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px]">
          Sản phẩm
        </p>
      </div>
      <div className="border-r border-[#e7e7e7] box-border flex items-center justify-center py-[8px] px-[10px] relative self-stretch w-[100px] min-w-[100px]">
        <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px]">
          Đơn giá
        </p>
      </div>
      <div className="border-r border-[#e7e7e7] box-border flex items-center justify-center py-[8px] px-[10px] relative self-stretch w-[80px] min-w-[80px]">
        <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px]">
          SL
        </p>
      </div>
      <div className="box-border flex items-center justify-end py-[8px] px-[10px] relative self-stretch w-[120px] min-w-[120px]">
        <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px]">
          Thành tiền
        </p>
      </div>
    </div>
  );
};

export default PaymentTableHeader;