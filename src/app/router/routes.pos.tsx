// src/app/router/routes.pos.tsx
import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { LazyWrapper } from "../../components/common/LazyWrapper";
import { POS_ROUTES } from "./routes.constants";

// Lazy load POS pages - Organized by feature modules
const POSSales = lazy(() => import("../../features/pos/pages/sales"));
const OrderManagement = lazy(() => import("../../features/pos/pages/orders"));
const InventoryLookup = lazy(() => import("../../features/pos/pages/inventory"));
const ReturnOrderManagement = lazy(() => import("../../features/pos/pages/returns/ReturnOrderManagement"));
const CreateReturnOrder = lazy(() => import("../../features/pos/pages/returns/CreateReturnOrder"));
const CashBook = lazy(() => import("../../features/pos/pages/cashbook"));

export const posRoutes: RouteObject[] = [
  // Default POS route - redirect to sales
  {
    index: true,
    element: <Navigate to={POS_ROUTES.SALES} replace />,
  },
  
  // POS Sales (Main POS interface)
  {
    path: "sales",
    element: (
      <LazyWrapper>
        <POSSales />
      </LazyWrapper>
    ),
  },
  // Order Management
  {
    path: "orders",
    element: (
      <LazyWrapper>
        <OrderManagement />
      </LazyWrapper>
    ),
  },
  
  // Inventory Lookup
  {
    path: "inventory",
    element: (
      <LazyWrapper>
        <InventoryLookup />
      </LazyWrapper>
    ),
  },
  
  // Return Order Management
  {
    path: "returns",
    children: [
      // Return orders list
      {
        index: true,
        element: (
          <LazyWrapper>
            <ReturnOrderManagement />
          </LazyWrapper>
        ),
      },
      // Create new return order
      {
        path: "create/:orderId",
        element: (
          <LazyWrapper>
            <CreateReturnOrder />
          </LazyWrapper>
        ),
      },
    ],
  },
  
  // Cash Book / Financial Management
  {
    path: "cashbook",
    element: (
      <LazyWrapper>
        <CashBook />
      </LazyWrapper>
    ),
  },
  
  // Catch-all route for POS - redirect to sales
  {
    path: "*",
    element: <Navigate to={POS_ROUTES.SALES} replace />,
  },
];
