import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import { getProductById, getRelatedProducts } from "../../data/productsData";
import type { Product } from "../../data/productsData";
import { useCart } from "../../../../context/CartContext";
import ProductImages from "../../../../components/shop/Product/ProductImages";
import ProductInfo from "../../../../components/shop/Product/ProductInfo";
import ProductDescription from "../../../../components/shop/Product/ProductDescription";
import CustomerReviews from "../../../../components/shop/Product/CustomerReviews";
import RelatedProducts from "../../../../components/shop/Product/RelatedProducts";

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, getCartCount } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get product from navigation state or find in mockdata
  const productFromState = (location.state as { product?: Product })?.product;
  const productFromData = productId && getProductById(productId);

  // Default product data
  const defaultProduct: Product = {
    id: productId || "1",
    imageUrl: "",
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
    images: ["", "", "", ""],
    stock: 25,
    category: "Đồ cắm trại",
    brand: "Naturehike",
    reviews: 128,
  };

  // Use product from state if available, otherwise from mockdata, otherwise default
  const product: Product =
    productFromState || productFromData || defaultProduct;

  // Related products from mockdata
  const relatedProducts = getRelatedProducts(product.id, 6);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    const maxStock = product.stock || 999;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    console.log("Added to cart:", { productId: product.id, quantity });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        cartCount={getCartCount()}
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
        <section className="w-full bg-gray-50 py-6">
          <div className="max-w-[1200px] mx-auto px-4 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProductImages
                  product={product}
                  selectedImageIndex={selectedImageIndex}
                  onImageSelect={setSelectedImageIndex}
                />
                <ProductInfo
                  product={product}
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </div>
            <ProductDescription product={product} />
          </div>
        </section>

        <CustomerReviews />

        <RelatedProducts products={relatedProducts} />
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
