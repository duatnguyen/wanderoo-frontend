// src/types/orders.ts - Order, cart and review types
import type { PageResponse } from "./common";

export interface UserInfo {
  id: number;
  name: string;
  image: string;
  username: string;
  phone?: string;
}

export interface OrderResponse {
  id: number;
  code: string;
  customerId: number;
  totalAmount: number;
  status: string;
  paymentStatus?: string; // Made optional for compatibility
  createdAt: string;
  updatedAt: string;
}

export interface OrderPageResponse extends PageResponse<OrderResponse> { }

export interface OrderDetailResponse extends OrderResponse {
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  total: number;
  name?: string; // Product name
  productImage?: string; // Product image
}

export interface OrderDetailItemResponse {
  id: number;
  orderId: number;
  productDetailId: number;
  quantity: number;
  snapshotProductName: string;
  snapshotProductSku: string;
  snapshotProductPrice: number; // giá gốc per unit
  snapshotDiscountAmount: number; // Tổng số tiền giảm (đã nhân quantity)
  snapshotFinalPrice: number; // Tổng giá cuối (đã nhân quantity)
  snapshotProductFinalPrice?: number; // Giá sản phẩm sau khi giảm (per unit)
  snapshotPackagedWeight?: number;
  snapshotLength?: number;
  snapshotWidth?: number;
  snapshotHeight?: number;
  barcode?: string | null;
  productImage?: string; // Product image URL from ProductDetail
  snapshotVariantAttributes?: VariantAttribute[];
  productId?: number; // Product ID for navigation
}

export interface CustomerOrderResponse extends OrderResponse {
  userInfo: UserInfo;
  shippingDetail?: any; // GHN shipping details
  items?: OrderItemResponse[]; // Order items (legacy, for backward compatibility)
  orderDetails?: OrderDetailItemResponse[]; // Order details with product information
  source?: string; // Order source (WEBSITE, POS, etc.)
  sourceLabel?: string | null; // Label tiếng Việt cho source
  picInfo?: UserInfo | null; // PIC user info from backend
  discountId?: number | null;
  method?: string;
  methodLabel?: string | null; // Label tiếng Việt cho method
  paymentStatus?: string;
  paymentStatusLabel?: string | null; // Label tiếng Việt cho paymentStatus
  shippingFee?: number;
  totalProductPrice?: number;
  totalOrderPrice?: number;
  notes?: string;
  discountOrderId?: number | null;
  discountShipId?: number | null;
  orderDiscountAmount?: number | null;
  productDiscountAmount?: number | null;
  totalDiscountAmount?: number | null;
  cashReceived?: number | null;
  changeAmount?: number | null;
  shippingOrderCode?: string | null;
  shippingStatus?: string | null;
  shippingProvider?: string | null;
  trackingNumber?: string | null;
  expectedDeliveryDate?: string | null;
  receiverName?: string | null;
  receiverPhone?: string | null;
  receiverAddress?: string | null;
  receiverProvinceName?: string | null;
  receiverDistrictId?: number | null;
  receiverDistrictName?: string | null;
  receiverWardCode?: string | null;
  receiverWardName?: string | null;
  shopDistrictId?: number | null;
  shopDistrictName?: string | null;
  shopWardCode?: string | null;
  shopWardName?: string | null;
  reasonCancel?: string | null; // Lý do hủy đơn hàng
  reasonCancelLabel?: string | null; // Label tiếng Việt cho reasonCancel
  statusLabel?: string | null; // Label tiếng Việt cho status
}

export interface CustomerOrderPageResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  orders: CustomerOrderResponse[];
}

export interface CartResponse {
  id: number;
  userId: number;
  items: CartItemResponse[];
  totalAmount: number;
}

export interface CartItemResponse {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  total: number;
}

export interface ReviewResponse {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewPageResponse extends PageResponse<ReviewResponse> { }

export interface OrderHistoryResponse {
  id: number;
  orderId: number;
  action: string;
  userId: number;
  timestamp: string;
  details: string;
}

export interface OrderHistoryPageResponse
  extends PageResponse<OrderHistoryResponse> { }

export interface OrderDetailPageResponse
  extends PageResponse<OrderDetailResponse> { }

// Request types
export interface CustomerOrderCreateRequest {
  customerId: number;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productDetailId: number;
  quantity: number;
}

export interface CustomerOrderPublicCreateRequest {
  customerId: number;
  items: OrderItemRequest[];
}

export interface CreateOrderResponse {
  order: CustomerOrderResponse;
  shippingInfo: string;
  shippingStatus: string;
  shippingMessage: string;
  shippingFee: number;
  totalOrderPrice: number;
}

export interface CustomerOrderCancelResponse {
  orderId: number;
  status: string;
  message: string;
}

export interface OrderConfirmResponse {
  orderId: number;
  shippingOrderCode: string;
  status: string;
}

export interface OrderCancelResponse {
  orderId: number;
  status: string;
  message: string;
}

export interface CustomerOrderMetadataResponse {
  paymentMethods: string[];
  shippingMethods: string[];
  orderStatuses: string[];
}

export interface OrderStatusUpdateRequest {
  status: string;
}

export interface CustomerOrderUpdateRequest {
  status?: string;
  paymentStatus?: string;
  shippingAddress?: import("./auth").AddressCreationRequest;
}

export interface CartItemRequest {
  productDetailId: number;
  quantity: number;
}

export interface CartItemUpdateRequest {
  quantity: number;
}

export interface ReviewCreateRequest {
  productId: number;
  orderId: number;
  rating: number;
  comment: string;
}

export interface ReviewUpdateRequest {
  rating?: number;
  comment?: string;
}

export interface OrderHistoryCreateRequest {
  orderId: number;
  action: string;
  details: string;
}

export interface OrderHistoryUpdateRequest {
  action?: string;
  details?: string;
}

// Admin orders API types
export interface VariantAttribute {
  id: number;
  name: string;
  groupLevel: number;
  value: string;
}

export interface AdminOrderItemResponse {
  id: number;
  orderId: number;
  productDetailId: number;
  quantity: number;
  snapshotProductName: string;
  snapshotProductSku: string;
  snapshotProductPrice: number;
  snapshotVariantAttributes: VariantAttribute[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderResponse {
  id: number;
  code: string;
  userInfo: UserInfo;
  picId: number | null;
  discountId: number | null;
  method: string;
  source: string;
  paymentStatus: string;
  status: string;
  shippingFee: number;
  totalProductPrice: number;
  totalOrderPrice: number;
  notes: string;
  discountOrderId: number | null;
  discountShipId: number | null;
  cashReceived: number | null;
  changeAmount: number | null;
  shippingOrderCode: string | null;
  shippingStatus: string | null;
  shippingProvider: string | null;
  trackingNumber: string | null;
  expectedDeliveryDate: string | null;
  createdAt: string;
  updatedAt: string;
  items?: AdminOrderItemResponse[]; // Legacy field for backward compatibility
  orderDetails?: OrderDetailItemResponse[]; // New field with product information
}

export interface AdminOrdersApiResponse {
  status: number;
  message: string;
  data: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    orders: AdminOrderResponse[];
  };
}

export interface OrderCountResponse {
  all: number;
  pending: number;
  confirmed: number;
  shipping: number;
  complete: number;
  canceled: number;
  refund: number;
  shippingFailed: number;
}
