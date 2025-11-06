import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PersonIcon,
  DocumentIcon,
  TicketIcon,
  EditPencilIcon,
} from "./ProfileIcons";
import { useAuthCtx } from "../../app/providers/AuthProvider";

type MenuItem = {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
};

const ProfileSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useAuthCtx();
  const { user } = state;

  // Get user data with fallback to mock data
  const userData = {
    fullName: user?.name || "Thanh",
    avatar: user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg",
  };

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

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 pl-0">
      <div className="px-5 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Tài khoản của tôi
        </h3>

        {/* User Summary */}
        <div className="flex flex-col items-start gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
          <img
            src={userData.avatar}
            alt="Avatar"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0 w-full">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              {userData.fullName}
            </h3>
            <button
              onClick={() => navigate("/user/profile/basicinformation")}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors text-sm"
            >
              <EditPencilIcon />
              <span className="font-medium">Sửa hồ sơ</span>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeMenuId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#18345c] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
