// src/app/router/routes.user.tsx
import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { LazyWrapper } from "../../components/common/LazyWrapper";

// Lazy load user/shop pages
const UserHome = lazy(() => import("../../pages/user/UserHome"));
const UserProfile = lazy(() => import("../../pages/user/Profile"));
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
        <UserProfile />
      </LazyWrapper>
    ),
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
