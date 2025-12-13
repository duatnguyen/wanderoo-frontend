// src/api/endpoints/cartApi.ts - Cart management API calls
import api from "../apiClient";
import type {
  ApiResponse,
  CartPageResponse,
  SelectAllRequest,
  BackendCartResponse,
  SelectedCartWithShippingResponse,
  VoucherHistoryResponse,
  CalculateDiscountRequest,
  DiscountCalculationResponse
} from "../../types";

// Cart APIs
export const getCart = async (params?: {
  page?: number;
  size?: number;
}): Promise<CartPageResponse> => {
  const response = await api.get<ApiResponse<CartPageResponse>>(
    "/auth/v1/private/checkout/cart",
    { params }
  );
  return response.data.data;
};

export const addToCart = async (
  productDetailId: number,
  quantity: number = 1
): Promise<ApiResponse<null>> => {

  try {
    const token = localStorage.getItem('accessToken');
    const response = await api.post<ApiResponse<null>>(
      "/auth/v1/private/checkout/cart",
      null,
      {
        params: { productDetailId, quantity },
      }
    );

    return response.data;
  } catch (error) {
    const errorInfo = {
      productDetailId,
      quantity,
      error: error instanceof Error ? error.message : String(error),
      status: (error as any)?.response?.status,
      responseData: (error as any)?.response?.data
    };

    if ((error as any)?.response?.status === 401) {
    } else if ((error as any)?.response?.status === 500) {
      const errorMessage = (error as any)?.response?.data?.message;
      if (errorMessage?.includes('exceeds available stock')) {
        console.error('📦 Stock error - not enough inventory available');
      } else if (errorMessage?.includes('not found')) {
        console.error('🔍 Product not found - productDetailId may not exist');
      } else {
        console.error('🚫 Server error - check backend logs for details');
      }
    }

    throw error;
  }
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

export const updateCartItemProductDetail = async (
  cartId: number,
  newProductDetailId: number
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    "/auth/v1/private/checkout/cart/product-detail",
    null,
    {
      params: { cartId, newProductDetailId },
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

export const getSelectedCartItems = async (
  request: SelectAllRequest
): Promise<SelectedCartWithShippingResponse> => {
  const response = await api.post<ApiResponse<SelectedCartWithShippingResponse>>(
    "/auth/v1/private/checkout/cart/selected",
    request
  );
  return response.data.data;
};

export const calculateShippingFeeForAddress = async (
  addressId: number,
  request: SelectAllRequest
): Promise<number> => {
  const response = await api.post<ApiResponse<number>>(
    "/auth/v1/private/checkout/cart/shipping-fee",
    request,
    {
      params: { addressId },
    }
  );
  return response.data.data;
};

// Discount/Voucher APIs
export const getAvailableVouchersForCheckout = async (): Promise<VoucherHistoryResponse[]> => {
  const response = await api.get<ApiResponse<VoucherHistoryResponse[]>>(
    "/public/v1/discount/voucher/available-for-checkout"
  );
  return response.data.data;
};

export const getMyDiscountsFromVouchers = async (): Promise<VoucherHistoryResponse[]> => {
  const response = await api.get<ApiResponse<VoucherHistoryResponse[]>>(
    "/public/v1/discount/voucher/my-discounts"
  );
  return response.data.data;
};

export const calculateDiscount = async (
  request: CalculateDiscountRequest
): Promise<DiscountCalculationResponse> => {
  const response = await api.post<ApiResponse<DiscountCalculationResponse>>(
    "/public/v1/discount/calculate-discount",
    request
  );
  return response.data.data;
};
