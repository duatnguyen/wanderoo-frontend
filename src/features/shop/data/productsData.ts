// src/features/shop/data/productsData.ts
export interface Product {
  id: string | number;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  discountPercent?: number;
  stock?: number;
  size?: string;
  weight?: number;
  material?: string;
  activity?: string[];
  color?: string;
  brand?: string;
  features?: string[];
  reviews?: number;
  createdAt?: string;
  categoryId?: number;
  description?: string;
  images?: string[];
  category?: string;
  variantOptions?: { label: string; value: string }[];
}

// Mock data for development
export const productsData: Product[] = [
  {
    id: 1,
    name: "Naturehike Backpack 60L",
    imageUrl: "/images/products/backpack1.jpg",
    price: 2500000,
    originalPrice: 3000000,
    rating: 4.5,
    discountPercent: 17,
    stock: 10,
    size: "large",
    weight: 1200,
    material: "polyester",
    activity: ["climbing", "trekking"],
    color: "blue",
    brand: "Naturehike",
    features: ["waterproof", "lightweight"],
    reviews: 25,
    categoryId: 1,
    description: "A high-quality backpack for outdoor activities.",
    images: ["/images/products/backpack1.jpg"],
    category: "Backpacks",
  },
  {
    id: 2,
    name: "The North Face Tent 2P",
    imageUrl: "/images/products/tent1.jpg",
    price: 4500000,
    rating: 4.8,
    stock: 5,
    size: "medium",
    weight: 2500,
    material: "nylon",
    activity: ["camping"],
    color: "green",
    brand: "northface",
    features: ["waterproof", "windproof"],
    reviews: 40,
    categoryId: 2,
    description: "A durable tent for camping.",
    images: ["/images/products/tent1.jpg"],
    category: "Tents",
  },
  // Add more mock products as needed
];

// Function to get related products (placeholder)
export const getRelatedProducts = (productId: string | number, limit: number = 4): Product[] => {
  return productsData.filter(p => p.id !== productId).slice(0, limit);
};