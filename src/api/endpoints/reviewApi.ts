// src/api/endpoints/reviewApi.ts - Review API calls
import api from '../apiClient';
import type {
  ApiResponse,
  ReviewResponse,
  ReviewPageResponse,
  ReviewCreateRequest,
  ReviewUpdateRequest,
} from '../../types';

// Review APIs
export const getReviews = async (params?: {
  userId?: number;
  productDetailId?: number;
  page?: number;
  size?: number;
}): Promise<ReviewPageResponse> => {
  const response = await api.get<ApiResponse<ReviewPageResponse>>('/auth/v1/private/reviews', { params });
  return response.data.data;
};

export const getReviewDetail = async (id: number): Promise<ReviewResponse> => {
  const response = await api.get<ApiResponse<ReviewResponse>>(`/auth/v1/private/reviews/${id}`);
  return response.data.data;
};

export const createReview = async (reviewData: ReviewCreateRequest): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>('/auth/v1/private/reviews', reviewData);
  return response.data;
};

export const updateReview = async (id: number, reviewData: ReviewUpdateRequest): Promise<ApiResponse<ReviewResponse>> => {
  const response = await api.put<ApiResponse<ReviewResponse>>(`/auth/v1/private/reviews/${id}`, reviewData);
  return response.data;
};

export const deleteReview = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/auth/v1/private/reviews/${id}`);
  return response.data;
};