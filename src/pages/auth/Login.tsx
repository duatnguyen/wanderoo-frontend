import React, { useState } from 'react';
import { useAuthCtx } from '../../app/providers/AuthProvider';
import { authLogin } from '../../services/auth.api';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginCredentials } from '../../types/auth';
import bannerSrc from '../../assets/images/banner/login-banner.png';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthCtx();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call API để login và lấy token
      const response = await authLogin(credentials);
      
      // Sử dụng AuthProvider để set token và update state
      await login(response.token);
      
      // Navigate based on user role
      if (response.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/home');
      }
    } catch (err) {
      console.error('Login failed', err);
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-gray-800">
      <aside className="relative flex-none lg:flex-1 lg:max-w-[37.5rem] min-h-[18rem] lg:min-h-[22rem] max-w-full overflow-hidden text-white">
        <img src={bannerSrc} alt="Wanderoo banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/45 via-slate-900/20 to-slate-900/70"></div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[460px] flex flex-col gap-8">
          <header className="flex flex-col gap-6">
            <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800 text-center">Đăng nhập</h1>
            <button type="button" className="flex items-center justify-center gap-3 h-12 w-full rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-800 hover:border-blue-200 hover:bg-slate-50 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 11v3.6h4.9c-.2 1.2-1.4 3.6-4.9 3.6-2.9 0-5.4-2.4-5.4-5.5s2.4-5.5 5.4-5.5c1.6 0 2.7.7 3.3 1.3l2.2-2.1C16.4 5 14.4 4 12 4 7.6 4 4 7.6 4 12s3.6 8 8 8c4.6 0 7.6-3.2 7.6-7.7 0-.5 0-.8-.1-1.3H12Z" />
                <path fill="#34A853" d="M5.8 9.5 8.7 11.6c.8-2.3 2.3-3.1 3.3-3.1.9 0 1.6.5 2 .9l2.2-2.2C15.4 5.9 13.8 5 12 5c-2.9 0-5.4 1.7-6.2 4.5Z" />
                <path fill="#4A90E2" d="M12 20c2.4 0 4.4-.8 5.8-2.2l-2.7-2.2c-.7.5-1.7.9-3.1.9-2.4 0-4.4-1.6-5-3.8l-2.9 2.2C5.6 18.6 8.6 20 12 20Z" />
                <path fill="#FBBC05" d="M18.7 11.3H12V14h3.8c-.4 1.9-2.1 3.2-3.8 3.2-2.4 0-4.4-1.8-4.4-4.2 0-2.3 1.9-4.2 4.4-4.2 1.3 0 2.1.5 2.6.9l2.5-2.4C15.7 6.2 14 5.4 12 5.4 8.7 5.4 6 8.1 6 11.5S8.7 17.6 12 17.6c3.6 0 6-2.5 6-6.1 0-.4 0-.7-.1-1.1Z" />
              </svg>
              Đăng nhập bằng Google
            </button>
            <div className="flex items-center gap-4 text-gray-400 text-xs uppercase tracking-wider">
              <div className="flex-1 h-px bg-gray-200"></div>
              Hoặc
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
          </header>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {error ? <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm">{error}</div> : null}

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <label htmlFor="email" className="font-semibold text-gray-800">Số Điện Thoại</label>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={credentials.email}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                placeholder="Nhập số điện thoại của bạn"
              />
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <label htmlFor="password" className="font-semibold text-gray-800">Mật Khẩu</label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                  placeholder="Nhập mật khẩu của bạn"
                />
                <button
                  type="button"
                  className="absolute right-4 text-gray-400 hover:text-gray-800 transition-colors"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    {showPassword ? (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                        <path d="M7.5 7.56C5.37 8.72 3.86 10.42 3 12c1.73 3.18 5.28 6 9 6 1.38 0 2.69-.28 3.9-.8" />
                        <path d="M14.12 9.88A3 3 0 0 0 9.88 14.12" />
                      </>
                    ) : (
                      <>
                        <path d="M1.5 12C3.23 8.82 6.78 6 10.5 6c3.72 0 7.27 2.82 9 6-1.73 3.18-5.28 6-9 6-3.72 0-7.27-2.82-9-6Z" />
                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={event => setRememberMe(event.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                Ghi nhớ tôi?
              </label>
              <button type="button" className="font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                Quên mật khẩu?
              </button>
            </div>

            <button type="submit" disabled={isLoading} className="h-12 w-full rounded-xl border-none bg-orange-500 text-white font-semibold tracking-wider uppercase hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Bạn chưa có tài khoản?
            {' '}
            <Link to="/register" className="ml-1 font-semibold text-orange-500 hover:text-orange-600 transition-colors">Đăng ký ngay</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;