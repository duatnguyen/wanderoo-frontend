export type CheckoutItem = {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  originalPrice: number;       // Giá gốc
  discountedPrice: number;     // Giá sau giảm (đơn vị)
  productPrice: number;        // Giá đơn vị cuối cùng (sau giảm giá)
  discountValue?: string;      // Thông tin giảm giá (ví dụ: "-10%" hoặc "-50000đ")
  quantity: number;
  totalPrice: number;          // Tổng tiền (sau giảm giá)
  variant?: string;
  cartId?: number;
  // Để tương thích với code cũ
  price: number;               // Alias cho productPrice
};

export type AddressOption = {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault?: boolean;
  region: string;
  detailAddress: string;
};

export type EditFormState = {
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  setAsDefault: boolean;
  detailAddress: string;
};

export type PaymentMethod = {
  id: "CASH" | "BANKING";
  title: string;
  description: string;
};

export type AddressFormData = {
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  isDefault: boolean;
};

// Shipping configuration - These should be configured per your warehouse/store location
export const SHIPPING_CONFIG = {
  FROM_DISTRICT_ID: 1454, // Default warehouse district ID (update this for your location)
  FROM_WARD_CODE: "21211", // Default warehouse ward code (update this for your location)
  DEFAULT_SERVICE_ID: 53320, // GHN Standard service ID
  DEFAULT_SHIPPING_FEE: 30000, // Fallback shipping fee in VND
  WEIGHT_PER_ITEM: 500, // Estimated weight per item in grams
  BASE_DIMENSIONS: { length: 20, width: 15, height: 10 }, // Base package dimensions in cm
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "CASH",
    title: "Thanh toán khi nhận hàng",
    description:
      "Thanh toán trực tiếp với nhân viên giao hàng sau khi nhận sản phẩm.",
  },
  {
    id: "BANKING",
    title: "Thanh toán online",
    description: "",
  },
];