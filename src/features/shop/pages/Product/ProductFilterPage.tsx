import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import ProductCard from "../../../../components/shop/ProductCard";
import DropdownList from "../../../../components/shop/DropdownList";
import { productsData } from "../../data/productsData";
import { useCart } from "../../../../context/CartContext";
import { useAuth } from "../../../../context/AuthContext";

type SortOption = "popular" | "hot-deal" | "price-low-high" | "price-high-low";

const ProductFilterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const displayName = user?.name?.trim() || user?.username || "Thanh";
  const avatarUrl = user?.avatar || undefined;

  // Filter states
  const [activeFilter, setActiveFilter] = useState<string>("filter");
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedFeature, setSelectedFeature] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [newArrivalsOnly, setNewArrivalsOnly] = useState<boolean>(false);

  // Get category from URL
  const categoryId = searchParams.get("category");

  // Filter products by category from mock data
  const products = useMemo(() => {
    if (!categoryId) {
      // If no category, show all products
      return productsData;
    }

    const categoryIdNum = Number.parseInt(categoryId, 10);
    if (Number.isNaN(categoryIdNum)) {
      return productsData;
    }

    // Filter products by categoryId
    return productsData.filter(
      (product: { categoryId?: number }) => product.categoryId === categoryIdNum
    );
  }, [categoryId]);

  // Filter options for outdoor/climbing gear
  const sizeOptions = [
    { label: "Tất cả", value: "" },
    { label: "Nhỏ (S)", value: "small" },
    { label: "Vừa (M)", value: "medium" },
    { label: "Lớn (L)", value: "large" },
    { label: "Rất lớn (XL)", value: "xlarge" },
    { label: "Một size", value: "onesize" },
  ];

  const weightOptions = [
    { label: "Tất cả", value: "" },
    { label: "Dưới 500g", value: "under500" },
    { label: "500g - 1kg", value: "500-1000" },
    { label: "1kg - 2kg", value: "1000-2000" },
    { label: "2kg - 3kg", value: "2000-3000" },
    { label: "Trên 3kg", value: "over3000" },
  ];

  const materialOptions = [
    { label: "Tất cả", value: "" },
    { label: "Polyester", value: "polyester" },
    { label: "Nylon", value: "nylon" },
    { label: "Cotton", value: "cotton" },
    { label: "Gore-Tex", value: "goretex" },
    { label: "Leather", value: "leather" },
    { label: "Canvas", value: "canvas" },
  ];

  const activityOptions = [
    { label: "Tất cả", value: "" },
    { label: "Leo núi", value: "climbing" },
    { label: "Trekking", value: "trekking" },
    { label: "Camping", value: "camping" },
    { label: "Hiking", value: "hiking" },
    { label: "Đa năng", value: "multi" },
  ];

  const colorOptions = [
    { label: "Tất cả", value: "" },
    { label: "Đen", value: "black" },
    { label: "Xám", value: "gray" },
    { label: "Xanh dương", value: "blue" },
    { label: "Xanh lá", value: "green" },
    { label: "Đỏ", value: "red" },
    { label: "Cam", value: "orange" },
    { label: "Nâu", value: "brown" },
  ];

  const brandOptions = [
    { label: "Tất cả", value: "" },
    { label: "Naturehike", value: "naturehike" },
    { label: "The North Face", value: "northface" },
    { label: "Columbia", value: "columbia" },
    { label: "Patagonia", value: "patagonia" },
    { label: "Marmot", value: "marmot" },
    { label: "Khác", value: "other" },
  ];

  const featureOptions = [
    { label: "Tất cả", value: "" },
    { label: "Chống nước", value: "waterproof" },
    { label: "Chống gió", value: "windproof" },
    { label: "Thoáng khí", value: "breathable" },
    { label: "Chống UV", value: "uv-protection" },
    { label: "Nhẹ", value: "lightweight" },
    { label: "Gấp gọn", value: "compact" },
  ];

  const priceRangeOptions = [
    { label: "Tất cả", value: "" },
    { label: "Dưới 500k", value: "under500k" },
    { label: "500k - 1 triệu", value: "500k-1m" },
    { label: "1 - 2 triệu", value: "1m-2m" },
    { label: "2 - 5 triệu", value: "2m-5m" },
    { label: "Trên 5 triệu", value: "over5m" },
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply filters
    if (inStockOnly) {
      filtered = filtered.filter((p) => (p.stock || 0) > 0);
    }

    if (newArrivalsOnly) {
      // Filter new arrivals (products added in last 30 days)
      // For now, we'll just show all products since we don't have createdAt in mock data
      // In real app, filter by createdAt date
    }

    // Apply sorting
    switch (sortOption) {
      case "popular":
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      case "hot-deal":
        filtered.sort(
          (a, b) => (b.discountPercent || 0) - (a.discountPercent || 0)
        );
        break;
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [products, inStockOnly, newArrivalsOnly, sortOption]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        cartCount={getCartCount()}
        userName={displayName}
        avatarUrl={avatarUrl}
      />

      <div className="flex-1 w-full max-w-[1440px] mx-auto px-20 py-6">
        {/* Filter Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Chọn theo tiêu chí
          </h2>

          {/* Primary Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => setActiveFilter("filter")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === "filter"
                  ? "bg-red-50 text-red-600 border-2 border-red-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Bộ lọc
            </button>
            <button
              onClick={() => {
                setActiveFilter("stock");
                setInStockOnly(!inStockOnly);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inStockOnly
                  ? "bg-red-50 text-red-600 border-2 border-red-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Sẵn hàng
            </button>
            <button
              onClick={() => {
                setActiveFilter("new");
                setNewArrivalsOnly(!newArrivalsOnly);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                newArrivalsOnly
                  ? "bg-red-50 text-red-600 border-2 border-red-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Hàng mới về
            </button>
            <button
              onClick={() => setActiveFilter("price")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === "price"
                  ? "bg-red-50 text-red-600 border-2 border-red-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Xem theo giá
            </button>
          </div>

          {/* Dropdown Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <DropdownList
              options={sizeOptions}
              value={selectedSize}
              onChange={setSelectedSize}
              placeholder="Kích thước"
              className="w-full"
            />
            <DropdownList
              options={weightOptions}
              value={selectedWeight}
              onChange={setSelectedWeight}
              placeholder="Trọng lượng"
              className="w-full"
            />
            <DropdownList
              options={materialOptions}
              value={selectedMaterial}
              onChange={setSelectedMaterial}
              placeholder="Chất liệu"
              className="w-full"
            />
            <DropdownList
              options={activityOptions}
              value={selectedActivity}
              onChange={setSelectedActivity}
              placeholder="Hoạt động"
              className="w-full"
            />
            <DropdownList
              options={colorOptions}
              value={selectedColor}
              onChange={setSelectedColor}
              placeholder="Màu sắc"
              className="w-full"
            />
            <DropdownList
              options={brandOptions}
              value={selectedBrand}
              onChange={setSelectedBrand}
              placeholder="Thương hiệu"
              className="w-full"
            />
            <DropdownList
              options={featureOptions}
              value={selectedFeature}
              onChange={setSelectedFeature}
              placeholder="Tính năng"
              className="w-full"
            />
            <DropdownList
              options={priceRangeOptions}
              value={selectedPriceRange}
              onChange={setSelectedPriceRange}
              placeholder="Khoảng giá"
              className="w-full"
            />
          </div>
        </div>

        {/* Sort Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sắp xếp theo
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSortOption("popular")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortOption === "popular"
                  ? "bg-blue-50 text-blue-600 border-2 border-blue-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Phổ biến
            </button>
            <button
              onClick={() => setSortOption("hot-deal")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortOption === "hot-deal"
                  ? "bg-blue-50 text-blue-600 border-2 border-blue-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Khuyến mãi HOT
            </button>
            <button
              onClick={() => setSortOption("price-low-high")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortOption === "price-low-high"
                  ? "bg-blue-50 text-blue-600 border-2 border-blue-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Giá Thấp - Cao
            </button>
            <button
              onClick={() => setSortOption("price-high-low")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortOption === "price-high-low"
                  ? "bg-blue-50 text-blue-600 border-2 border-blue-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Giá Cao - Thấp
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Không tìm thấy sản phẩm nào
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductFilterPage;
