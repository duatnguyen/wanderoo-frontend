// src/app/router/guards/RoleGuard.tsx
import { Navigate } from "react-router-dom";
import { useAuthCtx } from "../../../app/providers/AuthProvider";
import type { JSX } from "react";

export default function RoleGuard({
  allow,
  children,
}: {
  allow: ("ADMIN" | "USER")[];
  children: JSX.Element;
}) {
  const { state } = useAuthCtx();
  if (!state.isAuth) return <Navigate to="/login" replace />;
  if (!state.role || !allow.includes(state.role)) {
    // chuyển về trang phù hợp role hiện tại
    return state.role === "USER" ? (
      <Navigate to="/" replace />
    ) : (
      <Navigate to="/admin" replace />
    );
  }
  return children;
}
