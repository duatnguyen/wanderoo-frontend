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
  categoryId?: number; // Category ID for filtering
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
    categoryId: 1, // Mock category ID
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
    description:
      "Túi ngủ mùa đông giữ nhiệt cao cấp, phù hợp cho nhiệt độ từ -10°C đến 10°C",
    images: ["", "", ""],
    stock: 15,
    category: "Đồ cắm trại",
    categoryId: 1, // Mock category ID
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
    categoryId: 1, // Mock category ID
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
    categoryId: 2, // Mock category ID
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
    categoryId: 3, // Mock category ID
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
    categoryId: 1, // Mock category ID
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
    categoryId: 2, // Mock category ID
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
    categoryId: 2, // Mock category ID
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
    categoryId: 1, // Mock category ID
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
    categoryId: 1, // Mock category ID
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
    categoryId: 1, // Mock category ID
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
    categoryId: 2, // Mock category ID
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
    categoryId: 1, // Mock category ID
    brand: "Naturehike",
    reviews: 134,
  },
  {
    id: 106,
    imageUrl: "",
    name: "Giày leo núi cao cổ chống trượt",
    price: 1200000,
    originalPrice: 1800000,
    rating: 4.7,
    discountPercent: 33,
    description:
      "Giày leo núi cao cổ chống trượt, đế cao su chắc chắn, phù hợp cho trekking và hiking",
    images: ["", "", ""],
    stock: 25,
    category: "Thể thao ngoài trời",
    categoryId: 3, // Mock category ID
    brand: "Naturehike",
    reviews: 198,
  },
  {
    id: 107,
    imageUrl: "",
    name: "Áo phao cứu sinh thể thao",
    price: 550000,
    originalPrice: 850000,
    rating: 4.4,
    discountPercent: 35,
    description:
      "Áo phao cứu sinh thể thao, nhẹ, dễ thổi phồng, an toàn cho các hoạt động dưới nước",
    images: ["", ""],
    stock: 32,
    category: "Thể thao ngoài trời",
    categoryId: 3, // Mock category ID
    brand: "Naturehike",
    reviews: 87,
  },
  {
    id: 108,
    imageUrl: "",
    name: "Võng du lịch nhẹ có màn chống muỗi",
    price: 380000,
    originalPrice: 550000,
    rating: 4.6,
    discountPercent: 31,
    description: "Võng du lịch nhẹ có màn chống muỗi, dễ dàng treo và gấp gọn",
    images: ["", ""],
    stock: 40,
    category: "Đồ cắm trại",
    categoryId: 1, // Mock category ID
    brand: "Naturehike",
    reviews: 112,
  },
  {
    id: 109,
    imageUrl: "",
    name: "Bình nước giữ nhiệt inox 1L",
    price: 250000,
    originalPrice: 380000,
    rating: 4.8,
    discountPercent: 34,
    description: "Bình nước giữ nhiệt inox 1L, giữ nhiệt 24h, chống rỉ sét",
    images: [""],
    stock: 55,
    category: "Phụ kiện",
    categoryId: 2, // Mock category ID
    brand: "Naturehike",
    reviews: 245,
  },
  {
    id: 110,
    imageUrl: "",
    name: "Kính râm chống tia UV thể thao",
    price: 320000,
    originalPrice: 480000,
    rating: 4.5,
    discountPercent: 33,
    description:
      "Kính râm chống tia UV thể thao, chống trầy xước, phù hợp cho các hoạt động ngoài trời",
    images: [""],
    stock: 45,
    category: "Phụ kiện",
    categoryId: 2, // Mock category ID
    brand: "Naturehike",
    reviews: 156,
  },
  {
    id: 111,
    imageUrl: "",
    name: "Bạt che nắng mưa 3x3m",
    price: 420000,
    originalPrice: 650000,
    rating: 4.3,
    discountPercent: 35,
    description: "Bạt che nắng mưa 3x3m, chống thấm nước, có dây cố định",
    images: ["", ""],
    stock: 30,
    category: "Đồ cắm trại",
    categoryId: 1, // Mock category ID
    brand: "Naturehike",
    reviews: 98,
  },
  {
    id: 112,
    imageUrl: "",
    name: "Gậy trekking chống sốc 2 cây",
    price: 680000,
    originalPrice: 980000,
    rating: 4.7,
    discountPercent: 31,
    description:
      "Gậy trekking chống sốc 2 cây, có thể điều chỉnh độ dài, nhẹ và chắc chắn",
    images: ["", ""],
    stock: 28,
    category: "Thể thao ngoài trời",
    categoryId: 3, // Mock category ID
    brand: "Naturehike",
    reviews: 167,
  },
  {
    id: 113,
    imageUrl: "",
    name: "Túi khô chống nước 20L",
    price: 180000,
    originalPrice: 280000,
    rating: 4.6,
    discountPercent: 36,
    description: "Túi khô chống nước 20L, bảo vệ đồ đạc khỏi nước và ẩm ướt",
    images: [""],
    stock: 50,
    category: "Phụ kiện",
    categoryId: 2, // Mock category ID
    brand: "Naturehike",
    reviews: 203,
  },
];

// Helper function to get product by ID
export const getProductById = (id: string | number): Product | undefined => {
  return productsData.find(
    (product) => product.id.toString() === id.toString()
  );
};

// Helper function to get products by category name
export const getProductsByCategory = (category: string): Product[] => {
  return productsData.filter((product) => product.category === category);
};

// Helper function to get products by category ID
export const getProductsByCategoryId = (categoryId: number): Product[] => {
  return productsData.filter((product) => product.categoryId === categoryId);
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
