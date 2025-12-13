import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/endpoints/authApi";
import type { ResetPasswordRequest } from "../../types/auth";
import bannerSrc from "../../assets/images/banner/banner_auth.png";
import logo from "../../assets/icons/ShopLogo.png";
import { MapPin } from "lucide-react";

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setError("Token không hợp lệ");
        }
    }, [searchParams]);

    const isPasswordStrongEnough = (password: string) =>
        password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const token = searchParams.get("token");
        if (!token) {
            setError("Token không hợp lệ");
            return;
        }

        if (!password || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        if (!isPasswordStrongEnough(password)) {
            setError(
                "Mật khẩu phải có tối thiểu 6 ký tự, chứa ít nhất 1 chữ cái và 1 số"
            );
            return;
        }

        setIsLoading(true);

        try {
            const payload: ResetPasswordRequest = {
                token: token,
                password: password,
                confirmPassword: confirmPassword,
            };

            await resetPassword(payload);
            setSuccess("Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...");

            // Chuyển đến trang đăng nhập sau 2 giây
            setTimeout(() => {
                navigate("/login", {
                    state: { message: "Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới." }
                });
            }, 2000);
        } catch (err: any) {
            console.error("Reset password failed", err);

            let errorMessage = "Đặt lại mật khẩu thất bại. Vui lòng thử lại.";
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
                <div className="relative z-10 flex h-full flex-col px-6 py-6">
                    <div className="flex-1 space-y-4 self-end">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
                            <MapPin size={14} className="text-white" />
                            <span>521 Đ. Hoàng Văn Thụ, Phường 4, Q. Tân Bình, HCM</span>
                        </div>
                        <div className="max-w-xs rounded-full bg-white/20 px-5 py-3 text-sm font-medium text-slate-700 shadow-lg backdrop-blur-sm">
                            Nhập hội khách hàng thành viên Wanderoo để không bỏ lỡ các ưu đãi hấp dẫn
                        </div>
                    </div>
                    <div className="space-y-0 text-center">
                        <img
                            src={logo}
                            alt="Wanderoo Logo"
                            className="w-100 h-100 object-contain mx-auto"
                        />
                        <button
                            type="button"
                            onClick={() => navigate("/shop")}
                            className="mx-auto inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-2 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-white/15"
                        >
                            Mua sắm ngay
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
                <div className="w-full max-w-[460px] flex flex-col gap-8">
                    <header className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Quay lại đăng nhập
                            </button>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-semibold text-gray-800 text-center">
                            Đặt lại mật khẩu
                        </h1>
                        <p className="text-sm text-gray-600 text-center">
                            Nhập mật khẩu mới của bạn
                        </p>
                    </header>

                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
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
                            <label htmlFor="password" className="font-semibold text-gray-800">
                                Mật khẩu mới
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                                    placeholder="Nhập mật khẩu mới"
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 text-gray-400 hover:text-gray-800 transition-colors"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
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
                            <p className="text-xs text-gray-500 mt-1">
                                Mật khẩu phải có tối thiểu 6 ký tự, chứa ít nhất 1 chữ cái và 1 số
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <label htmlFor="confirmPassword" className="font-semibold text-gray-800">
                                Xác nhận mật khẩu mới
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 text-gray-400 hover:text-gray-800 transition-colors"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="h-12 w-full rounded-xl border-none bg-orange-500 text-white font-semibold tracking-wider uppercase hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Nhớ mật khẩu?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                        >
                            Đăng nhập ngay
                        </button>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;

