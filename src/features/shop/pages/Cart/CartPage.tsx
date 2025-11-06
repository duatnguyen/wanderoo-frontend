import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import Button from "../../../../components/shop/Button";
import { useCart } from "../../../../context/CartContext";
import { getProductById } from "../../data/productsData";
import CartTable from "../../../../components/shop/Cart/CartTable";
import RecommendedProducts from "../../../../components/shop/Cart/RecommendedProducts";

type CartItemDisplay = {
  id: string;
  productId: string | number;
  name: string;
  description?: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variant?: string;
  variantOptions?: { label: string; value: string }[];
};

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, addToCart, getCartCount } =
    useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Map cart items to display format with product data
  const cartItemsDisplay: CartItemDisplay[] = useMemo(() => {
    return cartItems
      .map((cartItem) => {
        const product = getProductById(cartItem.productId);
        if (!product) return null;

        return {
          id: `${cartItem.productId}-${cartItem.variant || "default"}`,
          productId: cartItem.productId,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl || "",
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: cartItem.quantity,
          variant: cartItem.variant,
          variantOptions: product.variantOptions,
        } as CartItemDisplay;
      })
      .filter((item): item is CartItemDisplay => item !== null);
  }, [cartItems]);

  const handleQuantityChange = (productId: string | number, change: number) => {
    const cartItem = cartItems.find(
      (item) => item.productId.toString() === productId.toString()
    );
    if (cartItem) {
      const newQuantity = cartItem.quantity + change;
      updateQuantity(productId, Math.max(1, newQuantity));
    }
  };

  const handleRemoveItem = (productId: string | number) => {
    removeFromCart(productId);
    const itemId = cartItemsDisplay.find(
      (item) => item.productId.toString() === productId.toString()
    )?.id;
    if (itemId) {
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItemsDisplay.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItemsDisplay.map((item) => item.id)));
    }
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach((itemId) => {
      const cartItem = cartItemsDisplay.find((item) => item.id === itemId);
      if (cartItem) {
        removeFromCart(cartItem.productId);
      }
    });
    setSelectedItems(new Set());
  };

  const handleVariantChange = (productId: string | number, variant: string) => {
    const product = getProductById(productId);
    if (product) {
      const cartItem = cartItems.find(
        (item) => item.productId.toString() === productId.toString()
      );
      if (cartItem) {
        // Remove old item and add new one with different variant
        removeFromCart(productId);
        // Add back with new variant
        addToCart(product, cartItem.quantity, variant);
      }
    }
  };

  // Recommended products
  const recommendedProducts = [
    {
      id: 6,
      imageUrl: "",
      name: "Ghế xếp du lịch nhẹ",
      price: 320000,
      originalPrice: 450000,
      rating: 4.4,
      discountPercent: 29,
    },
    {
      id: 7,
      imageUrl: "",
      name: "Đèn pin siêu sáng LED",
      price: 280000,
      originalPrice: 380000,
      rating: 4.2,
      discountPercent: 26,
    },
    {
      id: 8,
      imageUrl: "",
      name: "Bộ dụng cụ đa năng",
      price: 180000,
      originalPrice: 250000,
      rating: 4.5,
      discountPercent: 28,
    },
    {
      id: 9,
      imageUrl: "",
      name: "Áo khoác gió chống nước",
      price: 750000,
      originalPrice: 950000,
      rating: 4.7,
      discountPercent: 21,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        cartCount={getCartCount()}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="w-full bg-gray-50 border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button
                onClick={() => navigate("/shop")}
                className="hover:text-[#18345c] transition-colors"
              >
                Trang chủ
              </button>
              <span>/</span>
              <span className="text-gray-900">Giỏ hàng</span>
            </div>
          </div>
        </section>

        {/* Cart Content */}
        <section className="w-full bg-gray-50 py-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-[32px] font-bold text-gray-900 mb-8">
              Giỏ hàng của bạn
            </h1>

            {cartItemsDisplay.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg mb-4">
                  Giỏ hàng của bạn đang trống
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate("/shop")}
                >
                  Tiếp tục mua sắm
                </Button>
              </div>
            ) : (
              <CartTable
                items={cartItemsDisplay}
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
                onSelectAll={handleSelectAll}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                onVariantChange={handleVariantChange}
                onDeleteSelected={handleDeleteSelected}
                onCheckout={() => navigate("/shop/checkout")}
              />
            )}
          </div>
        </section>

        {cartItemsDisplay.length > 0 && (
          <RecommendedProducts products={recommendedProducts} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
