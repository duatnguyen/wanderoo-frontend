import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { CartProvider, useCart } from "../context/CartContext";
import Header from "../components/shop/Header";
import Footer from "../components/shop/Footer";
import { useAuth } from "../context/AuthContext";

const UserLayoutContent: React.FC = () => {
  const { getCartCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        cartCount={getCartCount()}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        userName={user?.name || user?.username || "Thanh"}
        avatarUrl={user?.avatar || undefined}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

const UserLayout: React.FC = () => {
  return (
    <CartProvider>
      <UserLayoutContent />
    </CartProvider>
  );
};

export default UserLayout;
