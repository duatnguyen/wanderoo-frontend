export type VoucherStatus = "Đang diễn ra" | "Sắp diễn ra" | "Đã kết thúc";

export interface VoucherProduct {
  id: string;
  name: string;
  image: string;
  barcode: string;
  price: number;
  available: number;
  quantity?: number;
}

export interface VoucherEditData {
  voucherName: string;
  voucherCode: string;
  description?: string;
  startDate: string;
  endDate: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  maxDiscountLimit: "limited" | "unlimited";
  maxDiscountValue?: string;
  minOrderAmount?: string;
  maxUsage?: string;
  maxUsagePerCustomer?: string;
  displaySetting: "pos" | "website" | "pos-website";
  totalSpendingAmount?: string;
  spendingDays?: string;
  appliedProducts?: VoucherProduct[];
}

export interface Voucher {
  id: string;
  code: string;
  name: string;
  type: string;
  products: string;
  discount: string;
  maxUsage: number;
  used: number;
  display: string;
  startDate: string;
  endDate: string;
  status: VoucherStatus;
  editData?: VoucherEditData;
  voucherCategory?: string;
  savedCount?: number;
}

export type VoucherOrderStatus =
  | "Đang xử lý"
  | "Đã giao"
  | "Đã hủy"
  | "Đã hoàn thành"
  | "Đang giao";

export interface VoucherOrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
}

export interface VoucherOrder {
  id: string;
  code: string;
  items: VoucherOrderItem[];
  discountAmount: number;
  totalAmount: number;
  orderDate: string;
  status: VoucherOrderStatus;
}

export interface VoucherOrderSummary {
  totalOrders: number;
  totalDiscountAmount: number;
  totalRevenue: number;
}

