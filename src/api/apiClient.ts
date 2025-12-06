// src/api/apiClient.ts - Base API client with axios instance and interceptors
import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Base API configuration
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
console.log('🔗 API BASE_URL:', BASE_URL, 'VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

const PUBLIC_ENDPOINT_PREFIXES = [
  '/auth/v1/public',
  '/public/v1',
  '/public/',
  '/v1/public',
];

// Endpoints that require authentication even though they are under /auth/v1/public
const AUTH_REQUIRED_PUBLIC_ENDPOINTS = [
  '/auth/v1/public/orders',
  '/public/v1/discount/calculate-discount',
  '/public/v1/discount/voucher/my-discounts',
];

function normalizePath(url?: string): string {
  if (!url) return '';
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return new URL(url).pathname;
    }
  } catch {
    return '';
  }
  return url.startsWith('/') ? url : `/${url}`;
}

function isPublicEndpoint(url?: string): boolean {
  const path = normalizePath(url);

  // Check if this endpoint requires authentication even though it's under public prefix
  const requiresAuth = AUTH_REQUIRED_PUBLIC_ENDPOINTS.some((prefix) => path.startsWith(prefix));
  if (requiresAuth) {
    return false; // Not public, requires auth
  }

  return PUBLIC_ENDPOINT_PREFIXES.some((prefix) => path.startsWith(prefix));
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 300000, // align with -c (5 minutes) to avoid premature timeouts on heavy requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    
    // Log request details for newest products endpoint
    if (config.url?.includes('/products/newest')) {
      console.log("=== REQUEST INTERCEPTOR: Newest Products ===");
      console.log("URL:", config.url);
      console.log("Params:", config.params);
      console.log("Full config:", config);
    }
    
    console.log("API Request:", config.url, "Token exists:", !!token);

    const publicEndpoint = isPublicEndpoint(config.url);

    // Always send token if available, even for public endpoints that require auth (like orders)
    // Only skip token for truly public endpoints (login, register, etc.)
    if (token) {
      const path = normalizePath(config.url);
      const requiresAuth = AUTH_REQUIRED_PUBLIC_ENDPOINTS.some((prefix) => path.startsWith(prefix));

      if (!publicEndpoint || requiresAuth) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Authorization header added for:", config.url);
      } else {
        console.log("No authorization header for:", config.url, "Public endpoint");
      }
    } else {
      console.log("No authorization header for:", config.url, "No token");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response details for newest products endpoint
    if (response.config.url?.includes('/products/newest')) {
      console.log("=== RESPONSE INTERCEPTOR: Newest Products ===");
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      console.log("Response data.data length:", response.data?.data?.length);
      console.log("Response data.data:", response.data?.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${BASE_URL}/auth/v1/public/users/refresh`,
            {
              refreshToken,
            }
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Helper functions for common API patterns
export const apiGet = <T>(url: string, params?: any): Promise<AxiosResponse<T>> => {
  return api.get(url, { params });
};

export const apiPost = <T>(url: string, data?: any): Promise<AxiosResponse<T>> => {
  return api.post(url, data);
};

export const apiPut = <T>(url: string, data?: any): Promise<AxiosResponse<T>> => {
  return api.put(url, data);
};

export const apiPatch = <T>(url: string, data?: any): Promise<AxiosResponse<T>> => {
  return api.patch(url, data);
};

export const apiDelete = <T>(url: string): Promise<AxiosResponse<T>> => {
  return api.delete(url);
};
