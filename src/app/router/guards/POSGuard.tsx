// src/app/router/guards/POSGuard.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loading } from "@/components/common";
import { AUTH_ROUTES } from "../routes.constants";

// For now, we'll use a simple auth check
// Later this should integrate with your actual auth system

interface POSGuardProps {
  children: React.ReactNode;
}

/**
 * POS Route Guard
 * Protects POS routes by checking user authentication and POS permissions
 * 
 * Note: Currently set to temporarily allow access for UI development
 * In production, this should integrate with your auth system
 */
const POSGuard: React.FC<POSGuardProps> = ({ children }) => {
  // const { user, loading } = useAuth(); // TODO: Integrate with auth system
  const location = useLocation();

  // Temporarily allow access for UI development
  // TODO: Enable authentication checks in production
  const isAuthEnabled = false; // Set to true when auth is ready
  
  if (isAuthEnabled) {
    // Mock auth check - replace with real auth logic
    const user = null; // Get from auth context
    const loading = false; // Get from auth context

    // Show loading while checking auth status
    if (loading) {
      return <Loading />;
    }

    // Redirect to login if not authenticated
    if (!user) {
      return (
        <Navigate 
          to={AUTH_ROUTES.LOGIN} 
          state={{ from: location.pathname }} 
          replace 
        />
      );
    }

    // Check if user has POS access permissions
    // const hasPOSAccess = user.role === 'admin' || 
    //                    user.role === 'pos_operator' || 
    //                    user.permissions?.includes('pos_access');

    // if (!hasPOSAccess) {
    //   // Redirect to appropriate dashboard based on user role
    //   const redirectPath = user.role === 'admin' ? '/admin' : '/user';
    //   return <Navigate to={redirectPath} replace />;
    // }
  }

  // Allow access (for now)
  return <>{children}</>;
};

export default POSGuard;