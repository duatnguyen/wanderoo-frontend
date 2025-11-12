import React, { useState } from "react";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import CategoryTabMenu from "../../../../components/shop/CategoryTabMenu";
import Button from "../../../../components/shop/Button";
import { productsData } from "../../data/productsData";
import { useCart } from "../../../../context/CartContext";
import { useAuthCtx } from "../../../../app/providers/AuthProvider";
import BannerSection from "../../../../components/shop/Main/BannerSection";
import FlashSaleSection from "../../../../components/shop/Main/FlashSaleSection";
import FeaturedProductsSection from "../../../../components/shop/Main/FeaturedProductsSection";
import SubBannerSection from "../../../../components/shop/Main/SubBannerSection";
import NewProductsSection from "../../../../components/shop/Main/NewProductsSection";
import GroupBannerSection from "../../../../components/shop/Main/GroupBannerSection";
import TodaySuggestionsSection from "../../../../components/shop/Main/TodaySuggestionsSection";

const LandingPage: React.FC = () => {
  const { getCartCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { state } = useAuthCtx();
  const { user } = state;

  // Sample categories data
  const categories = [
    {
      id: "tent",
      label: "Lều cắm trại",
      subcategories: [],
    },
    {
      id: "shoes",
      label: "Giày",
      subcategories: [],
    },
    {
      id: "sandals",
      label: "Dép Sandal",
      subcategories: [],
    },
    {
      id: "chair",
      label: "Ghế gấp gọn",
      subcategories: [],
    },
    {
      id: "hat",
      label: "Mũ leo núi",
      subcategories: [],
    },
    {
      id: "backpack",
      label: "Balo leo núi",
      subcategories: [],
    },
    {
      id: "sleeping-bag",
      label: "Túi ngủ",
      subcategories: [],
    },
  ];

  // Flash sale products - products with high discount (35% and above) - take first 6
  const flashSaleProducts = productsData
    .filter((product) => (product.discountPercent || 0) >= 35)
    .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0))
    .slice(0, 6);

  // Featured products - first 6 products (best sellers)
  const featuredProducts = productsData.slice(0, 6);

  // New products - next 6 products
  const newProducts = productsData.slice(6, 12);

  // Today's suggestions - 18 products (3 rows x 6 columns)
  // Take products starting from index 12, or from beginning if not enough
  const remainingProducts = productsData.slice(12);
  const todaySuggestions = remainingProducts.length >= 18 
    ? remainingProducts.slice(0, 18)
    : [...remainingProducts, ...productsData.slice(0, 18 - remainingProducts.length)];

  return (
    <div className="min-h-screen bg-white justify-center flex flex-col">
      <Header
        cartCount={getCartCount()}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        userName={user?.name || "Thanh"}
        avatarUrl={user?.avatar}
      />

      <BannerSection />

      <FlashSaleSection products={flashSaleProducts} />

      {/* Category Filter Section */}
      <section className="w-full bg-white pt-4 pb-2">
        <div className="max-w-[1200px] mx-auto px-4">
          <CategoryTabMenu categories={categories} className="justify-center" />
        </div>
      </section>

      <FeaturedProductsSection products={featuredProducts} />

      <SubBannerSection />

      <NewProductsSection products={newProducts} />

      <GroupBannerSection />

      <TodaySuggestionsSection products={todaySuggestions} />

      {/* See More Button Section */}
      <section className="w-full bg-white pt-2 pb-6">
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="md"
              shape="rounded"
              className="px-6 py-3"
              onClick={() => console.log("See more all products")}
            >
              Xem thêm
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
