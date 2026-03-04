import apiClient from './apiClient';

// API Response interface matching backend ApiResponse
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
}

// API Response interface matching backend ReturnOrderResponseDTO
export interface ApiReturnOrderResponse {
  id: number;
  code: string;
  orderId: number;
  userId: number;
  picId?: number;
  status: string; // Raw status from DB
  statusKey?: string; // Mapped status key (UNDER_REVIEW, RETURNING, COMPLETED, INVALID)
  statusLabel?: string; // Mapped status label in Vietnamese
  returnReason?: string; // Raw return reason enum name
  returnReasonLabel?: string; // Mapped return reason description in Vietnamese
  returnReasonNote?: string;
  notes?: string;
  returnType?: string; // Raw return type from DB
  returnTypeLabel?: string; // Mapped return type label in Vietnamese
  category?: string; // Mapped category (RETURN, CANCEL, FAILED)
  totalProductAmount?: number;
  shippingFee?: number;
  totalRefundedAmount?: number;
  totalReturnAmount?: number;
  createdDate?: string;
  updatedDate?: string;
  images?: string[];
  receiverName?: string; // From orders.receiver_name
  receiverPhone?: string; // From orders.receiver_phone
  receiverAddress?: string; // From orders.receiver_address
  forwardShippingStatus?: string; // From orders.shipping_status
  shippingOrderCode?: string; // From orders.shipping_order_code
  shippingProvider?: string; // From orders.shipping_provider
  refundMethod?: string;
  refundMethodLabel?: string;
  refundedStatus?: string;
  refundedStatusLabel?: string;
  rejectReason?: string; // Raw reject reason enum name
  rejectReasonLabel?: string; // Mapped reject reason description in Vietnamese
  userInfo?: UserInfo;
  returnOrderDetails?: ApiReturnOrderDetail[];
}

// API Response interface for return order details
export interface ApiReturnOrderDetail {
  id: number;
  returnOrderId: number;
  productDetailId?: number;
  orderDetailId?: number;
  quantityRequested: number;
  quantityReceived?: number;
  receivedStatus?: string;
  receivedStatusLabel?: string;
  refundedStatus?: string;
  refundedStatusLabel?: string;
  refundedAmount?: number;
  notes?: string;
  returnPrice?: number;
  totalReturnPrice?: number;
  snapshotProductName?: string;
  snapshotProductPrice?: number;
  snapshotProductFinalPrice?: number;
  snapshotProductSku?: string;
  snapshotProductImageUrl?: string;
  snapshotVariantAttributes?: string;
  createdDate?: string;
  updatedDate?: string;
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
  refundMethod?: 'CASH' | 'BANKING';
  rejectReason?: string; // ReturnRejectReason enum name
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

  // Get return order detail by code (raw API response)
  async getReturnOrderDetailRaw(returnOrderCode: string): Promise<ApiReturnOrderResponse> {
    try {
      const response = await apiClient.get<ApiResponse<ApiReturnOrderResponse>>(
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
  async approveReturnOrder(returnOrderId: string, notes?: string, refundMethod?: 'CASH' | 'BANKING'): Promise<void> {
    try {
      const payload: ProcessReturnRequest = {
        returnOrderId: parseInt(returnOrderId),
        notes: notes || '',
        refundMethod: refundMethod || 'BANKING'
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
  async rejectReturnOrder(returnOrderId: string, notes?: string, rejectReason?: string): Promise<void> {
    try {
      const payload: ProcessReturnRequest = {
        returnOrderId: parseInt(returnOrderId),
        notes: notes || '',
        rejectReason: rejectReason
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

  // Confirm receipt with details (quantity, condition, notes)
  async confirmReceiptWithDetails(
    returnOrderId: string,
    receiveItems: Array<{
      returnOrderDetailId: number;
      quantityReceived: number;
      condition: 'GOOD' | 'DAMAGED';
      notes?: string;
    }>
  ): Promise<ReturnOrderDetail> {
    try {
      const response = await apiClient.post<ApiResponse<ReturnOrderDetail>>(
        `${this.baseUrl}/${returnOrderId}/confirm-receipt-with-details`,
        receiveItems
      );

      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to confirm receipt with details');
      }
    } catch (error: any) {
      console.error('Error confirming receipt with details:', error);
      throw new Error(error?.response?.data?.message || 'Failed to confirm receipt with details');
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

  // Mark as refunding (RECEIVED -> REFUNDING) 
  async markAsRefunding(returnOrderId: string, data: {
    refundMethod: 'CASH' | 'BANKING';
    notes?: string;
    refundDetails?: Array<{
      returnOrderDetailId: number;
      refundNote: string;
    }>;
  }): Promise<ReturnOrderDetail> {
    try {
      const response = await apiClient.post<ApiResponse<ReturnOrderDetail>>(
        `${this.baseUrl}/${returnOrderId}/mark-as-refunding`,
        data
      );

      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to mark as refunding');
      }
    } catch (error: any) {
      console.error('Error marking as refunding:', error);
      throw new Error(error?.response?.data?.message || 'Failed to mark as refunding');
    }
  }

  // Complete return order (REFUNDING -> COMPLETED)
  async completeReturnOrder(returnOrderId: string): Promise<ReturnOrderDetail> {
    try {
      const response = await apiClient.post<ApiResponse<ReturnOrderDetail>>(
        `${this.baseUrl}/${returnOrderId}/complete`
      );

      if (response.data.status === 200 && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to complete return order');
      }
    } catch (error: any) {
      console.error('Error completing return order:', error);
      throw new Error(error?.response?.data?.message || 'Failed to complete return order');
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

  async getDeliveryAddresses(returnOrderCode: string): Promise<ApiResponse<{
    shopAddress: {
      fullAddress: string;
      street?: string;
      wardName?: string;
      districtName?: string;
      provinceName?: string;
      wardCode?: string;
      districtId?: number;
    };
    customerAddress: {
      fullAddress: string;
      receiverName?: string;
      receiverPhone?: string;
      street?: string;
      wardName?: string;
      districtName?: string;
      provinceName?: string;
      wardCode?: string;
      districtId?: number;
    };
  }>> {
    try {
      const response = await apiClient.get<ApiResponse<{
        shopAddress: {
          fullAddress: string;
          street?: string;
          wardName?: string;
          districtName?: string;
          provinceName?: string;
          wardCode?: string;
          districtId?: number;
        };
        customerAddress: {
          fullAddress: string;
          receiverName?: string;
          receiverPhone?: string;
          street?: string;
          wardName?: string;
          districtName?: string;
          provinceName?: string;
          wardCode?: string;
          districtId?: number;
        };
      }>>(
        `${this.baseUrl}/delivery-addresses/${returnOrderCode}`
      );

      if (response.data.status === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch delivery addresses');
      }
    } catch (error: any) {
      console.error('Error fetching delivery addresses:', error);
      throw new Error(error?.response?.data?.message || 'Failed to fetch delivery addresses');
    }
  }

  async fetchImageBlob(imageUrl: string): Promise<Blob> {
    try {
      // Extract path from full URL (apiClient has baseURL, so we need relative path)
      let imagePath = imageUrl;
      try {
        const url = new URL(imageUrl);
        imagePath = url.pathname; // Get only the path part
      } catch {
        // If it's already a relative path, use it as is
        if (imageUrl.startsWith('/')) {
          imagePath = imageUrl;
        } else {
          imagePath = `/${imageUrl}`;
        }
      }

      const response = await apiClient.get(imagePath, {
        responseType: 'blob',
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching image:', error);
      throw new Error(error?.response?.data?.message || 'Failed to fetch image');
    }
  }
}

export const returnOrderService = new ReturnOrderService();