// src/pages/admin/AdminOrders.tsx
import React from 'react';

const AdminOrders: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Tạo đơn hàng mới
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-gray-500">Đơn hàng sẽ hiển thị ở đây khi có khách hàng đặt mua.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;