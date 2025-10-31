// src/services/auth.api.ts - Authentication API calls
import { getToken } from "../utils/storage";

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  avatar?: string;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

// Authentication APIs
export const authLogin = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  // Mock implementation - thay thế bằng API call thực tế
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Demo accounts
      const demoAccounts = [
        {
          email: "admin@example.com",
          password: "password",
          user: {
            id: "1",
            email: "admin@example.com",
            name: "Admin User",
            role: "ADMIN" as const,
            avatar: "",
            createdAt: new Date().toISOString(),
          },
        },
        {
          email: "user@example.com",
          password: "password",
          user: {
            id: "2",
            email: "user@example.com",
            name: "Regular User",
            role: "USER" as const,
            avatar: "",
            createdAt: new Date().toISOString(),
          },
        },
      ];

      const account = demoAccounts.find(
        (acc) =>
          acc.email === credentials.email &&
          acc.password === credentials.password
      );

      if (account) {
        resolve({
          token: `demo-token-${account.user.id}-${Date.now()}`,
          user: account.user,
        });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000); // Simulate network delay
  });

  // Real API call would look like this:
  // return apiCall('/auth/login', {
  //   method: 'POST',
  //   body: JSON.stringify(credentials),
  // });
};

export const authRegister = async (
  userData: RegisterData
): Promise<LoginResponse> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: `demo-token-new-${Date.now()}`,
        user: {
          id: `new-${Date.now()}`,
          email: userData.email,
          name: userData.name,
          role: "USER",
          avatar: "",
          createdAt: new Date().toISOString(),
        },
      });
    }, 1000);
  });

  // Real API call:
  // return apiCall('/auth/register', {
  //   method: 'POST',
  //   body: JSON.stringify(userData),
  // });
};

export const authMe = async (): Promise<AuthUser> => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found");
  }

  // Mock implementation - extract user info from token
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In real app, decode JWT or call API
      // Check for admin token (includes "demo-token-1" or starts with admin pattern)
      if (token.includes("demo-token-1") || token.match(/demo-token-1-/)) {
        resolve({
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          role: "ADMIN",
          avatar: "",
          createdAt: new Date().toISOString(),
        });
      }
      // Check for user token (includes "demo-token-2" or starts with user pattern)
      else if (token.includes("demo-token-2") || token.match(/demo-token-2-/)) {
        resolve({
          id: "2",
          email: "user@example.com",
          name: "Regular User",
          role: "USER",
          avatar: "",
          createdAt: new Date().toISOString(),
        });
      }
      // Check for new user tokens (from registration)
      else if (token.includes("demo-token-new")) {
        resolve({
          id: token.split("-").pop() || "new-user",
          email: "newuser@example.com",
          name: "New User",
          role: "USER",
          avatar: "",
          createdAt: new Date().toISOString(),
        });
      } else {
        reject(new Error("Invalid token"));
      }
    }, 500);
  });

  // Real API call:
  // return apiCall('/auth/me');
};

export const authLogout = async (): Promise<void> => {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(resolve, 300);
  });

  // Real API call:
  // return apiCall('/auth/logout', { method: 'POST' });
};
