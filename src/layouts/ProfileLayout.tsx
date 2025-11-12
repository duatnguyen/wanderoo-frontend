import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import ProfileSidebar from "../components/shop/ProfileSidebar";

const ProfileLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 h-full">
      <div className="w-full px-4 h-full flex flex-col">
        {/* Mobile Menu Button */}
        <div className="lg:hidden py-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Menu size={24} />
            <span className="font-medium">Menu</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 py-4 sm:py-6 lg:py-8 w-full items-start flex-1 min-h-0">
          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Left Sidebar - Menu */}
          <div
            className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transform ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            } transition-transform duration-300 ease-in-out lg:transition-none`}
          >
            <ProfileSidebar onClose={() => setIsSidebarOpen(false)} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 lg:pl-0 h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
