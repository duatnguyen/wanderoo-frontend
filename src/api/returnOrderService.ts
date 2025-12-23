import apiClient from './apiClient';

// API Response interface matching backend ApiResponse
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
}

// UserInfo interface matching backend
export interface UserInfo {
  id: number;
  name: string;
  image?: string;
  username: string;
  phone?: string;
}

// Data interfaces matching backend DTOs
export interface ReturnOrderListItem {
  id: number; // Changed from string to number to match backend Long
  returnOrderCode: string; // Only returnOrderCode, no orderCode
  createdAt: string;
  totalAmount: number;
  paymentMethod: string;
  returnReason?: string;
  returnReasonNote?: string;
  buyerOptions?: string[];
  statusLabel: string;
  statusKey: ReturnOrderStatus;
  resolutionNote?: string;
  forwardShippingStatus?: string;
  returnShippingStatus?: string;
  refundStatus: RefundStatus;
  refundStatusLabel: string;
  source: "Website" | "POS";
  category: ReturnOrderCategory;
  sourceNote?: string;
  picId?: number;
  picName?: string;
  lastUpdated?: string;
  priority?: number;
  returnOrderDetails?: ReturnOrderDetailItem[]; // Use snapshot data from details
  userInfo?: UserInfo; // User information
}

export interface ReturnOrderDetailItem {
  id: number;
  returnOrderId: number;
  productDetailId: number;
  orderDetailId: number;
  returnQuantity: number;
  quantityReceived: number;
  receivedStatus: string;
  refundedStatus: string;
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

export interface ReturnOrderDetail {
  id: string;
  orderCode: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerUsername: string;
  customerEmail?: string;
  customerPhone?: string;
  productName: string;
  productVariant?: string;
  productImage?: string;
  totalAmount: number;
  paymentMethod: string;
  returnReason?: string;
  returnReasonNote?: string;
  buyerOptions: string[];
  statusLabel: string;
  statusKey: ReturnOrderStatus;
  resolutionNote?: string;
  forwardShippingStatus?: string;
  returnShippingStatus?: string;
  refundStatus: RefundStatus;
  refundStatusLabel: string;
  source: "Website" | "POS";
  category: ReturnOrderCategory;
  sourceNote?: string;
  adminNotes?: string;
  images?: string[]; // Images array from JSON
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ProcessReturnRequest {
  returnOrderId: number;
  notes?: string;
}

export type ReturnOrderCategory = "RETURN" | "CANCEL" | "FAILED";
export type ReturnOrderStatus = "UNDER_REVIEW" | "RETURNING" | "COMPLETED" | "INVALID";
export type RefundStatus = "WAITING" | "PARTIAL" | "DONE";

export interface GetReturnOrdersParams {
  search?: string;
  status?: string;
  category?: string;
  source?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface ReturnOrderStats {
  totalCount: number;
  pendingCount: number;
  processingCount: number;
  completedCount: number;
  cancelledCount: number;
}

class ReturnOrderService {
  private readonly baseUrl = '/auth/v1/private/return-orders';

  // Get paginated return orders for admin
  async getReturnOrders(params: GetReturnOrdersParams = {}): Promise<PageResponse<ReturnOrderListItem>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.category) queryParams.append('category', params.category);
      if (params.source) queryParams.append('source', params.source);
      if (params.fromDate) queryParams.append('fromDate', params.fromDate);
      if (params.toDate) queryParams.append('toDate', params.toDate);
      if (params.page !== undefined) queryParams.append('page', params.page.toString());
      if (params.size !== undefined) queryParams.append('size', params.size.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortDir) queryParams.append('sortDir', params.sortDir);

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      const response = await apiClient.get<ApiResponse<PageResponse<ReturnOrderListItem>>>(url);
      
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

  // Get return order detail by code
  async getReturnOrderDetail(returnOrderCode: string): Promise<ReturnOrderDetail> {
    try {
      const response = await apiClient.get<ApiResponse<ReturnOrderDetail>>(
        `${this.baseUrl}/${returnOrderCode}`
      );
      
      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch return order detail');
      }
    } catch (error: any) {
      console.error('Error fetching return order detail:', error);
      throw new Error(error?.response?.data?.message || 'Failed to fetch return order detail');
    }
  }

  // Approve return order
  async approveReturnOrder(returnOrderId: string, notes?: string): Promise<void> {
    try {
      const payload: ProcessReturnRequest = {
        returnOrderId: parseInt(returnOrderId),
        notes: notes || ''
      };

      const response = await apiClient.post<ApiResponse<null>>(
        `${this.baseUrl}/${returnOrderId}/approve`,
        payload
      );
      
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to approve return order');
      }
    } catch (error: any) {
      console.error('Error approving return order:', error);
      throw new Error(error?.response?.data?.message || 'Failed to approve return order');
    }
  }

  // Reject return order
  async rejectReturnOrder(returnOrderId: string, notes?: string): Promise<void> {
    try {
      const payload: ProcessReturnRequest = {
        returnOrderId: parseInt(returnOrderId),
        notes: notes || ''
      };

      const response = await apiClient.post<ApiResponse<null>>(
        `${this.baseUrl}/${returnOrderId}/reject`,
        payload
      );
      
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to reject return order');
      }
    } catch (error: any) {
      console.error('Error rejecting return order:', error);
      throw new Error(error?.response?.data?.message || 'Failed to reject return order');
    }
  }

  // Request more information
  async requestMoreInformation(returnOrderId: string, notes: string): Promise<void> {
    try {
      const payload: ProcessReturnRequest = {
        returnOrderId: parseInt(returnOrderId),
        notes: notes
      };

      const response = await apiClient.post<ApiResponse<null>>(
        `${this.baseUrl}/${returnOrderId}/request-info`,
        payload
      );
      
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to request more information');
      }
    } catch (error: any) {
      console.error('Error requesting more information:', error);
      throw new Error(error?.response?.data?.message || 'Failed to request more information');
    }
  }

  // Mark as receiving (APPROVED → RECEIVING)
  async markAsReceiving(returnOrderId: string, notes: string, shopFullAddress: string): Promise<void> {
    try {
      const payload = {
        returnOrderId: parseInt(returnOrderId),
        notes: notes || '',
        shopFullAddress: shopFullAddress
      };

      const response = await apiClient.post<ApiResponse<null>>(
        `${this.baseUrl}/${returnOrderId}/mark-as-receiving`,
        payload
      );
      
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to mark as receiving');
      }
    } catch (error: any) {
      console.error('Error marking as receiving:', error);
      throw new Error(error?.response?.data?.message || 'Failed to mark as receiving');
    }
  }

  // Confirm receipt of returned goods
  async confirmReceipt(returnOrderId: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<null>>(
        `${this.baseUrl}/${returnOrderId}/confirm-receipt`
      );
      
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Failed to confirm receipt');
      }
    } catch (error: any) {
      console.error('Error confirming receipt:', error);
      throw new Error(error?.response?.data?.message || 'Failed to confirm receipt');
    }
  }

  // Process refund
  async processRefund(returnOrderId: string): Promise<ReturnOrderDetail> {
    try {
      const response = await apiClient.post<ApiResponse<ReturnOrderDetail>>(
        `${this.baseUrl}/${returnOrderId}/process-refund`
      );
      
      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to process refund');
      }
    } catch (error: any) {
      console.error('Error processing refund:', error);
      throw new Error(error?.response?.data?.message || 'Failed to process refund');
    }
  }

  // Get shop address
  async getShopAddress(): Promise<{
    fullAddress: string;
    street?: string;
    wardName?: string;
    districtName?: string;
    provinceName?: string;
    wardCode?: string;
    districtId?: number;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        fullAddress: string;
        street?: string;
        wardName?: string;
        districtName?: string;
        provinceName?: string;
        wardCode?: string;
        districtId?: number;
      }>>(`${this.baseUrl}/shop-address`);
      
      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch shop address');
      }
    } catch (error: any) {
      console.error('Error fetching shop address:', error);
      throw new Error(error?.response?.data?.message || 'Failed to fetch shop address');
    }
  }

  // Get return order statistics
  async getStats(period: string = 'month'): Promise<ReturnOrderStats> {
    try {
      const response = await apiClient.get<ApiResponse<ReturnOrderStats>>(
        `${this.baseUrl}/stats?period=${period}`
      );
      
      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch stats');
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      throw new Error(error?.response?.data?.message || 'Failed to fetch stats');
    }
  }
}

export const returnOrderService = new ReturnOrderService();