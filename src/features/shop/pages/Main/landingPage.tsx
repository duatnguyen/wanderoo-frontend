import React, { useState } from "react";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import CategoryTabMenu from "../../../../components/shop/CategoryTabMenu";
import Button from "../../../../components/shop/Button";
import { productsData } from "../../data/productsData";
import { useCart } from "../../../../context/CartContext";
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

  // Flash sale products - products with high discount (41% and above)
  const flashSaleProducts = productsData.filter(
    (product) => (product.discountPercent || 0) >= 41
  );

  // Featured products - first 5 products (best sellers)
  const featuredProducts = productsData.slice(0, 5);

  // New products - next 5 products
  const newProducts = productsData.slice(5, 10);

  // Today's suggestions - 10 products in 2 rows (5 products per row)
  const todaySuggestions = productsData.slice(10, 20);

  return (
    <div className="min-h-screen bg-white justify-center flex flex-col">
      <Header
        cartCount={getCartCount()}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <BannerSection />

      {/* Category Filter Section */}
      <section className="w-full bg-white py-4 border-b border-gray-200">
        <div className="max-w-[1000px] mx-auto px-4">
          <CategoryTabMenu categories={categories} className="justify-center" />
        </div>
      </section>

      <FlashSaleSection products={flashSaleProducts} />

      <FeaturedProductsSection products={featuredProducts} />

      <SubBannerSection />

      <NewProductsSection products={newProducts} />

      <GroupBannerSection />

      <TodaySuggestionsSection products={todaySuggestions} />

      {/* See More Button Section */}
      <section className="w-full bg-white py-6">
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="md"
              shape="rounded"
              className="px-6"
              onClick={() => console.log("See more all products")}
            >
              Xem thêm sản phẩm
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
