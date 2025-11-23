import React from "react";
import { Link } from "react-router-dom";
import ShopLogo from "@/assets/icons/ShopLogo.svg";

// Header Component - Logo area
const SidebarHeader: React.FC = () => {
  return (
    <div className="relative flex items-center justify-start h-[64px] border-b border-white/10 bg-[#18345C] overflow-hidden">
      <Link to="/admin/dashboard">
        <div className="h-[64px] w-full flex items-center justify-start overflow-hidden relative" style={{ paddingLeft: 2 }}>
          <img
            src={ShopLogo}
            alt="Shop Logo"
            style={{ width: 3000, height: 920, objectFit: 'contain', display: 'block', marginTop: 4 }}
            className="block"
          />
        </div>
      </Link>
    </div>
  );
};

export default SidebarHeader;