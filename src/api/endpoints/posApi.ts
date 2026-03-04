import apiClient from '../apiClient';
import type { ApiResponse, PageResponse } from '../../types/common';

// Request params for POS order list
export interface PosOrderListParams {
  search?: string;
  fromDate?: string; // yyyy-MM-dd
  toDate?: string; // yyyy-MM-dd
  page?: number;
  size?: number;
  sort?: string; // e.g. createdAt,desc
  paymentStatus?: string; // PAID, UNPAID, PARTIAL, REFUNDED
}

export interface PosOrderListItem {
  id: number;
  code: string;
  createdAt: string; // ISO date string from backend LocalDateTime
  totalOrderPrice: number;
  paymentStatus: string; // Enum: PAID, UNPAID, PARTIAL, REFUNDED
  createdBy: string;
}

// POS Order Detail Response (matches backend OrderDetailResponse)
export interface ProductOrderDetailResponse {
  id: number;
  productName: string;
  productImage?: string;
  productSku?: string; // SKU sản phẩm (mã sản phẩm)
  category?: string;
  unitPrice: number; // Giá sau giảm (discounted price)
  originalPrice?: number; // Giá gốc (original price)
  quantity: number;
  totalPrice: number;
}

export interface PaymentSummaryResponse {
  totalProductPrice: number;
  discountAmount: number; // Total discount (product + order)
  productDiscountAmount?: number; // Product discount only
  orderDiscountAmount?: number; // Order discount only
  totalOrderPrice: number;
  cashReceived: number;
  change: number;
}

export interface PosOrderDetailResponse {
  id: number;
  code: string;
  createdAt: string; // ISO date string
  createdBy: string;
  notes?: string;
  paymentStatus: string; // Enum: PAID, UNPAID, PARTIAL, REFUNDED
  orderStatus: string; // Enum from backend
  method: string; // Enum from backend
  from: string; // Enum: POS, WEBSITE
  products: ProductOrderDetailResponse[];
  paymentSummary: PaymentSummaryResponse;
}

// POS Order APIs
export const getPosOrderList = async (
  params: PosOrderListParams = {}
): Promise<PageResponse<PosOrderListItem>> => {
  const queryParams: Record<string, string> = {
    page: String(params.page ?? 0),
    size: String(params.size ?? 10),
  };

  if (params.search) queryParams.search = params.search;
  if (params.fromDate) queryParams.fromDate = params.fromDate;
  if (params.toDate) queryParams.toDate = params.toDate;
  if (params.sort) queryParams.sort = params.sort;
  if (params.paymentStatus) queryParams.paymentStatus = params.paymentStatus;

  const resp = await apiClient.get<ApiResponse<PageResponse<PosOrderListItem>>>(
    '/api/v1/pos/orders',
    { params: queryParams }
  );
  return resp.data.data;
};

export const getPosOrderDetail = async (
  id: number
): Promise<PosOrderDetailResponse> => {
  const resp = await apiClient.get<ApiResponse<PosOrderDetailResponse>>(
    `/api/v1/pos/orders/${id}`
  );
  return resp.data.data;
};

// POS Return Order APIs - types
export type ReturnTypeEnum = 'FULL' | 'PARTIAL';
// Align with backend enum vn.wanderoo.common.ReturnReasonEnum
// For POS we currently support:
// - DEFECTIVE: Sản phẩm lỗi
// - OTHER: Khách đổi ý / lý do khác
export type ReturnReasonEnum = 'DEFECTIVE' | 'OTHER';
export type ReturnStatusEnum = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface ReturnProductRequest {
  orderDetailId: number;
  returnQuantity: number;
  returnPrice: number;
}

export interface CreateReturnOrderRequest {
  orderId: number;
  returnType: ReturnTypeEnum;
  returnReason: ReturnReasonEnum;
  notes?: string;
  returnProducts: ReturnProductRequest[];
}

export interface ReturnOrderListParams {
  search?: string;
  returnType?: ReturnTypeEnum;
  returnReason?: ReturnReasonEnum;
  status?: ReturnStatusEnum;
  fromDate?: string; // yyyy-MM-dd
  toDate?: string; // yyyy-MM-dd
  page?: number;
  size?: number;
  sortBy?: string;
}

export interface ReturnOrderListItem {
  id: number;
  code: string;
  originalOrderCode: string;
  returnType: ReturnTypeEnum;
  returnReason: ReturnReasonEnum;
  status: ReturnStatusEnum;
  totalReturnAmount: number;
  createdAt: string; // ISO date string
  createdBy: string;
}

export type ReturnOrderListResponse = PageResponse<ReturnOrderListItem>;

export interface ReturnProductDetailResponse {
  id: number;
  productName: string;
  productSku?: string;
  productImage?: string;
  category?: string;
  originalQuantity: number;
  quantityRequested: number;
  unitPrice: number;
  totalReturnPrice: number;
}

export interface ReturnOrderDetailResponse {
  id: number;
  code: string;
  originalOrderCode: string;
  returnType: ReturnTypeEnum;
  returnReason: ReturnReasonEnum;
  status: ReturnStatusEnum;
  notes?: string;
  totalReturnAmount: number;
  createdAt: string; // ISO date string
  createdBy: string;
  returnProducts: ReturnProductDetailResponse[];
}

export const createPosReturnOrder = async (
  request: CreateReturnOrderRequest
): Promise<ReturnOrderDetailResponse> => {
  const resp = await apiClient.post<ApiResponse<ReturnOrderDetailResponse>>(
    '/api/v1/pos/returns',
    request
  );
  return resp.data.data;
};

export const getPosReturnOrderList = async (
  params: ReturnOrderListParams = {}
): Promise<PageResponse<ReturnOrderListItem>> => {
  const queryParams: Record<string, string> = {
    page: String(params.page ?? 0),
    size: String(params.size ?? 10),
  };

  if (params.search) queryParams.search = params.search;
  if (params.returnType) queryParams.returnType = params.returnType;
  if (params.returnReason) queryParams.returnReason = params.returnReason;
  if (params.status) queryParams.status = params.status;
  if (params.fromDate) queryParams.fromDate = params.fromDate;
  if (params.toDate) queryParams.toDate = params.toDate;
  if (params.sortBy) queryParams.sortBy = params.sortBy;

  const resp = await apiClient.get<ApiResponse<PageResponse<ReturnOrderListItem>>>(
    '/api/v1/pos/returns',
    { params: queryParams }
  );
  return resp.data.data;
};

export const getPosReturnOrderDetail = async (
  id: number
): Promise<ReturnOrderDetailResponse> => {
  const resp = await apiClient.get<ApiResponse<ReturnOrderDetailResponse>>(
    `/api/v1/pos/returns/${id}`
  );
  return resp.data.data;
};

export const cancelPosReturnOrder = async (id: number): Promise<void> => {
  await apiClient.put(`/api/v1/pos/returns/${id}/cancel`);
};

export const completePosReturnOrder = async (id: number): Promise<void> => {
  await apiClient.put(`/api/v1/pos/returns/${id}/complete`);
};
