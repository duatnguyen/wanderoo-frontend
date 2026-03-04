// src/api/endpoints/posOrderApi.ts - POS Order API calls
import api from "../apiClient";
import type {
  ApiResponse,
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
} from "../../types";

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