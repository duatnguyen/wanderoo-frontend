import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthCtx } from "../app/providers/AuthProvider";
import Header from "../features/shop/components/Header";
import Footer from "../features/shop/components/Footer";

const UserLayout: React.FC = () => {
  const { state } = useAuthCtx();
  const { user } = state;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        userName={user?.name || "User"}
        avatarUrl={user?.avatar}
        cartCount={0}
        onMenuClick={() => {}}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
