// src/app/router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";

// Layouts
import AdminLayout from "../../layouts/AdminLayout";

// Pages
import Login from "../../pages/auth/Login";
import Register from "../../pages/auth/Register";

// Guards
import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";

// Common Components
import Loading from "../../components/common/Loading";

// Admin routes
import { adminRoutes } from "./routes.admin";
// User routes
import { userRoutes, shopRoutes } from "./routes.user";
import UserLayout from "../../layouts/UserLayout";

export const router = createBrowserRouter([
  // Root redirect (temporarily to shop for UI development)
  {
    path: "/",
    element: <Navigate to="/shop" replace />,
  },

  // Auth routes (public)
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<Loading />}>
        <Register />
      </Suspense>
    ),
  },

  // Admin routes (temporarily public for UI development)
  {
    path: "/admin",
    element: <AdminLayout />,
    children: adminRoutes,
  },

  // Shop routes (public - landing page)
  ...shopRoutes,

  // User routes (temporarily public for UI development)
  {
    path: "/user",
    element: <UserLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="/user/home" replace />,
      },
      ...userRoutes,
    ],
  },

  // 404 Not Found (temporarily redirect to shop for UI development)
  {
    path: "*",
    element: <Navigate to="/shop" replace />,
  },
]);
