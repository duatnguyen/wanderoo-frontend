// src/api/endpoints/saleApi.ts - Sale POS API calls
import api from '../apiClient';
import type {
  ApiResponse,
  SaleProductPageResponse,
  CustomerSearchPageResponse,
  DiscountPageResponse,
  DraftOrderResponse,
  DraftOrderDetailResponse,
  CheckoutResponse,
  AddItemToOrderRequest,
  UpdateItemQuantityRequest,
  AssignCustomerToOrderRequest,
  UpdateNoteRequest,
  CheckoutRequest,
  RemoveItemFromDraftOrderRequest,
} from '../../types';

// Sale POS APIs
export const searchProducts = async (keyword?: string): Promise<SaleProductPageResponse> => {
  const response = await api.get<ApiResponse<SaleProductPageResponse>>('/auth/v1/private/sale/search', {
    params: { keyword }
  });
  return response.data.data;
};

export const searchCustomers = async (keyword?: string): Promise<CustomerSearchPageResponse> => {
  const response = await api.get<ApiResponse<CustomerSearchPageResponse>>('/auth/v1/private/sale/pos/customers/search', {
    params: { keyword }
  });
  return response.data.data;
};

export const getAvailableDiscounts = async (): Promise<DiscountPageResponse> => {
  const response = await api.get<ApiResponse<DiscountPageResponse>>('/auth/v1/private/sale/pos/discounts/available');
  return response.data.data;
};

export const getDraftOrderDetail = async (orderId: number): Promise<DraftOrderDetailResponse> => {
  const response = await api.get<ApiResponse<DraftOrderDetailResponse>>(`/auth/v1/private/sale/draft-orders/${orderId}`);
  return response.data.data;
};

export const getOrCreateDraftOrders = async (): Promise<DraftOrderResponse[]> => {
  const response = await api.get<ApiResponse<DraftOrderResponse[]>>('/auth/v1/private/sale/draft-orders');
  return response.data.data;
};

export const createNewDraftOrder = async (): Promise<ApiResponse<DraftOrderResponse>> => {
  const response = await api.post<ApiResponse<DraftOrderResponse>>('/auth/v1/private/sale/draft-orders');
  return response.data;
};

export const updateItemQuantity = async (orderId: number, request: UpdateItemQuantityRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/sale/orders/${orderId}/items`, request);
  return response.data;
};

export const addItemToOrder = async (orderId: number, request: AddItemToOrderRequest): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(`/auth/v1/private/sale/orders/${orderId}/items`, request);
  return response.data;
};

export const assignCustomerToOrder = async (orderId: number, request: AssignCustomerToOrderRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/sale/pos/orders/${orderId}/customer`, request);
  return response.data;
};

export const applyDiscountToOrder = async (orderId: number): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(`/auth/v1/private/sale/pos/orders/${orderId}/apply-discount`);
  return response.data;
};

export const removeOrderDiscount = async (orderId: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/auth/v1/private/sale/pos/orders/${orderId}/remove-order-discount`);
  return response.data;
};

export const updateOrderNote = async (orderId: number, request: UpdateNoteRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/sale/pos/orders/${orderId}/note`, request);
  return response.data;
};

export const checkoutOrder = async (orderId: number, request: CheckoutRequest): Promise<ApiResponse<CheckoutResponse>> => {
  const response = await api.post<ApiResponse<CheckoutResponse>>(`/auth/v1/private/sale/pos/orders/${orderId}/checkout`, request);
  return response.data;
};

export const removeItemFromDraftOrder = async (orderId: number, request: RemoveItemFromDraftOrderRequest): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/auth/v1/private/sale/orders/${orderId}/items`, { data: request });
  return response.data;
};

export const deleteDraftOrder = async (orderId: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/auth/v1/private/sale/draft-orders/${orderId}`);
  return response.data;
};