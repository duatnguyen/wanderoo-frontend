// src/api/endpoints/orderApi.ts - Order, Cart, Review and POS API calls
import api from "../apiClient";
import type {
  ApiResponse,
  CustomerOrderMetadataResponse,
  CustomerOrderPageResponse,
  CustomerOrderResponse,
  CreateOrderResponse,
  CustomerOrderCancelResponse,
  OrderPageResponse,
  OrderDetailResponse,
  OrderStatusUpdateRequest,
  CustomerOrderCreateRequest,
  CustomerOrderUpdateRequest,
  OrderConfirmResponse,
  OrderCancelResponse,
  OrderDetailPageResponse,
  OrderHistoryPageResponse,
  OrderHistoryResponse,
  OrderHistoryCreateRequest,
  OrderHistoryUpdateRequest,
  ReviewPageResponse,
  ReviewResponse,
  ReviewCreateRequest,
  ReviewUpdateRequest,
  SaleProductPageResponse,
  CustomerResponse,
  DiscountResponse,
  DraftOrderResponse,
  UpdateOrderItemRequest,
  AddOrderItemRequest,
  UpdateCustomerRequest,
  ApplyDiscountRequest,
  UpdateNoteRequest,
  CheckoutRequest,
  CheckoutResponse,
  OrderDetailCreateRequest,
  OrderDetailUpdateRequest,
  AdminOrdersApiResponse,
  AdminOrderResponse,
  OrderCountResponse,
} from "../../types";

// Public Order APIs
export const getOrderMetadata =
  async (): Promise<CustomerOrderMetadataResponse> => {
    const response = await api.get<ApiResponse<CustomerOrderMetadataResponse>>(
      "/auth/v1/public/orders/metadata"
    );
    return response.data.data;
  };

export const getCustomerOrders = async (params?: {
  page?: number;
  size?: number;
}): Promise<CustomerOrderPageResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    "/auth/v1/public/orders",
    { params }
  );
  return response.data.data;
};

export const getCustomerOrderDetail = async (
  orderCode: string
): Promise<CustomerOrderResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderResponse>>(
    `/auth/v1/public/orders/${orderCode}`
  );
  return response.data.data;
};

export const createOrder = async (
  orderData: CustomerOrderCreateRequest
): Promise<CreateOrderResponse> => {
  const response = await api.post<ApiResponse<CreateOrderResponse>>(
    "/auth/v1/public/orders",
    orderData
  );
  return response.data.data;
};

export const cancelOrder = async (
  orderId: number
): Promise<CustomerOrderCancelResponse> => {
  const response = await api.patch<ApiResponse<CustomerOrderCancelResponse>>(
    `/auth/v1/public/orders/${orderId}/cancel`
  );
  return response.data.data;
};

// Admin Order APIs
export const getAllOrders = async (params?: {
  page?: number;
  size?: number;
  status?: string;
  paymentStatus?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<OrderPageResponse> => {
  const response = await api.get<ApiResponse<OrderPageResponse>>(
    "/orders/v1/admin",
    { params }
  );
  return response.data.data;
};

export const getOrderDetail = async (
  orderId: number
): Promise<OrderDetailResponse> => {
  const response = await api.get<ApiResponse<OrderDetailResponse>>(
    `/orders/v1/admin/${orderId}`
  );
  return response.data.data;
};

export const updateOrderStatus = async (
  orderId: number,
  statusData: OrderStatusUpdateRequest
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    `/orders/v1/admin/${orderId}/status`,
    statusData
  );
  return response.data;
};

// Admin Customer Order Management
export const getAdminCustomerOrders = async (params?: {
  page?: number;
  size?: number;
}): Promise<AdminOrdersApiResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    "/auth/v1/private/orders",
    { params }
  );
  // Transform CustomerOrderPageResponse to AdminOrdersApiResponse format
  // Map orders to ensure all required fields are present (not undefined)
  const orders = (response.data.data.orders || []).map((order) => {
    const { items, ...restOrder } = order;
    return {
      ...restOrder,
      picId: order.picId ?? null,
      discountId: order.discountId ?? null,
      method: order.method ?? "",
      source: order.source ?? "",
      paymentStatus: order.paymentStatus ?? "",
      status: order.status ?? "",
      shippingFee: order.shippingFee ?? 0,
      totalProductPrice: order.totalProductPrice ?? 0,
      totalOrderPrice: order.totalOrderPrice ?? 0,
      notes: order.notes ?? "",
      discountOrderId: order.discountOrderId ?? null,
      discountShipId: order.discountShipId ?? null,
      cashReceived: order.cashReceived ?? null,
      changeAmount: order.changeAmount ?? null,
      shippingOrderCode: order.shippingOrderCode ?? null,
      shippingStatus: order.shippingStatus ?? null,
      shippingProvider: order.shippingProvider ?? null,
      trackingNumber: order.trackingNumber ?? null,
      expectedDeliveryDate: order.expectedDeliveryDate ?? null,
      // Only include items if it's the correct type, otherwise rely on orderDetails
      items: undefined, // Remove items field as it's incompatible type
    } as AdminOrderResponse;
  });
  return {
    status: response.data.status,
    message: response.data.message,
    data: {
      pageNumber: response.data.data.pageNumber,
      pageSize: response.data.data.pageSize,
      totalElements: response.data.data.totalElements,
      totalPages: response.data.data.totalPages,
      orders,
    },
  };
};

export const getAdminCustomerOrdersByStatus = async (
  status: string,
  params?: {
    page?: number;
    size?: number;
  }
): Promise<AdminOrdersApiResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    `/auth/v1/private/orders/status/${status}`,
    { params }
  );
  // Transform CustomerOrderPageResponse to AdminOrdersApiResponse format
  // Map orders to ensure all required fields are present (not undefined)
  const orders = (response.data.data.orders || []).map((order) => {
    const { items, ...restOrder } = order;
    return {
      ...restOrder,
      picId: order.picId ?? null,
      discountId: order.discountId ?? null,
      method: order.method ?? "",
      source: order.source ?? "",
      paymentStatus: order.paymentStatus ?? "",
      status: order.status ?? "",
      shippingFee: order.shippingFee ?? 0,
      totalProductPrice: order.totalProductPrice ?? 0,
      totalOrderPrice: order.totalOrderPrice ?? 0,
      notes: order.notes ?? "",
      discountOrderId: order.discountOrderId ?? null,
      discountShipId: order.discountShipId ?? null,
      cashReceived: order.cashReceived ?? null,
      changeAmount: order.changeAmount ?? null,
      shippingOrderCode: order.shippingOrderCode ?? null,
      shippingStatus: order.shippingStatus ?? null,
      shippingProvider: order.shippingProvider ?? null,
      trackingNumber: order.trackingNumber ?? null,
      expectedDeliveryDate: order.expectedDeliveryDate ?? null,
      // Only include items if it's the correct type, otherwise rely on orderDetails
      items: undefined, // Remove items field as it's incompatible type
    } as AdminOrderResponse;
  });
  return {
    status: response.data.status,
    message: response.data.message,
    data: {
      pageNumber: response.data.data.pageNumber,
      pageSize: response.data.data.pageSize,
      totalElements: response.data.data.totalElements,
      totalPages: response.data.data.totalPages,
      orders,
    },
  };
};

export const getAdminCustomerOrdersWithFilters = async (params?: {
  page?: number;
  size?: number;
  status?: string;
  paymentStatus?: string;
  method?: string;
  source?: string;
}): Promise<AdminOrdersApiResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    "/auth/v1/private/orders/filter",
    { params }
  );
  // Transform CustomerOrderPageResponse to AdminOrdersApiResponse format
  // Map orders to ensure all required fields are present (not undefined)
  const orders = (response.data.data.orders || []).map((order) => {
    const { items, ...restOrder } = order;
    return {
      ...restOrder,
      picId: order.picId ?? null,
      discountId: order.discountId ?? null,
      method: order.method ?? "",
      source: order.source ?? "",
      paymentStatus: order.paymentStatus ?? "",
      status: order.status ?? "",
      shippingFee: order.shippingFee ?? 0,
      totalProductPrice: order.totalProductPrice ?? 0,
      totalOrderPrice: order.totalOrderPrice ?? 0,
      notes: order.notes ?? "",
      discountOrderId: order.discountOrderId ?? null,
      discountShipId: order.discountShipId ?? null,
      cashReceived: order.cashReceived ?? null,
      changeAmount: order.changeAmount ?? null,
      shippingOrderCode: order.shippingOrderCode ?? null,
      shippingStatus: order.shippingStatus ?? null,
      shippingProvider: order.shippingProvider ?? null,
      trackingNumber: order.trackingNumber ?? null,
      expectedDeliveryDate: order.expectedDeliveryDate ?? null,
      // Only include items if it's the correct type, otherwise rely on orderDetails
      items: undefined, // Remove items field as it's incompatible type
    } as AdminOrderResponse;
  });
  return {
    status: response.data.status,
    message: response.data.message,
    data: {
      pageNumber: response.data.data.pageNumber,
      pageSize: response.data.data.pageSize,
      totalElements: response.data.data.totalElements,
      totalPages: response.data.data.totalPages,
      orders,
    },
  };
};

export const getAdminCustomerOrderDetail = async (
  id: number
): Promise<CustomerOrderResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderResponse>>(
    `/auth/v1/private/orders/${id}`
  );
  return response.data.data;
};

export const createAdminCustomerOrder = async (
  orderData: CustomerOrderCreateRequest
): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>(
    "/auth/v1/private/orders",
    orderData
  );
  return response.data;
};

export const updateAdminCustomerOrder = async (
  id: number,
  orderData: CustomerOrderUpdateRequest
): Promise<CustomerOrderResponse> => {
  const response = await api.put<ApiResponse<CustomerOrderResponse>>(
    `/auth/v1/private/orders/${id}`,
    orderData
  );
  return response.data.data;
};

export const confirmOrderAndCreateShipping = async (
  id: number,
  data: {
    pickShift: number[];
    requiredNote: string;
    paymentTypeId: number;
    serviceTypeId: number;
  }
): Promise<OrderConfirmResponse> => {
  // Transform camelCase to snake_case for backend
  const requestData = {
    pick_shift: data.pickShift,
    required_note: data.requiredNote,
    payment_type_id: data.paymentTypeId,
    service_type_id: data.serviceTypeId,
  };
  const response = await api.post<ApiResponse<OrderConfirmResponse>>(
    `/auth/v1/private/orders/${id}/confirm`,
    requestData
  );
  return response.data.data;
};

export const cancelAdminOrder = async (
  id: number
): Promise<OrderCancelResponse> => {
  const response = await api.post<ApiResponse<OrderCancelResponse>>(
    `/auth/v1/private/orders/${id}/cancel`
  );
  return response.data.data;
};

export const getOrderCounts = async (): Promise<OrderCountResponse> => {
  const response = await api.get<ApiResponse<OrderCountResponse>>(
    "/auth/v1/private/orders/counts"
  );
  return response.data.data;
};

export const syncShippingStatus = async (): Promise<{ syncedCount: number }> => {
  const response = await api.post<ApiResponse<{ syncedCount: number }>>(
    "/auth/v1/private/orders/sync-shipping-status"
  );
  return response.data.data;
};

// Order Detail APIs
export const getOrderDetails = async (params?: {
  page?: number;
  size?: number;
}): Promise<OrderDetailPageResponse> => {
  const response = await api.get<ApiResponse<OrderDetailPageResponse>>(
    "/order-details/v1/admin",
    { params }
  );
  return response.data.data;
};

export const getOrderDetailById = async (
  id: number
): Promise<OrderDetailResponse> => {
  const response = await api.get<ApiResponse<OrderDetailResponse>>(
    `/order-details/v1/admin/${id}`
  );
  return response.data.data;
};

// Order Detail Management APIs (per order)
export const getOrderDetailsByOrderId = async (
  orderId: number,
  params?: {
    page?: number;
    size?: number;
  }
): Promise<OrderDetailPageResponse> => {
  const response = await api.get<ApiResponse<OrderDetailPageResponse>>(
    `/auth/v1/private/orders/${orderId}/details`,
    { params }
  );
  return response.data.data;
};

export const getOrderDetailItem = async (
  orderId: number,
  detailId: number
): Promise<OrderDetailResponse> => {
  const response = await api.get<ApiResponse<OrderDetailResponse>>(
    `/auth/v1/private/orders/${orderId}/details/${detailId}`
  );
  return response.data.data;
};

export const createOrderDetail = async (
  orderId: number,
  detailData: OrderDetailCreateRequest
): Promise<OrderDetailResponse> => {
  const response = await api.post<ApiResponse<OrderDetailResponse>>(
    `/auth/v1/private/orders/${orderId}/details`,
    detailData
  );
  return response.data.data;
};

export const updateOrderDetail = async (
  orderId: number,
  detailId: number,
  detailData: OrderDetailUpdateRequest
): Promise<OrderDetailResponse> => {
  const response = await api.put<ApiResponse<OrderDetailResponse>>(
    `/auth/v1/private/orders/${orderId}/details/${detailId}`,
    detailData
  );
  return response.data.data;
};

// Order History APIs
export const getOrderHistory = async (params?: {
  page?: number;
  size?: number;
  orderId?: number;
  customerId?: number;
  fromDate?: string;
  toDate?: string;
}): Promise<OrderHistoryPageResponse> => {
  const response = await api.get<ApiResponse<OrderHistoryPageResponse>>(
    "/order-history/v1/admin",
    { params }
  );
  return response.data.data;
};

export const getOrderHistoryDetail = async (
  historyId: number
): Promise<OrderHistoryPageResponse["content"][0]> => {
  const response = await api.get<
    ApiResponse<OrderHistoryPageResponse["content"][0]>
  >(`/order-history/v1/admin/${historyId}`);
  return response.data.data;
};

export const createOrderHistory = async (
  historyData: OrderHistoryCreateRequest
): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>(
    "/order-history/v1/admin",
    historyData
  );
  return response.data;
};

export const updateOrderHistory = async (
  historyId: number,
  historyData: OrderHistoryUpdateRequest
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    `/order-history/v1/admin/${historyId}`,
    historyData
  );
  return response.data;
};

export const deleteOrderHistory = async (
  historyId: number
): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(
    `/order-history/v1/admin/${historyId}`
  );
  return response.data;
};

// Order History Management APIs (per order)
export const getOrderHistoriesByOrderId = async (
  orderId: number,
  params?: {
    eventType?: string;
    actorType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }
): Promise<OrderHistoryPageResponse> => {
  const response = await api.get<ApiResponse<OrderHistoryPageResponse>>(
    `/auth/v1/private/orders/${orderId}/histories`,
    { params }
  );
  return response.data.data;
};

export const getOrderHistoryByOrderAndHistoryId = async (
  orderId: number,
  historyId: number
): Promise<OrderHistoryResponse> => {
  const response = await api.get<ApiResponse<OrderHistoryResponse>>(
    `/auth/v1/private/orders/${orderId}/histories/${historyId}`
  );
  return response.data.data;
};

// Cart APIs moved to cartApi.ts

// Review APIs
export const getReviews = async (params?: {
  page?: number;
  size?: number;
  productId?: number;
  rating?: number;
}): Promise<ReviewPageResponse> => {
  const response = await api.get<ApiResponse<ReviewPageResponse>>(
    "/reviews/v1",
    { params }
  );
  return response.data.data;
};

export const getReviewDetail = async (id: number): Promise<ReviewResponse> => {
  const response = await api.get<ApiResponse<ReviewResponse>>(
    `/reviews/v1/${id}`
  );
  return response.data.data;
};

export const createReview = async (
  reviewData: ReviewCreateRequest
): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>(
    "/reviews/v1",
    reviewData
  );
  return response.data;
};

export const updateReview = async (
  id: number,
  reviewData: ReviewUpdateRequest
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    `/reviews/v1/${id}`,
    reviewData
  );
  return response.data;
};

export const deleteReview = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/reviews/v1/${id}`);
  return response.data;
};

// POS APIs
export const searchProductsPOS = async (params: {
  keyword: string;
  page?: number;
  size?: number;
}): Promise<SaleProductPageResponse> => {
  const response = await api.get<ApiResponse<SaleProductPageResponse>>(
    "/sale/v1/pos/search",
    { params }
  );
  return response.data.data;
};

export const searchCustomersPOS = async (
  keyword: string
): Promise<CustomerResponse[]> => {
  const response = await api.get<ApiResponse<CustomerResponse[]>>(
    "/sale/v1/pos/customers/search",
    {
      params: { keyword },
    }
  );
  return response.data.data;
};

export const getAvailableDiscounts = async (): Promise<DiscountResponse[]> => {
  const response = await api.get<ApiResponse<DiscountResponse[]>>(
    "/sale/v1/pos/discounts/available"
  );
  return response.data.data;
};

export const getDraftOrder = async (
  orderId: number
): Promise<DraftOrderResponse> => {
  const response = await api.get<ApiResponse<DraftOrderResponse>>(
    `/sale/v1/pos/draft-orders/${orderId}`
  );
  return response.data.data;
};

export const getAllDraftOrders = async (): Promise<DraftOrderResponse[]> => {
  const response = await api.get<ApiResponse<DraftOrderResponse[]>>(
    "/sale/v1/pos/draft-orders"
  );
  return response.data.data;
};

export const createDraftOrder = async (): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>(
    "/sale/v1/pos/draft-orders"
  );
  return response.data;
};

export const deleteDraftOrder = async (
  orderId: number
): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(
    `/sale/v1/pos/draft-orders/${orderId}`
  );
  return response.data;
};

export const updateOrderItem = async (
  orderId: number,
  request: UpdateOrderItemRequest
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    `/sale/v1/pos/orders/${orderId}/items`,
    request
  );
  return response.data;
};

export const addOrderItem = async (
  orderId: number,
  request: AddOrderItemRequest
): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(
    `/sale/v1/pos/orders/${orderId}/items`,
    request
  );
  return response.data;
};

export const updateCustomer = async (
  orderId: number,
  request: UpdateCustomerRequest
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    `/sale/v1/pos/orders/${orderId}/customer`,
    request
  );
  return response.data;
};

export const applyDiscount = async (
  orderId: number,
  request: ApplyDiscountRequest
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    `/sale/v1/pos/orders/${orderId}/discount`,
    request
  );
  return response.data;
};

export const updateNote = async (
  orderId: number,
  request: UpdateNoteRequest
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    `/sale/v1/pos/orders/${orderId}/note`,
    request
  );
  return response.data;
};

export const checkout = async (
  orderId: number,
  request: CheckoutRequest
): Promise<CheckoutResponse> => {
  const response = await api.post<ApiResponse<CheckoutResponse>>(
    `/sale/v1/pos/orders/${orderId}/checkout`,
    request
  );
  return response.data.data;
};
