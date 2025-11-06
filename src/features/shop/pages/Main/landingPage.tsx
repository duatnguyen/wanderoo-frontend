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
import TodaySuggestionsSection from "../../../../components/shop/Main/TodaySuggestionsSection";

const LandingPage: React.FC = () => {
  const { getCartCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sample categories data
  const categories = [
    {
      id: "all",
      label: "Tất cả",
      subcategories: [],
    },
    {
      id: "camping",
      label: "Đồ cắm trại",
      subcategories: [
        { id: "tents", label: "Lều trại" },
        { id: "sleeping", label: "Đồ ngủ" },
        { id: "cooking", label: "Đồ nấu ăn" },
      ],
    },
    {
      id: "outdoor",
      label: "Thể thao ngoài trời",
      subcategories: [
        { id: "hiking", label: "Đồ leo núi" },
        { id: "water", label: "Đồ dùng dưới nước" },
      ],
    },
    {
      id: "accessories",
      label: "Phụ kiện",
      subcategories: [
        { id: "backpacks", label: "Ba lô" },
        { id: "tools", label: "Dụng cụ" },
      ],
    },
  ];

  // Flash sale products - products with high discount (41% and above)
  const flashSaleProducts = productsData.filter(
    (product) => (product.discountPercent || 0) >= 41
  );

  // Featured products - first 8 products
  const featuredProducts = productsData.slice(0, 8);

  // Today's suggestions - next 8 products (to show variety)
  const todaySuggestions = productsData.slice(8, 16);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
