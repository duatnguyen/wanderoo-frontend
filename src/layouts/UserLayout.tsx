import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthCtx } from "../app/providers/AuthProvider";
import Header from "../components/shop/Header";
import Footer from "../components/shop/Footer";

const UserLayout: React.FC = () => {
  const { state } = useAuthCtx();
  const { user } = state;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        userName={user?.name || "User"}
        avatarUrl={user?.avatar}
        cartCount={0}
        onMenuClick={() => { }}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
