// src/app/router/guards/AuthGuard.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../../components/common/Loading";
import type { JSX } from "react";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
