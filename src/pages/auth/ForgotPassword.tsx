import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/endpoints/authApi";
import type { ForgotPasswordRequest } from "../../types/auth";
import bannerSrc from "../../assets/images/banner/banner_auth.png";
import logo from "../../assets/icons/ShopLogo.png";
import { MapPin } from "lucide-react";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setError("Vui lòng nhập email");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            setError("Email không hợp lệ");
            return;
        }

        setIsLoading(true);

        try {
            const payload: ForgotPasswordRequest = {
                email: trimmedEmail,
            };

            await forgotPassword(payload);
            setSuccess("Nếu email tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư.");

            // Chuyển đến trang đăng nhập sau 5 giây
            setTimeout(() => {
                navigate("/login");
            }, 5000);
        } catch (err: any) {
            console.error("Forgot password failed", err);

            let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
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
                            Quên mật khẩu
                        </h1>
                        <p className="text-sm text-gray-600 text-center">
                            Nhập email của bạn để nhận link đặt lại mật khẩu
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
                            <label htmlFor="email" className="font-semibold text-gray-800">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm text-gray-800 outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15"
                                placeholder="Nhập email của bạn"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="h-12 w-full rounded-xl border-none bg-orange-500 text-white font-semibold tracking-wider uppercase hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600">
                        Nhớ mật khẩu?{" "}
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

export default ForgotPassword;

