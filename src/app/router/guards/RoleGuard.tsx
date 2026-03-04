// src/app/router/guards/RoleGuard.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getUserFromToken } from "../../../utils/jwt";
import Loading from "../../../components/common/Loading";
import type { JSX } from "react";

type AllowedRole =
  | "ADMIN"
  | "MANAGER"
  | "EMPLOYEE"
  | "OPERATIONS_MANAGER"
  | "USER"
  | "CUSTOMER";

interface RoleGuardProps {
  allow: AllowedRole[];
  children: JSX.Element;
}

export default function RoleGuard({ allow, children }: RoleGuardProps) {
  const { isLoading, isAuthenticated, token } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated || !token) return <Navigate to="/login" replace />;

  try {
    const userFromToken = getUserFromToken(token);
    const userRole = userFromToken?.role?.toUpperCase();

    console.log("RoleGuard - User role from token:", userRole);
    console.log("RoleGuard - Allowed roles:", allow);

    if (!userRole) {
      console.log("RoleGuard - No role found, redirecting to login");
      return <Navigate to="/login" replace />;
    }

    const isAuthorized = allow.includes(userRole as AllowedRole);

    if (!isAuthorized) {
      console.log("RoleGuard - Role not allowed, redirecting based on role");
      if (userRole === "ADMIN") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      if (userRole === "CUSTOMER" || userRole === "USER") {
        return <Navigate to="/shop" replace />;
      }
      return <Navigate to="/login" replace />;
    }

    console.log("RoleGuard - Access granted");
    return children;
  } catch (error) {
    console.error("RoleGuard - Error decoding token:", error);
    return <Navigate to="/login" replace />;
  }
}
