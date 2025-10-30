import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import { SiteHeader } from "../components/admin/sidebar/site-header";

const AdminLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-full w-full">
      <AdminSidebar activePath={location.pathname} />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <SiteHeader />
        <main className="flex-1 overflow-auto px-4 sm:px-8 md:px-[32px] py-4 sm:py-6 md:py-[32px] bg-[#F7F7F7] min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
