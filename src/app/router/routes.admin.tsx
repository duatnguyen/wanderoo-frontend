// src/app/router/routes.admin.tsx
import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { LazyWrapper } from "../../components/common/LazyWrapper";

// Lazy load admin pages
const AdminDashboard = lazy(
  () => import("../../features/admin/pages/dashboard/AdminDashboard")
);
const AdminProducts = lazy(
  () => import("../../features/admin/pages/products/list/AdminProducts")
);
const AdminOrders = lazy(
  () => import("../../features/admin/pages/orders/list/AdminOrders")
);
const AdminOrderDetail = lazy(
  () => import("../../features/admin/pages/orders/detail/AdminOrderDetail")
);
const AdminSettings = lazy(
  () => import("../../features/admin/pages/settings/AdminSettings")
);
const AdminShipping = lazy(
  () => import("../../features/admin/pages/shipping/AdminShipping")
);
const AdminCustomers = lazy(() =>
  import("../../features/admin/pages/customers/list").then((module) => ({
    default: module.AdminCustomers,
  }))
);
const AdminAccounting = lazy(
  () => import("../../features/admin/pages/accounting/AdminAccounting")
);
const AdminStaff = lazy(
  () => import("../../features/admin/pages/staff/list/AdminStaff")
);
const AdminReports = lazy(
  () => import("../../features/admin/pages/reports/AdminReports")
);
const AdminDiscounts = lazy(
  () => import("../../features/admin/pages/discounts/list/AdminDiscounts")
);
const AdminCreateVoucher = lazy(
  () => import("../../features/admin/pages/discounts/create/AdminCreateVoucher")
);
const AdminCreateVoucherShopWide = lazy(
  () =>
    import(
      "../../features/admin/pages/discounts/create/AdminCreateVoucherShopWide"
    )
);
const AdminCreateVoucherProduct = lazy(
  () =>
    import(
      "../../features/admin/pages/discounts/create/AdminCreateVoucherProduct"
    )
);
const AdminCreateVoucherNewCustomer = lazy(
  () =>
    import(
      "../../features/admin/pages/discounts/create/AdminCreateVoucherNewCustomer"
    )
);
const AdminCreateVoucherReturningCustomer = lazy(
  () =>
    import(
      "../../features/admin/pages/discounts/create/AdminCreateVoucherReturningCustomer"
    )
);
const AdminCreateVoucherPrivate = lazy(
  () =>
    import(
      "../../features/admin/pages/discounts/create/AdminCreateVoucherPrivate"
    )
);

// POS Pages
const POSSales = lazy(() => import("../../features/pos/pages/sales/POSSales"));
const POSOrderManagement = lazy(
  () => import("../../features/pos/pages/orders/OrderManagement")
);
const POSReturnOrderManagement = lazy(
  () => import("../../features/pos/pages/returns/ReturnOrderManagement")
);
const POSCreateReturnOrder = lazy(
  () => import("../../features/pos/pages/returns/CreateReturnOrder")
);
const POSInventoryLookup = lazy(
  () => import("../../features/pos/pages/inventory/InventoryLookup")
);
const POSCashBook = lazy(
  () => import("../../features/pos/pages/cashbook/CashBook")
);

const AdminWarehouseReturnsImport = lazy(
  () =>
    import(
      "../../features/admin/pages/warehouse/returns/AdminWarehouseReturnsImport"
    )
);
const AdminWarehouseImports = lazy(
  () =>
    import("../../features/admin/pages/warehouse/imports/AdminWarehouseImports")
);
const AdminWarehouseCreateImport = lazy(
  () =>
    import(
      "../../features/admin/pages/warehouse/imports/AdminWarehouseCreateImport"
    )
);
const AdminWarehouseCreateReturnImport = lazy(
  () =>
    import(
      "../../features/admin/pages/warehouse/returns/AdminWarehouseCreateReturnImport"
    )
);
const AdminWarehouseImportDetail = lazy(
  () =>
    import(
      "../../features/admin/pages/warehouse/imports/AdminWarehouseImportDetail"
    )
);
const AdminWarehouseDetailReturnImport = lazy(
  () =>
    import(
      "../../features/admin/pages/warehouse/returns/AdminWarehouseDetailReturnImport"
    )
);
const AdminCustomerReviews = lazy(
  () =>
    import("../../features/admin/pages/customers/reviews/AdminCustomerReviews")
);
const AdminWarehouseSupplier = lazy(
  () =>
    import(
      "../../features/admin/pages/warehouse/suppliers/AdminWarehouseSupplier"
    )
);
const AdminOrderOtherStatus = lazy(
  () => import("../../features/admin/pages/orders/list/AdminOrderOtherStatus")
);
const AdminOrderOtherStatusDetail = lazy(
  () =>
    import(
      "../../features/admin/pages/orders/detail/AdminOrderOtherStatusDetail"
    )
);
const AdminProductsCategories = lazy(
  () =>
    import(
      "../../features/admin/pages/products/categories/AdminProductsCategories"
    )
);
const AdminProductsCategoryDetail = lazy(
  () =>
    import(
      "../../features/admin/pages/products/categories/AdminProductsCategoryDetail"
    )
);
const AdminProductsSubcategoryDetail = lazy(
  () =>
    import(
      "../../features/admin/pages/products/categories/AdminProductsSubcategoryDetail"
    )
);
const AdminProductsNew = lazy(
  () => import("../../features/admin/pages/products/create/AdminProductsNew")
);
const AdminProductsEdit = lazy(
  () => import("../../features/admin/pages/products/edit/AdminProductsEdit")
);
const AdminStaffNew = lazy(
  () => import("../../features/admin/pages/staff/create/AdminStaffNew")
);
const AdminStaffDetail = lazy(
  () => import("../../features/admin/pages/staff/detail/AdminStaffDetail")
);
const AdminSupplierNew = lazy(
  () =>
    import("../../features/admin/pages/warehouse/suppliers/AdminSupplierNew")
);
const AdminSupplierDetail = lazy(
  () =>
    import("../../features/admin/pages/warehouse/suppliers/AdminSupplierDetail")
);

const AdminCustomerDetail = lazy(
  () =>
    import("../../features/admin/pages/customers/detail/AdminCustomerDetail")
);
const AdminAddCustomer = lazy(
  () => import("../../features/admin/pages/customers/list/AdminAddCustomer")
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
    path: "orders/otherstatus/:orderId",
    element: (
      <LazyWrapper>
        <AdminOrderOtherStatusDetail />
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
    path: "products/categories/:categoryId/subcategories/:subcategoryId",
    element: (
      <LazyWrapper>
        <AdminProductsSubcategoryDetail />
      </LazyWrapper>
    ),
  },
  {
    path: "products/:productId/edit",
    element: (
      <LazyWrapper>
        <AdminProductsEdit />
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
    path: "warehouse/returns/create",
    element: (
      <LazyWrapper>
        <AdminWarehouseCreateReturnImport />
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
    path: "customers",
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
    path: "discounts/new/shop-wide",
    element: (
      <LazyWrapper>
        <AdminCreateVoucherShopWide />
      </LazyWrapper>
    ),
  },
  {
    path: "discounts/new/product",
    element: (
      <LazyWrapper>
        <AdminCreateVoucherProduct />
      </LazyWrapper>
    ),
  },
  {
    path: "discounts/new/new-customer",
    element: (
      <LazyWrapper>
        <AdminCreateVoucherNewCustomer />
      </LazyWrapper>
    ),
  },
  {
    path: "discounts/new/returning-customer",
    element: (
      <LazyWrapper>
        <AdminCreateVoucherReturningCustomer />
      </LazyWrapper>
    ),
  },
  {
    path: "discounts/new/private",
    element: (
      <LazyWrapper>
        <AdminCreateVoucherPrivate />
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
  // POS Routes - Point of Sale System
  {
    path: "channels/pos",
    element: (
      <LazyWrapper>
        <POSSales />
      </LazyWrapper>
    ),
  },
  {
    path: "pos/sales",
    element: (
      <LazyWrapper>
        <POSSales />
      </LazyWrapper>
    ),
  },
  {
    path: "pos/orders",
    element: (
      <LazyWrapper>
        <POSOrderManagement />
      </LazyWrapper>
    ),
  },
  {
    path: "pos/returns",
    element: (
      <LazyWrapper>
        <POSReturnOrderManagement />
      </LazyWrapper>
    ),
  },
  {
    path: "pos/returns/create",
    element: (
      <LazyWrapper>
        <POSCreateReturnOrder />
      </LazyWrapper>
    ),
  },
  {
    path: "pos/inventory",
    element: (
      <LazyWrapper>
        <POSInventoryLookup />
      </LazyWrapper>
    ),
  },
  {
    path: "pos/cashbook",
    element: (
      <LazyWrapper>
        <POSCashBook />
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
