import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, X } from "lucide-react";
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
  children?: MenuItem[];
};

interface ProfileSidebarProps {
  onClose?: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useAuthCtx();
  const { user } = state;
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // Get user data with fallback - same as Header
  const userData = {
    fullName: user?.name || "Thanh",
    avatar: user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const menuItems: MenuItem[] = [
    {
      id: "account",
      label: "Tài khoản của tôi",
      path: "/user/profile",
      icon: <PersonIcon />,
      children: [
        { id: "basicinformation", label: "Hồ sơ", path: "/user/profile/basicinformation" },
        { id: "address", label: "Địa chỉ", path: "/user/profile/address" },
        { id: "password", label: "Đổi mật khẩu", path: "/user/profile/password" },
        { id: "privacy", label: "Thiết lập riêng tư", path: "/user/profile/privacy" },
      ],
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

  // Check if a menu item or its children is active
  const isMenuActive = (item: MenuItem): boolean => {
    // If item has children, only check if any child is active
    if (item.children && item.children.length > 0) {
      return item.children.some(child => 
        location.pathname === child.path || location.pathname.startsWith(child.path + "/")
      );
    }
    // For items without children, check exact path match
    return location.pathname === item.path || location.pathname.startsWith(item.path + "/");
  };

  // Check if a child menu item is active
  const isChildActive = (childPath: string): boolean => {
    return location.pathname === childPath || location.pathname.startsWith(childPath + "/");
  };

  const handleMenuItemClick = (item: MenuItem) => {
    // If item has children, toggle expansion instead of navigating
    if (item.children && item.children.length > 0) {
      // Toggle expansion for all items including "Tài khoản của tôi"
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else {
      // Navigate only if no children
      // Close "Tài khoản của tôi" when clicking on other items
      if (expandedMenu === "account") {
        setExpandedMenu(null);
      }
      navigate(item.path);
      if (onClose) {
        onClose();
      }
    }
  };

  const handleToggleDropdown = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking chevron
    setExpandedMenu(expandedMenu === itemId ? null : itemId);
  };

  const handleChildClick = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  // Auto-expand menu if one of its children is active
  React.useEffect(() => {
    menuItems.forEach(item => {
      if (item.children) {
        // Check if any child is active
        const hasActiveChild = item.children.some(child => 
          location.pathname === child.path || location.pathname.startsWith(child.path + "/")
        );
        
        if (hasActiveChild) {
          // Expand this menu if a child is active
        setExpandedMenu(item.id);
      }
      }
    });
    
    // Close "Tài khoản của tôi" if none of its children are active
    const accountItem = menuItems.find(item => item.id === "account");
    if (accountItem && accountItem.children) {
      const hasActiveAccountChild = accountItem.children.some(child => 
        location.pathname === child.path || location.pathname.startsWith(child.path + "/")
      );
      if (!hasActiveAccountChild) {
        setExpandedMenu(prev => prev === "account" ? null : prev);
      }
    }
  }, [location.pathname]);

  return (
    <aside className="w-64 lg:w-64 h-full lg:h-auto flex-shrink-0">
      <div className="h-full lg:h-auto p-4 sm:p-5 lg:p-6 overflow-y-auto">
        {/* Close button for mobile */}
        {onClose && (
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Tài khoản của tôi
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Đóng menu"
            >
              <X size={24} />
            </button>
          </div>
        )}
        {/* User Profile Section */}
        <div className="mb-4 sm:mb-6 pb-4 border-b border-gray-300 pl-3">
          <div className="flex items-start gap-3">
            <img
              src={userData.avatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-base font-semibold text-gray-900 mb-1">
                {userData.fullName}
              </div>
              <button
                onClick={() => navigate("/user/profile/basicinformation")}
                className="text-gray-600 hover:text-gray-700 flex items-center gap-1 transition-colors text-sm"
              >
                <EditPencilIcon />
                <span>Sửa hồ sơ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = isMenuActive(item);
            const isExpanded = expandedMenu === item.id;
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.id}>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMenuItemClick(item)}
                    className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "text-[#E04D30]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon && (
                      <span className="flex-shrink-0">{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                  </button>
                  {hasChildren && item.id !== "account" && (
                    <button
                      onClick={(e) => handleToggleDropdown(item.id, e)}
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? "text-[#E04D30] hover:bg-gray-100"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      aria-label="Toggle submenu"
                    >
                      {isExpanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  )}
                </div>

                {/* Dropdown Children */}
                {hasChildren && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 pl-4">
                    {item.children!.map((child) => {
                      const childIsActive = isChildActive(child.path);
                      return (
                        <button
                          key={child.id}
                          onClick={() => handleChildClick(child.path)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                            childIsActive
                              ? "text-[#E04D30]"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <span>{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
