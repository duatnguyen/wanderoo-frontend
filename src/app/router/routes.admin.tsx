// src/app/router/routes.admin.tsx
import type { RouteObject } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "../../components/common/Loading";

// Lazy load admin pages  
const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("../../pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("../../pages/admin/AdminOrders"));
const AdminSettings = lazy(() => import("../../pages/admin/AdminSettings"));
const AdminShipping = lazy(() => import("../../pages/admin/AdminShipping"));
const AdminWarehouse = lazy(() => import("../../pages/admin/AdminWarehouse"));
const AdminCustomers = lazy(() => import("../../pages/admin/AdminCustomers"));
const AdminAccounting = lazy(() => import("../../pages/admin/AdminAccounting"));
const AdminStaff = lazy(() => import("../../pages/admin/AdminStaff"));
const AdminReports = lazy(() => import("../../pages/admin/AdminReports"));
const AdminDiscounts = lazy(() => import("../../pages/admin/AdminDiscounts"));
const AdminWebsite = lazy(() => import("../../pages/admin/AdminWebsite"));
const AdminPOS = lazy(() => import("../../pages/admin/AdminPOS"));
const AdminOrdersReturn = lazy(() => import("../../pages/admin/AdminOrdersReturn"));

// Wrapper component for lazy loading
const LazyWrapper = ({ children }: { children: React.ReactElement }) => (
    <Suspense fallback={<Loading />}>
        {children}
    </Suspense>
);

export const adminRoutes: RouteObject[] = [
    {
        path: "",
        element: <LazyWrapper><AdminDashboard /></LazyWrapper>,
    },
    {
        path: "dashboard",
        element: <LazyWrapper><AdminDashboard /></LazyWrapper>,
    },
    {
        path: "orders",
        element: <LazyWrapper><AdminOrders /></LazyWrapper>,
    },
    {
        path: "orders/:orderId",
        element: <LazyWrapper><AdminOrders /></LazyWrapper>,
    },
    {
        path: "orders/return",
        element: <LazyWrapper><AdminOrdersReturn /></LazyWrapper>,
    },
    {
        path: "shipping",
        element: <LazyWrapper><AdminShipping /></LazyWrapper>,
    },
    {
        path: "shipping/carriers",
        element: <LazyWrapper><AdminShipping /></LazyWrapper>,
    },
    {
        path: "shipping/zones",
        element: <LazyWrapper><AdminShipping /></LazyWrapper>,
    },
    {
        path: "products",
        element: <LazyWrapper><AdminProducts /></LazyWrapper>,
    },
    {
        path: "products/categories",
        element: <LazyWrapper><AdminProducts /></LazyWrapper>,
    },
    {
        path: "products/new",
        element: <LazyWrapper><AdminProducts /></LazyWrapper>,
    },
    {
        path: "products/:productId/edit",
        element: <LazyWrapper><AdminProducts /></LazyWrapper>,
    },
    {
        path: "warehouse",
        element: <LazyWrapper><AdminWarehouse /></LazyWrapper>,
    },
    {
        path: "warehouse/inventory",
        element: <LazyWrapper><AdminWarehouse /></LazyWrapper>,
    },
    {
        path: "warehouse/import",
        element: <LazyWrapper><AdminWarehouse /></LazyWrapper>,
    },
    {
        path: "warehouse/export",
        element: <LazyWrapper><AdminWarehouse /></LazyWrapper>,
    },
    {
        path: "customers",
        element: <LazyWrapper><AdminCustomers /></LazyWrapper>,
    },
    {
        path: "customers/:customerId",
        element: <LazyWrapper><AdminCustomers /></LazyWrapper>,
    },
    {
        path: "accounting",
        element: <LazyWrapper><AdminAccounting /></LazyWrapper>,
    },
    {
        path: "accounting/revenue",
        element: <LazyWrapper><AdminAccounting /></LazyWrapper>,
    },
    {
        path: "accounting/expenses",
        element: <LazyWrapper><AdminAccounting /></LazyWrapper>,
    },
    {
        path: "staff",
        element: <LazyWrapper><AdminStaff /></LazyWrapper>,
    },
    {
        path: "staff/roles",
        element: <LazyWrapper><AdminStaff /></LazyWrapper>,
    },
    {
        path: "staff/:staffId",
        element: <LazyWrapper><AdminStaff /></LazyWrapper>,
    },
    {
        path: "reports",
        element: <LazyWrapper><AdminReports /></LazyWrapper>,
    },
    {
        path: "reports/sales",
        element: <LazyWrapper><AdminReports /></LazyWrapper>,
    },
    {
        path: "reports/products",
        element: <LazyWrapper><AdminReports /></LazyWrapper>,
    },
    {
        path: "reports/customers",
        element: <LazyWrapper><AdminReports /></LazyWrapper>,
    },
    {
        path: "discounts",
        element: <LazyWrapper><AdminDiscounts /></LazyWrapper>,
    },
    {
        path: "discounts/new",
        element: <LazyWrapper><AdminDiscounts /></LazyWrapper>,
    },
    {
        path: "discounts/:discountId/edit",
        element: <LazyWrapper><AdminDiscounts /></LazyWrapper>,
    },
    {
        path: "channels/website",
        element: <LazyWrapper><AdminWebsite /></LazyWrapper>,
    },
    {
        path: "channels/pos",
        element: <LazyWrapper><AdminPOS /></LazyWrapper>,
    },
    {
        path: "settings",
        element: <LazyWrapper><AdminSettings /></LazyWrapper>,
    },
    {
        path: "settings/general",
        element: <LazyWrapper><AdminSettings /></LazyWrapper>,
    },
    {
        path: "settings/integrations",
        element: <LazyWrapper><AdminSettings /></LazyWrapper>,
    },
    {
        path: "settings/security",
        element: <LazyWrapper><AdminSettings /></LazyWrapper>,
    },
    
    {
        path: "*",
        element: <LazyWrapper><AdminDashboard /></LazyWrapper>,
    }
];
