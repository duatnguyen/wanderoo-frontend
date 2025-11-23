// src/types/products.ts - Product and category types

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string | null;
}

export interface VariantResponse {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  status: string;
}

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
  content?: CategoryChildResponse[];
}

export interface SimpleCategoryResponse {
  id: number;
  name: string;
}

export interface CategoryPublicResponse {
  categories: SimpleCategoryResponse[];
}

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

export interface ProductDetailAttributeValueResponse {
  id: number;
  value: string;
}

export interface ProductDetailAttributeResponse {
  name: string;
  values: ProductDetailAttributeValueResponse[];
}

export interface ProductDetailsResponse {
  id: number;
  images?: string[];
  name: string;
  categoryResponse?: { id: number; name: string } | null;
  brandResponse?: { id: number; name: string } | null;
  description?: string;
  attributes?: ProductDetailAttributeResponse[];
  packagedWeight?: number;
  length?: number;
  width?: number;
  height?: number;
}