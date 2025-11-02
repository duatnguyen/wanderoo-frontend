// src/app/router/routes.constants.ts

/**
 * POS Route Constants
 * Centralized routing paths for POS system
 */
export const POS_ROUTES = {
  // Base POS route
  BASE: "/pos",
  
  // Main POS pages
  SALES: "/pos/sales",
  ORDERS: "/pos/orders", 
  INVENTORY: "/pos/inventory",
  CASHBOOK: "/pos/cashbook",
  
  // Return order routes
  RETURNS: {
    BASE: "/pos/returns",
    CREATE: (orderId: string) => `/pos/returns/create/${orderId}`,
  },
} as const;

/**
 * Admin Route Constants
 */
export const ADMIN_ROUTES = {
  BASE: "/admin",
  DASHBOARD: "/admin/dashboard",
  PRODUCTS: "/admin/products",
  ORDERS: "/admin/orders",
  USERS: "/admin/users",
  SETTINGS: "/admin/settings",
} as const;

/**
 * User/Shop Route Constants  
 */
export const USER_ROUTES = {
  BASE: "/user",
  HOME: "/user/home",
  PROFILE: "/user/profile",
  ORDERS: "/user/orders",
  FAVORITES: "/user/favorites",
} as const;

export const SHOP_ROUTES = {
  HOME: "/shop",
  CATEGORY: (categoryId: string) => `/shop/category/${categoryId}`,
  PRODUCT: (productId: string) => `/shop/product/${productId}`,
} as const;

/**
 * Auth Route Constants
 */
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

/**
 * Helper function to check if current path matches POS routes
 */
export const isPOSRoute = (pathname: string): boolean => {
  return pathname.startsWith(POS_ROUTES.BASE);
};

/**
 * Helper function to check if current path matches Admin routes
 */
export const isAdminRoute = (pathname: string): boolean => {
  return pathname.startsWith(ADMIN_ROUTES.BASE);
};

/**
 * Helper function to check if current path matches User routes
 */
export const isUserRoute = (pathname: string): boolean => {
  return pathname.startsWith(USER_ROUTES.BASE);
};