import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserHome from './pages/user/UserHome';
import Profile from './pages/user/Profile';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<div>Quản lý Users - Coming soon</div>} />
              <Route path="settings" element={<div>Cài đặt Admin - Coming soon</div>} />
            </Route>
            
            {/* User Routes */}
            <Route 
              path="/user" 
              element={
                <ProtectedRoute requiredRole="user">
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="home" element={<UserHome />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<div>Cài đặt User - Coming soon</div>} />
            </Route>
            
            {/* Default Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
