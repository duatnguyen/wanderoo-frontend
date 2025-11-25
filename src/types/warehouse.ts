// src/types/warehouse.ts - Warehouse and inventory types
import type { PageResponse } from './common';

export interface SimpleInventoryItemResponse {
  id: number;
  imageUrl?: string | null;
  productName: string;
  barcode?: string | null;
  attributes?: string | null;
  posSoldQuantity?: number | null;
  sellingPrice?: number | null;
}

export interface SimpleInventoryPageResponse extends PageResponse<SimpleInventoryItemResponse> {}

export interface ProviderResponse {
  id: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  status?: "ACTIVE" | "INACTIVE" | "NONE";
}

export interface ProviderPageResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  providers: ProviderResponse[];
}

export interface ProviderDetailResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  note?: string | null;
  street?: string | null;
  wardCode?: string | null;
  wardName?: string | null;
  districtId?: number | null;
  districtName?: string | null;
  provinceName?: string | null;
  fullAddress?: string | null;
}

export interface ProviderCreateRequest {
  name: string;
  phone: string;
  email: string;
  note?: string;
  provinceName: string;
  districtName: string;
  districtId: number;
  wardName: string;
  wardCode: string;
  street: string;
  fullAddress?: string;
}

export interface ProviderUpdateRequest extends ProviderCreateRequest {
  id: number;
}

export interface ProviderInvoiceHistoryItem {
  type: "IMPORT" | "EXPORT";
  code: string;
  updatedAt: string;
  productStatus: "PENDING" | "DONE";
  paymentStatus: "PENDING" | "DONE";
}

export interface ProviderStatResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  fromDate?: string | null;
  toDate?: string | null;
  invoiceImportCreated: number;
  invoiceImportUnpaid: number;
  invoiceExportCreated: number;
  invoiceExportUnrefund: number;
  invoiceHistory: ProviderInvoiceHistoryItem[];
}

export interface InvoiceResponse {
  id: number;
  code: string;
  createdAt: string;
  method: PaymentMethod;
  productStatus: 'PENDING' | 'DONE';
  paymentStatus: 'PENDING' | 'DONE';
  status: 'PENDING' | 'DONE';
  providerName: string;
  picName: string;
  totalQuantity: number;
  totalPrice: number;
}

export interface InvoicePageResponse {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  invoices: InvoiceResponse[];
}

export type PaymentMethod = 'CASH' | 'BANKING' | 'UNDEFINED';

export interface InvoiceCartItemRequest {
  productDetailId: number;
  quantity: number;
}

export interface InvoiceCheckOutRequest {
  cartItems: InvoiceCartItemRequest[];
  providerId: number;
  note?: string;
}

export interface InvoicePreviewCartItemResponse {
  productDetailId: number;
  productName: string;
  quantity: number;
  productPrice: number;
  amount: number;
}

export interface InvoicePreviewResponse {
  cartItems: InvoicePreviewCartItemResponse[];
  providerId: number;
  providerName: string;
  totalQuantity: number;
  totalPrice: number;
}

export interface InvoiceDetailCartItemResponse {
  productName: string;
  quantity: number;
  productPrice: number;
  amount: number;
}

export interface InvoiceDetailResponse {
  id: number;
  updatedAt: string;
  invoiceType: string;
  cartItem: InvoiceDetailCartItemResponse[];
  code: string;
  status: string;
  paymentStatus: string;
  method: PaymentMethod;
  note: string;
  referenceCode: string;
  productStatus: string;
  providerName: string;
  picName: string;
  picImage: string;
}

export interface PaymentRequest {
  invoiceId: number;
  method?: PaymentMethod;
  paidAmount: number;
  referenceCode?: string;
}