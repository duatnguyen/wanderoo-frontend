// src/types/index.ts - Export all types
export * from './common';
export * from './auth';
export * from './products';
export * from './orders';
export type { POSCustomerResponse as CustomerResponse } from './shipping';
export * from './shipping';
export * from './warehouse';
export type {
  OrderDetailCreateRequest,
  OrderDetailUpdateRequest,
  VariantDetailIdRequest,
  CustomerSearchListResponse,
  DraftOrderDetailResponse,
  DraftOrderItemResponse,
  CheckoutOrderItemResponse,
  AddItemToOrderRequest,
  UpdateItemQuantityRequest,
  AssignCustomerToOrderRequest,
  RemoveItemFromDraftOrderRequest,
  GetStationsRequest,
  StationsResponse,
  GHNOrderDetailResponse,
  OrderByClientCodeResponse,
  GHNTrackingResponse,
  GeneratePrintTokenResponse,
  PrintOrderResponse,
  SwitchStatusResponse,
  BrandCreateRequest,
  BrandPageResponse,
} from './api';
