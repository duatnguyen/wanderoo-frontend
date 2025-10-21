// src/app/router/guards/AuthGuard.tsx
import { Navigate } from "react-router-dom";
import { useAuthCtx } from "../../../app/providers/AuthProvider";
import Loading from "../../../components/common/Loading";
import type { JSX } from "react";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const { state } = useAuthCtx();
  if (state.loading) return <Loading />;
  if (!state.isAuth) return <Navigate to="/login" replace />;
  return children;
}
