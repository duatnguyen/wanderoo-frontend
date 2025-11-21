import apiClient from "../apiClient";
import type { PageResponse } from "../../types/common";

// Minimal types for POS order responses/requests
export interface PosOrderListParams {
  search?: string;
  fromDate?: string; // yyyy-MM-dd
  toDate?: string; // yyyy-MM-dd
  page?: number;
  size?: number;
  sort?: string; // e.g. createdAt,desc
}

export interface PosOrderListItem {
  id: number;
  code?: string;
  totalAmount?: number;
  status?: string;
  createdAt?: string;
}

export type PosOrderListResponse = PageResponse<PosOrderListItem>;

export interface PosOrderDetailResponse {
  id: number;
  code?: string;
  items?: Array<{
    id: number;
    productName?: string;
    quantity?: number;
    price?: number;
  }>;
  totalAmount?: number;
  status?: string;
  createdAt?: string;
}

// POS Order APIs
export const getPosOrderList = async (
  params: PosOrderListParams = {}
): Promise<PosOrderListResponse> => {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.fromDate) query.append("fromDate", params.fromDate);
  if (params.toDate) query.append("toDate", params.toDate);
  query.append("page", String(params.page ?? 0));
  query.append("size", String(params.size ?? 10));
  if (params.sort) query.append("sort", params.sort);

  const resp = await apiClient.get<PosOrderListResponse>(
    `/api/v1/pos/orders?${query.toString()}`
  );
  return resp.data;
};

export const getPosOrderDetail = async (
  id: number
): Promise<PosOrderDetailResponse> => {
  const resp = await apiClient.get<PosOrderDetailResponse>(
    `/api/v1/pos/orders/${id}`
  );
  return resp.data;
};

// POS Return Order APIs - types
export interface CreateReturnOrderRequest {
  orderId: number;
  note?: string;
  // items etc. Add fields as backend requires
}

export interface ReturnOrderListParams {
  search?: string;
  returnType?: string;
  returnReason?: string;
  status?: string;
  fromDate?: string; // yyyy-MM-dd
  toDate?: string; // yyyy-MM-dd
  page?: number;
  size?: number;
  sortBy?: string;
}

export interface ReturnOrderListItem {
  id: number;
  code?: string;
  createdBy?: string;
  status?: string;
  returnType?: string;
  createdAt?: string;
}

export type ReturnOrderListResponse = PageResponse<ReturnOrderListItem>;

export interface ReturnOrderDetailResponse {
  id: number;
  orderId?: number;
  items?: Array<{ id: number; productName?: string; quantity?: number }>;
  status?: string;
  createdAt?: string;
}

export const createPosReturnOrder = async (
  request: CreateReturnOrderRequest
): Promise<ReturnOrderDetailResponse> => {
  const resp = await apiClient.post<ReturnOrderDetailResponse>(
    "/api/v1/pos/returns",
    request
  );
  return resp.data;
};

export const getPosReturnOrderList = async (
  params: ReturnOrderListParams = {}
): Promise<ReturnOrderListResponse> => {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.returnType) query.append("returnType", params.returnType);
  if (params.returnReason) query.append("returnReason", params.returnReason);
  if (params.status) query.append("status", params.status);
  if (params.fromDate) query.append("fromDate", params.fromDate);
  if (params.toDate) query.append("toDate", params.toDate);
  query.append("page", String(params.page ?? 0));
  query.append("size", String(params.size ?? 10));
  if (params.sortBy) query.append("sortBy", params.sortBy);

  const resp = await apiClient.get<ReturnOrderListResponse>(
    `/api/v1/pos/returns?${query.toString()}`
  );
  return resp.data;
};

export const getPosReturnOrderDetail = async (
  id: number
): Promise<ReturnOrderDetailResponse> => {
  const resp = await apiClient.get<ReturnOrderDetailResponse>(
    `/api/v1/pos/returns/${id}`
  );
  return resp.data;
};

export const cancelPosReturnOrder = async (id: number): Promise<void> => {
  await apiClient.put(`/api/v1/pos/returns/${id}/cancel`);
};

export const completePosReturnOrder = async (id: number): Promise<void> => {
  await apiClient.put(`/api/v1/pos/returns/${id}/complete`);
};
