// src/pages/admin/AdminDiscounts.tsx
import React from 'react';

const AdminDiscounts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mã giảm giá</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Tạo mã giảm giá
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Quản lý mã giảm giá</h3>
          <p className="text-gray-500">Tạo và quản lý các mã giảm giá, chương trình khuyến mãi.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDiscounts;