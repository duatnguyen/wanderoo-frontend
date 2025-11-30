import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { adminFooterNav, type AdminNavItem } from "../adminNavData";
import NavItem from "./NavItem";
import { useAuth } from "../../../context/AuthContext";

// Footer Component
interface SidebarFooterProps {
  activePath: string;
  expandedItems: Set<string>;
  onToggleExpand: (key: string) => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  activePath,
  expandedItems,
  onToggleExpand,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mb-2">
      <div className="h-[20px]" />
      <div className="-mx-[16px] h-px bg-white/15" />
      <div className="mt-2 space-y-1.5 [&>a]:pl-5 [&>div]:pl-5">
        {adminFooterNav.items.map((item: AdminNavItem, index: number) => (
          <NavItem
            key={`footer-${index}`}
            item={item}
            itemKey={`footer-${index}`}
            activePath={activePath}
            expandedItems={expandedItems}
            onToggleExpand={onToggleExpand}
            isFooter={true}
          />
        ))}
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 h-8 py-0 text-sm font-medium tracking-wide transition-colors duration-200 w-full text-white hover:text-white hover:bg-[#172b46] pl-5"
          type="button"
        >
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarFooter;
