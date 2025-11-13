// src/types/shipping.ts - Shipping, POS, Discount and Voucher types

// Shipping types
export interface ProvinceResponse {
  provinceId: number;
  provinceName: string;
}

export interface DistrictResponse {
  districtId: number;
  districtName: string;
  provinceId: number;
}

export interface WardResponse {
  wardCode: string;
  wardName: string;
  districtId: number;
}

export interface CalculateShippingFeeRequest {
  fromDistrictId: number;
  fromWardCode: string;
  toDistrictId: number;
  toWardCode: string;
  serviceId: number;
  weight: number;
  length: number;
  width: number;
  height: number;
}

export interface ShippingFeeResponse {
  serviceFee: number;
  serviceId: number;
  serviceName: string;
  expectedDeliveryTime: string;
}

export interface StationResponse {
  stationId: number;
  stationName: string;
  address: string;
  districtId: number;
  wardCode: string;
}

export interface PickShiftResponse {
  shiftId: number;
  shiftName: string;
  fromTime: string;
  toTime: string;
}

export interface CreateGHNOrderRequest {
  toName: string;
  toPhone: string;
  toAddress: string;
  toWardCode: string;
  toDistrictId: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  serviceId: number;
  paymentTypeId: number;
  requiredNote: string;
  items: Array<{
    name: string;
    code: string;
    quantity: number;
    price: number;
    length: number;
    width: number;
    height: number;
    weight: number;
  }>;
}

export interface CreateShippingOrderResponse {
  orderCode: string;
  expectedDeliveryTime: string;
  totalFee: number;
}

export interface UpdateGHNOrderRequest {
  orderCode: string;
  toName?: string;
  toPhone?: string;
  toAddress?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}

export interface UpdateShippingOrderResponse {
  orderCode: string;
  totalFee: number;
}

export interface ShippingOrderDetailResponse {
  orderCode: string;
  status: string;
  toName: string;
  toPhone: string;
  toAddress: string;
  totalFee: number;
  expectedDeliveryTime: string;
  items: Array<{
    name: string;
    code: string;
    quantity: number;
    price: number;
  }>;
}

export interface GetOrderDetailRequest {
  orderCode: string;
}

export interface PreviewOrderRequest {
  orderCode: string;
}

export interface PreviewOrderResponse {
  orderCode: string;
  status: string;
  toName: string;
  toPhone: string;
  toAddress: string;
  totalFee: number;
  expectedDeliveryTime: string;
}

export interface TrackingResponse {
  orderCode: string;
  status: string;
  statusDescription: string;
  updatedAt: string;
}

export interface OrderStatusResponse {
  orderCode: string;
  status: string;
  statusDescription: string;
}

export interface CancelGHNOrderRequest {
  orderCode: string;
}

export interface CancelOrderResponse {
  orderCode: string;
  message: string;
}

export interface SwitchStatusRequest {
  orderCode: string;
  status: string;
}

// POS types
export interface UserOrderResponse {
  orderId: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface PrintOrderRequest {
  orderId: number;
}

export interface PrintTokenResponse {
  token: string;
  orderId: number;
}

export interface SaleProductPageResponse {
  content: Array<{
    productId: number;
    productName: string;
    price: number;
    stock: number;
    categoryName: string;
  }>;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface POSCustomerResponse {
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
}

export interface DraftOrderResponse {
  orderId: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
}

export interface UpdateOrderItemRequest {
  orderId: number;
  productId: number;
  quantity: number;
}

export interface AddOrderItemRequest {
  orderId: number;
  productId: number;
  quantity: number;
}

export interface UpdateCustomerRequest {
  orderId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
}

export interface ApplyDiscountRequest {
  orderId: number;
  discountCode: string;
}

export interface UpdateNoteRequest {
  orderId: number;
  note: string;
}

export interface CheckoutRequest {
  orderId: number;
  paymentMethod: string;
}

export interface CheckoutResponse {
  orderId: number;
  orderCode: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

// Discount types
export interface DiscountResponse {
  discountId: number;
  discountCode: string;
  discountName: string;
  discountType: string;
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscountAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  applicableCategories: string[];
  applicableProducts: number[];
}

export interface DiscountPageResponse {
  content: DiscountResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface DiscountCreateRequest {
  discountCode: string;
  discountName: string;
  discountType: string;
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscountAmount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  applicableCategories: string[];
  applicableProducts: number[];
}

export interface DiscountUpdateRequest {
  discountName?: string;
  discountType?: string;
  discountValue?: number;
  minimumOrderValue?: number;
  maximumDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  applicableCategories?: string[];
  applicableProducts?: number[];
  isActive?: boolean;
}

export interface DiscountMetadataResponse {
  totalDiscounts: number;
  activeDiscounts: number;
  expiredDiscounts: number;
}

// Voucher types
export interface VoucherResponse {
  voucherId: number;
  voucherCode: string;
  voucherName: string;
  voucherType: string;
  voucherValue: number;
  minimumOrderValue: number;
  maximumDiscountAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  applicableCategories: string[];
  applicableProducts: number[];
}

export interface VoucherPageResponse {
  content: VoucherResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface VoucherCreateRequest {
  voucherCode: string;
  voucherName: string;
  voucherType: string;
  voucherValue: number;
  minimumOrderValue: number;
  maximumDiscountAmount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  applicableCategories: string[];
  applicableProducts: number[];
}

export interface VoucherUpdateRequest {
  voucherName?: string;
  voucherType?: string;
  voucherValue?: number;
  minimumOrderValue?: number;
  maximumDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  applicableCategories?: string[];
  applicableProducts?: number[];
  isActive?: boolean;
}

export interface CustomerVoucherResponse {
  customerVoucherId: number;
  voucherId: number;
  voucherCode: string;
  voucherName: string;
  voucherType: string;
  voucherValue: number;
  minimumOrderValue: number;
  maximumDiscountAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isUsed: boolean;
  usedAt: string;
}

export interface CustomerVoucherPageResponse {
  content: CustomerVoucherResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CustomerVoucherCreateRequest {
  customerId: number;
  voucherId: number;
}

export interface CustomerVoucherUpdateRequest {
  isUsed?: boolean;
}

export interface CustomerVoucherStatsResponse {
  totalVouchers: number;
  usedVouchers: number;
  activeVouchers: number;
  expiredVouchers: number;
}

export interface UseVoucherRequest {
  voucherCode: string;
  orderId: number;
}

export interface GrantVoucherRequest {
  customerId: number;
  voucherId: number;
}

export interface ExpireVoucherRequest {
  voucherId: number;
}

// POS Order types (keeping the existing ones for compatibility)
export interface POSOrderResponse {
  orderId: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface POSOrderPageResponse {
  content: POSOrderResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface POSOrderCreateRequest {
  customerName: string;
  customerPhone: string;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface POSOrderUpdateRequest {
  orderId: number;
  customerName?: string;
  customerPhone?: string;
  items?: Array<{
    productId: number;
    quantity: number;
  }>;
}

export interface POSOrderConfirmResponse {
  orderId: number;
  orderCode: string;
  status: string;
}

export interface POSOrderCancelResponse {
  orderId: number;
  message: string;
}

export interface POSOrderDetailResponse {
  orderId: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface POSOrderDetailPageResponse {
  content: POSOrderDetailResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface POSOrderHistoryResponse {
  historyId: number;
  orderId: number;
  action: string;
  oldStatus: string;
  newStatus: string;
  changedBy: string;
  changedAt: string;
  notes: string;
}

export interface POSOrderHistoryPageResponse {
  content: POSOrderHistoryResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface POSOrderHistoryCreateRequest {
  orderId: number;
  action: string;
  oldStatus: string;
  newStatus: string;
  notes: string;
}

export interface POSOrderHistoryUpdateRequest {
  historyId: number;
  notes?: string;
}