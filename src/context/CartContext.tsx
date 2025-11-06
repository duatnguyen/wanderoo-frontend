import React, { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "../features/shop/data/productsData";

export type CartItem = {
  productId: string | number;
  quantity: number;
  variant?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, variant?: string) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback(
    (product: Product, quantity: number, variant?: string) => {
      setCartItems((prev) => {
        const existingItemIndex = prev.findIndex(
          (item) =>
            item.productId.toString() === product.id.toString() &&
            item.variant === variant
        );

        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          const updated = [...prev];
          updated[existingItemIndex] = {
            ...updated[existingItemIndex],
            quantity: updated[existingItemIndex].quantity + quantity,
          };
          return updated;
        } else {
          // Add new item
          return [
            ...prev,
            {
              productId: product.id,
              quantity,
              variant,
            },
          ];
        }
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: string | number) => {
    setCartItems((prev) =>
      prev.filter((item) => item.productId.toString() !== productId.toString())
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string | number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId.toString() === productId.toString()
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

