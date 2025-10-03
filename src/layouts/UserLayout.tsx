import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/user/home" className="text-xl font-bold">
                Wanderoo
              </Link>
            </div>
            
            <nav className="flex items-center space-x-6">
              <Link
                to="/user/home"
                className="hover:text-blue-200 transition-colors"
              >
                Trang chủ
              </Link>
              <Link
                to="/user/profile"
                className="hover:text-blue-200 transition-colors"
              >
                Hồ sơ
              </Link>
              <Link
                to="/user/settings"
                className="hover:text-blue-200 transition-colors"
              >
                Cài đặt
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Wanderoo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;