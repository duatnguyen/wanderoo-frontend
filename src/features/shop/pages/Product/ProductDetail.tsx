import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "../../../../components/shop/Header";
import Footer from "../../../../components/shop/Footer";
import { getRelatedProducts } from "../../data/productsData";
import type { Product } from "../../data/productsData";
import { useCart } from "../../../../context/CartContext";
import ProductImages from "../../../../components/shop/Product/ProductImages";
import ProductInfo from "../../../../components/shop/Product/ProductInfo";
import ProductDescription from "../../../../components/shop/Product/ProductDescription";
import CustomerReviews from "../../../../components/shop/Product/CustomerReviews";
import RelatedProducts from "../../../../components/shop/Product/RelatedProducts";
import { getProductDetail } from "../../../../api/endpoints/productApi";
import { getSuggestionProducts, type HomepageProductResponse } from "../../../../api/endpoints/homepageApi";
import type { ProductDetailsResponse } from "../../../../types";

type EnrichedProduct = Product & {
  priceRange?: {
    min: number;
    max: number;
  };
  originalPriceRange?: {
    min: number;
    max: number;
  };
  sku?: string;
  status?: string;
};

const parsePriceRange = (priceString?: string | null) => {
  if (!priceString) return undefined;
  const compact = priceString.replace(/\s/g, "");
  const segments = compact
    .split("-")
    .map((segment) => parseInt(segment.replace(/[^\d]/g, ""), 10))
    .filter((value) => !Number.isNaN(value));
  if (!segments.length) return undefined;
  const min = segments[0];
  const max = segments.length > 1 ? segments[segments.length - 1] : segments[0];
  return { min, max };
};

const extractDiscountPercent = (discountValue?: string | null) => {
  if (!discountValue) return undefined;
  const match = discountValue.match(/(\d+(?:\.\d+)?)%/);
  if (!match) return undefined;
  return Math.round(Number(match[1]));
};

const buildVariantOptions = (
  attributes?: ProductDetailsResponse["attributes"]
) => {
  if (!attributes || !attributes.length) return [];
  const primaryAttribute = attributes[0];
  if (!primaryAttribute?.values) return [];
  return primaryAttribute.values
    .filter((value) => value && typeof value.id !== "undefined")
    .map((value) => ({
      label: value.value,
      value: value.id.toString(),
    }));
};

const mapProductResponseToProduct = (
  apiProduct: ProductDetailsResponse,
  fallbackId: string | number
): EnrichedProduct => {
  const discountedRange = parsePriceRange(apiProduct.discountPrice);
  const baseRange = parsePriceRange(apiProduct.price);
  const priceRange = discountedRange ?? baseRange;
  const originalPriceRange = discountedRange && baseRange ? baseRange : undefined;
  const normalizedImages =
    apiProduct.images && apiProduct.images.length > 0
      ? apiProduct.images
      : [""];

  return {
    id: apiProduct.id ?? fallbackId,
    imageUrl: normalizedImages[0] || "",
    images: normalizedImages,
    name: apiProduct.name ?? "Đang cập nhật",
    price: priceRange?.min ?? 0,
    originalPrice: originalPriceRange?.min,
    description: apiProduct.description ?? "",
    stock: apiProduct.quantity ?? 0,
    category: apiProduct.categoryResponse?.name || undefined,
    brand: apiProduct.brandResponse?.name || undefined,
    variantOptions: buildVariantOptions(apiProduct.attributes),
    discountPercent: extractDiscountPercent(apiProduct.discountValue),
    priceRange,
    originalPriceRange,
    sku: apiProduct.barcode || undefined,
    status:
      typeof apiProduct.quantity === "number" && apiProduct.quantity > 0
        ? "Còn hàng"
        : "Hết hàng",
  };
};

const convertHomepageProductToProduct = (item: HomepageProductResponse): Product => {
  const salePrice = item.salePrice ?? 0;
  const originalPrice = item.originalPrice ?? salePrice;
  return {
    id: item.productId,
    name: item.name,
    imageUrl: item.image || "",
    price: salePrice,
    originalPrice,
    discountPercent:
      typeof item.discountPercent === "number"
        ? Math.round(item.discountPercent)
        : undefined,
    rating: 0,
    stock: 0,
    category: "",
    brand: "",
    reviews: item.soldQuantity ?? 0,
  };
};

const pickRandomProducts = (products: Product[], limit: number) => {
  const shuffled = [...products];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, limit);
};

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, getCartCount } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const productFromState = (location.state as { product?: Product })?.product;

  const defaultProduct = useMemo<Product>(
    () => ({
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
    }),
    [productId]
  );

  const { data: productDetail } = useQuery({
    queryKey: ["product-detail", productId],
    queryFn: () => {
      if (!productId) {
        throw new Error("Thiếu mã sản phẩm");
      }
      return getProductDetail(Number(productId));
    },
    enabled: Boolean(productId),
  });

  const { data: suggestionProducts } = useQuery({
    queryKey: ["product-suggestions"],
    queryFn: () => getSuggestionProducts(20),
  });

  const product = useMemo<EnrichedProduct>(() => {
    if (productDetail && productId) {
      return mapProductResponseToProduct(productDetail, productId);
    }
    if (productFromState) {
      return productFromState as EnrichedProduct;
    }
    return defaultProduct as EnrichedProduct;
  }, [productDetail, productId, productFromState, defaultProduct]);

  const relatedProducts = useMemo(() => {
    if (suggestionProducts && suggestionProducts.length > 0) {
      const mapped = suggestionProducts.map(convertHomepageProductToProduct);
      return pickRandomProducts(mapped, 10);
    }
    return getRelatedProducts(product.id, 10);
  }, [suggestionProducts, product.id]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product.id]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    const maxStock = product.stock || 999;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const categoryLabel = product.category || "Danh mục";

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
              <span>{categoryLabel}</span>
              <span>/</span>
              <span className="text-gray-900">
                {product.name || "Đang cập nhật"}
              </span>
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
