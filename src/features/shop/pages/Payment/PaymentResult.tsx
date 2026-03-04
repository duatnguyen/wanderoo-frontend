import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status");
  const message = searchParams.get("message") || "";
  const orderCode = searchParams.get("orderCode");
  const orderId = searchParams.get("orderId");

  // Redirect immediately to order detail page with payment result params
  useEffect(() => {
    const redirectPath = orderCode 
      ? `/user/profile/orders/${orderCode}`
      : orderId
      ? `/user/profile/orders/${orderId}`
      : "/user/profile/orders";

    // Add payment result params to redirect
    const params = new URLSearchParams();
    params.set("paymentStatus", status || "");
    if (message) {
      params.set("paymentMessage", message);
    }
    if (orderCode) {
      params.set("paymentOrderCode", orderCode);
    }

    const fullPath = `${redirectPath}?${params.toString()}`;
    navigate(fullPath, { replace: true });
  }, [navigate, status, message, orderCode, orderId]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e04d30] mx-auto mb-4"></div>
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
};

export default PaymentResult;

