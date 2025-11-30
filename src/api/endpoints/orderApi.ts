// src/api/endpoints/orderApi.ts - Admin Order, Order Detail, Order History and Review API calls
import api from "../apiClient";
import type {
  ApiResponse,
  OrderPageResponse,
  OrderDetailResponse,
  OrderStatusUpdateRequest,
  OrderDetailPageResponse,
  OrderHistoryPageResponse,
  OrderHistoryCreateRequest,
  OrderHistoryUpdateRequest,
  ReviewPageResponse,
  ReviewResponse,
  ReviewCreateRequest,
  ReviewUpdateRequest,
  CustomerOrderPageResponse,
  CustomerOrderResponse,
} from "../../types";

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

// Customer Order APIs (Private Admin)
export const getAdminCustomerOrders = async (params?: {
  page?: number;
  size?: number;
}): Promise<CustomerOrderPageResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    "/auth/v1/private/orders",
    { params }
  );
  return response.data.data;
};

export const getAdminCustomerOrdersWithFilters = async (params?: {
  page?: number;
  size?: number;
  status?: string;
  paymentStatus?: string;
  method?: string;
  source?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<CustomerOrderPageResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    "/auth/v1/private/orders/filter",
    { params }
  );
  return response.data.data;
};

export const getPOSOrders = async (params?: {
  page?: number;
  size?: number;
}): Promise<CustomerOrderPageResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    "/auth/v1/private/orders/pos",
    { params }
  );
  return response.data.data;
};

export const getWebsiteOrders = async (params?: {
  page?: number;
  size?: number;
}): Promise<CustomerOrderPageResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    "/auth/v1/private/orders/website",
    { params }
  );
  return response.data.data;
};

export const getPOSOrdersWithFilters = async (params?: {
  status?: string;
  paymentStatus?: string;
  method?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}): Promise<CustomerOrderPageResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    "/auth/v1/private/orders/filter/pos",
    { params }
  );
  return response.data.data;
};

export const getWebsiteOrdersWithFilters = async (params?: {
  status?: string;
  paymentStatus?: string;
  method?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}): Promise<CustomerOrderPageResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderPageResponse>>(
    "/auth/v1/private/orders/filter/website",
    { params }
  );
  return response.data.data;
};

// Sync shipping status
export const syncShippingStatus = async (): Promise<{ syncedCount: number }> => {
  const response = await api.post<ApiResponse<{ syncedCount: number }>>(
    "/auth/v1/private/orders/sync-shipping-status"
  );
  return response.data.data;
};

// Get admin customer order detail
export const getAdminCustomerOrderDetail = async (
  code: string
): Promise<CustomerOrderResponse> => {
  const response = await api.get<ApiResponse<CustomerOrderResponse>>(
    `/auth/v1/private/orders/${code}`
  );
  return response.data.data;
};
