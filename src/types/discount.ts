// src/types/discount.ts - Admin discount domain types aligned with backend

export type DiscountTypeValue = "PERCENT" | "FIXED";
export type DiscountCategoryValue =
  | "ORDER_DISCOUNT"
  | "PRODUCT_DISCOUNT"
  | "SHIPPING_DISCOUNT";
export type DiscountApplyToValue = "ORDER" | "PRODUCT" | "CATEGORY";
export type DiscountApplyOnValue = "WEBSITE" | "POS" | "BOTH";
export type DiscountStatusValue = "ENABLE" | "DISABLE";
export type DiscountContextValue = "SIGNUP" | "EVENT" | "OTHER";
export type DiscountStateValue = "ONGOING" | "UPCOMING" | "ENDED" | "ALL";

export interface DiscountEnumOption {
  value: string;
  label: string;
}

export interface AdminDiscountResponse {
  id: number;
  name: string;
  code: string;
  category: DiscountCategoryValue;
  type: DiscountTypeValue;
  applyTo: DiscountApplyToValue;
  applyOn: DiscountApplyOnValue;
  value: number;
  minOrderValue?: number | null;
  maxOrderValue?: number | null;
  discountUsage?: number | null;
  contextAllowed?: DiscountContextValue | null;
  startDate: string;
  endDate: string;
  quantity: number;
  status: DiscountStatusValue;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminDiscountPageResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  discounts: AdminDiscountResponse[];
}

export interface AdminDiscountCreateRequest {
  name: string;
  code: string;
  category: DiscountCategoryValue;
  type: DiscountTypeValue;
  applyTo: DiscountApplyToValue;
  applyOn: DiscountApplyOnValue;
  value: number;
  minOrderValue?: number | null;
  maxOrderValue?: number | null;
  discountUsage?: number | null;
  contextAllowed?: DiscountContextValue;
  startDate: string;
  endDate: string;
  quantity: number;
  status: DiscountStatusValue;
  description?: string | null;
}

export type AdminDiscountUpdateRequest = AdminDiscountCreateRequest;

export interface AdminDiscountMetadataResponse {
  applyOns: DiscountEnumOption[];
  applyTos: DiscountEnumOption[];
  categories: DiscountEnumOption[];
  discountTypes: DiscountEnumOption[];
  contexts: DiscountEnumOption[];
  statuses: DiscountEnumOption[];
  states: DiscountEnumOption[];
}

