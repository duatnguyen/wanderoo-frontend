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
  status?: "ACTIVE" | "INACTIVE";
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
  note?: string;
  province: string;
  ward: string;
  district: string;
  location: string;
}

export interface ProviderCreateRequest {
  name: string;
  phone: string;
  email: string;
  note?: string;
  province: string;
  ward: string;
  district: string;
  location: string;
}

export interface ProviderUpdateRequest extends ProviderCreateRequest {
  id: number;
}

export interface ProviderStatResponse {
  totalInvoices: number;
  totalAmount: number;
  lastOrderDate: string;
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