// src/pages/admin/AdminProducts.tsx
import React from 'react';

const AdminProducts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Thêm sản phẩm mới
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sản phẩm nào</h3>
          <p className="text-gray-500">Thêm sản phẩm đầu tiên để bắt đầu bán hàng.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;