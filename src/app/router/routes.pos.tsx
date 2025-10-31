// src/app/router/routes.pos.tsx
import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { LazyWrapper } from "../../components/common/LazyWrapper";

// Lazy load POS pages
const POSPage = lazy(() => import("../../features/pos/pages/POSPage"));

export const posRoutes: RouteObject[] = [
  {
    path: "sales",
    element: (
      <LazyWrapper>
        <POSPage />
      </LazyWrapper>
    ),
  },
];

