import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import Button from "../../../../components/shop/Button";
import { useCart } from "../../../../context/CartContext";
import { useAuth } from "../../../../context/AuthContext";
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name?.trim() || user?.username || "Thanh";
  const avatarUrl = user?.avatar || undefined;
  const queryClient = useQueryClient();
  
  // Clear old cache for newest products
  React.useEffect(() => {
    queryClient.removeQueries({ queryKey: ["homepageNewest"] });
  }, [queryClient]);


  // Fetch homepage products from API
  const { data: topDiscountProducts = [] } = useQuery({
    queryKey: ["homepageTopDiscount"],
    queryFn: () => getTopDiscountProducts(12),
  });

  const currentYear = new Date().getFullYear();
  const { data: bestSellerProducts = [] } = useQuery({
    queryKey: ["homepageBestSeller", currentYear, "limit-6"],
    queryFn: async () => {
      const limitValue = 6; // Explicitly set limit to 6
      console.log("=== FETCHING BEST SELLER PRODUCTS ===");
      console.log("Calling getBestSellerProducts with limit:", limitValue);
      const result = await getBestSellerProducts(currentYear, limitValue);
      console.log("=== FETCHED BEST SELLER RESULT ===", result.length, "products");
      if (result.length !== limitValue) {
        console.warn("⚠️ WARNING: Expected 6 products but got", result.length);
      }
      return result;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const { data: newestProducts = [] } = useQuery<HomepageProductResponse[]>({
    queryKey: ["homepageNewest", "limit-6"],
    queryFn: async () => {
      const limitValue = 6; // Explicitly set limit
      console.log("=== FETCHING NEWEST PRODUCTS ===");
      console.log("Calling getNewestProducts with limit:", limitValue);
      const result = await getNewestProducts(limitValue);
      console.log("=== FETCHED RESULT ===", result.length, "products");
      console.log("=== FETCHED RESULT DETAILS ===", result);
      if (result.length !== 6) {
        console.warn("⚠️ WARNING: Expected 6 products but got", result.length);
      }
      return result;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
  
  // Debug log - Always log để kiểm tra
  React.useEffect(() => {
    console.log("=== DEBUG Newest Products ===");
    console.log("Newest products count from API:", newestProducts.length);
    console.log("Newest products data:", newestProducts);
  }, [newestProducts]);

  const { data: suggestionProducts = [] } = useQuery({
    queryKey: ["homepageSuggestions"],
    queryFn: () => getSuggestionProducts(12),
  });

  // Helper function to format discount value for display (shared with ProductCard)
  // API returns: "-35%" or "-1000đ" or "35%" or "1000đ"
  // Display format: "-35%" or "-1.000đ" (with thousand separator for VND)
  const formatDiscountValue = (discountValue: string | null | undefined): string | undefined => {
    if (!discountValue) return undefined;
    const discountStr = discountValue.toString().trim();
    
    // Check if it's a percentage (contains "%")
    if (discountStr.includes("%")) {
      // For percentage, just ensure it starts with "-"
      if (discountStr.startsWith("-")) {
        return discountStr;
      }
      return `-${discountStr}`;
    }
    
    // For VND amount (contains "đ" or "Đ")
    if (discountStr.includes("đ") || discountStr.includes("Đ")) {
      // Extract ALL digits (remove all non-digit characters except minus sign)
      const cleaned = discountStr.replace(/[^\d-]/g, "");
      const numberMatch = cleaned.match(/(-?\d+)/);
      if (numberMatch) {
        const numberStr = numberMatch[1];
        const number = Math.abs(parseInt(numberStr, 10)); // Get absolute value
        // Format number with thousand separator (.)
        const formattedNumber = number.toLocaleString("vi-VN");
        // Determine if original had "-" prefix
        const hasMinus = discountStr.startsWith("-") || numberStr.startsWith("-");
        // Get the currency symbol (đ or Đ) - preserve original case
        const currencySymbol = discountStr.includes("Đ") ? "Đ" : "đ";
        return hasMinus ? `-${formattedNumber}${currencySymbol}` : `-${formattedNumber}${currencySymbol}`;
      }
    }
    
    // If it's just a number without currency, assume it's percentage
    const numberMatch = discountStr.match(/(-?\d+)/);
    if (numberMatch) {
      const hasMinus = discountStr.startsWith("-");
      return hasMinus ? `${discountStr}%` : `-${discountStr}%`;
    }
    
    // Fallback: ensure it starts with "-"
    if (discountStr.startsWith("-")) {
      return discountStr;
    }
    return `-${discountStr}`;
  };

  // Convert HomepageProductResponse to Product format for components
  // Logic giống ProductCategoryListing: tính display price và discount
  // Sử dụng minSellingPrice, discountSellingPrice, discountValue (giống ProductCategoryItemResponse)
  const convertToProduct = (item: HomepageProductResponse): Product => {
    // Sử dụng logic giống ProductCategoryListing nếu có đầy đủ thông tin
    if (item.minSellingPrice !== null && item.minSellingPrice !== undefined) {
      // Logic giống ProductCategoryListing
      const hasDiscount =
        item.discountSellingPrice !== null &&
        item.discountSellingPrice !== undefined &&
        item.discountSellingPrice > 0 &&
        item.discountSellingPrice < item.minSellingPrice;

      const displayPrice = hasDiscount
        ? item.discountSellingPrice || item.minSellingPrice
        : item.minSellingPrice;

      const originalPrice = hasDiscount ? item.minSellingPrice : undefined;
      
      // Parse discountPercent từ discountValue string (giống ProductCategoryListing)
      let discountPercent: number | undefined = undefined;
      if (hasDiscount && item.discountValue) {
        const match = item.discountValue.match(/(\d+(?:\.\d+)?)/);
        if (match) {
          discountPercent = Math.round(Number(match[1]));
        }
      }

      return {
        id: item.productId?.toString?.() || `${Math.random()}`,
        name: item.name,
        imageUrl: item.image || "",
        price: displayPrice,
        originalPrice: originalPrice,
        discountPercent, // Keep for backward compatibility
        discountValue: item.discountValue ? formatDiscountValue(item.discountValue) : undefined, // New field for formatted display
        rating: item.rating ?? 0,
        stock: 0,
        category: "",
        brand: "",
        reviews: 0,
      };
    }
    
    // Fallback cho các API khác (backward compatibility)
    const salePrice = item.salePrice ?? 0;
    const originalPrice = item.originalPrice ?? salePrice;
    
    const hasDiscount = 
      item.discountPercent !== null &&
      item.discountPercent !== undefined &&
      item.discountPercent > 0 &&
      salePrice > 0 &&
      originalPrice > 0 &&
      salePrice < originalPrice;
    
    const displayPrice = hasDiscount ? salePrice : (salePrice > 0 ? salePrice : originalPrice);
    const displayOriginalPrice = hasDiscount ? originalPrice : undefined;
    const discountPercent = hasDiscount && typeof item.discountPercent === "number"
      ? Math.round(item.discountPercent)
      : undefined;
    
    return {
      id: item.productId?.toString?.() || `${Math.random()}`,
      name: item.name,
      imageUrl: item.image || "",
      price: displayPrice,
      originalPrice: displayOriginalPrice,
      discountPercent, // Keep for backward compatibility
      discountValue: item.discountValue ? formatDiscountValue(item.discountValue) : undefined, // New field for formatted display
      rating: item.rating ?? 0,
      stock: 0,
      category: "",
      brand: "",
      reviews: 0,
    };
  };

  const flashSaleProducts = topDiscountProducts.map(convertToProduct).filter(Boolean);
  const featuredProducts = bestSellerProducts
    .map(convertToProduct)
    .filter((p): p is Product => !!p && !!p.id && !!p.name)
    .slice(0, 6); // Ensure exactly 6 products
  const newProducts = newestProducts
    .map(convertToProduct)
    .filter((p): p is Product => !!p && !!p.id && !!p.name)
    .slice(0, 6); // Ensure exactly 6 products
  const todaySuggestions = suggestionProducts.map(convertToProduct).filter(Boolean);
  
  // Debug log for products - Always log
  React.useEffect(() => {
    console.log("=== DEBUG Converted Products ===");
    console.log("bestSellerProducts from API:", bestSellerProducts.length, bestSellerProducts);
    console.log("featuredProducts after convert and filter:", featuredProducts.length, featuredProducts);
    console.log("newestProducts from API:", newestProducts.length, newestProducts);
    console.log("newProducts after convert and filter:", newProducts.length, newProducts);
    console.log("featuredProducts details:", featuredProducts.map((p, idx) => ({ 
      index: idx,
      id: p.id, 
      name: p.name, 
      price: p.price,
      isValid: !!p && !!p.id && !!p.name
    })));
    console.log("newProducts details:", newProducts.map((p, idx) => ({ 
      index: idx,
      id: p.id, 
      name: p.name, 
      price: p.price,
      isValid: !!p && !!p.id && !!p.name
    })));
    if (newProducts.length !== 6) {
      console.warn("⚠️ WARNING: newProducts should have 6 items but has", newProducts.length);
    }
  }, [newestProducts, newProducts]);

  return (
    <div className="min-h-screen bg-white justify-center flex flex-col">
      <Header
        cartCount={getCartCount()}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        userName={displayName}
        avatarUrl={avatarUrl}
      />

      <BannerSection />

      <FlashSaleSection products={flashSaleProducts} />

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
              onClick={() => navigate("/shop/products/all")}
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
