import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '../components/admin/AppSidebar';
import { SiteHeader } from '../components/admin/sidebar/site-header';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";


const AdminLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-1 flex-col sidebar-inset">
        <SiteHeader />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;