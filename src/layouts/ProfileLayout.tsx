import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  PersonIcon,
  DocumentIcon,
  TicketIcon,
} from "../components/shop/ProfileIcons";

type MenuItem = {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
};

const ProfileLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      id: "basicinformation",
      label: "Hồ sơ",
      path: "/user/profile/basicinformation",
      icon: <PersonIcon />,
    },
    { id: "address", label: "Địa chỉ", path: "/user/profile/address" },
    { id: "password", label: "Đổi mật khẩu", path: "/user/profile/password" },
    {
      id: "privacy",
      label: "Thiết lập riêng tư",
      path: "/user/profile/privacy",
    },
    {
      id: "orders",
      label: "Đơn mua",
      path: "/user/profile/orders",
      icon: <DocumentIcon />,
    },
    {
      id: "vouchers",
      label: "Kho voucher",
      path: "/user/profile/vouchers",
      icon: <TicketIcon />,
    },
  ];

  const activeMenuId =
    menuItems.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/")
    )?.id || "basicinformation";

  return (
    <div className="bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left Sidebar - Menu */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Tài khoản của tôi
              </h3>
              <nav className="space-y-1 sm:space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors text-sm sm:text-base ${activeMenuId === item.id
                        ? "bg-[#18345c] text-white"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {item.icon && (
                      <span
                        className={
                          activeMenuId === item.id
                            ? "text-white"
                            : "text-gray-600"
                        }
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
