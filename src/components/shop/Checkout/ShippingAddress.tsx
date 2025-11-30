import React from "react";

interface ShippingAddressProps {
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
  onChange: () => void;
  isEmpty?: boolean;
  onAddNew?: () => void;
}

const ShippingAddress: React.FC<ShippingAddressProps> = ({
  name,
  phone,
  address,
  isDefault,
  onChange,
  isEmpty = false,
  onAddNew,
}) => {
  if (isEmpty) {
    return (
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#E04D30] transition-colors">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Chưa có địa chỉ giao hàng
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-sm">
            Bạn cần thêm địa chỉ giao hàng để tiếp tục đặt hàng
          </p>
          {onAddNew && (
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E04D30] hover:bg-[#c53b1d] text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm địa chỉ mới
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E04D30]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#E04D30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Địa chỉ nhận hàng
          </h3>
        </div>
        <button
          onClick={onChange}
          className="text-sm text-[#E04D30] hover:text-[#c53b1d] font-semibold transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Thay đổi
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-bold text-gray-900 text-base">{name}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-700">{phone}</span>
          {isDefault && (
            <span className="px-2.5 py-1 bg-[#E04D30]/10 text-[#E04D30] text-xs font-semibold rounded-full">
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
