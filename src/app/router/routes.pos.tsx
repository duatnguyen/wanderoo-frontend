// src/app/router/routes.pos.tsx
import type { ReactElement } from "react";
import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { LazyWrapper } from "../../components/common/LazyWrapper";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../context/AuthContext";
import { AUTH_ROUTES, POS_ROUTES } from "./routes.constants";

// Lazy load POS pages - Organized by feature modules
const POSSales = lazy(() => import("../../features/pos/pages/sales/POSSales"));
const OrderManagement = lazy(
  () => import("../../features/pos/pages/orders/OrderManagement")
);
const InventoryLookup = lazy(
  () => import("../../features/pos/pages/inventory/InventoryLookup")
);
const ReturnOrderManagement = lazy(
  () => import("../../features/pos/pages/returns/ReturnOrderManagement")
);
const CreateReturnOrder = lazy(
  () => import("../../features/pos/pages/returns/CreateReturnOrder")
);
const CashBook = lazy(
  () => import("../../features/pos/pages/cashbook/CashBook")
);

type PosRouteGuardProps = {
  children: ReactElement;
};

const PosRouteGuard = ({ children }: PosRouteGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading text="Đang xác thực quyền truy cập..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.LOGIN} replace />;
  }

  return children;
};

const withPosAuth = (element: ReactElement) => (
  <PosRouteGuard>{element}</PosRouteGuard>
);

export const posRoutes: RouteObject[] = [
  // Default POS route - redirect to sales
  {
    index: true,
    element: withPosAuth(<Navigate to={POS_ROUTES.SALES} replace />),
  },

  // POS Sales (Main POS interface)
  {
    path: "sales",
    element: withPosAuth(
      <LazyWrapper>
        <POSSales />
      </LazyWrapper>
    ),
  },
  // Order Management
  {
    path: "orders",
    element: withPosAuth(
      <LazyWrapper>
        <OrderManagement />
      </LazyWrapper>
    ),
  },

  // Inventory Lookup
  {
    path: "inventory",
    element: withPosAuth(
      <LazyWrapper>
        <InventoryLookup />
      </LazyWrapper>
    ),
  },

  // Return Order Management
  {
    path: "returns",
    element: withPosAuth(
      <LazyWrapper>
        <ReturnOrderManagement />
      </LazyWrapper>
    ),
  },
  {
    path: "returns/create/:orderId",
    element: withPosAuth(
      <LazyWrapper>
        <CreateReturnOrder />
      </LazyWrapper>
    ),
  },

  // Cash Book / Financial Management
  {
    path: "cashbook",
    element: withPosAuth(
      <LazyWrapper>
        <CashBook />
      </LazyWrapper>
    ),
  },

  // Catch-all route for POS - redirect to sales
  {
    path: "*",
    element: withPosAuth(<Navigate to={POS_ROUTES.SALES} replace />),
  },
];
