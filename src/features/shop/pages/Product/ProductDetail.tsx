import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import ProductCard from "../../components/ProductCard";

function formatCurrencyVND(value: number) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("vi-VN")}đ`;
  }
}

const Star: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <svg
    viewBox="0 0 20 20"
    width="20"
    height="20"
    className={filled ? "text-yellow-400" : "text-gray-300"}
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
  </svg>
);

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  // Sample product data - in real app, fetch from API using productId
  const product = {
    id: productId || "1",
    name: "Lều trại 2 người chống thấm nước cao cấp",
    price: 1290000,
    originalPrice: 1590000,
    rating: 4.5,
    discountPercent: 19,
    description: `Lều trại 2 người chống thấm nước cao cấp với công nghệ hiện đại, phù hợp cho các chuyến đi camping và trekking.

Đặc điểm nổi bật:
- Chống thấm nước 3000mm, đảm bảo khô ráo trong mọi điều kiện thời tiết
- Chất liệu vải PU cao cấp, bền bỉ và nhẹ
- Khung lều bằng thép không gỉ, chắc chắn
- Thiết kế 2 lớp với lưới chống côn trùng
- Dễ dàng lắp đặt trong 5 phút
- Kích thước: 210cm x 140cm x 110cm
- Trọng lượng: 2.5kg

Phù hợp cho các hoạt động: Camping, trekking, dã ngoại, cắm trại gia đình`,
    images: [
      "https://via.placeholder.com/600x600?text=Product+Image+1",
      "https://via.placeholder.com/600x600?text=Product+Image+2",
      "https://via.placeholder.com/600x600?text=Product+Image+3",
      "https://via.placeholder.com/600x600?text=Product+Image+4",
    ],
    stock: 25,
    category: "Đồ cắm trại",
    brand: "Naturehike",
    reviews: 128,
  };

  // Related products
  const relatedProducts = [
    {
      id: 2,
      imageUrl: "https://via.placeholder.com/300x245?text=Related+1",
      name: "Túi ngủ mùa đông giữ nhiệt",
      price: 890000,
      originalPrice: 1200000,
      rating: 4.8,
      discountPercent: 26,
    },
    {
      id: 3,
      imageUrl: "https://via.placeholder.com/300x245?text=Related+2",
      name: "Bếp gas du lịch mini",
      price: 450000,
      originalPrice: 650000,
      rating: 4.3,
      discountPercent: 31,
    },
    {
      id: 4,
      imageUrl: "https://via.placeholder.com/300x245?text=Related+3",
      name: "Ba lô trekking 30L",
      price: 950000,
      originalPrice: 1150000,
      rating: 4.6,
      discountPercent: 17,
    },
    {
      id: 5,
      imageUrl: "https://via.placeholder.com/300x245?text=Related+4",
      name: "Áo khoác gió chống nước",
      price: 750000,
      originalPrice: 950000,
      rating: 4.7,
      discountPercent: 21,
    },
  ];

  const stars = Array.from(
    { length: 5 },
    (_, i) => i < Math.round(product.rating)
  );

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", { productId: product.id, quantity });
    // Add to cart logic here
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        cartCount={0}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="w-full bg-gray-50 border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button
                onClick={() => navigate("/shop")}
                className="hover:text-[#18345c] transition-colors"
              >
                Trang chủ
              </button>
              <span>/</span>
              <span>{product.category}</span>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>
          </div>
        </section>

        {/* Product Detail Section */}
        <section className="w-full bg-white py-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.discountPercent && (
                    <div className="absolute right-2 top-2 bg-[#ffe8a3] text-red-600 font-semibold text-[16px] rounded-[4px] px-3 py-1 flex items-center gap-1">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-red-600"
                      >
                        <path
                          d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
                          fill="currentColor"
                        />
                      </svg>
                      -{product.discountPercent}%
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-[#18345c]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">
                      {product.brand}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-500">
                      {product.category}
                    </span>
                  </div>
                  <h1 className="text-[32px] font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {stars.map((filled, idx) => (
                        <Star key={idx} filled={filled} />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      ({product.reviews} đánh giá)
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-[32px] font-bold text-[#18345c]">
                      {formatCurrencyVND(product.price)}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-[20px] text-gray-400 line-through">
                          {formatCurrencyVND(product.originalPrice)}
                        </span>
                        <span className="text-red-600 font-semibold">
                          Tiết kiệm{" "}
                          {formatCurrencyVND(
                            product.originalPrice - product.price
                          )}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-gray-700 font-medium">
                        Số lượng:
                      </span>
                      <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          disabled={quantity <= 1}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                        <span className="w-12 text-center font-semibold">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          disabled={quantity >= product.stock}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-sm text-gray-500 ml-4">
                        Còn lại: {product.stock} sản phẩm
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="primary"
                      size="lg"
                      shape="rounded"
                      className="flex-1"
                      onClick={handleAddToCart}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      shape="rounded"
                      className="flex-1"
                      onClick={() => console.log("Buy now")}
                    >
                      Mua ngay
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-[24px] font-bold text-gray-900 mb-4">
                Mô tả sản phẩm
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="w-full bg-white py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-[32px] font-bold text-gray-900 mb-8">
              ĐÁNH GIÁ SẢN PHẨM
            </h2>

            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              {/* Overall Rating */}
              <div className="flex items-center gap-4">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 20 20"
                  className="text-yellow-400"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
                <div>
                  <div className="text-[48px] font-bold text-gray-900">4.8</div>
                  <div className="text-[16px] text-gray-500">
                    428 Lượt đánh giá
                  </div>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                      activeFilter === "all"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button className="px-4 py-2 rounded-lg text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                    5 sao (25)
                  </button>
                  <button className="px-4 py-2 rounded-lg text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                    4 sao (3)
                  </button>
                  <button className="px-4 py-2 rounded-lg text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                    3 sao (2)
                  </button>
                  <button className="px-4 py-2 rounded-lg text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                    2 sao (0)
                  </button>
                  <button className="px-4 py-2 rounded-lg text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                    1 sao (0)
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 rounded-lg text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                    Có bình luận
                  </button>
                  <button className="px-4 py-2 rounded-lg text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                    Có hình ảnh/ Video
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {/* Review 1 */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-start gap-4">
                  <img
                    src="https://via.placeholder.com/50x50?text=Linh"
                    alt="Linh"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900">Linh</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} filled={true} />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      11/08/2025 | Phân loại hàng: Size 37
                    </div>
                    <p className="text-gray-700 mb-3">
                      Sản phẩm tốt. Chuẩn chính hãng. Giao hàng nhanh. Sẽ ủng hộ
                      thêm nếu có cơ hội
                    </p>
                    <div className="flex gap-2">
                      <img
                        src="https://via.placeholder.com/80x80?text=Boot1"
                        alt="Review image 1"
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                      />
                      <img
                        src="https://via.placeholder.com/80x80?text=Boot2"
                        alt="Review image 2"
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                      />
                      <img
                        src="https://via.placeholder.com/80x80?text=Boot3"
                        alt="Review image 3"
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-start gap-4">
                  <img
                    src="https://via.placeholder.com/50x50?text=Nguyen+Du"
                    alt="Nguyễn Du"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900">Nguyễn Du</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} filled={true} />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      11/08/2025 | Phân loại hàng: Size 37
                    </div>
                    <p className="text-gray-700">
                      Ok đẹp lắm nha nma mình thấy màu đen với cái để nâu hơi
                      đấm nhau xíu còn lại rất ok, vẫn là cho shop 5 sao nha
                    </p>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-start gap-4">
                  <img
                    src="https://via.placeholder.com/50x50?text=Thanh"
                    alt="Thanh"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900">Thanh</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} filled={true} />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      11/08/2025 | Phân loại hàng: Size 37
                    </div>
                    <p className="text-gray-700">
                      Sản phẩm tốt. Chuẩn chính hãng. Giao hàng nhanh. Sẽ ủng hộ
                      thêm nếu có cơ hội
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className="text-gray-700">Trang hiện tại</span>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              <button
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                disabled
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        <section className="w-full bg-gray-50 py-10">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex-1">
                <div className="inline-block">
                  <h2 className="text-[32px] font-bold text-gray-900">
                    Sản phẩm liên quan
                  </h2>
                </div>
              </div>
              <a
                href="#"
                className="text-blue-600 text-[16px] font-medium hover:text-blue-700 transition-colors whitespace-nowrap"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/shop");
                }}
              >
                Xem tất cả &gt;&gt;
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  imageUrl={relatedProduct.imageUrl}
                  name={relatedProduct.name}
                  price={relatedProduct.price}
                  originalPrice={relatedProduct.originalPrice}
                  rating={relatedProduct.rating}
                  discountPercent={relatedProduct.discountPercent}
                  onClick={() =>
                    navigate(`/shop/products/${relatedProduct.id}`)
                  }
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
