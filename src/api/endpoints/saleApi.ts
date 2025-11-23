// src/api/endpoints/saleApi.ts - Sale POS API calls
import api from '../apiClient';
import type {
  ApiResponse,
  SaleProductListResponse,
  CustomerSearchListResponse,
  DiscountResponse,
  DraftOrderResponse,
  DraftOrderDetailResponse,
  CheckoutResponse,
  AddItemToOrderRequest,
  UpdateItemQuantityRequest,
  AssignCustomerToOrderRequest,
  UpdateNoteRequest,
  CheckoutRequest,
  RemoveItemFromDraftOrderRequest,
} from '@/types/api';

// Sale POS APIs
export const searchProducts = async (keyword?: string): Promise<SaleProductListResponse> => {
  const response = await api.get<ApiResponse<SaleProductListResponse>>('/auth/v1/private/sale/search', {
    params: { keyword }
  });
  return response.data.data ?? [];
};

export const searchCustomers = async (keyword?: string): Promise<CustomerSearchListResponse> => {
  const response = await api.get<ApiResponse<CustomerSearchListResponse>>('/auth/v1/private/sale/pos/customers/search', {
    params: { keyword }
  });
  return response.data.data ?? [];
};

export const getAvailableDiscounts = async (): Promise<DiscountResponse[]> => {
  const response = await api.get<ApiResponse<DiscountResponse[]>>('/auth/v1/private/sale/pos/discounts/available');
  return response.data.data ?? [];
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
  try {
    const response = await api.post<ApiResponse<DraftOrderResponse>>('/auth/v1/private/sale/draft-orders');
    console.log('createNewDraftOrder response:', response);
    
    // Kiểm tra nếu response có data
    if (!response.data) {
      throw new Error('API không trả về dữ liệu');
    }
    
    // Kiểm tra nếu có lỗi trong response (status >= 400)
    if (response.data.status && response.data.status >= 400) {
      const errorMessage = response.data.message || 'Lỗi khi tạo hóa đơn nháp';
      
      // Xử lý trường hợp LIMIT_REACHED với message rõ ràng hơn
      if (errorMessage === 'LIMIT_REACHED') {
        throw new Error('Bạn đã đạt giới hạn tối đa 5 hóa đơn nháp. Vui lòng hoàn tất hoặc xóa một hóa đơn trước khi tạo mới.');
      }
      
      throw new Error(errorMessage);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error in createNewDraftOrder:', error);
    
    // Nếu đã là Error object với message rõ ràng, throw lại
    if (error instanceof Error && error.message.includes('giới hạn')) {
      throw error;
    }
    
    // Nếu có response từ server, throw với message từ server
    if (error.response?.data?.message) {
      const serverMessage = error.response.data.message;
      
      // Xử lý LIMIT_REACHED từ server
      if (serverMessage === 'LIMIT_REACHED') {
        throw new Error('Bạn đã đạt giới hạn tối đa 5 hóa đơn nháp. Vui lòng hoàn tất hoặc xóa một hóa đơn trước khi tạo mới.');
      }
      
      throw new Error(serverMessage);
    }
    
    // Nếu có message từ error
    if (error.message) {
      throw error;
    }
    
    // Default error
    throw new Error('Không thể tạo hóa đơn nháp. Vui lòng thử lại.');
  }
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

export const removeCustomerFromOrder = async (orderId: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/auth/v1/private/sale/pos/orders/${orderId}/customer`);
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