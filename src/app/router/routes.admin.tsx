// src/app/router/routes.admin.tsx
import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { LazyWrapper } from "../../components/common/LazyWrapper";

// Lazy load admin pages
const AdminDashboard = lazy(
  () => import("../../features/admin/dashboard/pages/AdminDashboard")
);
const AdminProducts = lazy(
  () => import("../../features/admin/products/pages/AdminProducts")
);
const AdminOrders = lazy(
  () => import("../../features/admin/orders/pages/AdminOrders")
);
const AdminOrderDetail = lazy(
  () => import("../../features/admin/orders/pages/AdminOrderDetail")
);
const AdminSettings = lazy(
  () => import("../../features/admin/settings/pages/AdminSettings")
);
const AdminShipping = lazy(
  () => import("../../features/admin/shipping/pages/AdminShipping")
);
const AdminCustomers = lazy(
  () => import("../../features/admin/customers/pages/AdminCustomers")
);
const AdminAccounting = lazy(
  () => import("../../features/admin/accounting/pages/AdminAccounting")
);
const AdminStaff = lazy(
  () => import("../../features/admin/staff/pages/AdminStaff")
);
const AdminReports = lazy(
  () => import("../../features/admin/reports/pages/AdminReports")
);
const AdminDiscounts = lazy(
  () => import("../../features/admin/discounts/pages/AdminDiscounts")
);
const AdminCreateVoucher = lazy(
  () => import("../../features/admin/discounts/pages/AdminCreateVoucher")
);
const AdminPOS = lazy(
  () => import("../../features/admin/channels/pages/AdminPOS")
);
const AdminWarehouseReturnsImport = lazy(
  () =>
    import("../../features/admin/warehouse/pages/AdminWarehouseReturnsImport")
);
const AdminWarehouseImports = lazy(
  () => import("../../features/admin/warehouse/pages/AdminWarehouseImports")
);
const AdminWarehouseCreateImport = lazy(
  () =>
    import("../../features/admin/warehouse/pages/AdminWarehouseCreateImport")
);
const AdminWarehouseImportDetail = lazy(
  () =>
    import("../../features/admin/warehouse/pages/AdminWarehouseImportDetail")
);
const AdminWarehouseDetailReturnImport = lazy(
  () =>
    import(
      "../../features/admin/warehouse/pages/AdminWarehouseDetailReturnImport"
    )
);
const AdminCustomerReviews = lazy(
  () => import("../../features/admin/customers/pages/AdminCustomerReviews")
);
const AdminWarehouseSupplier = lazy(
  () => import("../../features/admin/warehouse/pages/AdminWarehouseSupplier")
);
const AdminOrderOtherStatus = lazy(
  () => import("../../features/admin/orders/pages/AdminOrderOtherStatus")
);
const AdminProductsCategories = lazy(
  () => import("../../features/admin/products/pages/AdminProductsCategories")
);
const AdminProductsCategoryDetail = lazy(
  () =>
    import("../../features/admin/products/pages/AdminProductsCategoryDetail")
);
const AdminProductsNew = lazy(
  () => import("../../features/admin/products/pages/AdminProductsNew")
);
const AdminStaffNew = lazy(
  () => import("../../features/admin/staff/pages/AdminStaffNew")
);
const AdminStaffDetail = lazy(
  () => import("../../features/admin/staff/pages/AdminStaffDetail")
);
const AdminSupplierNew = lazy(
  () => import("../../features/admin/warehouse/pages/AdminSupplierNew")
);
const AdminSupplierDetail = lazy(
  () => import("../../features/admin/warehouse/pages/AdminSupplierDetail")
);
const AdminWebsite = lazy(
  () => import("../../features/admin/channels/pages/AdminWebsite")
);
const AdminCustomerDetail = lazy(
  () => import("../../features/admin/customers/pages/AdminCustomerDetail")
);
const AdminAddCustomer = lazy(
  () => import("../../features/admin/customers/pages/AdminAddCustomer")
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
    path: "products/categories/:categoryId",
    element: (
      <LazyWrapper>
        <AdminProductsCategoryDetail />
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
    path: "warehouse/imports/create",
    element: (
      <LazyWrapper>
        <AdminWarehouseCreateImport />
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
    path: "warehouse/returns/:returnId",
    element: (
      <LazyWrapper>
        <AdminWarehouseDetailReturnImport />
      </LazyWrapper>
    ),
  },
  {
    path: "customers/all",
    element: (
      <LazyWrapper>
        <AdminCustomers />
      </LazyWrapper>
    ),
  },
  {
    path: "customers/new",
    element: (
      <LazyWrapper>
        <AdminAddCustomer />
      </LazyWrapper>
    ),
  },
  {
    path: "customers/:customerId",
    element: (
      <LazyWrapper>
        <AdminCustomerDetail />
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
        <AdminStaffDetail />
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
        <AdminCreateVoucher />
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
    path: "settings/profile",
    element: (
      <LazyWrapper>
        <AdminSettings />
      </LazyWrapper>
    ),
  },
  {
    path: "settings/address",
    element: (
      <LazyWrapper>
        <AdminSettings />
      </LazyWrapper>
    ),
  },
  {
    path: "settings/password",
    element: (
      <LazyWrapper>
        <AdminSettings />
      </LazyWrapper>
    ),
  },
  {
    path: "settings/shop",
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
