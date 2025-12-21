import React from "react";
import { Wallet } from "lucide-react";

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl || imageUrl.trim() === '') return undefined;
  
  // Clean up the image URL
  const cleanUrl = imageUrl.trim();
  
  // If already a full URL (http/https), return as is
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  
  // Get base URL from environment or default to localhost
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  
  // If relative path starting with /, add base URL
  if (cleanUrl.startsWith('/')) {
    return `${baseUrl}${cleanUrl}`;
  }
  
  // If relative path not starting with /, add base URL with /
  return `${baseUrl}/${cleanUrl}`;
};

export interface AdminPaymentItem {
  id: string | number;
  name: string;
  productImage?: string;
  unitPrice: number; // Giá gốc (snapshotProductPrice)
  discountAmount?: number; // Số tiền được giảm (snapshotDiscountAmount)
  finalPrice?: number; // Giá cuối cùng sau giảm (snapshotFinalPrice) 
  quantity: number;
  total: number; // Thành tiền (finalPrice * quantity hoặc snapshotFinalPrice * quantity)
  variantText?: string;
  sku?: string;
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
      className={`bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[20px] items-start p-[20px] sm:p-[20px] relative rounded-[8px] w-full overflow-hidden min-w-0 ${disabled ? "opacity-60" : ""
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
        <div className="flex flex-col items-start relative w-full min-w-[800px]">
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
                Đơn giá gốc
              </p>
            </div>
            <div className="border-r border-[#e7e7e7] box-border flex items-center justify-center py-[8px] px-[10px] relative self-stretch w-[90px] min-w-[90px]">
              <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#4b5563] text-[12px]">
                Giảm giá
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
                className={`flex items-center relative shrink-0 w-full min-w-[800px] border-b border-[#f0f0f0] ${index % 2 === 0 ? "bg-white" : "bg-[#fcfcfc]"
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
                    {item.productImage ? (
                      <img
                        src={getImageUrl(item.productImage) || item.productImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<span class="font-montserrat font-semibold text-[9px] text-gray-400 text-center px-1">No Image</span>';
                          }
                        }}
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
                    {item.sku && (
                      <p className="font-montserrat font-medium text-[9px] leading-[1.3] text-[#9ca3af]">
                        SKU: <span className="font-semibold text-[#6b7280]">{item.sku}</span>
                      </p>
                    )}
                  </div>
                </div>
                {/* Original Unit price */}
                <div className="box-border flex gap-[4px] items-center justify-center p-[10px] relative w-[100px] min-w-[100px]">
                  <div className="text-center">
                    {item.discountAmount && item.discountAmount > 0 && item.finalPrice && item.finalPrice < item.unitPrice ? (
                      <>
                        <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-black text-[12px] text-nowrap line-through">
                          {formatCurrency(item.unitPrice)}
                        </p>
                        <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-red-600 text-[10px] text-nowrap mt-1">
                          {formatCurrency(item.finalPrice)}
                        </p>
                      </>
                    ) : (
                      <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-red-600 text-[12px] text-nowrap">
                        {formatCurrency(item.unitPrice)}
                      </p>
                    )}
                  </div>
                </div>
                {/* Discount Amount (tổng giảm giá) */}
                <div className="box-border flex gap-[4px] items-center justify-center p-[10px] relative w-[90px] min-w-[90px]">
                  {item.discountAmount && item.discountAmount > 0 ? (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded text-xs font-medium text-red-600">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      -{formatCurrency(item.discountAmount)}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </div>
                {/* Quantity */}
                <div className="box-border flex gap-[4px] items-center justify-center p-[10px] relative w-[80px] min-w-[80px]">
                  <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#111827] text-[12px] text-nowrap">
                    {item.quantity}
                  </p>
                </div>
                {/* Total */}
                <div className="box-border flex gap-[4px] items-center justify-end p-[10px] pr-[14px] relative w-[120px] min-w-[120px]">
                  <p className="font-montserrat font-semibold leading-[1.4] relative shrink-0 text-red-600 text-[12px] text-nowrap">
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

