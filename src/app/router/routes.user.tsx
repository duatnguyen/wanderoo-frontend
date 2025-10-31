// src/app/router/routes.user.tsx
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { lazy } from "react";
import { LazyWrapper } from "../../components/common/LazyWrapper";

// Lazy load user/shop pages
const UserHome = lazy(() => import("../../pages/user/UserHome"));
const ProfileLayout = lazy(() => import("../../layouts/ProfileLayout"));
const BasicInformationTab = lazy(
  () => import("../../pages/user/tabs/BasicInformationTab")
);
const AddressTab = lazy(() => import("../../pages/user/tabs/AddressTab"));
const PasswordTab = lazy(() => import("../../pages/user/tabs/PasswordTab"));
const PrivacyTab = lazy(() => import("../../pages/user/tabs/PrivacyTab"));
const OrdersTab = lazy(() => import("../../pages/user/tabs/OrdersTab"));
const OrderDetailTab = lazy(
  () => import("../../pages/user/tabs/OrderDetailTab")
);
const VouchersTab = lazy(() => import("../../pages/user/tabs/VouchersTab"));
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
    path: "profile",
    element: (
      <LazyWrapper>
        <ProfileLayout />
      </LazyWrapper>
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
            <BasicInformationTab />
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
    ],
  },
];

// Shop routes (can be public or user-specific)
export const shopRoutes: RouteObject[] = [
  {
    path: "/shop",
    element: (
      <LazyWrapper>
        <LandingPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/shop/products/:productId",
    element: (
      <LazyWrapper>
        <ProductDetail />
      </LazyWrapper>
    ),
  },
  {
    path: "/shop/cart",
    element: (
      <LazyWrapper>
        <CartPage />
      </LazyWrapper>
    ),
  },
  {
    path: "/shop/checkout",
    element: (
      <LazyWrapper>
        <CheckoutPage />
      </LazyWrapper>
    ),
  },
];
