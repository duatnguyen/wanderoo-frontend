import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../utils/jwt";
import type { LoginCredentials } from "../../types/auth";
import bannerSrc from "../../assets/images/banner/login-banner.png";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Sử dụng AuthProvider để login và lưu token
      await login(credentials);

      // Thông báo thành công
      setSuccess("Đăng nhập thành công! Đang chuyển hướng...");

      // Decode token để kiểm tra role
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const userFromToken = getUserFromToken(token);
          console.log("User role from token:", userFromToken?.role);

          // Delay navigation và chuyển hướng theo role
          setTimeout(() => {
            if (userFromToken?.role === "ADMIN") {
              console.log("Navigating to /admin");
              navigate("/admin");
            } else {
              console.log("Navigating to /shop");
              navigate("/shop");
            }
          }, 1500);
        } catch (tokenError) {
          console.error("Error decoding token:", tokenError);
          navigate("/shop"); // Fallback
        }
      } else {
        navigate("/shop"); // Fallback
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("Email hoặc mật khẩu không đúng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-gray-800">
      <aside className="relative flex-none lg:flex-1 lg:max-w-[37.5rem] min-h-[18rem] lg:min-h-[22rem] max-w-full overflow-hidden text-white">
        <img
          src={bannerSrc}
          alt="Wanderoo banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/45 via-slate-900/20 to-slate-900/70"></div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[460px] flex flex-col gap-8">
          <header className="flex flex-col gap-6">
            <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800 text-center">
              Đăng nhập
            </h1>
          </header>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-xl border border-green-200 bg-green-50 text-green-700 p-3 text-sm">
                {success}
              </div>
            ) : null}

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <label htmlFor="username" className="font-semibold text-gray-800">
                Số Điện Thoại
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                placeholder="Nhập số điện thoại của bạn"
              />
            </div>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <label htmlFor="password" className="font-semibold text-gray-800">
                Mật Khẩu
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                  placeholder="Nhập mật khẩu của bạn"
                />
                <button
                  type="button"
                  className="absolute right-4 text-gray-400 hover:text-gray-800 transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                  }
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
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
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                Ghi nhớ tôi?
              </label>
              <button
                type="button"
                className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-xl border-none bg-orange-500 text-white font-semibold tracking-wider uppercase hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="ml-1 font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
