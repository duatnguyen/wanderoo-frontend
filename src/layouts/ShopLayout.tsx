import React from "react";
import { Outlet } from "react-router-dom";
import { CartProvider } from "../context/CartContext";

const ShopLayout: React.FC = () => {
  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  );
};

export default ShopLayout;

