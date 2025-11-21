// src/api/endpoints/userApi.ts - User management API calls
import api from '../apiClient';
import type {
  ApiResponse,
  UserResponse,
  UserUpdateRequest,
  ChangePasswordRequest,
  AddressPageResponse,
  AddressCreationRequest,
  AddressUpdateRequest,
  AddressDetailResponse,
  EmployeePageResponse,
  EmployeeCreationRequest,
  EmployeeUpdateRequest,
  EmployeeResponse,
  CustomerPageResponse,
  CustomerCreationRequest,
  CustomerUpdateRequest,
  SelectAllRequest,
  AdminProfileDetailResponse,
  AdminProfileUpdateRequest,
  AdminPasswordUpdateRequest,
} from '../../types';
import type { CustomerResponse } from '../../types/api';

export type AllowedRole =
  | "ADMIN"
  | "MANAGER"
  | "EMPLOYEE"
  | "OPERATIONS_MANAGER";

// Private User Management APIs (aligned with UserPrivateController)
export const getUserInfo = async (): Promise<UserResponse> => {
  const response = await api.get<ApiResponse<UserResponse>>('/auth/v1/private/users/info');
  return response.data.data;
};

export const updateUserProfile = async (userData: UserUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/users', userData);
  return response.data;
};

export const changePassword = async (passwordData: ChangePasswordRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/users/password', passwordData);
  return response.data;
};

// Address APIs (customer)
export const getUserAddresses = async (): Promise<AddressPageResponse> => {
  const response = await api.get<ApiResponse<AddressDetailResponse[]>>('/auth/v1/private/users/address');
  const addresses = response.data.data ?? [];
  return { addresses };
};

export const setDefaultAddress = async (addressId: number): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/users/address/default`, undefined, {
    params: { addressId },
  });
  return response.data;
};

export const addAddress = async (addressData: AddressCreationRequest): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>('/auth/v1/private/users/address', addressData);
  return response.data;
};

export const getAddressById = async (addressId: number): Promise<AddressDetailResponse> => {
  const response = await api.get<ApiResponse<AddressDetailResponse>>(`/auth/v1/private/users/address/${addressId}`);
  return response.data.data;
};

export const updateAddress = async (addressData: AddressUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/users/address', addressData);
  return response.data;
};

export const deleteAddress = async (addressId: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/auth/v1/private/users/address/${addressId}`);
  return response.data;
};

// Employee Management APIs
type EmployeePageApiResponse = EmployeePageResponse & {
  employees?: EmployeeResponse[];
  content?: EmployeeResponse[];
};

export const getEmployees = async (params?: {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
}): Promise<EmployeePageResponse> => {
  const { page = 1, size = 10, search, status } = params ?? {};
  const queryParams = {
    page,
    size,
    keyword: search || undefined,
    status: status || undefined,
  };

  const response = await api.get<ApiResponse<EmployeePageApiResponse>>(
    '/auth/v1/private/users/employees',
    { params: queryParams },
  );
  const payload = response.data.data ?? {};
  const content =
    payload.content ??
    payload.employees ??
    [];

  const totalElements =
    payload.totalElements ??
    content.length;

  const pageSizeValue = payload.pageSize ?? size;
  const totalPages =
    payload.totalPages ??
    Math.ceil(totalElements / (pageSizeValue || 1));

  return {
    pageNumber: payload.pageNumber ?? page,
    pageSize: pageSizeValue,
    totalElements,
    totalPages,
    content,
  };
};

export const getEmployeeById = async (id: number): Promise<EmployeeResponse> => {
  const response = await api.get<ApiResponse<EmployeeResponse>>(`/auth/v1/private/users/employees/${id}`);
  return response.data.data;
};

export const createEmployee = async (
  employeeData: EmployeeCreationRequest,
  userType?: AllowedRole,
): Promise<ApiResponse<number>> => {
  const endpoint = userType
    ? '/auth/v1/private/account/employee/add'
    : '/auth/v1/private/users/employees';
  const response = await api.post<ApiResponse<number>>(endpoint, employeeData, {
    params: userType ? { userType } : undefined,
  });
  return response.data;
};

export const updateEmployee = async (id: number, employeeData: EmployeeUpdateRequest): Promise<ApiResponse<null>> => {
  console.log("updateEmployee API call:", { id, employeeData });
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/users/employees/${id}`, employeeData);
  console.log("updateEmployee API response:", response.data);
  return response.data;
};

export const updateEmployeeAccount = async (
  employeeData: EmployeeUpdateRequest,
  userType?: AllowedRole,
): Promise<ApiResponse<null>> => {
  console.log("updateEmployeeAccount API call:", { employeeData, userType });
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/account/employee/upd', employeeData, {
    params: userType ? { userType } : undefined,
  });
  console.log("updateEmployeeAccount API response:", response.data);
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/auth/v1/private/users/employees/${id}`);
  return response.data;
};

export const disableEmployeeAccounts = async (selectData: SelectAllRequest): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>('/auth/v1/private/account/employee/disable/all', {
    data: selectData,
  });
  return response.data;
};

export const enableEmployeeAccounts = async (selectData: SelectAllRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/account/employee/enable/all', selectData);
  return response.data;
};

export const disableAllEmployeeAccounts = async (selectData: SelectAllRequest): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>('/auth/v1/private/account/employee/disable/all', {
    data: selectData,
  });
  return response.data;
};

// Customer Management APIs
type CustomerPageApiResponse = CustomerPageResponse & {
  customers?: CustomerResponse[];
  content?: CustomerResponse[];
};

export const getCustomers = async (params?: {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
}): Promise<CustomerPageResponse> => {
  const { page = 1, size = 10, search } = params ?? {};
  const queryParams = {
    page,
    size,
    keyword: search || undefined,
    // Note: Backend doesn't support status filter for customers yet
  };

  const response = await api.get<ApiResponse<CustomerPageApiResponse>>(
    '/auth/v1/private/users/customers',
    { params: queryParams },
  );
  
  console.log("getCustomers API response:", response.data);
  
  const payload = response.data.data ?? {};
  console.log("getCustomers payload:", payload);
  
  const content =
    payload.content ??
    payload.customers ??
    [];

  console.log("getCustomers content:", content);

  const totalElements =
    payload.totalElements ??
    content.length;

  const pageSizeValue = payload.pageSize ?? size;
  const totalPages =
    payload.totalPages ??
    Math.ceil(totalElements / (pageSizeValue || 1));

  return {
    pageNumber: payload.pageNumber ?? page,
    pageSize: pageSizeValue,
    totalElements,
    totalPages,
    content,
  };
};

export const getCustomerById = async (id: number): Promise<CustomerResponse> => {
  const response = await api.get<ApiResponse<CustomerResponse>>(`/auth/v1/private/users/customers/${id}`);
  return response.data.data;
};

export const createCustomer = async (customerData: CustomerCreationRequest): Promise<ApiResponse<number>> => {
  console.log("createCustomer API call:", customerData);
  const response = await api.post<ApiResponse<number>>('/auth/v1/private/users/customers', customerData);
  console.log("createCustomer API response:", response.data);
  return response.data;
};

export const updateCustomer = async (id: number, customerData: CustomerUpdateRequest): Promise<ApiResponse<null>> => {
  console.log("updateCustomer API call:", { id, customerData });
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/users/customers/${id}`, customerData);
  console.log("updateCustomer API response:", response.data);
  return response.data;
};

export const deleteCustomer = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/auth/v1/private/users/customers/${id}`);
  return response.data;
};

export const disableCustomerAccounts = async (selectData: SelectAllRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/account/customer/disable', selectData);
  return response.data;
};

export const enableCustomerAccounts = async (selectData: SelectAllRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/account/customer/enable', selectData);
  return response.data;
};

export const disableAllCustomerAccounts = async (selectData: SelectAllRequest): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>('/auth/v1/private/account/customer/disable/all', {
    data: selectData,
  });
  return response.data;
};

// Customer Address Management APIs
export const getCustomerAddresses = async (customerId: number): Promise<AddressPageResponse> => {
  const response = await api.get<ApiResponse<AddressPageResponse>>(`/auth/v1/private/users/customers/${customerId}/addresses`);
  return response.data.data;
};

export const updateCustomerAddress = async (customerId: number, addressData: AddressUpdateRequest): Promise<ApiResponse<null>> => {
  console.log("updateCustomerAddress API call:", { customerId, addressData });
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/users/customers/${customerId}/addresses`, addressData);
  console.log("updateCustomerAddress API response:", response.data);
  return response.data;
};

export const createCustomerAddress = async (customerId: number, addressData: AddressCreationRequest): Promise<ApiResponse<number>> => {
  console.log("createCustomerAddress API call:", { customerId, addressData });
  const response = await api.post<ApiResponse<number>>(`/auth/v1/private/users/customers/${customerId}/addresses`, addressData);
  console.log("createCustomerAddress API response:", response.data);
  return response.data;
};

// Admin Address APIs
export const getAdminAddresses = async (): Promise<AddressPageResponse> => {
  const response = await api.get<ApiResponse<AddressDetailResponse[]>>('/auth/v1/private/users/admin/address');
  return {
    addresses: response.data.data ?? [],
  };
};

export const createAdminAddress = async (addressData: AddressCreationRequest): Promise<ApiResponse<number>> => {
  console.log("createAdminAddress API call:", addressData);
  const response = await api.post<ApiResponse<number>>('/auth/v1/private/users/admin/address', addressData);
  console.log("createAdminAddress API response:", response.data);
  return response.data;
};

export const updateAdminAddress = async (addressData: AddressUpdateRequest): Promise<ApiResponse<null>> => {
  console.log("updateAdminAddress API call:", addressData);
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/users/admin/address', addressData);
  console.log("updateAdminAddress API response:", response.data);
  return response.data;
};

export const deleteAdminAddress = async (addressId: number): Promise<ApiResponse<null>> => {
  console.log("deleteAdminAddress API call:", addressId);
  const response = await api.delete<ApiResponse<null>>(`/auth/v1/private/users/admin/address/${addressId}`);
  console.log("deleteAdminAddress API response:", response.data);
  return response.data;
};

export const setDefaultAdminAddress = async (addressId: number): Promise<ApiResponse<null>> => {
  console.log("setDefaultAdminAddress API call:", addressId);
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/users/admin/address/default?addressId=${addressId}`);
  console.log("setDefaultAdminAddress API response:", response.data);
  return response.data;
};

// Admin Profile APIs
export const getAdminProfile = async (): Promise<AdminProfileDetailResponse> => {
  const response = await api.get<ApiResponse<AdminProfileDetailResponse>>('/auth/v1/private/users/admin/info');
  return response.data.data;
};

export const updateAdminProfile = async (profileData: AdminProfileUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/users/admin', profileData);
  return response.data;
};

export const updateAdminPassword = async (passwordData: AdminPasswordUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/users/admin/password', passwordData);
  return response.data;
};

export const uploadAdminAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ApiResponse<string>>('/files/avatar', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

// Alias exports for backward compatibility
// Note: authMe is now in authApi.ts
