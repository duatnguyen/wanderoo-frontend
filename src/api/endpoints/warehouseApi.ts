import apiClient from '../apiClient';
import type {
  ProviderPageResponse,
  ProviderResponse,
  ProviderCreateRequest,
  ProviderUpdateRequest,
  ProviderStatResponse,
  InvoicePageResponse,
} from '../../types/warehouse';
import type { SelectAllRequest } from '../../types/auth';

// Provider APIs
export const getProviderList = async (
  keyword?: string,
  sort?: string,
  page: number = 0,
  size: number = 20
): Promise<ProviderPageResponse> => {
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  if (sort) params.append('sort', sort);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await apiClient.get<ProviderPageResponse>(
    `/auth/v1/private/provider?${params.toString()}`
  );
  return response.data;
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

export const createProvider = async (
  request: ProviderCreateRequest
): Promise<ProviderResponse> => {
  const response = await apiClient.post<ProviderResponse>(
    '/auth/v1/private/provider/add',
    request
  );
  return response.data;
};

export const getProviderDetail = async (
  providerId: number
): Promise<ProviderResponse> => {
  const response = await apiClient.get<ProviderResponse>(
    `/auth/v1/private/provider/${providerId}`
  );
  return response.data;
};

export const getProviderStats = async (
  providerId: number,
  fromDate?: string,
  toDate?: string,
  sort?: string,
  page: number = 0,
  size: number = 20
): Promise<ProviderStatResponse> => {
  const params = new URLSearchParams();
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  if (sort) params.append('sort', sort);
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await apiClient.get<ProviderStatResponse>(
    `/auth/v1/private/provider/stat/${providerId}?${params.toString()}`
  );
  return response.data;
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

  const response = await apiClient.get<InvoicePageResponse>(
    `/auth/v1/private/invoice/import?${params.toString()}`
  );
  return response.data;
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

  const response = await apiClient.get<InvoicePageResponse>(
    `/auth/v1/private/invoice/import/pending?${params.toString()}`
  );
  return response.data;
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

  const response = await apiClient.get<InvoicePageResponse>(
    `/auth/v1/private/invoice/import/done?${params.toString()}`
  );
  return response.data;
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

  const response = await apiClient.get<InvoicePageResponse>(
    `/auth/v1/private/invoice/export?${params.toString()}`
  );
  return response.data;
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

  const response = await apiClient.get<InvoicePageResponse>(
    `/auth/v1/private/invoice/export/pending?${params.toString()}`
  );
  return response.data;
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

  const response = await apiClient.get<InvoicePageResponse>(
    `/auth/v1/private/invoice/export/done?${params.toString()}`
  );
  return response.data;
};