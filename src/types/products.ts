// src/types/products.ts - Product and category types
import type { PageResponse } from "./common";

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

export interface CategoryParentResponse {
  id: number;
  name: string;
  status: string;
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
  content?: CategoryChildResponse[];
}

export interface CategoryParentPageResponse
  extends PageResponse<CategoryParentResponse> {}

export interface CategoryChildPageResponse
  extends PageResponse<CategoryChildResponse> {}

// Request types
export interface ProductAttributeInputRequest {
  name: string;
  values: string[];
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  categoryId: number;
  brandId: number;
  images?: string[];
  attributes?: ProductAttributeInputRequest[];
  packagedWeight: number;
  length: number;
  width: number;
  height: number;
  importPrice?: number;
  sellingPrice?: number;
  totalQuantity?: number;
  availableQuantity?: number;
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
}

export interface CategoryChildCreateRequest {
  name: string;
  parentId: number;
}

export interface CategoryParentUpdateRequest
  extends CategoryParentCreateRequest {
  id: number;
}

export interface CategoryChildUpdateRequest extends CategoryChildCreateRequest {
  id: number;
  name: string;
  imageUrl?: string;
}

// Admin product list responses
export interface AdminProductDetailResponse {
  id: number;
  imageUrl?: string;
  nameDetail: string;
  skuDetail: string;
  barcode?: string;
  totalQuantity: number;
  availableQuantity: number;
  websiteSoldQuantity: number;
  posSoldQuantity: number;
  sellingPrice: number | string;
  importPrice: number | string;
}

export interface AdminProductResponse {
  id: number;
  imageUrl?: string;
  name: string;
  sku: string;
  totalQuantity: number;
  availableQuantity: number;
  websiteSoldQuantity: number;
  posSoldQuantity: number;
  sellingPrice: number | string;
  importPrice: number | string;
  display?: string;
  productDetails?: AdminProductDetailResponse[];
}

export interface AdminProductPageResponse {
  totalProducts: number;
  pageNumber?: number;
  pageSize?: number;
  page?: number;
  size?: number;
  totalPages?: number;
  totalPage?: number;
  totalElements?: number;
  productResponseList: AdminProductResponse[];
}

export interface ProductVariantListResponse {
  variants?: AdminProductDetailResponse[];
  content?: AdminProductDetailResponse[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalElements?: number;
}
