import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import { SiteHeader } from "../components/admin/sidebar/site-header";

const AdminLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar activePath={location.pathname} />
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 overflow-auto px-[50px] py-[32px] bg-[#F7F7F7]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
