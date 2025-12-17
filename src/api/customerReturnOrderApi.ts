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
  reason?: string;
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
  id: string;
  orderCode: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerUsername: string;
  productName: string;
  productVariant?: string;
  productImage?: string;
  totalAmount: number;
  paymentMethod: string;
  reason: string;
  statusLabel: string;
  statusKey: string;
  refundStatus: string;
  refundStatusLabel: string;
  source: "Website" | "POS";
  category: string;
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

  // Get customer return orders
  async getCustomerReturnOrders(): Promise<ReturnOrderResponse[]> {
    try {
      const response = await apiClient.get<ApiResponse<ReturnOrderResponse[]>>(
        this.baseUrl
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

