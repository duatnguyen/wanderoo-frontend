import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, ConfigProvider } from "antd";
import type { MenuProps } from "antd";
import {
  PersonIcon,
  DocumentIcon,
  TicketIcon,
  EditPencilIcon,
} from "../components/shop/ProfileIcons";
import { useAuthCtx } from "../app/providers/AuthProvider";

type MenuItem = {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
};

const ProfileLayout: React.FC = () => {
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

  // Convert menuItems to antd Menu items format
  const menuProps: MenuProps = {
    mode: "inline",
    selectedKeys: [activeMenuId],
    items: menuItems.map((item) => ({
      key: item.id,
      label: item.label,
      icon: item.icon || undefined,
    })),
    onClick: ({ key }) => {
      const selectedItem = menuItems.find((item) => item.id === key);
      if (selectedItem) {
        navigate(selectedItem.path);
      }
    },
  };

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 py-4 sm:py-6 lg:py-8">
        {/* Left Sidebar - Menu */}
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

            <ConfigProvider
              theme={{
                components: {
                  Menu: {
                    itemActiveBg: "#18345c",
                    itemSelectedBg: "#18345c",
                    itemSelectedColor: "#ffffff",
                    itemHoverBg: "#f9fafb",
                    itemColor: "#374151",
                    borderRadius: 8,
                    itemMarginInline: 0,
                    itemPaddingInline: 12,
                    itemHeight: 44,
                  },
                },
              }}
            >
              <Menu
                {...menuProps}
                className="!border-0 bg-transparent"
                style={{
                  backgroundColor: "transparent",
                }}
              />
            </ConfigProvider>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 pr-4 sm:pr-6 lg:pr-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
