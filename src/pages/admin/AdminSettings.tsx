// src/pages/admin/AdminSettings.tsx
import React from 'react';

const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Cấu hình hệ thống</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cài đặt chung</h3>
          <p className="text-gray-500">Thông tin cửa hàng, múi giờ, ngôn ngữ.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tích hợp</h3>
          <p className="text-gray-500">Cấu hình các dịch vụ bên thứ ba.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bảo mật</h3>
          <p className="text-gray-500">Cài đặt bảo mật và phân quyền.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Thanh toán</h3>
          <p className="text-gray-500">Cấu hình các phương thức thanh toán.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;