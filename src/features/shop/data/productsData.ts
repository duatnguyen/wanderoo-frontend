// Mock data for products - will be replaced with backend API later

export interface Product {
  id: string | number;
  imageUrl: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  discountPercent?: number;
  description?: string;
  images?: string[];
  stock?: number;
  category?: string;
  brand?: string;
  reviews?: number;
  variant?: string;
  variantOptions?: { label: string; value: string }[];
}

export const productsData: Product[] = [
  {
    id: 1,
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
  },
  {
    id: 2,
    imageUrl: "",
    name: "Túi ngủ mùa đông giữ nhiệt",
    price: 890000,
    originalPrice: 1200000,
    rating: 4.8,
    discountPercent: 26,
    description: "Túi ngủ mùa đông giữ nhiệt cao cấp, phù hợp cho nhiệt độ từ -10°C đến 10°C",
    images: ["", "", ""],
    stock: 15,
    category: "Đồ cắm trại",
    brand: "Naturehike",
    reviews: 95,
  },
  {
    id: 3,
    imageUrl: "",
    name: "Bếp gas du lịch mini",
    price: 450000,
    originalPrice: 650000,
    rating: 4.3,
    discountPercent: 31,
    description: "Bếp gas du lịch mini nhỏ gọn, tiện lợi cho các chuyến đi",
    images: ["", ""],
    stock: 30,
    category: "Đồ cắm trại",
    brand: "Naturehike",
    reviews: 67,
  },
  {
    id: 4,
    imageUrl: "",
    name: "Ba lô trekking 30L",
    price: 950000,
    originalPrice: 1150000,
    rating: 4.6,
    discountPercent: 17,
    description: "Ba lô trekking 30L chống nước, nhiều ngăn tiện lợi",
    images: ["", "", "", ""],
    stock: 20,
    category: "Phụ kiện",
    brand: "Naturehike",
    reviews: 142,
  },
  {
    id: 5,
    imageUrl: "",
    name: "Áo khoác gió chống nước",
    price: 750000,
    originalPrice: 950000,
    rating: 4.7,
    discountPercent: 21,
    description: "Áo khoác gió chống nước nhẹ, thấm hút mồ hôi",
    images: ["", ""],
    stock: 35,
    category: "Thể thao ngoài trời",
    brand: "Naturehike",
    reviews: 89,
  },
  {
    id: 6,
    imageUrl: "",
    name: "Ghế xếp du lịch nhẹ",
    price: 320000,
    originalPrice: 450000,
    rating: 4.4,
    discountPercent: 29,
    description: "Ghế xếp du lịch nhẹ, gọn dễ mang theo",
    images: [""],
    stock: 50,
    category: "Đồ cắm trại",
    brand: "Naturehike",
    reviews: 56,
  },
  {
    id: 7,
    imageUrl: "",
    name: "Đèn pin siêu sáng LED",
    price: 280000,
    originalPrice: 380000,
    rating: 4.2,
    discountPercent: 26,
    description: "Đèn pin siêu sáng LED, pin sạc USB",
    images: ["", ""],
    stock: 40,
    category: "Phụ kiện",
    brand: "Naturehike",
    reviews: 78,
  },
  {
    id: 8,
    imageUrl: "",
    name: "Bộ dụng cụ đa năng",
    price: 180000,
    originalPrice: 250000,
    rating: 4.5,
    discountPercent: 28,
    description: "Bộ dụng cụ đa năng 12 trong 1 cho camping",
    images: [""],
    stock: 60,
    category: "Phụ kiện",
    brand: "Naturehike",
    reviews: 103,
  },
  {
    id: 101,
    imageUrl: "",
    name: "Lều trại 4 người siêu giảm giá",
    price: 1890000,
    originalPrice: 3200000,
    rating: 4.9,
    discountPercent: 41,
    description: "Lều trại 4 người rộng rãi, chống thấm nước cao cấp",
    images: ["", "", "", ""],
    stock: 10,
    category: "Đồ cắm trại",
    brand: "Naturehike",
    reviews: 234,
  },
  {
    id: 102,
    imageUrl: "",
    name: "Bếp nướng BBQ đa năng",
    price: 650000,
    originalPrice: 1200000,
    rating: 4.7,
    discountPercent: 46,
    description: "Bếp nướng BBQ đa năng, có thể dùng gas hoặc than",
    images: ["", ""],
    stock: 18,
    category: "Đồ cắm trại",
    brand: "Naturehike",
    reviews: 156,
  },
  {
    id: 103,
    imageUrl: "",
    name: "Túi ngủ 3 mùa cao cấp",
    price: 990000,
    originalPrice: 1800000,
    rating: 4.8,
    discountPercent: 45,
    description: "Túi ngủ 3 mùa cao cấp, phù hợp mọi thời tiết",
    images: ["", "", ""],
    stock: 12,
    category: "Đồ cắm trại",
    brand: "Naturehike",
    reviews: 187,
  },
  {
    id: 104,
    imageUrl: "",
    name: "Ba lô du lịch 50L chống thấm",
    price: 1290000,
    originalPrice: 2200000,
    rating: 4.6,
    discountPercent: 41,
    description: "Ba lô du lịch 50L chống thấm nước, nhiều ngăn",
    images: ["", "", ""],
    stock: 22,
    category: "Phụ kiện",
    brand: "Naturehike",
    reviews: 201,
  },
  {
    id: 105,
    imageUrl: "",
    name: "Bộ đồ nấu ăn du lịch 8 món",
    price: 450000,
    originalPrice: 850000,
    rating: 4.5,
    discountPercent: 47,
    description: "Bộ đồ nấu ăn du lịch 8 món, inox không gỉ",
    images: ["", ""],
    stock: 28,
    category: "Đồ cắm trại",
    brand: "Naturehike",
    reviews: 134,
  },
];

// Helper function to get product by ID
export const getProductById = (id: string | number): Product | undefined => {
  return productsData.find((product) => product.id.toString() === id.toString());
};

// Helper function to get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return productsData.filter((product) => product.category === category);
};

// Helper function to get related products (excluding current product)
export const getRelatedProducts = (
  currentProductId: string | number,
  limit: number = 4
): Product[] => {
  return productsData
    .filter((product) => product.id.toString() !== currentProductId.toString())
    .slice(0, limit);
};

