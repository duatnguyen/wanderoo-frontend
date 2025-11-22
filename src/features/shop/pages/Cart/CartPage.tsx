import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import Button from "../../../../components/shop/Button";
import { useAuth } from "../../../../context/AuthContext";
import CartTable from "../../../../components/shop/Cart/CartTable";
import RecommendedProducts from "../../../../components/shop/Cart/RecommendedProducts";
import { getCart, updateCartItem, removeCartItem, getSelectedCartItems, updateCartItemProductDetail } from "../../../../api/endpoints/cartApi";
import type { BackendCartResponse, ProductDetailVariantResponse } from "../../../../types/api";

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
  cartId?: number; // For API calls
  websiteSoldQuantity?: number; // For stock status
  availableVariants?: ProductDetailVariantResponse[]; // Available variants for this product
};

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [cartData, setCartData] = useState<BackendCartResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page] = useState(1);
  const [size] = useState(20);

  // Fetch cart data from API
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchCartData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCart({ page, size });
        setCartData(response.carts || []);
      } catch (err: any) {
        console.error("Error fetching cart:", err);
        setError(err?.response?.data?.message || "Không thể tải giỏ hàng");
        setCartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [isAuthenticated, page, size]);

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

  // Map cart items from API to display format
  // Display each cart item separately (no merging)
  const cartItemsDisplay: CartItemDisplay[] = useMemo(() => {
    return cartData.map((cartItem) => {
      // Use cartId as the unique identifier
      const id = cartItem.id.toString();

      // Map attributes from VariantAttributeSnapshot[] to string for display
      // Format: "name: value, name: value"
      const attributesString = cartItem.attributes
        ?.map(attr => `${attr.name}: ${attr.value}`)
        .join(", ") || "";

      return {
        id,
        productId: cartItem.productId || cartItem.productDetailId, // Use productId if available, fallback to productDetailId
        name: cartItem.productName,
        description: attributesString,
        imageUrl: cartItem.imageUrl || "",
        price: cartItem.discountedPrice || cartItem.productPrice,
        originalPrice: cartItem.originalPrice,
        quantity: cartItem.quantity,
        variant: attributesString || undefined,
        variantOptions: undefined,
        cartId: cartItem.id, // Store cartId for API calls
        websiteSoldQuantity: cartItem.websiteSoldQuantity, // For stock status
        availableVariants: cartItem.availableVariants || [], // Available variants
      } as CartItemDisplay & { cartId: number };
    });
  }, [cartData]);

  const handleQuantityChange = async (productId: string | number, change: number) => {
    const cartItem = cartItemsDisplay.find(
      (item) => item.id === productId.toString()
    );

    if (!cartItem || !cartItem.cartId) return;

    const newQuantity = cartItem.quantity + change;
    if (newQuantity < 1) {
      // If quantity becomes 0 or negative, remove the item
      await handleRemoveItem(productId);
      return;
    }

    try {
      await updateCartItem(cartItem.cartId, newQuantity);
      // Refresh cart data
      const response = await getCart({ page, size });
      setCartData(response.carts || []);
    } catch (err: any) {
      console.error("Error updating cart item:", err);
      setError(err?.response?.data?.message || "Không thể cập nhật số lượng");
    }
  };

  const handleRemoveItem = async (productId: string | number) => {
    const cartItem = cartItemsDisplay.find(
      (item) => item.id === productId.toString()
    );

    if (!cartItem || !cartItem.cartId) return;

    try {
      await removeCartItem(cartItem.cartId);

      // Remove from selected items
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItem.id);
        return newSet;
      });
      // Refresh cart data
      const response = await getCart({ page, size });
      setCartData(response.carts || []);
    } catch (err: any) {
      console.error("Error removing cart item:", err);
      setError(err?.response?.data?.message || "Không thể xóa sản phẩm");
    }
  };

  const handleSelectItem = (id: string) => {
    // Check if item is out of stock
    const item = cartItemsDisplay.find(i => i.id === id);
    if (item && item.websiteSoldQuantity === 0) {
      // Don't allow selecting out of stock items
      return;
    }

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
    // Only select available items (not out of stock and quantity doesn't exceed stock)
    const availableItems = cartItemsDisplay.filter((item) => {
      const isOutOfStock = item.websiteSoldQuantity === 0;
      const isQuantityExceedsStock = (item.websiteSoldQuantity || 0) < item.quantity;

      // Item is available if not out of stock and quantity doesn't exceed stock
      return !isOutOfStock && !isQuantityExceedsStock;
    });

    const availableItemIds = availableItems.map((item) => item.id);
    const allAvailableSelected = availableItemIds.length > 0 &&
      availableItemIds.every(id => selectedItems.has(id));

    if (allAvailableSelected) {
      // Deselect all available items
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        availableItemIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    } else {
      // Select all available items
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        availableItemIds.forEach(id => newSet.add(id));
        return newSet;
      });
    }
  };

  const handleDeleteSelected = async () => {
    const selectedItemsList = cartItemsDisplay.filter((item) => selectedItems.has(item.id));

    if (selectedItemsList.length === 0) return;

    try {
      // Collect all cart IDs to delete
      const cartIdsToDelete = selectedItemsList
        .map((item) => item.cartId)
        .filter((id): id is number => id !== undefined);

      // Delete all selected items
      await Promise.all(
        cartIdsToDelete.map((cartId) => removeCartItem(cartId))
      );
      setSelectedItems(new Set());
      // Refresh cart data
      const response = await getCart({ page, size });
      setCartData(response.carts || []);
    } catch (err: any) {
      console.error("Error deleting selected items:", err);
      setError(err?.response?.data?.message || "Không thể xóa các sản phẩm đã chọn");
    }
  };

  const handleVariantChange = async (cartId: number, newProductDetailId: number) => {
    try {
      setError(null);

      // Find the cart item
      const cartItem = cartItemsDisplay.find(item => item.cartId === cartId);
      if (!cartItem) {
        setError("Không tìm thấy sản phẩm trong giỏ hàng");
        return;
      }

      // Check if the new variant is available
      const selectedVariant = cartItem.availableVariants?.find(
        v => v.productDetailId === newProductDetailId
      );

      if (!selectedVariant) {
        setError("Biến thể không tồn tại");
        return;
      }

      if (selectedVariant.websiteSoldQuantity === 0) {
        setError("Biến thể này đã hết hàng");
        return;
      }

      // Update cart item with new productDetailId
      // Backend will handle quantity adjustment if needed
      await updateCartItemProductDetail(cartId, newProductDetailId);

      // Refresh cart data
      const response = await getCart({ page, size });
      setCartData(response.carts || []);

      // Show success message if quantity was adjusted
      const updatedItem = response.carts?.find(c => c.id === cartId);
      if (updatedItem && updatedItem.quantity < cartItem.quantity) {
        setError(`Đã đổi biến thể thành công. Số lượng đã được điều chỉnh từ ${cartItem.quantity} xuống ${updatedItem.quantity} do tồn kho hạn chế.`);
        setTimeout(() => setError(null), 5000);
      }
    } catch (err: any) {
      console.error("Error changing variant:", err);
      setError(err?.response?.data?.message || "Không thể đổi biến thể");
    }
  };

  const handleCheckout = async () => {
    // Filter selected items to only include available ones (not out of stock and quantity doesn't exceed stock)
    // Note: Items with available variants can be selected but need to change variant before checkout
    const selectedAvailableItems = cartItemsDisplay.filter((item) => {
      if (!selectedItems.has(item.id)) return false;
      const isOutOfStock = item.websiteSoldQuantity === 0;
      const isQuantityExceedsStock = (item.websiteSoldQuantity || 0) < item.quantity;

      // For checkout, only allow items that are not out of stock and quantity doesn't exceed stock
      // Items with available variants should change variant first
      return !isOutOfStock && !isQuantityExceedsStock;
    });

    const selectedCartIds = selectedAvailableItems
      .map((item) => item.cartId)
      .filter((id): id is number => id !== undefined);

    if (selectedCartIds.length === 0) {
      // If no available items selected, check if there are any available items at all
      const hasAvailableItems = cartItemsDisplay.some((item) => {
        const isOutOfStock = item.websiteSoldQuantity === 0;
        const isQuantityExceedsStock = (item.websiteSoldQuantity || 0) < item.quantity;
        return !isOutOfStock && !isQuantityExceedsStock;
      });

      if (!hasAvailableItems) {
        setError("Không có sản phẩm nào có thể thanh toán. Vui lòng kiểm tra lại giỏ hàng hoặc đổi biến thể cho các sản phẩm hết hàng.");
        return;
      }

      // If no items selected, navigate to checkout with all available items
      // Only include items that are not out of stock and quantity doesn't exceed stock
      const allAvailableCartIds = cartItemsDisplay
        .filter((item) => {
          const isOutOfStock = item.websiteSoldQuantity === 0;
          const isQuantityExceedsStock = (item.websiteSoldQuantity || 0) < item.quantity;
          return !isOutOfStock && !isQuantityExceedsStock;
        })
        .map((item) => item.cartId)
        .filter((id): id is number => id !== undefined);

      if (allAvailableCartIds.length === 0) {
        setError("Không có sản phẩm nào có thể thanh toán. Vui lòng kiểm tra lại giỏ hàng.");
        return;
      }

      try {
        const selectedItemsData = await getSelectedCartItems({
          getAll: allAvailableCartIds
        });
        navigate("/shop/checkout", {
          state: { selectedCartItems: selectedItemsData }
        });
      } catch (err: any) {
        console.error("Error getting selected items:", err);
        setError(err?.response?.data?.message || "Không thể tải thông tin sản phẩm đã chọn");
      }
      return;
    }

    try {
      // Get selected cart items data
      const selectedItemsData = await getSelectedCartItems({
        getAll: selectedCartIds
      });

      // Navigate to checkout with selected items data
      navigate("/shop/checkout", {
        state: { selectedCartItems: selectedItemsData }
      });
    } catch (err: any) {
      console.error("Error getting selected items:", err);
      setError(err?.response?.data?.message || "Không thể tải thông tin sản phẩm đã chọn");
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
        cartCount={cartData.reduce((sum, item) => sum + item.quantity, 0)}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1">
        {/* Cart Content */}
        <section className="w-full bg-gray-50 py-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-2xl font-semibold text-[#E04D30] mb-6">
              Giỏ hàng của bạn
            </h1>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">Đang tải giỏ hàng...</p>
              </div>
            ) : cartItemsDisplay.length === 0 ? (
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
                onCheckout={handleCheckout}
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
