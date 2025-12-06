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
  console.log('🛒 Adding to cart:', { productDetailId, quantity });
  
  try {
    console.log('🛒 Attempting to add to cart...');
    console.log('🔗 Request URL will be:', `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/auth/v1/private/checkout/cart?productDetailId=${productDetailId}&quantity=${quantity}`);
    
    // Log the access token for debugging
    const token = localStorage.getItem('accessToken');
    console.log('🔑 Using token:', token ? `${token.substring(0, 50)}...` : 'NO TOKEN');
    
    const response = await api.post<ApiResponse<null>>(
      "/auth/v1/private/checkout/cart",
      null,
      {
        params: { productDetailId, quantity },
      }
    );
    
    console.log('✅ Add to cart success:', response.data);
    return response.data;
  } catch (error) {
    const errorInfo = {
      productDetailId,
      quantity,
      error: error instanceof Error ? error.message : String(error),
      status: (error as any)?.response?.status,
      responseData: (error as any)?.response?.data
    };
    
    console.error('❌ Add to cart failed:', errorInfo);
    
    // Log full error response for debugging
    if ((error as any)?.response) {
      console.error('📋 Full error response:', {
        status: (error as any).response.status,
        statusText: (error as any).response.statusText,
        data: (error as any).response.data,
        headers: (error as any).response.headers
      });
    }
    
    // Handle specific error cases
    if ((error as any)?.response?.status === 401) {
      console.error('🔐 Authentication required - user needs to login');
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
