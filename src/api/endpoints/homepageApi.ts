// src/api/endpoints/homepageApi.ts - Homepage API calls
import apiClient from '../apiClient';
import type { ApiResponse } from '../../types/common';

// Homepage Banner Response
export interface HomepageBannerResponse {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  buttonText?: string;
  position: number;
}

// Homepage Product Response (matches backend response)
export interface HomepageProductResponse {
  productId: number;
  name: string;
  image?: string;
  originalPrice?: number | null;
  salePrice?: number | null;
  discountPercent?: number | null;
  soldQuantity?: number | null;
}

// Homepage APIs
export const getHomepageBanners = async (): Promise<HomepageBannerResponse[]> => {
  const response = await apiClient.get<ApiResponse<HomepageBannerResponse[]>>(
    '/public/v1/homepage/banners'
  );
  return response.data.data;
};

export const getTopDiscountProducts = async (
  limit: number = 5
): Promise<HomepageProductResponse[]> => {
  const response = await apiClient.get<ApiResponse<HomepageProductResponse[]>>(
    '/public/v1/homepage/products/top-discount',
    { params: { limit } }
  );
  return response.data.data;
};

export const getBestSellerProducts = async (
  year?: number,
  limit: number = 5
): Promise<HomepageProductResponse[]> => {
  const params: Record<string, any> = { limit };
  if (year) params.year = year;
  
  const response = await apiClient.get<ApiResponse<HomepageProductResponse[]>>(
    '/public/v1/homepage/products/best-seller',
    { params }
  );
  return response.data.data;
};

export const getNewestProducts = async (
  limit: number = 5
): Promise<HomepageProductResponse[]> => {
  const response = await apiClient.get<ApiResponse<HomepageProductResponse[]>>(
    '/public/v1/homepage/products/newest',
    { params: { limit } }
  );
  return response.data.data;
};

export const getSuggestionProducts = async (
  size: number = 15
): Promise<HomepageProductResponse[]> => {
  const response = await apiClient.get<ApiResponse<HomepageProductResponse[]>>(
    '/public/v1/homepage/products/suggestions',
    { params: { size } }
  );
  return response.data.data;
};

