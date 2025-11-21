// src/api/endpoints/cartApi.ts - Cart management API calls
import api from "../apiClient";
import type { ApiResponse, CartResponse, SelectAllRequest } from "../../types";

// Cart APIs
export const getCart = async (params?: {
  page?: number;
  size?: number;
}): Promise<CartResponse> => {
  const response = await api.get<ApiResponse<CartResponse>>(
    "/auth/v1/private/checkout/cart",
    { params }
  );
  return response.data.data;
};

export const addToCart = async (
  productDetailId: number,
  quantity: number = 1
): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(
    "/auth/v1/private/checkout/cart",
    null,
    {
      params: { productDetailId, quantity },
    }
  );
  return response.data;
};

export const updateCartItem = async (
  cartId: number,
  quantity: number
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    "/auth/v1/private/checkout/cart",
    null,
    {
      params: { cartId, quantity },
    }
  );
  return response.data;
};

export const removeCartItem = async (
  cartId: number
): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(
    "/auth/v1/private/checkout/cart",
    {
      params: { cartId },
    }
  );
  return response.data;
};

export const clearCart = async (
  request: SelectAllRequest
): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(
    "/auth/v1/private/checkout/cart/all",
    {
      data: request,
    }
  );
  return response.data;
};
