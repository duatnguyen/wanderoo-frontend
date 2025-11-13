// src/types/auth.ts - Authentication and user management types
import type { PageResponse } from './common';

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

export interface AddressPageResponse extends PageResponse<AddressResponse> {}

export interface AddressDetailResponse extends AddressResponse {}

export interface EmployeeResponse extends UserResponse {
  department: string;
  position: string;
}

export interface EmployeePageResponse extends PageResponse<EmployeeResponse> {}

export interface CustomerResponse extends UserResponse {
  address: string;
  membershipLevel: string;
}

export interface CustomerPageResponse extends PageResponse<CustomerResponse> {}

// Request types
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
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
}

export interface CustomerUpdateRequest extends CustomerCreationRequest {
  id: number;
}

export interface SelectAllRequest {
  ids: number[];
}

// Context and state types
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  status: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}
