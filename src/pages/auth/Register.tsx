import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthCtx } from "../../app/providers/AuthProvider";
import { authRegister } from "../../api/endpoints/authApi";
import type { UserCreationRequest } from "../../types/auth";
import bannerSrc from "../../assets/images/banner/login-banner.png";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthCtx();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isPasswordStrongEnough = (password: string) =>
    password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const trimmedName = formData.name.trim();
    const trimmedUsername = formData.username.trim();
    const trimmedPhone = formData.phone.trim();

    if (!trimmedName || !trimmedUsername || !trimmedPhone) {
      setError("Vui lòng nhập đầy đủ thông tin cá nhân");
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!isPasswordStrongEnough(formData.password)) {
      setError(
        "Mật khẩu phải có tối thiểu 6 ký tự, chứa ít nhất 1 chữ cái và 1 số"
      );
      return;
    }

    setIsLoading(true);

    try {
      const payload: UserCreationRequest = {
        username: trimmedUsername,
        name: trimmedName,
        phone: trimmedPhone,
        password: formData.password,
        email: `${trimmedPhone}@wanderoo.vn`,
      };

      console.log("Sending registration payload:", payload);

      // Call API để register và lấy token
      const response = await authRegister(payload);

      // Sử dụng AuthProvider để set token và update state
      await login(response.accessToken);

      // Navigate to user dashboard (new users are USER role by default)
      navigate("/user/home");
    } catch (err: any) {
      console.error("Register failed", err);

      // Get more specific error message from API response
      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
              Đăng ký
            </h1>
          </header>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
                {error}
              </div>
            ) : null}

            <section className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <label htmlFor="name" className="font-semibold text-gray-800">
                  Họ và tên
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <label htmlFor="username" className="font-semibold text-gray-800">
                  Tên đăng nhập
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <label htmlFor="phone" className="font-semibold text-gray-800">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>
            </section>

            <section className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <label
                  htmlFor="password"
                  className="font-semibold text-gray-800"
                >
                  Mật khẩu
                </label>
                <div className="relative flex items-center">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
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

              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <label
                  htmlFor="confirmPassword"
                  className="font-semibold text-gray-800"
                >
                  Nhập lại mật khẩu
                </label>
                <div className="relative flex items-center">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                    placeholder="Nhập lại mật khẩu của bạn"
                  />
                  <button
                    type="button"
                    className="absolute right-4 text-gray-400 hover:text-gray-800 transition-colors"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
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
                      {showConfirmPassword ? (
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
            </section>

            <button
              type="submit"
              className="h-12 w-full rounded-xl border-none bg-orange-500 text-white font-semibold tracking-wider uppercase hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Bạn đã có tài khoản?{" "}
            <Link
              to="/login"
              className="ml-1 font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
