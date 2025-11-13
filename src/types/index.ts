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
} from './api';
