// src/app/router/routes.user.tsx
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { lazy } from "react";
import { LazyWrapper } from "../../components/common/LazyWrapper";
import ProtectedRoute from "../../components/common/ProtectedRoute";

// Lazy load user/shop pages
const UserHome = lazy(
  () => import("../../features/shop/pages/UserProfile/UserHome")
);
const ProfileLayout = lazy(() => import("../../layouts/ProfileLayout"));
const ProfileTab = lazy(
  () => import("../../features/shop/pages/UserProfile/ProfileTab")
);
const AddressTab = lazy(
  () => import("../../features/shop/pages/UserProfile/AddressTab")
);
const PasswordTab = lazy(
  () => import("../../features/shop/pages/UserProfile/PasswordTab")
);
const PrivacyTab = lazy(
  () => import("../../features/shop/pages/UserProfile/PrivacyTab")
);
const OrdersTab = lazy(
  () => import("../../features/shop/pages/UserProfile/OrdersTab")
);
const OrderDetailTab = lazy(
  () => import("../../features/shop/pages/UserProfile/OrderDetailTab")
);
const ReturnRefundRequest = lazy(
  () => import("../../features/shop/pages/UserProfile/ReturnRefundRequest")
);
const ReturnRefundProductSelection = lazy(
  () =>
    import("../../features/shop/pages/UserProfile/ReturnRefundProductSelection")
);
const ReturnRefundDetail = lazy(
  () => import("../../features/shop/pages/UserProfile/ReturnRefundDetail")
);
const ReturnRefundMethodSelection = lazy(
  () =>
    import(
      "../../features/shop/pages/UserProfile/ReturnRefundMethodSelection"
    )
);
const VouchersTab = lazy(
  () => import("../../features/shop/pages/UserProfile/VouchersTab")
);
const LandingPage = lazy(
  () => import("../../features/shop/pages/Main/landingPage")
);
const ProductDetail = lazy(
  () => import("../../features/shop/pages/Product/ProductDetail")
);
const CartPage = lazy(() => import("../../features/shop/pages/Cart/CartPage"));
const CheckoutPage = lazy(
  () => import("../../features/shop/pages/Checkout/CheckoutPage")
);
const WarrantyPolicy = lazy(
  () => import("../../features/shop/pages/Policies/WarrantyPolicy")
);
const ReturnRefundPolicy = lazy(
  () => import("../../features/shop/pages/Policies/ReturnRefundPolicy")
);
const PaymentPolicy = lazy(
  () => import("../../features/shop/pages/Policies/PaymentPolicy")
);
const PrivacyPolicy = lazy(
  () => import("../../features/shop/pages/Policies/PrivacyPolicy")
);
const ShippingPolicy = lazy(
  () => import("../../features/shop/pages/Policies/ShippingPolicy")
);

export const userRoutes: RouteObject[] = [
  {
    path: "home",
    element: (
      <LazyWrapper>
        <UserHome />
      </LazyWrapper>
    ),
  },
  {
    path: "return-refund",
    element: (
      <ProtectedRoute>
        <LazyWrapper>
          <ReturnRefundRequest />
        </LazyWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: "return-refund/select-products",
    element: (
      <ProtectedRoute>
        <LazyWrapper>
          <ReturnRefundProductSelection />
        </LazyWrapper>
      </ProtectedRoute>
    ),
  },
  {
    path: "policy/warranty",
    element: (
      <LazyWrapper>
        <WarrantyPolicy />
      </LazyWrapper>
    ),
  },
  {
    path: "policy/return-refund",
    element: (
      <LazyWrapper>
        <ReturnRefundPolicy />
      </LazyWrapper>
    ),
  },
  {
    path: "policy/payment",
    element: (
      <LazyWrapper>
        <PaymentPolicy />
      </LazyWrapper>
    ),
  },
  {
    path: "policy/privacy",
    element: (
      <LazyWrapper>
        <PrivacyPolicy />
      </LazyWrapper>
    ),
  },
  {
    path: "policy/shipping",
    element: (
      <LazyWrapper>
        <ShippingPolicy />
      </LazyWrapper>
    ),
  },
  {
    path: "profile",
    element: (
      <ProtectedRoute>
        <LazyWrapper>
          <ProfileLayout />
        </LazyWrapper>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/user/profile/basicinformation" replace />,
      },
      {
        path: "basicinformation",
        element: (
          <LazyWrapper>
            <ProfileTab />
          </LazyWrapper>
        ),
      },
      {
        path: "address",
        element: (
          <LazyWrapper>
            <AddressTab />
          </LazyWrapper>
        ),
      },
      {
        path: "password",
        element: (
          <LazyWrapper>
            <PasswordTab />
          </LazyWrapper>
        ),
      },
      {
        path: "privacy",
        element: (
          <LazyWrapper>
            <PrivacyTab />
          </LazyWrapper>
        ),
      },
      {
        path: "orders",
        element: (
          <LazyWrapper>
            <OrdersTab />
          </LazyWrapper>
        ),
      },
      {
        path: "orders/:orderId",
        element: (
          <LazyWrapper>
            <OrderDetailTab />
          </LazyWrapper>
        ),
      },
      {
        path: "vouchers",
        element: (
          <LazyWrapper>
            <VouchersTab />
          </LazyWrapper>
        ),
      },
      {
        path: "return-refund/:requestId",
        element: (
          <LazyWrapper>
            <ReturnRefundDetail />
          </LazyWrapper>
        ),
      },
      {
        path: "return-refund/:requestId/method",
        element: (
          <LazyWrapper>
            <ReturnRefundMethodSelection />
          </LazyWrapper>
        ),
      },
    ],
  },
];

// Shop routes (can be public or user-specific)
export const shopRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyWrapper>
        <LandingPage />
      </LazyWrapper>
    ),
  },
  {
    path: "products/:productId",
    element: (
      <LazyWrapper>
        <ProductDetail />
      </LazyWrapper>
    ),
  },
  {
    path: "cart",
    element: (
      <LazyWrapper>
        <CartPage />
      </LazyWrapper>
    ),
  },
  {
    path: "checkout",
    element: (
      <LazyWrapper>
        <CheckoutPage />
      </LazyWrapper>
    ),
  },
];
