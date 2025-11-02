import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import ProductCard from "../../../../components/shop/ProductCard";
import CategoryTabMenu from "../../../../components/shop/CategoryTabMenu";
import Button from "../../../../components/shop/Button";
import mainBanner from "../../../../assets/images/banner/main-page-banner.png";
import subBanner from "../../../../assets/images/banner/sub-banner.png";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
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

  // Flash sale products data
  const flashSaleProducts = [
    {
      id: 101,
      imageUrl: "https://via.placeholder.com/300x245?text=Flash+Sale+1",
      name: "Lều trại 4 người siêu giảm giá",
      price: 1890000,
      originalPrice: 3200000,
      rating: 4.9,
      discountPercent: 41,
    },
    {
      id: 102,
      imageUrl: "https://via.placeholder.com/300x245?text=Flash+Sale+2",
      name: "Bếp nướng BBQ đa năng",
      price: 650000,
      originalPrice: 1200000,
      rating: 4.7,
      discountPercent: 46,
    },
    {
      id: 103,
      imageUrl: "https://via.placeholder.com/300x245?text=Flash+Sale+3",
      name: "Túi ngủ 3 mùa cao cấp",
      price: 990000,
      originalPrice: 1800000,
      rating: 4.8,
      discountPercent: 45,
    },
    {
      id: 104,
      imageUrl: "https://via.placeholder.com/300x245?text=Flash+Sale+4",
      name: "Ba lô du lịch 50L chống thấm",
      price: 1290000,
      originalPrice: 2200000,
      rating: 4.6,
      discountPercent: 41,
    },
    {
      id: 105,
      imageUrl: "https://via.placeholder.com/300x245?text=Flash+Sale+5",
      name: "Bộ đồ nấu ăn du lịch 8 món",
      price: 450000,
      originalPrice: 850000,
      rating: 4.5,
      discountPercent: 47,
    },
  ];

  // Sample products data
  const featuredProducts = [
    {
      id: 1,
      imageUrl: "https://via.placeholder.com/300x245?text=Product+1",
      name: "Lều trại 2 người chống thấm nước",
      price: 1290000,
      originalPrice: 1590000,
      rating: 4.5,
      discountPercent: 19,
    },
    {
      id: 2,
      imageUrl: "https://via.placeholder.com/300x245?text=Product+2",
      name: "Túi ngủ mùa đông giữ nhiệt",
      price: 890000,
      originalPrice: 1200000,
      rating: 4.8,
      discountPercent: 26,
    },
    {
      id: 3,
      imageUrl: "https://via.placeholder.com/300x245?text=Product+3",
      name: "Bếp gas du lịch mini",
      price: 450000,
      originalPrice: 650000,
      rating: 4.3,
      discountPercent: 31,
    },
    {
      id: 4,
      imageUrl: "https://via.placeholder.com/300x245?text=Product+4",
      name: "Ba lô trekking 30L",
      price: 950000,
      originalPrice: 1150000,
      rating: 4.6,
      discountPercent: 17,
    },
    {
      id: 5,
      imageUrl: "https://via.placeholder.com/300x245?text=Product+5",
      name: "Áo khoác gió chống nước",
      price: 750000,
      originalPrice: 950000,
      rating: 4.7,
      discountPercent: 21,
    },
    {
      id: 6,
      imageUrl: "https://via.placeholder.com/300x245?text=Product+6",
      name: "Ghế xếp du lịch nhẹ",
      price: 320000,
      originalPrice: 450000,
      rating: 4.4,
      discountPercent: 29,
    },
    {
      id: 7,
      imageUrl: "https://via.placeholder.com/300x245?text=Product+7",
      name: "Đèn pin siêu sáng LED",
      price: 280000,
      originalPrice: 380000,
      rating: 4.2,
      discountPercent: 26,
    },
    {
      id: 8,
      imageUrl: "https://via.placeholder.com/300x245?text=Product+8",
      name: "Bộ dụng cụ đa năng",
      price: 180000,
      originalPrice: 250000,
      rating: 4.5,
      discountPercent: 28,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        cartCount={0}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Banner Section */}
      <section className="w-full relative">
        <img
          src={mainBanner}
          alt="Wanderoo Banner"
          className="w-full h-auto object-cover"
        />
      </section>

      {/* Category Filter Section */}
      <section className="w-full bg-white py-6 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4">
          <CategoryTabMenu categories={categories} className="justify-center" />
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="w-full bg-gray-100 py-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-[32px] font-bold text-red-600 uppercase flex items-center gap-1">
                F
                <svg
                  width="28"
                  height="32"
                  viewBox="0 0 24 32"
                  fill="none"
                  className="text-red-600"
                >
                  <path
                    d="M13.5 2L3.5 14h7l-1 16 10-12h-7l1-16z"
                    fill="currentColor"
                  />
                </svg>
                ASH SALE
              </h2>
            </div>

            <div className="relative">
              {/* Product Cards Carousel */}
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {flashSaleProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[240px]">
                    <ProductCard
                      id={product.id}
                      imageUrl={product.imageUrl}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      rating={product.rating}
                      discountPercent={product.discountPercent}
                      onClick={() => navigate(`/shop/products/${product.id}`)}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrow Button */}
              <Button
                variant="icon"
                size="md"
                shape="pill"
                className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 shadow-lg z-10 bg-white hover:bg-gray-50"
                aria-label="Xem thêm sản phẩm flash sale"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-700"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full bg-gray-50 py-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-block">
                <h2 className="text-[32px] font-bold text-gray-900">
                  Sản phẩm nổi bật
                </h2>
              </div>
            </div>
            <a
              href="#"
              className="text-blue-600 text-[16px] font-medium hover:text-blue-700 transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                console.log("See all featured products");
              }}
            >
              Xem tất cả &gt;&gt;
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.imageUrl}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating}
                discountPercent={product.discountPercent}
                onClick={() => navigate(`/shop/products/${product.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sub Banner Section */}
      <section className="w-full bg-white py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <img
            src={subBanner}
            alt="Wanderoo Sub Banner"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Additional Products Section */}
      <section className="w-full bg-white py-10">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-block">
                <h2 className="text-[32px] font-bold text-gray-900">
                  Sản phẩm mới nhất
                </h2>
              </div>
            </div>
            <a
              href="#"
              className="text-blue-600 text-[16px] font-medium hover:text-blue-700 transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                console.log("See all new products");
              }}
            >
              Xem tất cả &gt;&gt;
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                imageUrl={product.imageUrl}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating}
                discountPercent={product.discountPercent}
                onClick={() => navigate(`/shop/products/${product.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* See More Button Section */}
      <section className="w-full bg-white py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="lg"
              shape="rounded"
              className="px-8"
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
