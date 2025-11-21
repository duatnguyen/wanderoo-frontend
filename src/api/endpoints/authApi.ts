// src/api/endpoints/authApi.ts - Authentication API calls
import api from "../apiClient";
import type {
  SignInRequest,
  UserCreationRequest,
  RefreshTokenRequest,
  TokenResponse,
  ApiResponse,
  UserResponse,
} from "../../types";

// Public Authentication APIs
export const login = async (
  credentials: SignInRequest
): Promise<TokenResponse> => {
  const response = await api.post<ApiResponse<TokenResponse>>(
    "/auth/v1/public/users/login",
    credentials
  );
  return response.data.data;
};

export const register = async (
  userData: UserCreationRequest
): Promise<TokenResponse> => {
  const response = await api.post<ApiResponse<TokenResponse>>(
    "/auth/v1/public/users/register",
    userData
  );
  return response.data.data;
};

export const refreshToken = async (
  refreshTokenData: RefreshTokenRequest
): Promise<TokenResponse> => {
  const response = await api.post<ApiResponse<TokenResponse>>(
    "/auth/v1/public/users/refresh",
    refreshTokenData
  );
  return response.data.data;
};

export const logout = async (): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>(
    "/auth/v1/private/users/logout"
  );
  return response.data;
};

// Private User APIs
export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await api.get<ApiResponse<UserResponse>>(
    "/auth/v1/private/users/me"
  );
  return response.data.data;
};

// Alias exports for backward compatibility
export const authLogin = login;
export const authRegister = register;
export const authMe = getCurrentUser;
