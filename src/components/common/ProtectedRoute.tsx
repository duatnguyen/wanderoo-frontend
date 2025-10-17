import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthCtx } from '../../app/providers/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/login' 
}) => {
  const { state } = useAuthCtx();
  const { isAuth: isAuthenticated, user, loading: isLoading } = state;

  // Hiển thị loading khi đang kiểm tra auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect nếu chưa đăng nhập
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Kiểm tra quyền truy cập nếu có yêu cầu role cụ thể
  if (requiredRole && user.role !== requiredRole) {
    // Redirect admin về admin dashboard, user về user home
    const defaultRedirect = user.role === 'admin' ? '/admin/dashboard' : '/user/home';
    return <Navigate to={defaultRedirect} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;