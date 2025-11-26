import React from "react";
import { Outlet } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import { Toaster } from "@/components/ui/sonner"

const ShopLayout: React.FC = () => {
  return (
    <CartProvider>
      <Outlet />
      <Toaster />
    </CartProvider>
  );
};

export default ShopLayout;
