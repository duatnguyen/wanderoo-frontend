// src/app/router/router.utils.ts
import { useNavigate, useLocation } from "react-router-dom";
import {
  POS_ROUTES,
  ADMIN_ROUTES,
  USER_ROUTES,
  AUTH_ROUTES,
} from "./routes.constants";

/**
 * Custom hook for POS navigation
 * Provides type-safe navigation methods for POS routes
 */
export const usePOSNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    // Navigation methods
    goToSales: () => navigate(POS_ROUTES.SALES),
    goToOrders: () => navigate(POS_ROUTES.ORDERS),
    goToInventory: () => navigate(POS_ROUTES.INVENTORY),
    goToCashBook: () => navigate(POS_ROUTES.CASHBOOK),
    goToReturns: () => navigate(POS_ROUTES.RETURNS.BASE),
    goToCreateReturn: (orderId: string) =>
      navigate(POS_ROUTES.RETURNS.CREATE(orderId)),

    // Current route checks
    isOnSales: () => location.pathname === POS_ROUTES.SALES,
    isOnOrders: () => location.pathname === POS_ROUTES.ORDERS,
    isOnInventory: () => location.pathname === POS_ROUTES.INVENTORY,
    isOnCashBook: () => location.pathname === POS_ROUTES.CASHBOOK,
    isOnReturns: () => location.pathname.startsWith(POS_ROUTES.RETURNS.BASE),

    // Current path
    currentPath: location.pathname,
  };
};

/**
 * Custom hook for Admin navigation
 */
export const useAdminNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    goToDashboard: () => navigate(ADMIN_ROUTES.DASHBOARD),
    goToProducts: () => navigate(ADMIN_ROUTES.PRODUCTS),
    goToOrders: () => navigate(ADMIN_ROUTES.ORDERS),
    goToUsers: () => navigate(ADMIN_ROUTES.USERS),
    goToSettings: () => navigate(ADMIN_ROUTES.SETTINGS),

    isOnDashboard: () => location.pathname === ADMIN_ROUTES.DASHBOARD,
    isOnProducts: () => location.pathname === ADMIN_ROUTES.PRODUCTS,
    isOnOrders: () => location.pathname === ADMIN_ROUTES.ORDERS,
    isOnUsers: () => location.pathname === ADMIN_ROUTES.USERS,
    isOnSettings: () => location.pathname === ADMIN_ROUTES.SETTINGS,

    currentPath: location.pathname,
  };
};

/**
 * Custom hook for User navigation
 */
export const useUserNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    goToHome: () => navigate(USER_ROUTES.HOME),
    goToProfile: () => navigate(USER_ROUTES.PROFILE),
    goToOrders: () => navigate(USER_ROUTES.ORDERS),
    goToFavorites: () => navigate(USER_ROUTES.FAVORITES),

    isOnHome: () => location.pathname === USER_ROUTES.HOME,
    isOnProfile: () => location.pathname === USER_ROUTES.PROFILE,
    isOnOrders: () => location.pathname === USER_ROUTES.ORDERS,
    isOnFavorites: () => location.pathname === USER_ROUTES.FAVORITES,

    currentPath: location.pathname,
  };
};

/**
 * Custom hook for Auth navigation
 */
export const useAuthNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    goToLogin: () => navigate(AUTH_ROUTES.LOGIN),
    goToRegister: () => navigate(AUTH_ROUTES.REGISTER),
    goToForgotPassword: () => navigate(AUTH_ROUTES.FORGOT_PASSWORD),
    goToResetPassword: () => navigate(AUTH_ROUTES.RESET_PASSWORD),

    isOnLogin: () => location.pathname === AUTH_ROUTES.LOGIN,
    isOnRegister: () => location.pathname === AUTH_ROUTES.REGISTER,

    currentPath: location.pathname,
  };
};

/**
 * Get breadcrumb items based on current path
 */
export const useBreadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const getBreadcrumb = () => {
    const breadcrumbs = [];

    if (pathSegments[0] === "pos") {
      breadcrumbs.push({ label: "POS System", path: POS_ROUTES.BASE });

      switch (pathSegments[1]) {
        case "sales":
          breadcrumbs.push({ label: "Sales", path: POS_ROUTES.SALES });
          break;
        case "orders":
          breadcrumbs.push({
            label: "Order Management",
            path: POS_ROUTES.ORDERS,
          });
          break;
        case "inventory":
          breadcrumbs.push({
            label: "Inventory Lookup",
            path: POS_ROUTES.INVENTORY,
          });
          break;
        case "returns":
          breadcrumbs.push({ label: "Returns", path: POS_ROUTES.RETURNS.BASE });
          if (pathSegments[2] === "create" && pathSegments[3]) {
            breadcrumbs.push({
              label: `Create Return for Order ${pathSegments[3]}`,
              path: POS_ROUTES.RETURNS.CREATE(pathSegments[3]),
            });
          }
          break;
        case "cashbook":
          breadcrumbs.push({ label: "Cash Book", path: POS_ROUTES.CASHBOOK });
          break;
      }
    }

    // Add similar logic for admin, user routes...

    return breadcrumbs;
  };

  return {
    breadcrumbs: getBreadcrumb(),
    currentPath: location.pathname,
  };
};

/**
 * Route guard utilities
 */
export const routeGuards = {
  requireAuth: (user: any) => {
    return !!user; // Simple auth check
  },

  requireRole: (user: any, requiredRole: string) => {
    return user && user.role === requiredRole;
  },

  requirePermission: (user: any, permission: string) => {
    return user && user.permissions && user.permissions.includes(permission);
  },
};
