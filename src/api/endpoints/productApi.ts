// src/api/endpoints/productApi.ts - Product and Category API calls
import api from '../apiClient';
import type {
  ApiResponse,
  ProductResponse,
  ProductPageResponse,
  VariantResponse,
  VariantPageResponse,
  ProductCreateRequest,
  ProductUpdateRequest,
  VariantUpdateRequest,
  ProductStatusRequest,
  VariantQuantityUpdateRequest,
  CategoryParentPageResponse,
  CategoryChildPageResponse,
  CategoryParentCreateRequest,
  CategoryChildCreateRequest,
  CategoryParentUpdateRequest,
  CategoryChildUpdateRequest,
  VariantDetailIdRequest,
  AdminProductPageResponse,
} from '../../types';

type ProductListQuery = {
  keyword?: string;
  sort?: string;
  page?: number;
  size?: number;
};

// Public Product APIs
export const getProductDetail = async (id: number): Promise<ProductResponse> => {
  const response = await api.get<ApiResponse<ProductResponse>>(`/auth/v1/public/product/${id}`);
  return response.data.data;
};

export const getProductVariants = async (variantRequest: VariantDetailIdRequest): Promise<VariantResponse> => {
  const response = await api.post<ApiResponse<VariantResponse>>('/auth/v1/public/product/variants', variantRequest);
  return response.data.data;
};

// Admin Product APIs (Private v1)
export const createProductPrivate = async (productData: ProductCreateRequest): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>('/auth/v1/private/product/', productData);
  return response.data;
};

export const getAllProductsPrivate = async (params?: ProductListQuery): Promise<AdminProductPageResponse> => {
  const response = await api.get<ApiResponse<AdminProductPageResponse>>('/auth/v1/private/product/', { params });
  return response.data.data;
};

export const getActiveProductsPrivate = async (params?: ProductListQuery): Promise<AdminProductPageResponse> => {
  const response = await api.get<ApiResponse<AdminProductPageResponse>>('/auth/v1/private/product/active', { params });
  return response.data.data;
};

export const getInactiveProductsPrivate = async (params?: ProductListQuery): Promise<AdminProductPageResponse> => {
  const response = await api.get<ApiResponse<AdminProductPageResponse>>('/auth/v1/private/product/inactive', { params });
  return response.data.data;
};

export const getProductDetailPrivate = async (id: number): Promise<ProductResponse> => {
  const response = await api.get<ApiResponse<ProductResponse>>(`/auth/v1/private/product/${id}`);
  return response.data.data;
};

export const getProductVariantsPrivate = async (productId: number, params?: {
  page?: number;
  size?: number;
  sort?: string;
}): Promise<VariantPageResponse> => {
  const response = await api.get<ApiResponse<VariantPageResponse>>(`/auth/v1/private/product/${productId}/variants`, { params });
  return response.data.data;
};

export const getVariantDetailPrivate = async (variantId: number): Promise<VariantResponse> => {
  const response = await api.get<ApiResponse<VariantResponse>>(`/auth/v1/private/product/variant/${variantId}`);
  return response.data.data;
};

export const updateProductPrivate = async (productData: ProductUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/product/', productData);
  return response.data;
};

export const updateVariantPrivate = async (variantData: VariantUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/product/variant', variantData);
  return response.data;
};

type SelectIdsRequest = {
  getAll: number[];
};

export const disableProductsPrivate = async (request: SelectIdsRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/product/disable', request);
  return response.data;
};

export const enableProductsPrivate = async (request: SelectIdsRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/product/enable', request);
  return response.data;
};

export const updateSellingQuantityPrivate = async (request: any): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/product/variant/selling-quantity', request);
  return response.data;
};

// Admin Product APIs
export const createProduct = async (productData: ProductCreateRequest): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>('/products/v1/admin/', productData);
  return response.data;
};

export const getAllProducts = async (params?: {
  keyword?: string;
  page?: number;
  size?: number;
}): Promise<ProductPageResponse> => {
  const response = await api.get<ApiResponse<ProductPageResponse>>('/products/v1/admin/', { params });
  return response.data.data;
};

export const getActiveProducts = async (): Promise<ProductPageResponse> => {
  const response = await api.get<ApiResponse<ProductPageResponse>>('/products/v1/admin/active');
  return response.data.data;
};

export const getInactiveProducts = async (): Promise<ProductPageResponse> => {
  const response = await api.get<ApiResponse<ProductPageResponse>>('/products/v1/admin/inactive');
  return response.data.data;
};

export const getAdminProductDetail = async (id: number): Promise<ProductResponse> => {
  const response = await api.get<ApiResponse<ProductResponse>>(`/products/v1/admin/${id}`);
  return response.data.data;
};

export const getProductVariantsAdmin = async (productId: number): Promise<VariantPageResponse> => {
  const response = await api.get<ApiResponse<VariantPageResponse>>(`/products/v1/admin/${productId}/variants`);
  return response.data.data;
};

export const getVariantDetail = async (variantId: number): Promise<VariantResponse> => {
  const response = await api.get<ApiResponse<VariantResponse>>(`/products/v1/admin/variant/${variantId}`);
  return response.data.data;
};

export const updateProduct = async (productData: ProductUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/products/v1/admin/', productData);
  return response.data;
};

export const updateVariant = async (variantData: VariantUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/products/v1/admin/variant', variantData);
  return response.data;
};

export const disableProduct = async (productData: ProductStatusRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/products/v1/admin/disable', productData);
  return response.data;
};

export const enableProduct = async (productData: ProductStatusRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/products/v1/admin/enable', productData);
  return response.data;
};

export const updateSellingQuantity = async (quantityData: VariantQuantityUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/products/v1/admin/variant/selling-quantity', quantityData);
  return response.data;
};

// Category APIs
export const getParentCategories = async (): Promise<CategoryParentPageResponse> => {
  const response = await api.get<ApiResponse<CategoryParentPageResponse>>('/attributes/v1/admin/category-parent');
  return response.data.data;
};

export const getChildCategories = async (parentId: number): Promise<CategoryChildPageResponse> => {
  const response = await api.get<ApiResponse<CategoryChildPageResponse>>(`/attributes/v1/admin/category-child/${parentId}`);
  return response.data.data;
};

export const createParentCategory = async (categoryData: CategoryParentCreateRequest): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>('/attributes/v1/admin/category-parent', categoryData);
  return response.data;
};

export const createChildCategory = async (categoryData: CategoryChildCreateRequest): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>('/attributes/v1/admin/category-child', categoryData);
  return response.data;
};

export const updateParentCategory = async (categoryData: CategoryParentUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/attributes/v1/admin/category-parent', categoryData);
  return response.data;
};

export const updateChildCategory = async (categoryData: CategoryChildUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/attributes/v1/admin/category-child', categoryData);
  return response.data;
};

export const enableAllCategories = async (): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/attributes/v1/admin/category/enable-all');
  return response.data;
};