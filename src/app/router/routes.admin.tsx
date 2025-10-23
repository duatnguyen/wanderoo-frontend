// src/app/router/routes.admin.tsx
import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { LazyWrapper } from "../../components/common/LazyWrapper";

// Lazy load admin pages
const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("../../pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("../../pages/admin/AdminOrders"));
const AdminOrderDetail = lazy(
  () => import("../../pages/admin/AdminOrderDetail"),
);
const AdminSettings = lazy(() => import("../../pages/admin/AdminSettings"));
const AdminShipping = lazy(() => import("../../pages/admin/AdminShipping"));
const AdminCustomers = lazy(() => import("../../pages/admin/AdminCustomers"));
const AdminAccounting = lazy(() => import("../../pages/admin/AdminAccounting"));
const AdminStaff = lazy(() => import("../../pages/admin/AdminStaff"));
const AdminReports = lazy(() => import("../../pages/admin/AdminReports"));
const AdminDiscounts = lazy(() => import("../../pages/admin/AdminDiscounts"));
const AdminWebsite = lazy(() => import("../../pages/admin/AdminWebsite"));
const AdminPOS = lazy(() => import("../../pages/admin/AdminPOS"));
const AdminWarehouseReturnsImport = lazy(
  () => import("../../pages/admin/AdminWarehouseReturnsImport"),
);
const AdminWarehouseImports = lazy(
  () => import("../../pages/admin/AdminWarehouseImports"),
);
const AdminWarehouseImportDetail = lazy(
  () => import("../../pages/admin/AdminWarehouseImportDetail"),
);
const AdminCustomerReviews = lazy(
  () => import("../../pages/admin/AdminCustomerReviews"),
);
const AdminWarehouseSupplier = lazy(
  () => import("../../pages/admin/AdminWarehouseSupplier"),
);
const AdminOrderOtherStatus = lazy(
  () => import("../../pages/admin/AdminOrderOtherStatus"),
);
const AdminProductsCategories = lazy(
  () => import("../../pages/admin/AdminProductsCategories"),
);
const AdminProductsNew = lazy(
  () => import("../../pages/admin/AdminProductsNew"),
);
const AdminStaffNew = lazy(
  () => import("../../pages/admin/AdminStaffNew"),
);
const AdminSupplierNew = lazy(
  () => import("../../pages/admin/AdminSupplierNew"),
);
const AdminSupplierDetail = lazy(
  () => import("../../pages/admin/AdminSupplierDetail"),
);

export const adminRoutes: RouteObject[] = [
  {
    path: "",
    element: (
      <LazyWrapper>
        <AdminDashboard />
      </LazyWrapper>
    ),
  },
  {
    path: "dashboard",
    element: (
      <LazyWrapper>
        <AdminDashboard />
      </LazyWrapper>
    ),
  },
  {
    path: "orders/all",
    element: (
      <LazyWrapper>
        <AdminOrders />
      </LazyWrapper>
    ),
  },
  {
    path: "orders/:orderId",
    element: (
      <LazyWrapper>
        <AdminOrderDetail />
      </LazyWrapper>
    ),
  },
  {
    path: "orders/otherstatus",
    element: (
      <LazyWrapper>
        <AdminOrderOtherStatus />
      </LazyWrapper>
    ),
  },
  {
    path: "shipping",
    element: (
      <LazyWrapper>
        <AdminShipping />
      </LazyWrapper>
    ),
  },
  {
    path: "shipping/carriers",
    element: (
      <LazyWrapper>
        <AdminShipping />
      </LazyWrapper>
    ),
  },
  {
    path: "shipping/zones",
    element: (
      <LazyWrapper>
        <AdminShipping />
      </LazyWrapper>
    ),
  },
  {
    path: "products/all",
    element: (
      <LazyWrapper>
        <AdminProducts />
      </LazyWrapper>
    ),
  },
  {
    path: "products/new",
    element: (
      <LazyWrapper>
        <AdminProductsNew />
      </LazyWrapper>
    ),
  },
  {
    path: "products/categories",
    element: (
      <LazyWrapper>
        <AdminProductsCategories />
      </LazyWrapper>
    ),
  },
  {
    path: "products/:productId/edit",
    element: (
      <LazyWrapper>
        <AdminProducts />
      </LazyWrapper>
    ),
  },
  {
    path: "warehouse/supplier",
    element: (
      <LazyWrapper>
        <AdminWarehouseSupplier />
      </LazyWrapper>
    ),
  },
  {
    path: "warehouse/supplier/new",
    element: (
      <LazyWrapper>
        <AdminSupplierNew />
      </LazyWrapper>
    ),
  },
  {
    path: "warehouse/supplier/:supplierId",
    element: (
      <LazyWrapper>
        <AdminSupplierDetail />
      </LazyWrapper>
    ),
  },
  {
    path: "warehouse/import",
    element: (
      <LazyWrapper>
        <AdminWarehouseImports />
      </LazyWrapper>
    ),
  },
  {
    path: "warehouse/returnsimport",
    element: (
      <LazyWrapper>
        <AdminWarehouseReturnsImport />
      </LazyWrapper>
    ),
  },
  {
    path: "warehouse/imports",
    element: (
      <LazyWrapper>
        <AdminWarehouseImports />
      </LazyWrapper>
    ),
  },
  {
    path: "warehouse/imports/:importId",
    element: (
      <LazyWrapper>
        <AdminWarehouseImportDetail />
      </LazyWrapper>
    ),
  },
  {
    path: "customers",
    element: (
      <LazyWrapper>
        <AdminCustomers />
      </LazyWrapper>
    ),
  },
  {
    path: "customers/:customerId",
    element: (
      <LazyWrapper>
        <AdminCustomers />
      </LazyWrapper>
    ),
  },
  {
    path: "customers/reviews",
    element: (
      <LazyWrapper>
        <AdminCustomerReviews />
      </LazyWrapper>
    ),
  },
  {
    path: "accounting",
    element: (
      <LazyWrapper>
        <AdminAccounting />
      </LazyWrapper>
    ),
  },
  {
    path: "accounting/revenue",
    element: (
      <LazyWrapper>
        <AdminAccounting />
      </LazyWrapper>
    ),
  },
  {
    path: "accounting/expenses",
    element: (
      <LazyWrapper>
        <AdminAccounting />
      </LazyWrapper>
    ),
  },
  {
    path: "staff",
    element: (
      <LazyWrapper>
        <AdminStaff />
      </LazyWrapper>
    ),
  },
  {
    path: "staff/new",
    element: (
      <LazyWrapper>
        <AdminStaffNew />
      </LazyWrapper>
    ),
  },
  {
    path: "staff/roles",
    element: (
      <LazyWrapper>
        <AdminStaff />
      </LazyWrapper>
    ),
  },
  {
    path: "staff/:staffId",
    element: (
      <LazyWrapper>
        <AdminStaff />
      </LazyWrapper>
    ),
  },
  {
    path: "reports",
    element: (
      <LazyWrapper>
        <AdminReports />
      </LazyWrapper>
    ),
  },
  {
    path: "reports/sales",
    element: (
      <LazyWrapper>
        <AdminReports />
      </LazyWrapper>
    ),
  },
  {
    path: "reports/products",
    element: (
      <LazyWrapper>
        <AdminReports />
      </LazyWrapper>
    ),
  },
  {
    path: "reports/customers",
    element: (
      <LazyWrapper>
        <AdminReports />
      </LazyWrapper>
    ),
  },
  {
    path: "discounts",
    element: (
      <LazyWrapper>
        <AdminDiscounts />
      </LazyWrapper>
    ),
  },
  {
    path: "discounts/new",
    element: (
      <LazyWrapper>
        <AdminDiscounts />
      </LazyWrapper>
    ),
  },
  {
    path: "discounts/:discountId/edit",
    element: (
      <LazyWrapper>
        <AdminDiscounts />
      </LazyWrapper>
    ),
  },
  {
    path: "channels/website",
    element: (
      <LazyWrapper>
        <AdminWebsite />
      </LazyWrapper>
    ),
  },
  {
    path: "channels/pos",
    element: (
      <LazyWrapper>
        <AdminPOS />
      </LazyWrapper>
    ),
  },
  {
    path: "settings",
    element: (
      <LazyWrapper>
        <AdminSettings />
      </LazyWrapper>
    ),
  },
  {
    path: "settings/general",
    element: (
      <LazyWrapper>
        <AdminSettings />
      </LazyWrapper>
    ),
  },
  {
    path: "settings/integrations",
    element: (
      <LazyWrapper>
        <AdminSettings />
      </LazyWrapper>
    ),
  },
  {
    path: "settings/security",
    element: (
      <LazyWrapper>
        <AdminSettings />
      </LazyWrapper>
    ),
  },

  {
    path: "*",
    element: (
      <LazyWrapper>
        <AdminDashboard />
      </LazyWrapper>
    ),
  },
];
