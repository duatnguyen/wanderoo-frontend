// src/types/orders.ts - Order, cart and review types
import type { PageResponse } from './common';

export interface OrderResponse {
  id: number;
  customerId: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderPageResponse extends PageResponse<OrderResponse> {}

export interface OrderDetailResponse extends OrderResponse {
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  total: number;
}

export interface CustomerOrderResponse extends OrderResponse {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

export interface CustomerOrderPageResponse extends PageResponse<CustomerOrderResponse> {}

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

export interface ReviewPageResponse extends PageResponse<ReviewResponse> {}

export interface OrderHistoryResponse {
  id: number;
  orderId: number;
  action: string;
  userId: number;
  timestamp: string;
  details: string;
}

export interface OrderHistoryPageResponse extends PageResponse<OrderHistoryResponse> {}

export interface OrderDetailPageResponse extends PageResponse<OrderDetailResponse> {}

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
  shippingAddress?: import('./auth').AddressCreationRequest;
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
  userId: number;
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
  items: AdminOrderItemResponse[];
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