import React from "react";

interface ShippingAddressProps {
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
  onChange: () => void;
}

const ShippingAddress: React.FC<ShippingAddressProps> = ({
  name,
  phone,
  address,
  isDefault,
  onChange,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 text-[14px]">
      <div className="flex items-center gap-2 text-[#E04D30] font-semibold mb-3 text-[16px]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
          <circle cx="12" cy="11" r="2.5" />
        </svg>
        <span>Địa chỉ nhận hàng</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3 text-gray-900">
          <span className="font-semibold">{name}</span>
          <span className="-mx-1 text-gray-400">|</span>
          <span>{phone}</span>
          {isDefault && (
            <span className="px-3 py-1 border border-[#E04D30] text-[#E04D30] rounded text-[12px] h-6 inline-flex items-center">
              Mặc định
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-4">
          <p className="text-gray-800 leading-relaxed flex-1">{address}</p>
          <button
            onClick={onChange}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors whitespace-nowrap"
          >
            Thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;
