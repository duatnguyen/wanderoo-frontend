import React from "react";
import { Outlet } from "react-router-dom";
import ProfileSidebar from "../components/shop/ProfileSidebar";

const ProfileLayout: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 py-4 sm:py-6 lg:py-8">
        {/* Left Sidebar - Menu */}
        <ProfileSidebar />

        {/* Main Content */}
        <div className="flex-1 min-w-0 pr-4 sm:pr-6 lg:pr-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
