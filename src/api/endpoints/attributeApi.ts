// src/api/endpoints/attributeApi.ts - Attribute management API calls
import api from "../apiClient";
import type {
  ApiResponse,
  CategoryParentPageResponse,
  CategoryChildPageResponse,
  CategoryParentCreateRequest,
  CategoryChildCreateRequest,
  CategoryParentUpdateRequest,
  CategoryChildUpdateRequest,
  SelectAllRequest,
} from "../../types";

// Category Parent APIs
export const getCategoryParentList = async (params?: {
  page?: number;
  size?: number;
}): Promise<CategoryParentPageResponse> => {
  const response = await api.get<ApiResponse<CategoryParentPageResponse>>(
    "/auth/v1/private/attribute/category-parent",
    { params }
  );
  return response.data.data;
};

export const createCategoryParent = async (
  categoryData: CategoryParentCreateRequest
): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>(
    "/auth/v1/private/attribute/category-parent",
    categoryData
  );
  return response.data;
};

export const updateCategoryParent = async (
  categoryData: CategoryParentUpdateRequest
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    "/auth/v1/private/attribute/category-parent",
    categoryData
  );
  return response.data;
};

// Category Child APIs
export const getCategoryChildListByParent = async (
  parentId: number,
  params?: {
    page?: number;
    size?: number;
  }
): Promise<CategoryChildPageResponse> => {
  const response = await api.get<ApiResponse<CategoryChildPageResponse>>(
    `/auth/v1/private/attribute/category-child/${parentId}`,
    { params }
  );
  return response.data.data;
};

export const getCategoryChildList = async (params?: {
  page?: number;
  size?: number;
}): Promise<CategoryChildPageResponse> => {
  const response = await api.get<ApiResponse<CategoryChildPageResponse>>(
    "/auth/v1/private/attribute/category-child",
    { params }
  );
  return response.data.data;
};

export const createCategoryChild = async (
  categoryData: CategoryChildCreateRequest
): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>(
    "/auth/v1/private/attribute/category-child",
    categoryData
  );
  return response.data;
};

export const updateCategoryChild = async (
  categoryData: CategoryChildUpdateRequest
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    "/auth/v1/private/attribute/category-child",
    categoryData
  );
  return response.data;
};

// Category Bulk Operations
export const enableAllCategories = async (
  request: SelectAllRequest
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    "/auth/v1/private/attribute/category/enable-all",
    request
  );
  return response.data;
};

export const disableAllCategories = async (
  request: SelectAllRequest
): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(
    "/auth/v1/private/attribute/category/disable-all",
    request
  );
  return response.data;
};

// Brand APIs
export const getBrandList = async (params?: {
  page?: number;
  size?: number;
}): Promise<any> => {
  // TODO: Define proper BrandPageResponse type
  const response = await api.get<ApiResponse<any>>(
    "/auth/v1/private/attribute/brand",
    { params }
  );
  return response.data.data;
};
