// src/types/api.ts - Common API types and interfaces

// Common API Response
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface UserInfo {
  id: number;
  name: string;
  image: string;
  username: string;
}

// Pagination Response
export interface PageResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  content: T[];
}

// Token Response
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

// User Types
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Address Types
export interface AddressResponse {
  id: number;
  province: string;
  district: string;
  ward: string;
  location: string;
  name: string;
  phone: string;
  wardCode: string;
  districtId: number;
  isDefault: boolean;
}

// Product Types
export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface VariantResponse {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  status: string;
}

// Order Types
export interface OrderResponse {
  id: number;
  customerId: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetailResponse extends OrderResponse {
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  total: number;
}

// Cart Types
export interface CartResponse {
  id: number;
  userId: number;
  items: CartItemResponse[];
  totalAmount: number;
}

export interface CartItemResponse {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  total: number;
}

// Backend Cart Types (matching CartController response)
export interface VariantAttributeSnapshot {
  groupLevel: number;
  name: string;
  id: number;
  value: string;
}

export interface ProductDetailVariantResponse {
  id: number;
  productDetailId: number;
  imageUrl: string | null;
  attributes: VariantAttributeSnapshot[];
  originalPrice: number;
  discountedPrice: number;
  discountValue: string | null;
  websiteSoldQuantity: number;
}

export interface BackendCartResponse {
  id: number;
  productId: number;
  productDetailId: number;
  imageUrl: string | null;
  productName: string;
  attributes: VariantAttributeSnapshot[];
  originalPrice: number;
  discountedPrice: number;
  productPrice: number;
  discountValue: string | null;
  quantity: number;
  totalPrice: number;
  websiteSoldQuantity: number;
  availableVariants?: ProductDetailVariantResponse[];
}

export interface CartPageResponse {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  carts: BackendCartResponse[];
}

// Review Types
export interface ReviewResponse {
  id: number;
  userId: number;
  productDetailId: number;
  orderHistoryId?: number;
  images?: string[];
  rating: number;
  judging?: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

// Shipping Types
export interface ProvinceResponse {
  id: number;
  name: string;
  code: string;
}

export interface DistrictResponse {
  id: number;
  name: string;
  code: string;
  provinceId: number;
}

export interface WardResponse {
  id: number;
  name: string;
  code: string;
  districtId: number;
}

export interface ShippingFeeResponse {
  fee: number;
  estimatedDeliveryTime: string;
}

// Voucher Types
export interface VoucherResponse {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  expiryDate: string;
  status: string;
}

export interface CustomerVoucherResponse extends VoucherResponse {
  customerId: number;
  used: boolean;
  usedAt?: string;
}

export type DiscountTypeValue = "PERCENT" | "FIXED";
export type DiscountCategoryValue =
  | "ORDER_DISCOUNT"
  | "PRODUCT_DISCOUNT"
  | "SHIPPING_DISCOUNT";
export type VoucherStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "EXPIRED"
  | "USED"
  | "AVAILABLE";

export interface DiscountPublicResponse {
  id: number;
  name: string;
  code: string;
  category: DiscountCategoryValue;
  type: DiscountTypeValue;
  value: number;
  minOrderValue?: number | null;
  maxOrderValue?: number | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  quantity?: number | null;
  isAvailable?: boolean;
  discountText?: string | null;
}

export interface VoucherHistoryResponse {
  id: number;
  discountId: number;
  discountCode: string;
  discountName: string;
  discountText?: string | null;
  minOrderValue?: number | null;
  maxOrderValue?: number | null;
  quantity?: number | null;
  status: VoucherStatus;
  expirationDate?: string | null;
  statusLabel?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ClaimVoucherRequest {
  code: string;
}

// POS Types
export interface SaleProductResponse {
  id: number;
  imageUrl?: string;
  productName: string;
  attributes?: string;
  posSoldQuantity?: number | null;
  sellingPrice?: number | null;
}

export type SaleProductListResponse = SaleProductResponse[];

export interface CustomerSearchResponse {
  id: number;
  name: string;
  phone: string;
  gender: string;
}

export type CustomerSearchListResponse = CustomerSearchResponse[];

export interface DiscountResponse {
  id: number;
  name: string;
  code: string;
  category: string;
  type: string;
  applyTo: string;
  value: number;
  minOrderValue?: number;
  maxOrderValue?: number;
  quantity: number;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface DiscountPageResponse extends PageResponse<DiscountResponse> { }

export interface DraftOrderResponse {
  id: number;
  displayName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DraftOrderDetailResponse {
  orderId: number;
  status: string;
  notes?: string;
  employeeName?: string;
  customerName?: string;
  customerPhone?: string;
  totalProductPrice: number;
  orderDiscountAmount: number;
  productDiscountAmount: number;
  totalOrderPrice: number;
  items: DraftOrderItemResponse[];
}

export interface DraftOrderItemResponse {
  id: number;
  imageUrl?: string;
  productName: string;
  attributes?: string;
  unitPrice: number;
  quantity: number;
  amount: number;
}

// Warehouse / Inventory Types
export interface SimpleInventoryItemResponse {
  id: number;
  imageUrl?: string | null;
  productName: string;
  barcode?: string | null;
  attributes?: string | null;
  posSoldQuantity?: number | null;
  sellingPrice?: number | null;
}

export interface SimpleInventoryPageResponse
  extends PageResponse<SimpleInventoryItemResponse> { }

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

export interface InvoiceResponse {
  id: number;
  type: string;
  providerId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface InvoicePageResponse extends PageResponse<InvoiceResponse> { }

// Request Types
export interface SignInRequest {
  username: string;
  password: string;
}

export interface UserCreationRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserUpdateRequest {
  name?: string;
  phone?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AddressCreationRequest {
  province: string;
  district: string;
  ward: string;
  location: string;
  name: string;
  phone: string;
  wardCode: string;
  districtId: number;
}

export interface AddressUpdateRequest extends AddressCreationRequest {
  id: number;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export interface ProductUpdateRequest extends ProductCreateRequest {
  id: number;
}

export interface CartItemRequest {
  productDetailId: number;
  quantity: number;
}

export interface CartItemUpdateRequest {
  quantity: number;
}

export interface ReviewCreateRequest {
  userId: number;
  productDetailId: number;
  orderHistoryId?: number;
  images?: string[];
  rating: number;
  judging?: string;
  response?: string;
}

export interface ReviewUpdateRequest {
  userId: number;
  productDetailId: number;
  orderHistoryId?: number;
  images?: string[];
  rating: number;
  judging?: string;
  response?: string;
}

export interface CustomerOrderCreateRequest {
  customerId: number;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productDetailId: number;
  quantity: number;
}

export interface CustomerOrderPublicCreateRequest {
  customerId: number;
  addressId: number;
  discountId?: number;
  paymentMethod: "CASH" | "BANKING";
  shippingFee: number;
  totalProductPrice: number;
  totalOrderPrice: number;
  notes?: string;
  items: OrderItemRequest[];
}

export interface CreateOrderResponse {
  order: OrderResponse;
  shippingInfo: string;
  shippingStatus: string;
  shippingMessage: string;
  shippingFee: number;
  totalOrderPrice: number;
}

export interface CustomerOrderResponse extends OrderResponse {
  userInfo: UserInfo;
  receiverName?: string | null;
  receiverPhone?: string | null;
  receiverAddress?: string | null;
  receiverProvinceName?: string | null;
  receiverDistrictId?: number | null;
  receiverDistrictName?: string | null;
  receiverWardCode?: string | null;
  receiverWardName?: string | null;
  shippingProvider?: string | null;
  shippingOrderCode?: string | null;
  shopDistrictId?: number | null;
  shopDistrictName?: string | null;
  shopWardCode?: string | null;
  shopWardName?: string | null;
}

export interface CustomerOrderPageResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  orders: CustomerOrderResponse[];
}

export interface CustomerOrderCancelResponse {
  orderId: number;
  status: string;
  message: string;
}

export interface OrderConfirmResponse {
  orderId: number;
  shippingOrderCode: string;
  status: string;
}

export interface OrderCancelResponse {
  orderId: number;
  status: string;
  message: string;
}

export interface GetDistrictsRequest {
  provinceId: number;
}

export interface GetWardsRequest {
  districtId: number;
}

export interface CalculateShippingFeeRequest {
  serviceTypeId: number;
  fromDistrictId: number;
  fromWardCode: string;
  toDistrictId: number;
  toWardCode: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  insuranceValue: number;
  serviceId: number;
  codFailedAmount: number;
  items: ShippingItem[];
}

export interface ShippingItem {
  name: string;
  quantity: number;
  price: number;
  weight: number;
}

export interface GetStationsRequest {
  district_id: string;
  ward_code: string;
  offset?: number;
  limit?: number;
}

export interface StationData {
  address: string;
  locationName: string;
  region?: string;
  province?: string;
  district?: string;
  ward?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  wardName?: string;
  districtName?: string;
  provinceName?: string;
  iframeMap?: string;
}

export interface StationResponse {
  id?: number;
  name?: string;
  address?: string;
  districtId?: number;
  wardCode?: string;
}

export interface StationsResponse {
  code: number;
  message: string;
  data: StationData[];
}

export interface PickShiftData {
  id: number;
  title: string;
  from_time: number;
  to_time: number;
}

export interface PickShiftResponse {
  code: number;
  message: string;
  data: PickShiftData[];
}

export interface AvailableServiceResponse {
  service_id: number;
  service_type_id: number;
  short_name: string;
  service_name?: string | null;
  description?: string | null;
  expected_delivery_time?: string | null;
}

export interface AvailableServicesRequest {
  from_district: number;
  to_district: number;
}

export interface CreateGHNOrderRequest {
  // Define based on GHN API
  toName: string;
  toPhone: string;
  toAddress: string;
  toDistrictId: number;
  toWardCode: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  serviceTypeId: number;
  paymentTypeId: number;
  requiredNote: string;
  items: ShippingItem[];
}

export interface CreateShippingOrderResponse {
  orderCode: string;
  expectedDeliveryTime: string;
  fee: number;
}

export interface UpdateGHNOrderRequest {
  orderCode: string;
  // Other update fields
}

export interface UpdateShippingOrderResponse {
  orderCode: string;
  status: string;
}

export interface ShippingOrderDetailResponse {
  orderCode: string;
  status: string;
  fee: number;
  expectedDeliveryTime: string;
  // Other details
}

export interface ShippingFeeResponse {
  total?: number;
  service_type_id?: number;
  service_fee?: number;
  insurance_fee?: number;
  coupon_value?: number;
  r2s_fee?: number;
  return_again?: number;
  document_return?: number;
  double_check?: number;
  cod_fee?: number;
  pick_station_fee?: number;
  deliver_station_fee?: number;
  thirteen_hour_fee?: number;
  next_day_fee?: number;
}

export interface GetOrderDetailRequest {
  orderCode: string;
}

export interface PreviewItemRequest {
  name: string;
  code?: string;
  quantity: number;
  price: number;
  length?: number;
  width?: number;
  height?: number;
  category?: {
    level1: string;
  };
}

export interface PreviewOrderRequest {
  payment_type_id?: number;
  note?: string;
  required_note?: string;
  return_phone?: string;
  return_address?: string;
  return_district_id?: number;
  return_ward_code?: string;
  client_order_code?: string;
  to_name: string;
  to_phone: string;
  to_address: string;
  to_ward_code: string;
  to_district_id: number;
  cod_amount?: number;
  insurance_value?: number;
  content?: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  pick_station_id?: number;
  service_id?: number;
  service_type_id: number;
  coupon?: string;
  pick_shift?: number[];
  items: PreviewItemRequest[];
}

export interface PreviewOrderFee {
  main_service?: number;
  insurance?: number;
  cod_fee?: number;
  station_do?: number;
  station_pu?: number;
  return?: number;
  r2s?: number;
  return_again?: number;
  coupon?: number;
  document_return?: number;
  double_check?: number;
  cod_failed_fee?: number;
  pick_remote_areas_fee?: number;
  deliver_remote_areas_fee?: number;
  pick_remote_areas_fee_return?: number;
  deliver_remote_areas_fee_return?: number;
}

export interface PreviewOrderData {
  order_code?: string;
  sort_code?: string;
  trans_type?: string;
  ward_encode?: string;
  district_encode?: string;
  fee?: PreviewOrderFee;
  total_fee?: number;
  expected_delivery_time?: string;
  operation_partner?: string;
  promo_discount?: number;
  insurance_fee?: number;
  pick_station_fee?: number;
  coupon_value?: number;
}

export interface PreviewOrderResponse {
  code: number;
  message: string;
  data: PreviewOrderData;
}

export interface TrackingResponse {
  orderCode: string;
  status: string;
  logs: TrackingLog[];
}

export interface TrackingLog {
  status: string;
  time: string;
  location: string;
}

export interface OrderStatusResponse {
  orderCode: string;
  status: string;
}

export interface CancelGHNOrderRequest {
  order_codes: string[];
}

export interface CancelOrderResponse {
  orderCode: string;
  status: string;
}

export interface SwitchStatusRequest {
  order_codes: string[];
}


export interface GHNOrderDetailResponse {
  orderCode: string;
  status: string;
  fee: number;
  expectedDeliveryTime: string;
  // Other GHN order details
}

export interface OrderByClientCodeResponse {
  orderCode: string;
  clientCode: string;
  status: string;
  // Other order details
}

export interface GHNTrackingResponse {
  orderCode: string;
  status: string;
  logs: TrackingLog[];
}

export interface GeneratePrintTokenResponse {
  token: string;
  url: string;
}

export interface PrintOrderResponse {
  fileName: string;
  fileSize: number;
  pdfContent: string; // base64 encoded
}

export interface SwitchStatusResponse {
  successCount: number;
  totalCount: number;
  results: Record<string, boolean>;
}

export interface UserOrderResponse {
  orderCode: string;
  status: string;
  createdAt: string;
}

export interface PrintOrderRequest {
  order_codes: string[];
}

export interface PrintTokenResponse {
  token: string;
  url: string;
}

export interface UpdateOrderItemRequest {
  productDetailId: number;
  quantity: number;
}

export interface AddOrderItemRequest {
  productDetailId: number;
  quantity: number;
}

export interface UpdateCustomerRequest {
  customerId: number;
}

export interface ApplyDiscountRequest {
  discountId: number;
}

export interface AddItemToOrderRequest {
  productDetailId: number;
  quantity: number;
}

export interface UpdateItemQuantityRequest {
  productDetailId: number;
  quantity: number;
}

export interface AssignCustomerToOrderRequest {
  customerId: number;
}

export interface RemoveItemFromDraftOrderRequest {
  productDetailId: number;
}

export interface UpdateNoteRequest {
  note: string;
}

export interface CheckoutRequest {
  cashReceived: number;
}

export interface CheckoutResponse {
  orderId: number;
  orderCode: string;
  status: string;
  paymentStatus: string;
  customerName?: string;
  customerPhone?: string;
  totalProductPrice: number;
  orderDiscountAmount: number;
  productDiscountAmount: number;
  totalOrderPrice: number;
  cashReceived: number;
  changeAmount: number;
  notes?: string;
  createdAt: string;
  items: CheckoutOrderItemResponse[];
}

export interface CheckoutOrderItemResponse {
  id: number;
  imageUrl?: string;
  productName: string;
  attributes?: string;
  unitPrice: number;
  quantity: number;
  amount: number;
}

export interface DiscountCreateRequest {
  name: string;
  type: string;
  value: number;
  startDate: string;
  endDate: string;
}

export interface DiscountUpdateRequest extends DiscountCreateRequest {
  id: number;
}

export interface DiscountPageResponse extends PageResponse<DiscountResponse> { }

export interface DiscountMetadataResponse {
  types: string[];
  states: string[];
}

export interface CustomerVoucherCreateRequest {
  customerId: number;
  voucherId: number;
  expiryDate: string;
}

export interface CustomerVoucherUpdateRequest {
  expiryDate?: string;
  status?: string;
}

export interface CustomerVoucherStatsResponse {
  total: number;
  used: number;
  available: number;
}

export interface UseVoucherRequest {
  voucherId: number;
  orderId: number;
}

export interface GrantVoucherRequest {
  customerId: number;
  voucherId: number;
}

export interface ExpireVoucherRequest {
  voucherId: number;
}

export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface CategoryParentResponse {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  categoryChildCount: number;
  status: CategoryStatus;
}

export interface CategoryChildResponse {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  status: CategoryStatus;
  productCount: number;
  parentId?: number;
}

export interface CategoryParentPageResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  categories: CategoryParentResponse[];
}

export interface CategoryChildPageResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  categoryChildResponseList: CategoryChildResponse[];
}

export interface CategoryParentCreateRequest {
  name: string;
  imageUrl?: string;
}

export interface CategoryChildCreateRequest {
  name: string;
  parentId: number;
  imageUrl?: string;
}

export interface CategoryParentUpdateRequest extends CategoryParentCreateRequest {
  id: number;
}

export interface CategoryChildUpdateRequest {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface VariantRequest {
  productId: number;
  // Other fields as needed
}

export interface VariantDetailIdRequest {
  productId: number;
  listAttributeId: number[];
}

export interface VariantUpdateRequest {
  id: number;
  price?: number;
  quantity?: number;
  status?: string;
}

export interface ProductStatusRequest {
  id: number;
}

export interface VariantQuantityUpdateRequest {
  variantId: number;
  quantity: number;
}

export interface EmployeeResponse extends UserResponse {
  department: string;
  position: string;
}

export interface EmployeePageResponse extends PageResponse<EmployeeResponse> { }

export interface CustomerResponse extends UserResponse {
  address: string;
  membershipLevel: string;
}

export interface CustomerPageResponse extends PageResponse<CustomerResponse> { }

export interface EmployeeCreationRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  department: string;
  position: string;
}

export interface EmployeeUpdateRequest extends EmployeeCreationRequest {
  id: number;
}

export interface CustomerCreationRequest {
  username?: string;
  email?: string;
  password?: string;
  name: string;
  phone: string;
  address?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  birthday?: string;
}

export interface CustomerUpdateRequest extends CustomerCreationRequest {
  id: number;
}

export interface SelectAllRequest {
  getAll: number[];
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

export interface OrderHistoryResponse {
  id: number;
  orderId: number;
  action: string;
  userId: number;
  timestamp: string;
  details: string;
}

export interface OrderHistoryPageResponse extends PageResponse<OrderHistoryResponse> { }

export interface OrderHistoryCreateRequest {
  orderId: number;
  action: string;
  details: string;
}

export interface OrderHistoryUpdateRequest {
  action?: string;
  details?: string;
}

export interface OrderDetailPageResponse extends PageResponse<OrderDetailResponse> { }

export interface CustomerOrderMetadataResponse {
  paymentMethods: string[];
  shippingMethods: string[];
  orderStatuses: string[];
}

export interface OrderStatusUpdateRequest {
  status: string;
}

export interface CustomerOrderUpdateRequest {
  status?: string;
  paymentStatus?: string;
  shippingAddress?: AddressCreationRequest;
}

export interface OrderDetailCreateRequest {
  productDetailId: number;
  quantity: number;
  snapshotProductName: string;
  snapshotProductSku: string;
  snapshotProductPrice: number;
}

export interface OrderDetailUpdateRequest {
  productDetailId: number;
  quantity: number;
  snapshotProductName: string;
  snapshotProductSku: string;
  snapshotProductPrice: number;
}

// Attribute Types
export interface SimpleCategoryResponse {
  id: number;
  name: string;
}

export interface CategoryPublicResponse {
  categories: SimpleCategoryResponse[];
}