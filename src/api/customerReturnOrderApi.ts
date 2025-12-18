import apiClient from './apiClient';

// API Response interface matching backend ApiResponse
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
}

// Create Return Order Request DTO
export interface CreateReturnOrderRequest {
  orderId: number;
  returnType: string;
  returnReason?: string;
  returnReasonNote?: string;
  notes?: string;
  images?: string[];
  returnOrderDetails: CreateReturnOrderDetailRequest[];
}

export interface CreateReturnOrderDetailRequest {
  orderDetailId: number;
  productDetailId: number;
  returnQuantity: number;
  notes?: string;
}

// Return Order Response DTO
export interface ReturnOrderResponse {
  id: number;
  code: string;
  orderId: number;
  userId: number;
  picId?: number;
  status: string;
  returnReason?: string;
  returnReasonNote?: string;
  notes?: string;
  returnType?: string;
  totalProductAmount?: number;
  shippingFee?: number;
  totalRefundedAmount?: number;
  totalReturnAmount?: number;
  createdDate: string;
  updatedDate?: string;
  images?: string[];
  returnOrderDetails?: ReturnOrderDetailResponse[];
}

export interface ReturnOrderDetailResponse {
  id: number;
  returnOrderId: number;
  productDetailId: number;
  orderDetailId: number;
  returnQuantity: number;
  returnQuantityField?: number;
  quantityReceived?: number;
  receivedStatus?: string;
  refundedStatus?: string;
  refundedAmount?: number;
  notes?: string;
  returnPrice?: number;
  totalReturnPrice?: number;
  snapshotProductName?: string;
  snapshotProductPrice?: number;
  snapshotProductSku?: string;
  snapshotProductImageUrl?: string;
  snapshotVariantAttributes?: string;
  createdDate?: string;
  updatedDate?: string;
}

// Return Order Page Response
export interface ReturnOrderPageResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  returnOrders: ReturnOrderResponse[];
}

class CustomerReturnOrderApi {
  private readonly baseUrl = '/api/customer/return-orders';

  // Create return order
  async createReturnOrder(request: CreateReturnOrderRequest): Promise<ReturnOrderResponse> {
    try {
      const response = await apiClient.post<ApiResponse<ReturnOrderResponse>>(
        this.baseUrl,
        request
      );

      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create return order');
      }
    } catch (error: any) {
      console.error('Error creating return order:', error);
      throw new Error(error?.response?.data?.message || 'Failed to create return order');
    }
  }

  // Get customer return orders (with pagination)
  async getCustomerReturnOrders(params?: { page?: number; size?: number }): Promise<ReturnOrderPageResponse> {
    try {
      const response = await apiClient.get<ApiResponse<ReturnOrderPageResponse>>(
        this.baseUrl,
        { params }
      );

      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch return orders');
      }
    } catch (error: any) {
      console.error('Error fetching return orders:', error);
      throw new Error(error?.response?.data?.message || 'Failed to fetch return orders');
    }
  }

  // Get return order details
  async getReturnOrderDetails(returnOrderId: string): Promise<ReturnOrderResponse> {
    try {
      const response = await apiClient.get<ApiResponse<ReturnOrderResponse>>(
        `${this.baseUrl}/${returnOrderId}`
      );

      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch return order details');
      }
    } catch (error: any) {
      console.error('Error fetching return order details:', error);
      throw new Error(error?.response?.data?.message || 'Failed to fetch return order details');
    }
  }

  // Cancel return order
  async cancelReturnOrder(returnOrderId: string): Promise<ReturnOrderResponse> {
    try {
      const response = await apiClient.delete<ApiResponse<ReturnOrderResponse>>(
        `${this.baseUrl}/${returnOrderId}`
      );

      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to cancel return order');
      }
    } catch (error: any) {
      console.error('Error canceling return order:', error);
      throw new Error(error?.response?.data?.message || 'Failed to cancel return order');
    }
  }

  // Check return eligibility
  async checkReturnEligibility(orderId: number): Promise<boolean> {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(
        `${this.baseUrl}/check-eligibility/${orderId}`
      );

      if (response.data.status === 200 && response.data.data !== undefined) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to check return eligibility');
      }
    } catch (error: any) {
      console.error('Error checking return eligibility:', error);
      throw new Error(error?.response?.data?.message || 'Failed to check return eligibility');
    }
  }
}

export const customerReturnOrderApi = new CustomerReturnOrderApi();

