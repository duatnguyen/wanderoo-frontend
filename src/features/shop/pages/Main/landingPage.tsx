import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import CategoryTabMenu from "../../../../components/shop/CategoryTabMenu";
import Button from "../../../../components/shop/Button";
import { useCart } from "../../../../context/CartContext";
import { useAuthCtx } from "../../../../app/providers/AuthProvider";
import BannerSection from "../../../../components/shop/Main/BannerSection";
import FlashSaleSection from "../../../../components/shop/Main/FlashSaleSection";
import FeaturedProductsSection from "../../../../components/shop/Main/FeaturedProductsSection";
import SubBannerSection from "../../../../components/shop/Main/SubBannerSection";
import NewProductsSection from "../../../../components/shop/Main/NewProductsSection";
import GroupBannerSection from "../../../../components/shop/Main/GroupBannerSection";
import TodaySuggestionsSection from "../../../../components/shop/Main/TodaySuggestionsSection";
import {
  getTopDiscountProducts,
  getBestSellerProducts,
  getNewestProducts,
  getSuggestionProducts,
  type HomepageProductResponse,
} from "../../../../api/endpoints/homepageApi";
import type { Product } from "../../data/productsData";

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

  // Fetch homepage products from API
  const { data: topDiscountProducts = [] } = useQuery({
    queryKey: ["homepageTopDiscount"],
    queryFn: () => getTopDiscountProducts(5),
  });

  const currentYear = new Date().getFullYear();
  const { data: bestSellerProducts = [] } = useQuery({
    queryKey: ["homepageBestSeller", currentYear],
    queryFn: () => getBestSellerProducts(currentYear, 5),
  });

  const { data: newestProducts = [] } = useQuery({
    queryKey: ["homepageNewest"],
    queryFn: () => getNewestProducts(5),
  });

  const { data: suggestionProducts = [] } = useQuery({
    queryKey: ["homepageSuggestions"],
    queryFn: () => getSuggestionProducts(15),
  });

  // Convert HomepageProductResponse to Product format for components
  const convertToProduct = (item: HomepageProductResponse): Product => {
    const salePrice = item.salePrice ?? 0;
    const originalPrice = item.originalPrice ?? salePrice;
    return {
      id: item.productId?.toString?.() || `${Math.random()}`,
      name: item.name,
      imageUrl: item.image || "",
      price: salePrice,
      originalPrice,
      discountPercent:
        typeof item.discountPercent === "number"
          ? Math.round(item.discountPercent)
          : undefined,
      rating: 0, // API doesn't return rating yet
      stock: 0,
      category: "",
      brand: "",
      reviews: 0,
    };
  };

  const flashSaleProducts = topDiscountProducts.map(convertToProduct);
  const featuredProducts = bestSellerProducts.map(convertToProduct);
  const newProducts = newestProducts.map(convertToProduct);
  const todaySuggestions = suggestionProducts.map(convertToProduct);

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
          <CategoryTabMenu categories={categories} />
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
