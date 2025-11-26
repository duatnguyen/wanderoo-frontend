// src/types/index.ts - Export all types
export * from "./common";
export * from "./auth";
export * from "./products";
export * from "./orders";
export type { POSCustomerResponse as CustomerResponse } from "./shipping";
export * from "./shipping";
export * from "./warehouse";
export type {
  // Common responses
  ApiResponse,
  PageResponse,
  TokenResponse,
  UserResponse,
  AddressResponse,

  // Product responses
  ProductResponse,
  ProductCategoryInfo,
  ProductBrandInfo,
  ProductAttributeValueResponse,
  ProductAttributeResponse,
  ProductDetailsResponse,
  VariantResponse,
  VariantDetailIdResponse,

  // Order responses
  OrderResponse,
  OrderDetailResponse,
  OrderItemResponse,

  // Cart responses
  CartResponse,
  CartItemResponse,
  ProductDetailVariantResponse,
  BackendCartResponse,
  CartPageResponse,
  SelectedCartWithShippingResponse,

  // Other responses
  ReviewResponse,

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
  DiscountPublicResponse,
  VoucherHistoryResponse,
  VoucherStatus,
  DiscountTypeValue,
  DiscountCategoryValue,
  ClaimVoucherRequest,
  SimpleCategoryResponse,
  CategoryPublicResponse,
  AvailableServicesRequest,
  AvailableServiceResponse,
  BrandCreateRequest,
  BrandPageResponse,
} from "./api";
