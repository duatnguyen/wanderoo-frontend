import React, { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "../features/shop/data/productsData";
import { addToCart as addToCartApi } from "../api/endpoints/cartApi";
import { toast } from "sonner";

export type CartItem = {
  productId: string | number;
  quantity: number;
  variant?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, variant?: string) => Promise<void>;
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
    async (product: Product, quantity: number, variant?: string) => {
      try {
        console.log('🛒 Adding to cart - productId:', product.id, 'quantity:', quantity);
        
        // Check authentication status
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
          return;
        }
        
        // Call API to add to cart
        // Backend expects productDetailId, not productId
        await addToCartApi(Number(product.id), quantity);

        // Update local state on success
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

        // Show success message
        toast.success('Đã thêm sản phẩm vào giỏ hàng thành công!');
      } catch (error) {
        console.error('Error adding to cart:', error);
        
        // Show specific error message based on error type
        const errorMessage = (error as any)?.response?.data?.message;
        if (errorMessage?.includes('exceeds available stock')) {
          toast.error('Số lượng yêu cầu vượt quá hàng tồn kho website!');
        } else if (errorMessage?.includes('out of stock for website sales')) {
          toast.error('Sản phẩm đã hết hàng trên website!');
        } else if (errorMessage?.includes('not found')) {
          toast.error('Sản phẩm không tồn tại!');
        } else if ((error as any)?.response?.status === 401) {
          toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        } else {
          toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại.');
        }
        
        throw error;
      }
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
