// src/api/endpoints/websiteOrderApi.ts - Website Order API calls
import api from "../apiClient";
import type {
  ApiResponse,
  CustomerOrderMetadataResponse,
  CustomerOrderPageResponse,
  CustomerOrderResponse,
  CreateOrderResponse,
  CustomerOrderCancelResponse,
  CustomerOrderCreateRequest,
  CustomerOrderUpdateRequest,
  OrderConfirmResponse,
  OrderCancelResponse,
  OrderCountResponse,
  OrderDetailPageResponse,
  OrderDetailResponse,
  OrderDetailCreateRequest,
  OrderDetailUpdateRequest,
  OrderHistoryPageResponse,
  OrderHistoryResponse,
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

// Admin Customer Order Management
export const getAdminCustomerOrders = async (params?: {
  page?: number;
  size?: number;
}): Promise<ApiResponse<CustomerOrderPageResponse>> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    "/auth/v1/private/orders",
    { params }
  );
  return response.data;
};

export const getAdminCustomerOrdersByStatus = async (
  status: string,
  params?: {
    page?: number;
    size?: number;
  }
): Promise<ApiResponse<CustomerOrderPageResponse>> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    `/auth/v1/private/orders/status/${status}`,
    { params }
  );
  return response.data;
};

export const getAdminCustomerOrdersWithFilters = async (params?: {
  page?: number;
  size?: number;
  status?: string;
  paymentStatus?: string;
  method?: string;
  source?: string;
}): Promise<ApiResponse<CustomerOrderPageResponse>> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    "/auth/v1/private/orders/filter",
    { params }
  );
  return response.data;
};

export const getAdminCustomerOrderDetail = async (
  code: string
): Promise<CustomerOrderResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderResponse>>(
    `/auth/v1/private/orders/${code}`
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

export const confirmOrder = async (
  id: number
): Promise<CustomerOrderResponse> => {
  const response = await api.post<ApiResponse<CustomerOrderResponse>>(
    `/auth/v1/private/orders/${id}/confirm`
  );
  return response.data.data;
};

export const createShippingOrder = async (
  id: number,
  data: {
    pickShift: number[];
    requiredNote: string;
    paymentTypeId: number;
    serviceTypeId: number;
    note?: string;
  }
): Promise<CustomerOrderResponse> => {
  // Transform camelCase to snake_case for backend
  const requestData: any = {
    pick_shift: data.pickShift,
    required_note: data.requiredNote,
    payment_type_id: data.paymentTypeId,
    service_type_id: data.serviceTypeId,
  };
  if (data.note) {
    requestData.note = data.note;
  }
  const response = await api.post<ApiResponse<CustomerOrderResponse>>(
    `/auth/v1/private/orders/${id}/shipping`,
    requestData
  );
  return response.data.data;
};

// Deprecated: Use createShippingOrder instead
export const confirmOrderAndCreateShipping = createShippingOrder;

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

export const updateShippingStatus = async (
  id: number,
  shippingStatus: string
): Promise<CustomerOrderResponse> => {
  const response = await api.put<ApiResponse<CustomerOrderResponse>>(
    `/auth/v1/private/orders/${id}/shipping-status`,
    null,
    { params: { shippingStatus } }
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