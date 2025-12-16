// src/api/endpoints/reviewApi.ts - Review API calls
import api from "../apiClient";
import type {
  ApiResponse,
  ReviewResponse,
  ReviewPageResponse,
  ReviewCreateRequest,
  ReviewUpdateRequest,
} from "../../types";

// Review APIs
// Public endpoint for getting reviews by productDetailId (no auth required)
export const getPublicReviews = async (params: {
  productDetailId: number;
  page?: number;
  size?: number;
}): Promise<ReviewPageResponse> => {
  const response = await api.get<ApiResponse<ReviewPageResponse>>(
    `/auth/v1/reviews/public/product-detail/${params.productDetailId}`,
    { 
      params: {
        page: params.page ?? 1,
        size: params.size ?? 10,
      }
    }
  );
  return response.data.data;
};

// Public endpoint for getting reviews by productId (all variants) (no auth required)
export const getPublicReviewsByProduct = async (params: {
  productId: number;
  page?: number;
  size?: number;
}): Promise<ReviewPageResponse> => {
  const response = await api.get<ApiResponse<ReviewPageResponse>>(
    `/auth/v1/reviews/public/product/${params.productId}`,
    { 
      params: {
        page: params.page ?? 1,
        size: params.size ?? 10,
      }
    }
  );
  return response.data.data;
};

// Private endpoint for admin/user to get reviews (requires auth)
export const getReviews = async (params?: {
  userId?: number;
  productDetailId?: number;
  page?: number;
  size?: number;
}): Promise<ReviewPageResponse> => {
  const response = await api.get<ApiResponse<ReviewPageResponse>>(
    "/auth/v1/private/reviews",
    { params }
  );
  return response.data.data;
};

// Customer endpoint for getting their own reviews
export const getMyReviews = async (params?: {
  page?: number;
  size?: number;
}): Promise<ReviewPageResponse> => {
  const response = await api.get<ApiResponse<ReviewPageResponse>>(
    "/auth/v1/reviews/my",
    { params }
  );
  return response.data.data;
};

export const getReviewDetail = async (id: number): Promise<ReviewResponse> => {
  const response = await api.get<ApiResponse<ReviewResponse>>(
    `/auth/v1/private/reviews/${id}`
  );
  return response.data.data;
};

// Customer endpoint for creating review (uses orderId, backend will find orderHistoryId)
export const createMyReview = async (reviewData: {
  orderId: number;
  productDetailId: number;
  images?: string[];
  rating: number;
  judging?: string;
}): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>(
    "/auth/v1/reviews/my",
    reviewData
  );
  return response.data;
};

// Admin endpoint for creating review (requires all fields including orderHistoryId)
export const createReview = async (
  reviewData: ReviewCreateRequest
): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>(
    "/auth/v1/private/reviews",
    reviewData
  );
  return response.data;
};

export const updateReview = async (
  id: number,
  reviewData: ReviewUpdateRequest
): Promise<ApiResponse<ReviewResponse>> => {
  const response = await api.put<ApiResponse<ReviewResponse>>(
    `/auth/v1/private/reviews/${id}`,
    reviewData
  );
  return response.data;
};

export const deleteReview = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(
    `/auth/v1/private/reviews/${id}`
  );
  return response.data;
};
