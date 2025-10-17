// src/pages/admin/AdminShipping.tsx
import React from 'react';

const AdminShipping: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Vận chuyển</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Quản lý vận chuyển</h3>
          <p className="text-gray-500">Cấu hình các phương thức và đối tác vận chuyển.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminShipping;