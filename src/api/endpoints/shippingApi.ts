// src/api/endpoints/shippingApi.ts - Shipping API calls
import api from '../apiClient';
import type {
  ApiResponse,
  ProvinceResponse,
  DistrictResponse,
  WardResponse,
  ShippingFeeResponse,
  StationsResponse,
  PickShiftResponse,
  CreateShippingOrderResponse,
  UpdateShippingOrderResponse,
  GHNOrderDetailResponse,
  OrderByClientCodeResponse,
  PreviewOrderResponse,
  GHNTrackingResponse,
  GeneratePrintTokenResponse,
  SwitchStatusResponse,
  CalculateShippingFeeRequest,
  GetStationsRequest,
  CreateGHNOrderRequest,
  UpdateGHNOrderRequest,
  GetOrderDetailRequest,
  PreviewOrderRequest,
  PrintOrderRequest,
  CancelGHNOrderRequest,
  SwitchStatusRequest,
} from '../../types';
import type { AvailableServiceResponse, AvailableServicesRequest } from '../../types/api';

// Address APIs
export const getProvinces = async (): Promise<ProvinceResponse[]> => {
  const response = await api.get<ApiResponse<ProvinceResponse[]>>('/api/shipping/provinces');
  return response.data.data;
};

export const getDistricts = async (provinceId: number): Promise<DistrictResponse[]> => {
  const response = await api.post<ApiResponse<DistrictResponse[]>>('/api/shipping/districts', { province_id: provinceId });
  return response.data.data;
};

export const getDistrictsByPath = async (provinceId: number): Promise<DistrictResponse[]> => {
  const response = await api.get<ApiResponse<DistrictResponse[]>>(`/api/shipping/districts/${provinceId}`);
  return response.data.data;
};

export const getWards = async (districtId: number): Promise<WardResponse[]> => {
  const response = await api.post<ApiResponse<WardResponse[]>>('/api/shipping/wards', { district_id: districtId });
  return response.data.data;
};

export const getWardsByPath = async (districtId: number): Promise<WardResponse[]> => {
  const response = await api.get<ApiResponse<WardResponse[]>>(`/api/shipping/wards/${districtId}`);
  return response.data.data;
};

// Shipping Fee and Stations APIs
export const calculateShippingFee = async (request: CalculateShippingFeeRequest): Promise<ShippingFeeResponse> => {
  const response = await api.post<ApiResponse<ShippingFeeResponse>>('/api/shipping/calculate-fee', request);
  return response.data.data;
};

export const getStations = async (request: GetStationsRequest): Promise<StationsResponse> => {
  const response = await api.post<ApiResponse<StationsResponse>>('/api/shipping/stations', request);
  return response.data.data;
};

export const getStationsByPath = async (
  districtId: string,
  wardCode: string,
  offset: number = 0,
  limit: number = 1000
): Promise<StationsResponse> => {
  const response = await api.get<ApiResponse<StationsResponse>>(
    `/api/shipping/stations/${districtId}/${wardCode}`,
    { params: { offset, limit } }
  );
  return response.data.data;
};

export const getPickShifts = async (): Promise<PickShiftResponse> => {
  const response = await api.get<ApiResponse<PickShiftResponse>>('/api/shipping/pick-shifts');
  return response.data.data;
};

export const getAvailableServices = async (
  request: AvailableServicesRequest
): Promise<AvailableServiceResponse[]> => {
  // Transform camelCase to snake_case for backend compatibility
  const requestBody = {
    from_district: request.fromDistrict,
    to_district: request.toDistrict,
  };
  const response = await api.post<ApiResponse<any[]>>(
    '/api/shipping/available-services',
    requestBody
  );
  
  // Transform snake_case response to camelCase for frontend compatibility
  return (response.data.data || []).map((item: any) => ({
    serviceId: item.service_id,
    serviceTypeId: item.service_type_id,
    shortName: item.short_name || '',
    serviceName: item.service_name || null,
    expectedDeliveryTime: item.expected_delivery_time || null,
  }));
};

// Order Management APIs
export const createShippingOrder = async (request: CreateGHNOrderRequest): Promise<CreateShippingOrderResponse> => {
  const response = await api.post<ApiResponse<CreateShippingOrderResponse>>('/api/shipping/orders', request);
  return response.data.data;
};

export const updateShippingOrder = async (request: UpdateGHNOrderRequest): Promise<UpdateShippingOrderResponse> => {
  const response = await api.post<ApiResponse<UpdateShippingOrderResponse>>('/api/shipping/orders/update', request);
  return response.data.data;
};

export const updateShippingOrderByCode = async (
  orderCode: string,
  request: UpdateGHNOrderRequest
): Promise<UpdateShippingOrderResponse> => {
  const response = await api.put<ApiResponse<UpdateShippingOrderResponse>>(`/api/shipping/orders/${orderCode}`, request);
  return response.data.data;
};

export const getShippingOrderDetail = async (shippingOrderCode: string): Promise<GHNOrderDetailResponse> => {
  const response = await api.get<ApiResponse<GHNOrderDetailResponse>>(`/api/shipping/orders/${shippingOrderCode}`);
  return response.data.data;
};

export const getOrderDetail = async (request: GetOrderDetailRequest): Promise<GHNOrderDetailResponse> => {
  const response = await api.post<ApiResponse<GHNOrderDetailResponse>>('/api/shipping/orders/detail', request);
  return response.data.data;
};

export const getOrderByClientCode = async (clientCode: string): Promise<OrderByClientCodeResponse> => {
  const response = await api.post<ApiResponse<OrderByClientCodeResponse>>('/api/shipping/orders/detail-by-client-code', {
    client_code: clientCode
  });
  return response.data.data;
};

export const getOrderByClientCodePath = async (clientCode: string): Promise<OrderByClientCodeResponse> => {
  const response = await api.get<ApiResponse<OrderByClientCodeResponse>>(`/api/shipping/orders/detail-by-client-code/${clientCode}`);
  return response.data.data;
};

export const previewOrder = async (request: PreviewOrderRequest): Promise<PreviewOrderResponse> => {
  const response = await api.post<ApiResponse<PreviewOrderResponse>>('/api/shipping/orders/preview', request);
  return response.data.data;
};

// Tracking APIs
export const trackShippingOrder = async (shippingOrderCode: string): Promise<GHNTrackingResponse> => {
  const response = await api.get<ApiResponse<GHNTrackingResponse>>(`/api/shipping/orders/${shippingOrderCode}/track`);
  return response.data.data;
};

export const getShippingStatus = async (shippingOrderCode: string): Promise<string> => {
  const response = await api.get<ApiResponse<string>>(`/api/shipping/orders/${shippingOrderCode}/status`);
  return response.data.data;
};

export const trackByTrackingNumber = async (trackingNumber: string): Promise<{
  order: any;
  tracking: GHNTrackingResponse;
}> => {
  const response = await api.get<ApiResponse<{
    order: any;
    tracking: GHNTrackingResponse;
  }>>(`/api/shipping/track/${trackingNumber}`);
  return response.data.data;
};

// Cancellation APIs
export const cancelShippingOrder = async (shippingOrderCode: string): Promise<{
  shipping_order_code: string;
  cancelled: boolean;
}> => {
  const response = await api.post<ApiResponse<{
    shipping_order_code: string;
    cancelled: boolean;
  }>>(`/api/shipping/orders/${shippingOrderCode}/cancel`);
  return response.data.data;
};

export const cancelMultipleShippingOrders = async (request: CancelGHNOrderRequest): Promise<{
  results: Record<string, boolean>;
  errors: Record<string, string>;
  success_count: number;
  total_count: number;
}> => {
  const response = await api.post<ApiResponse<{
    results: Record<string, boolean>;
    errors: Record<string, string>;
    success_count: number;
    total_count: number;
  }>>('/api/shipping/orders/cancel', request);
  return response.data.data;
};

// User Order APIs
export const getUserOrdersWithShipping = async (
  userId: number,
  provider: string = 'GHN'
): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>(`/api/shipping/user/${userId}/orders`, {
    params: { provider }
  });
  return response.data.data;
};

export const getAllOrdersForUser = async (userId: number): Promise<any[]> => {
  const response = await api.get<ApiResponse<any[]>>(`/api/shipping/debug/user/${userId}/all-orders`);
  return response.data.data;
};

// Print APIs
export const generatePrintToken = async (request: PrintOrderRequest): Promise<GeneratePrintTokenResponse> => {
  const response = await api.post<ApiResponse<GeneratePrintTokenResponse>>('/api/shipping/orders/print/token', request);
  return response.data.data;
};

export const printOrderA5 = async (request: PrintOrderRequest): Promise<Blob> => {
  const response = await api.post('/api/shipping/orders/print/a5', request, {
    responseType: 'blob'
  });
  return response.data;
};

export const printOrder80x80 = async (request: PrintOrderRequest): Promise<Blob> => {
  const response = await api.post('/api/shipping/orders/print/80x80', request, {
    responseType: 'blob'
  });
  return response.data;
};

export const printOrder52x70 = async (request: PrintOrderRequest): Promise<Blob> => {
  const response = await api.post('/api/shipping/orders/print/52x70', request, {
    responseType: 'blob'
  });
  return response.data;
};

export const printSingleOrder = async (
  orderCode: string,
  format: 'A5' | '80X80' | '52X70'
): Promise<Blob> => {
  const response = await api.get(`/api/shipping/orders/${orderCode}/print/${format}`, {
    responseType: 'blob'
  });
  return response.data;
};

// Status Management APIs
export const switchStatusToStoring = async (request: SwitchStatusRequest): Promise<SwitchStatusResponse> => {
  const response = await api.post<ApiResponse<SwitchStatusResponse>>('/api/shipping/switch-status/storing', request);
  return response.data.data;
};

// Webhook API
export const handleShippingWebhook = async (provider: string, payload: string): Promise<string> => {
  const response = await api.post<string>(`/api/shipping/webhook/${provider}`, payload, {
    headers: { 'Content-Type': 'text/plain' }
  });
  return response.data;
};