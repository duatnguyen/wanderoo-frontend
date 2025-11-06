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
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Địa chỉ nhận hàng
      </h2>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-semibold text-gray-900">{name}</span>
            <span className="text-gray-600">{phone}</span>
          </div>
          <p className="text-gray-700">{address}</p>
        </div>
        <div className="flex items-center gap-3">
          {isDefault && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg">
              Mặc định
            </span>
          )}
          <button
            onClick={onChange}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;

