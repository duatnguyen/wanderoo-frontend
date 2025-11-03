// src/pages/admin/AdminSettings.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminSettings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Redirect to profile if on base settings route
  useEffect(() => {
    if (path === "/admin/settings") {
      navigate("/admin/settings/profile", { replace: true });
    }
  }, [path, navigate]);

  // Determine which page to show based on the path
  const getPageContent = () => {
    if (path.includes("/profile")) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hồ sơ</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500">Trang hồ sơ người dùng</p>
          </div>
        </div>
      );
    } else if (path.includes("/address")) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Địa chỉ</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500">Trang quản lý địa chỉ</p>
          </div>
        </div>
      );
    } else if (path.includes("/password")) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Đổi mật khẩu
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500">Trang đổi mật khẩu</p>
          </div>
        </div>
      );
    } else if (path.includes("/shop")) {
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Thiết lập shop
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-gray-500">Trang thiết lập shop</p>
          </div>
        </div>
      );
    }

    // Default to profile page if no match (shouldn't happen due to redirect)
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hồ sơ</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500">Trang hồ sơ người dùng</p>
        </div>
      </div>
    );
  };

  return <div className="space-y-6">{getPageContent()}</div>;
};

export default AdminSettings;
