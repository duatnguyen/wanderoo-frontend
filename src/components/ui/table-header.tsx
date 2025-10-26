import React from "react";

interface TableHeaderProps {
  onSelectAll?: (checked: boolean) => void;
  isAllSelected?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  onSelectAll,
  isAllSelected,
}) => {
  return (
    <div className="w-full h-full border-t border-[var(--Neutral-100,#E7E7E7)] rounded-t-[24px] flex items-start justify-start">
      {/* Checkbox column */}
      <div className="self-stretch px-3 py-[14px] bg-[var(--Neutral-50,#F6F6F6)] overflow-hidden rounded-tl-[12px] border-b border-[var(--Neutral-200,#D1D1D1)] flex items-center justify-start gap-[10px]">
        <div className="w-6 h-6 relative overflow-hidden">
          <input
            type="checkbox"
            className="w-6 h-6"
            checked={isAllSelected || false}
            onChange={(e) => onSelectAll?.(e.target.checked)}
          />
        </div>
      </div>

      {/* Product name column */}
      <div className="w-[500px] self-stretch px-3 py-[14px] bg-[var(--Neutral-50,#F6F6F6)] overflow-hidden border-b border-[var(--Neutral-200,#D1D1D1)] flex items-center justify-start gap-[10px]">
        <div className="text-[#272424] text-xs font-semibold font-['Montserrat'] leading-[16.80px] break-words">
          Tên sản phẩm
        </div>
      </div>

      {/* SKU column */}
      <div className="flex-1 self-stretch p-[14px] relative bg-[var(--Neutral-50,#F6F6F6)] border-b border-[var(--Neutral-200,#D1D1D1)] flex items-center justify-center gap-1">
        <div className="w-[22px] h-0 absolute left-0 top-[43px] -rotate-90 origin-top-left"></div>
        <div className="text-center text-[#272424] text-xs font-semibold font-['Montserrat'] leading-[16.80px] break-words">
          SKU sản phẩm
        </div>
      </div>

      {/* Barcode column */}
      <div className="flex-1 self-stretch p-[14px] relative bg-[var(--Neutral-50,#F6F6F6)] border-b border-[var(--Neutral-200,#D1D1D1)] flex items-center justify-center gap-1">
        <div className="w-[22px] h-0 absolute left-0 top-[43px] -rotate-90 origin-top-left"></div>
        <div className="text-[#272424] text-xs font-semibold font-['Montserrat'] leading-[16.80px] break-words">
          Barcode
        </div>
      </div>

      {/* Stock column */}
      <div className="flex-1 self-stretch p-[14px] relative bg-[var(--Neutral-50,#F6F6F6)] border-b border-[var(--Neutral-200,#D1D1D1)] flex items-center justify-center gap-1">
        <div className="w-[22px] h-0 absolute left-0 top-[43px] -rotate-90 origin-top-left"></div>
        <div className="text-[#272424] text-xs font-semibold font-['Montserrat'] leading-[16.80px] break-words">
          Tồn kho
        </div>
      </div>

      {/* Sellable column */}
      <div className="flex-1 self-stretch p-[14px] relative bg-[var(--Neutral-50,#F6F6F6)] border-b border-[var(--Neutral-200,#D1D1D1)] flex items-center justify-center gap-1">
        <div className="w-[22px] h-0 absolute left-0 top-[43px] -rotate-90 origin-top-left"></div>
        <div className="text-[#272424] text-xs font-semibold font-['Montserrat'] leading-[16.80px] break-words">
          Có thể bán
        </div>
      </div>

      {/* Website sales column */}
      <div className="flex-1 self-stretch p-[14px] relative bg-[var(--Neutral-50,#F6F6F6)] border-b border-[var(--Neutral-200,#D1D1D1)] flex items-center justify-center gap-1">
        <div className="w-[22px] h-0 absolute left-0 top-[43px] -rotate-90 origin-top-left"></div>
        <div className="flex-1 text-center text-[#272424] text-xs font-semibold font-['Montserrat'] leading-[16.80px] break-words">
          SL bán trên website
        </div>
      </div>

      {/* POS sales column */}
      <div className="flex-1 self-stretch p-[14px] relative bg-[var(--Neutral-50,#F6F6F6)] border-b border-[var(--Neutral-200,#D1D1D1)] flex items-center justify-center gap-1">
        <div className="w-[22px] h-0 absolute left-0 top-[43px] -rotate-90 origin-top-left"></div>
        <div className="flex-1 text-center text-[#272424] text-xs font-semibold font-['Montserrat'] leading-[16.80px] break-words">
          SL bán trên POS
        </div>
      </div>

      {/* Selling price column */}
      <div className="flex-1 self-stretch p-[14px] relative bg-[var(--Neutral-50,#F6F6F6)] border-b border-[var(--Neutral-200,#D1D1D1)] flex items-center justify-center gap-1">
        <div className="w-[22px] h-0 absolute left-0 top-[43px] -rotate-90 origin-top-left"></div>
        <div className="text-[#272424] text-xs font-semibold font-['Montserrat'] leading-[16.80px] break-words">
          Giá bán
        </div>
      </div>

      {/* Cost price column */}
      <div className="flex-1 self-stretch p-[14px] relative bg-[var(--Neutral-50,#F6F6F6)] border-b border-[var(--Neutral-200,#D1D1D1)] flex items-center justify-center gap-1">
        <div className="w-[22px] h-0 absolute left-0 top-[43px] -rotate-90 origin-top-left"></div>
        <div className="text-[#272424] text-xs font-semibold font-['Montserrat'] leading-[16.80px] break-words">
          Giá vốn
        </div>
      </div>

      {/* Actions column */}
      <div className="flex-1 self-stretch p-[14px] relative bg-[var(--Neutral-50,#F6F6F6)] rounded-tr-[12px] border-b border-[var(--Neutral-200,#D1D1D1)] flex items-center justify-center gap-1">
        <div className="w-[22px] h-0 absolute left-0 top-[43px] -rotate-90 origin-top-left"></div>
        <div className="text-[#272424] text-xs font-semibold font-['Montserrat'] leading-[16.80px] break-words">
          Thao tác
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
