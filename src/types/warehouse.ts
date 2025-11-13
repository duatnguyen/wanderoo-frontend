// src/types/warehouse.ts - Warehouse and inventory types
import type { PageResponse } from './common';

export interface InventoryResponse {
  id: number;
  productId: number;
  quantity: number;
  location: string;
  status: string;
}

export interface SimpleInventoryPageResponse extends PageResponse<InventoryResponse> {}

export interface ProviderResponse {
  id: number;
  name: string;
  contact: string;
  address: string;
  status: string;
}

export interface ProviderPageResponse extends PageResponse<ProviderResponse> {}

export interface ProviderCreateRequest {
  name: string;
  contact: string;
  address: string;
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
  type: string;
  providerId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface InvoicePageResponse extends PageResponse<InvoiceResponse> {}