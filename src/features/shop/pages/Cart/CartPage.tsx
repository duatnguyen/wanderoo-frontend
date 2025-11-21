import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import Button from "../../../../components/shop/Button";
import { useCart } from "../../../../context/CartContext";
import { useAuth } from "../../../../context/AuthContext";
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
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Login Prompt Content */}
          <section className="w-full bg-gray-50 py-8">
            <div className="max-w-[1200px] mx-auto px-4">
              <h1 className="text-[20px] font-bold text-[#E04D30] mb-4">
                Giỏ hàng của bạn
              </h1>

              <div className="text-center py-16">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500 mb-6">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Đăng nhập để tiếp tục
                </h2>
                <p className="text-gray-600 mb-6">
                  Vui lòng đăng nhập để xem và quản lý các sản phẩm trong giỏ hàng của bạn.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-[#E04D30] hover:bg-[#c53b1d] text-white py-2 px-4 rounded-lg mr-4"
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    onClick={() => navigate("/register")}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg"
                  >
                    Tạo tài khoản
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

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
    {
      id: 4,
      imageUrl: "",
      name: "Ba lô trekking 30L",
      price: 950000,
      originalPrice: 1150000,
      rating: 4.6,
      discountPercent: 17,
    },
    {
      id: 101,
      imageUrl: "",
      name: "Lều trại 4 người siêu giảm giá",
      price: 1890000,
      originalPrice: 3200000,
      rating: 4.9,
      discountPercent: 41,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        cartCount={getCartCount()}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1">
        {/* Cart Content */}
        <section className="w-full bg-gray-50 py-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-[20px] font-bold text-[#E04D30] mb-4">
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
