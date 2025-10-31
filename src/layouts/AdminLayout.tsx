import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import { SiteHeader } from "../components/admin/sidebar/site-header";

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex w-full min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar activePath={location.pathname} />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          aria-modal="true"
          role="dialog"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute left-0 top-0 h-full w-[230px] bg-[#18345C] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminSidebar activePath={location.pathname} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <SiteHeader onOpenSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto px-4 sm:px-8 md:px-[32px] py-4 sm:py-6 md:py-[32px] bg-[#F7F7F7] min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
