import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import ProductCard from "../../../../components/shop/ProductCard";
import CategoryTabMenu from "../../../../components/shop/CategoryTabMenu";
import Button from "../../../../components/shop/Button";
import { productsData } from "../../data/productsData";
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

  // Flash sale products - products with high discount (41% and above)
  const flashSaleProducts = productsData.filter(
    (product) => (product.discountPercent || 0) >= 41
  );

  // Featured products - first 8 products
  const featuredProducts = productsData.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
      <section className="w-full bg-white py-4 border-b border-gray-200">
        <div className="max-w-[1000px] mx-auto px-4">
          <CategoryTabMenu categories={categories} className="justify-center" />
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="w-full bg-gray-100 py-6">
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-red-600 uppercase flex items-center gap-1">
                F
                <svg
                  width="24"
                  height="28"
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
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {flashSaleProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[200px]">
                    <ProductCard
                      id={product.id}
                      imageUrl={product.imageUrl}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      rating={product.rating}
                      discountPercent={product.discountPercent}
                      product={product}
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
      <section className="w-full bg-gray-50 py-6">
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-block">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sản phẩm nổi bật
                </h2>
              </div>
            </div>
            <a
              href="#"
              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                console.log("See all featured products");
              }}
            >
              Xem tất cả &gt;&gt;
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sub Banner Section */}
      <section className="w-full bg-white py-6">
        <div className="max-w-[1000px] mx-auto px-4">
          <img
            src={subBanner}
            alt="Wanderoo Sub Banner"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Additional Products Section */}
      <section className="w-full bg-white py-6">
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-block">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sản phẩm mới nhất
                </h2>
              </div>
            </div>
            <a
              href="#"
              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                console.log("See all new products");
              }}
            >
              Xem tất cả &gt;&gt;
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

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
