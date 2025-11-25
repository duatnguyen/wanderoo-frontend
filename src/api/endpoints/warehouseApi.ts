import apiClient from '../apiClient';
import type {
  ProviderPageResponse,
  ProviderCreateRequest,
  ProviderUpdateRequest,
  ProviderDetailResponse,
  ProviderStatResponse,
  InvoicePageResponse,
  InvoiceCheckOutRequest,
  InvoicePreviewResponse,
  InvoiceDetailResponse,
  PaymentRequest,
  ProductInvoicePageResponse,
} from '../../types/warehouse';
import type { SelectAllRequest } from '../../types/auth';
import type { ApiResponse } from '../../types/common';

// Provider APIs
export const getProviderList = async (
  keyword?: string,
  sort?: string,
  page: number = 1,
  size: number = 10
): Promise<ProviderPageResponse> => {
  const params = new URLSearchParams();
  if (keyword) params.append("keyword", keyword);
  if (sort) params.append("sort", sort);
  params.append("page", page.toString());
  params.append("size", size.toString());

  const response = await apiClient.get<ApiResponse<ProviderPageResponse>>(
    `/auth/v1/private/provider?${params.toString()}`
  );
  return response.data.data;
};

export const deleteProvider = async (id: number): Promise<void> => {
  await apiClient.delete('/auth/v1/private/provider', {
    params: { id },
  });
};

export const deleteAllProviders = async (request: SelectAllRequest): Promise<void> => {
  await apiClient.delete('/auth/v1/private/provider/all', {
    data: request,
  });
};

export const activateAllProviders = async (request: SelectAllRequest): Promise<void> => {
  // Sử dụng cùng endpoint nhưng với method PUT để activate
  // Nếu backend chưa có endpoint này, sẽ cần thêm sau
  await apiClient.put('/auth/v1/private/provider/all/activate', request);
};

export const createProvider = async (
  request: ProviderCreateRequest
): Promise<number> => {
  const response = await apiClient.post<ApiResponse<number>>(
    '/auth/v1/private/provider/add',
    request
  );
  return response.data.data;
};

export const getProviderDetail = async (
  providerId: number
): Promise<ProviderDetailResponse> => {
  const response = await apiClient.get<ApiResponse<ProviderDetailResponse>>(
    `/auth/v1/private/provider/${providerId}`
  );
  return response.data.data;
};

export const getProviderStats = async (
  providerId: number,
  fromDate?: string,
  toDate?: string,
  sort?: string,
  page: number = 1,
  size: number = 20
): Promise<ProviderStatResponse> => {
  const params = new URLSearchParams();
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  if (sort) params.append('sort', sort);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await apiClient.get<ApiResponse<ProviderStatResponse>>(
    `/auth/v1/private/provider/stat/${providerId}?${params.toString()}`
  );
  return response.data.data;
};

export const updateProvider = async (
  request: ProviderUpdateRequest
): Promise<void> => {
  await apiClient.put('/auth/v1/private/provider', request);
};

// Invoice APIs
export const getImportInvoices = async (
  keyword?: string,
  sort?: string,
  page: number = 0,
  size: number = 20
): Promise<InvoicePageResponse> => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (sort) params.append('sort', sort);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await apiClient.get<ApiResponse<InvoicePageResponse>>(
    `/auth/v1/private/invoice/import?${params.toString()}`
  );
  return response.data.data;
};

export const getImportInvoicesPending = async (
  keyword?: string,
  sort?: string,
  page: number = 0,
  size: number = 20
): Promise<InvoicePageResponse> => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (sort) params.append('sort', sort);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await apiClient.get<ApiResponse<InvoicePageResponse>>(
    `/auth/v1/private/invoice/import/pending?${params.toString()}`
  );
  return response.data.data;
};

export const getImportInvoicesDone = async (
  keyword?: string,
  sort?: string,
  page: number = 0,
  size: number = 20
): Promise<InvoicePageResponse> => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (sort) params.append('sort', sort);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await apiClient.get<ApiResponse<InvoicePageResponse>>(
    `/auth/v1/private/invoice/import/done?${params.toString()}`
  );
  return response.data.data;
};

export const getExportInvoices = async (
  keyword?: string,
  sort?: string,
  page: number = 0,
  size: number = 20
): Promise<InvoicePageResponse> => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (sort) params.append('sort', sort);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await apiClient.get<ApiResponse<InvoicePageResponse>>(
    `/auth/v1/private/invoice/export?${params.toString()}`
  );
  return response.data.data;
};

export const getExportInvoicesPending = async (
  keyword?: string,
  sort?: string,
  page: number = 0,
  size: number = 20
): Promise<InvoicePageResponse> => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (sort) params.append('sort', sort);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await apiClient.get<ApiResponse<InvoicePageResponse>>(
    `/auth/v1/private/invoice/export/pending?${params.toString()}`
  );
  return response.data.data;
};

export const getExportInvoicesDone = async (
  keyword?: string,
  sort?: string,
  page: number = 0,
  size: number = 20
): Promise<InvoicePageResponse> => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (sort) params.append('sort', sort);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await apiClient.get<ApiResponse<InvoicePageResponse>>(
    `/auth/v1/private/invoice/export/done?${params.toString()}`
  );
  return response.data.data;
};

export const createImportInvoice = async (
  request: InvoiceCheckOutRequest
): Promise<number> => {
  const response = await apiClient.post<ApiResponse<number>>(
    '/auth/v1/private/invoice/import',
    request
  );
  return response.data.data;
};

export const createExportInvoice = async (
  request: InvoiceCheckOutRequest
): Promise<number> => {
  const response = await apiClient.post<ApiResponse<number>>(
    '/auth/v1/private/invoice/export',
    request
  );
  return response.data.data;
};

export const getInvoicePreview = async (
  request: InvoiceCheckOutRequest
): Promise<InvoicePreviewResponse> => {
  const response = await apiClient.post<ApiResponse<InvoicePreviewResponse>>(
    '/auth/v1/private/invoice/preview',
    request
  );
  return response.data.data;
};

export const getInvoiceDetail = async (
  invoiceId: number
): Promise<InvoiceDetailResponse> => {
  const response = await apiClient.get<ApiResponse<InvoiceDetailResponse>>(
    `/auth/v1/private/invoice/${invoiceId}`
  );
  return response.data.data;
};

export const confirmInvoicePayment = async (
  request: PaymentRequest
): Promise<InvoiceDetailResponse> => {
  const response = await apiClient.post<ApiResponse<InvoiceDetailResponse>>(
    '/auth/v1/private/invoice/confirm-payment',
    request
  );
  return response.data.data;
};

export const confirmInvoiceProductStatus = async (
  invoiceId: number
): Promise<InvoiceDetailResponse> => {
  const response = await apiClient.post<ApiResponse<InvoiceDetailResponse>>(
    `/auth/v1/private/invoice/${invoiceId}/confirm-product-status`
  );
  return response.data.data;
};

export const searchInvoiceProducts = async (
  keyword?: string,
  page: number = 1,
  size: number = 10
): Promise<ProductInvoicePageResponse> => {
  const params = new URLSearchParams();
  if (keyword && keyword.trim()) {
    params.append("keyword", keyword.trim());
  }
  params.append("page", page.toString());
  params.append("size", size.toString());

  const response = await apiClient.get<ApiResponse<ProductInvoicePageResponse>>(
    `/auth/v1/private/invoice/products?${params.toString()}`
  );
  return response.data.data;
};

// Return Import APIs
export const getReturnImportList = async (
  keyword?: string,
  sort?: string,
  page: number = 0,
  size: number = 20
): Promise<InvoicePageResponse> => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (sort) params.append('sort', sort);
  params.append('page', page.toString());
  params.append('size', size.toString());

  // Return import is treated as export invoice (returning goods to supplier)
  const response = await apiClient.get<ApiResponse<InvoicePageResponse>>(
    `/auth/v1/private/invoice/export?${params.toString()}`
  );
  return response.data.data;
};