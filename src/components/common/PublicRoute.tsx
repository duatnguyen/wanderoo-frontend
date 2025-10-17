import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthCtx } from '../../app/providers/AuthProvider';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo 
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

  // Redirect nếu đã đăng nhập
  if (isAuthenticated && user) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    
    // Redirect về trang tương ứng với role
    const defaultRedirect = user.role === 'admin' ? '/admin/dashboard' : '/user/home';
    return <Navigate to={defaultRedirect} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;