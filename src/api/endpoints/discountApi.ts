// src/api/endpoints/discountApi.ts - Discount management API calls
import api from '../apiClient';
import type {
  ApiResponse,
  DiscountPageResponse,
  DiscountResponse,
  DiscountMetadataResponse,
  DiscountCreateRequest,
  SelectAllRequest,
} from '../../types';

// Discount APIs
export const getDiscounts = async (params?: {
  keyword?: string;
  sort?: string;
  page?: number;
  size?: number;
  state?: string;
}): Promise<DiscountPageResponse> => {
  const response = await api.get<ApiResponse<DiscountPageResponse>>('/auth/v1/private/discount', { params });
  return response.data.data;
};

export const getDiscountMetadata = async (): Promise<DiscountMetadataResponse> => {
  const response = await api.get<ApiResponse<DiscountMetadataResponse>>('/auth/v1/private/discount/metadata');
  return response.data.data;
};

export const getDiscountDetail = async (id: number): Promise<DiscountResponse> => {
  const response = await api.get<ApiResponse<DiscountResponse>>(`/auth/v1/private/discount/${id}`);
  return response.data.data;
};

export const createDiscount = async (discountData: DiscountCreateRequest): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>('/auth/v1/private/discount', discountData);
  return response.data;
};

export const updateDiscount = async (id: number, discountData: DiscountCreateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/discount/${id}`, discountData);
  return response.data;
};

export const deleteDiscount = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/auth/v1/private/discount/${id}`);
  return response.data;
};

export const deleteAllDiscounts = async (request: SelectAllRequest): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>('/auth/v1/private/discount', {
    data: request,
  });
  return response.data;
};