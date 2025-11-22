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
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">
          Địa chỉ nhận hàng
        </h3>
        <button
          onClick={onChange}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Thay đổi
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium text-gray-900">{name}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">{phone}</span>
          {isDefault && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
              Mặc định
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{address}</p>
      </div>
    </div>
  );
};

export default ShippingAddress;
