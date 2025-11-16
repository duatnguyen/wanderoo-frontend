// src/app/router/guards/RoleGuard.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getUserFromToken } from "../../../utils/jwt";
import Loading from "../../../components/common/Loading";
import type { JSX } from "react";

export default function RoleGuard({
  allow,
  children,
}: {
  allow: ("ADMIN" | "USER")[];
  children: JSX.Element;
}) {
  const { isLoading, isAuthenticated, token } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated || !token) return <Navigate to="/login" replace />;

  // Decode token để lấy role
  try {
    const userFromToken = getUserFromToken(token);
    const userRole = userFromToken?.role;

    console.log("RoleGuard - User role from token:", userRole);
    console.log("RoleGuard - Allowed roles:", allow);

    if (!userRole) {
      console.log("RoleGuard - No role found, redirecting to login");
      return <Navigate to="/login" replace />;
    }

    // Kiểm tra role có được phép không
    if (!allow.includes(userRole as "ADMIN" | "USER")) {
      console.log("RoleGuard - Role not allowed, redirecting based on role");
      if (userRole === "ADMIN") {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (userRole === "USER" || userRole === "CUSTOMER") {
        return <Navigate to="/shop" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }

    console.log("RoleGuard - Access granted");
    return children;
  } catch (error) {
    console.error("RoleGuard - Error decoding token:", error);
    return <Navigate to="/login" replace />;
  }
}
