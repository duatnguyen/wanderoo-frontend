import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthCtx } from '../app/providers/AuthProvider';
import AdminSidebar, { adminNavItems } from '../components/admin/AdminSidebar';

const AdminLayout: React.FC = () => {
  const { state, logout } = useAuthCtx();
  const { user } = state;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeNavItem = adminNavItems.find(item =>
    item.activeMatch ? location.pathname.startsWith(item.activeMatch) : item.defaultActive
  );

  const pageTitle = activeNavItem?.label ?? 'Bảng điều khiển';

  const getInitials = (name?: string | null) => {
    if (!name) return 'AD';
    const letters = name
      .split(' ')
      .map(part => part.trim()[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
    return letters || 'AD';
  };

  return (
    <div className="flex min-h-screen bg-[#EEF1F6] text-slate-900">
      <AdminSidebar activePath={location.pathname} />

      <div className="flex flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm">
          <div className="flex h-[72px] items-center justify-between px-8">
            <div className="flex flex-1 items-center gap-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{pageTitle}</h1>
                <p className="text-xs text-slate-500">Xin chào, {user?.name ?? 'Quản trị viên'} 👋</p>
              </div>
              <div className="relative hidden max-w-md flex-1 lg:block">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="6" />
                    <path d="m20 20-2.5-2.5" />
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="Tìm kiếm nhanh..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#FF6F3C] focus:bg-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{user?.name ?? 'Admin'}</p>
                <p className="text-xs text-slate-500">Quản trị viên</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                {getInitials(user?.name)}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-[#FF6F3C] transition hover:text-[#e55d2b]"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;