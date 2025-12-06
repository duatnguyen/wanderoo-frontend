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
  originalPrice?: number | null; // For backward compatibility (import_price)
  salePrice?: number | null; // For backward compatibility (selling_price)
  discountPercent?: number | null; // For backward compatibility
  soldQuantity?: number | null;
  // New fields for newest products (similar to ProductCategoryItemResponse)
  rating?: number | null; // Average rating
  minSellingPrice?: number | null; // Minimum selling price
  discountSellingPrice?: number | null; // Discounted selling price
  discountValue?: string | null; // Discount value string (e.g., "-35%")
}

// Homepage APIs
export const getHomepageBanners = async (): Promise<HomepageBannerResponse[]> => {
  const response = await apiClient.get<ApiResponse<HomepageBannerResponse[]>>(
    '/public/v1/homepage/banners'
  );
  return response.data.data;
};

export const getTopDiscountProducts = async (
  limit: number = 12
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
  limit: number = 6
): Promise<HomepageProductResponse[]> => {
  console.log("=== API Call: getNewestProducts ===");
  console.log("Request limit parameter:", limit);
  console.log("Request URL:", '/public/v1/homepage/products/newest');
  console.log("Request params:", { limit });
  
  const response = await apiClient.get<ApiResponse<HomepageProductResponse[]>>(
    '/public/v1/homepage/products/newest',
    { 
      params: { limit },
      paramsSerializer: (params) => {
        console.log("=== Params Serializer ===", params);
        return new URLSearchParams(params as any).toString();
      }
    }
  );
  
  console.log("=== API Response ===");
  console.log("Full response:", response);
  console.log("Response data:", response.data);
  console.log("Response data.data:", response.data.data);
  console.log("Response data.data length:", response.data.data?.length);
  console.log("Response data.data items:", response.data.data?.map((p: any) => ({ id: p.productId, name: p.name })));
  
  return response.data.data || [];
};

export const getSuggestionProducts = async (
  size: number = 12
): Promise<HomepageProductResponse[]> => {
  const response = await apiClient.get<ApiResponse<HomepageProductResponse[]>>(
    '/public/v1/homepage/products/suggestions',
    { params: { size } }
  );
  return response.data.data;
};

