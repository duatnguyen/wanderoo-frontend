// src/types/products.ts - Product and category types
import type { PageResponse } from './common';

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPageResponse extends PageResponse<ProductResponse> {}

export interface VariantResponse {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  status: string;
}

export interface VariantPageResponse extends PageResponse<VariantResponse> {}

export type CategoryStatus = 'ACTIVE' | 'INACTIVE';

export interface CategoryParentResponse {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  categoryChildCount: number;
  status: CategoryStatus;
}

export interface CategoryChildResponse {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  status: CategoryStatus;
  productCount: number;
  parentId?: number;
}

export interface CategoryParentPageResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  categories: CategoryParentResponse[];
}

export interface CategoryChildPageResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  categoryChildResponseList: CategoryChildResponse[];
}

// Request types
export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export interface ProductUpdateRequest extends ProductCreateRequest {
  id: number;
}

export interface VariantRequest {
  productId: number;
}

export interface VariantUpdateRequest {
  id: number;
  price?: number;
  quantity?: number;
  status?: string;
}

export interface ProductStatusRequest {
  id: number;
}

export interface VariantQuantityUpdateRequest {
  variantId: number;
  quantity: number;
}

export interface CategoryParentCreateRequest {
  name: string;
  imageUrl?: string;
}

export interface CategoryChildCreateRequest {
  name: string;
  parentId: number;
  imageUrl?: string;
}

export interface CategoryParentUpdateRequest extends CategoryParentCreateRequest {
  id: number;
}

export interface CategoryChildUpdateRequest {
  id: number;
  name: string;
  imageUrl?: string;
}