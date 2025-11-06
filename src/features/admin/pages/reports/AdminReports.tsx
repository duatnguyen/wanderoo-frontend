// src/pages/admin/AdminReports.tsx
import React from "react";

const AdminReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Báo cáo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Báo cáo bán hàng
          </h3>
          <p className="text-gray-500">Thống kê doanh thu và đơn hàng.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Báo cáo sản phẩm
          </h3>
          <p className="text-gray-500">Phân tích hiệu suất sản phẩm.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Báo cáo khách hàng
          </h3>
          <p className="text-gray-500">Thống kê và phân tích khách hàng.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
