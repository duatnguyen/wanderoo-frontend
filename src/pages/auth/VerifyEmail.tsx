import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/apiClient";
import type { ApiResponse } from "../../types";
import { Button } from "@/components/ui/button";

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Token không hợp lệ");
            return;
        }

        // Gọi API xác thực - sử dụng params object để axios tự động encode token
        api.get<ApiResponse<null>>(`/auth/v1/public/users/verify-email`, {
            params: {
                token: token
            }
        })
            .then((response) => {
                if (response.data.status === 200) {
                    // Hiển thị thông báo thành công trước
                    setStatus("success");
                    setMessage(response.data.message || "Xác thực thành công!");

                    // Sau 1.5 giây, chuyển đến trang đăng nhập
                    setTimeout(() => {
                        navigate("/login", {
                            replace: true,
                            state: { message: response.data.message || "Tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập." }
                        });
                    }, 1500);
                } else {
                    setStatus("error");
                    setMessage(response.data.message || "Xác thực thất bại");
                }
            })
            .catch((error) => {
                setStatus("error");
                const errorMessage = error?.response?.data?.message || "Token không hợp lệ hoặc đã hết hạn";
                setMessage(errorMessage);
            });
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                {status === "loading" && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Đang xác thực...</h2>
                        <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mb-4">
                            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Xác thực thành công!</h2>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <p className="text-sm text-gray-500">Đang chuyển đến trang đăng nhập...</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mb-4">
                            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Xác thực thất bại</h2>
                        <p className="text-gray-600 mb-4">{message}</p>
                        <Button
                            onClick={() => navigate("/login")}
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Đi đến trang đăng nhập
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;

