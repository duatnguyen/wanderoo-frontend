// src/api/endpoints/authApi.ts - Authentication API calls
import api from '../apiClient';
import type {
  SignInRequest,
  UserCreationRequest,
  TokenResponse,
  ApiResponse,
} from '../../types';

// Public Authentication APIs
export const login = async (credentials: SignInRequest): Promise<TokenResponse> => {
  const response = await api.post<ApiResponse<TokenResponse>>('/auth/v1/public/users/login', credentials);
  return response.data.data;
};

export const register = async (userData: UserCreationRequest): Promise<TokenResponse> => {
  const response = await api.post<ApiResponse<TokenResponse>>('/auth/v1/public/users/register', userData);
  return response.data.data;
};

export const refreshToken = async (refreshTokenValue: string): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>(
    '/auth/v1/public/users/refresh-token',
    refreshTokenValue,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
  return response.data;
};

export const logout = async (): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>('/auth/v1/private/users/logout');
  return response.data;
};

// Alias exports for backward compatibility
export const authLogin = login;
export const authRegister = register;