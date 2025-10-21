// src/pages/admin/AdminWebsite.tsx
import React from "react";

const AdminWebsite: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Kênh bán hàng - Website
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9V3m0 9l-3-3m0 6l3-3"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Quản lý Website
          </h3>
          <p className="text-gray-500">
            Cấu hình và quản lý kênh bán hàng trực tuyến.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminWebsite;
