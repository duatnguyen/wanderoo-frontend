// src/utils/storage.ts - Local storage utilities

const TOKEN_KEY = "wanderoo_token";
const USER_KEY = "wanderoo_user";

// Token management
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token from localStorage:", error);
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error setting token to localStorage:", error);
  }
};

export const clearToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error clearing token from localStorage:", error);
  }
};

// User data management
export const getUser = (): any | null => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting user from localStorage:", error);
    return null;
  }
};

export const setUser = (user: any): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error setting user to localStorage:", error);
  }
};
