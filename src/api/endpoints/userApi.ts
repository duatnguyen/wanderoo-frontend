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
  CustomerResponse,
  SelectAllRequest,
} from '../../types';

// Private User Management APIs
export const getUserProfile = async (): Promise<UserResponse> => {
  const response = await api.get<ApiResponse<UserResponse>>('/auth/v1/private/users/profile');
  return response.data.data;
};

export const updateUserProfile = async (userData: UserUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/users/profile', userData);
  return response.data;
};

export const changePassword = async (passwordData: ChangePasswordRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/users/change-password', passwordData);
  return response.data;
};

// Address APIs
export const getUserAddresses = async (params?: { page?: number; size?: number }): Promise<AddressPageResponse> => {
  const response = await api.get<AddressPageResponse>('/auth/v1/private/users/addresses', { params });
  return response.data;
};

export const setDefaultAddress = async (addressId: number): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/users/addresses/${addressId}/default`);
  return response.data;
};

export const addAddress = async (addressData: AddressCreationRequest): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>('/auth/v1/private/users/addresses', addressData);
  return response.data;
};

export const getAddressById = async (addressId: number): Promise<AddressDetailResponse> => {
  const response = await api.get<ApiResponse<AddressDetailResponse>>(`/auth/v1/private/users/addresses/${addressId}`);
  return response.data.data;
};

export const updateAddress = async (addressData: AddressUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/users/addresses/${addressData.id}`, addressData);
  return response.data;
};

export const deleteAddress = async (addressId: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/auth/v1/private/users/addresses/${addressId}`);
  return response.data;
};

// Employee Management APIs
export const getEmployees = async (params?: {
  page?: number;
  size?: number;
  search?: string;
  department?: string;
  status?: string;
}): Promise<EmployeePageResponse> => {
  const response = await api.get<EmployeePageResponse>('/auth/v1/private/users/employees', { params });
  return response.data;
};

export const getEmployeeById = async (id: number): Promise<EmployeeResponse> => {
  const response = await api.get<ApiResponse<EmployeeResponse>>(`/auth/v1/private/users/employees/${id}`);
  return response.data.data;
};

export const createEmployee = async (employeeData: EmployeeCreationRequest): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>('/auth/v1/private/users/employees', employeeData);
  return response.data;
};

export const updateEmployee = async (id: number, employeeData: EmployeeUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/users/employees/${id}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/auth/v1/private/users/employees/${id}`);
  return response.data;
};

export const disableEmployeeAccounts = async (selectData: SelectAllRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/account/employee/disable', selectData);
  return response.data;
};

export const enableEmployeeAccounts = async (selectData: SelectAllRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>('/auth/v1/private/account/employee/enable', selectData);
  return response.data;
};

export const disableAllEmployeeAccounts = async (selectData: SelectAllRequest): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>('/auth/v1/private/account/employee/disable/all', {
    data: selectData,
  });
  return response.data;
};

// Customer Management APIs
export const getCustomers = async (params?: {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
}): Promise<CustomerPageResponse> => {
  const response = await api.get<CustomerPageResponse>('/auth/v1/private/users/customers', { params });
  return response.data;
};

export const getCustomerById = async (id: number): Promise<CustomerResponse> => {
  const response = await api.get<ApiResponse<CustomerResponse>>(`/auth/v1/private/users/customers/${id}`);
  return response.data.data;
};

export const createCustomer = async (customerData: CustomerCreationRequest): Promise<ApiResponse<number>> => {
  const response = await api.post<ApiResponse<number>>('/auth/v1/private/users/customers', customerData);
  return response.data;
};

export const updateCustomer = async (id: number, customerData: CustomerUpdateRequest): Promise<ApiResponse<null>> => {
  const response = await api.put<ApiResponse<null>>(`/auth/v1/private/users/customers/${id}`, customerData);
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

// Alias exports for backward compatibility
// Note: authMe is now in authApi.ts