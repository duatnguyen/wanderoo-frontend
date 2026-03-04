import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";
import { createVNPayPayment } from "@/api/endpoints/paymentApi";

export type PaymentMethod = "cash" | "vnpay";

export type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  finalAmount: number;
  draftOrderId?: number | null;
  onComplete: (data: {
    paymentMethod: PaymentMethod;
    amountPaid: number;
    change: number;
  }) => void;
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  finalAmount,
  draftOrderId,
  onComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [change, setChange] = useState(0);
  const [vnpayUrl, setVnpayUrl] = useState<string | null>(null);
  const [isLoadingVNPay, setIsLoadingVNPay] = useState(false);
  const [vnpayError, setVnpayError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setPaymentMethod("cash");
      setAmountPaid("");
      setChange(0);
      setVnpayUrl(null);
      setIsLoadingVNPay(false);
      setVnpayError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    // Calculate change when amount paid changes
    if (paymentMethod === "cash" && amountPaid) {
      const paid = parseFloat(amountPaid.replace(/[^\d]/g, "")) || 0;
      const calculatedChange = Math.max(0, paid - finalAmount);
      setChange(calculatedChange);
    } else {
      setChange(0);
    }
  }, [amountPaid, finalAmount, paymentMethod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // If input is empty or just contains currency symbols, set to empty
    if (!inputValue || inputValue === "đ" || inputValue === "0đ" || inputValue.trim() === "") {
      setAmountPaid("");
      return;
    }
    
    // Remove all non-digit characters (including dots, commas, and đ)
    const numericValue = inputValue.replace(/[^\d]/g, "");
    
    // If after removing non-digits we have nothing, clear the field
    if (!numericValue || numericValue === "0") {
      setAmountPaid("");
      return;
    }
    
    // Set the numeric value
    setAmountPaid(numericValue);
  };

  // Xử lý tạo VNPay payment URL
  const handleVNPayPayment = async () => {
    if (!draftOrderId) {
      setVnpayError("Không tìm thấy thông tin đơn hàng");
      return;
    }

    setIsLoadingVNPay(true);
    setVnpayError(null);
    
    try {
      const response = await createVNPayPayment(draftOrderId);
      
      // Validate response
      if (!response) {
        throw new Error("Không nhận được phản hồi từ VNPay");
      }
      
      if (response.status !== 200 && response.status !== 0) {
        throw new Error(response.message || "Lỗi tạo thanh toán VNPay");
      }
      
      if (!response.url || !isValidUrl(response.url)) {
        throw new Error("URL thanh toán không hợp lệ");
      }
      
      setVnpayUrl(response.url);
      console.log("VNPay Response:", response);
      console.log("VNPay URL created successfully:", response.url);
      console.log("URL validation result:", isValidUrl(response.url));
      
    } catch (error: any) {
      console.error("Lỗi tạo VNPay payment:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Không thể tạo thanh toán VNPay";
      setVnpayError(errorMessage);
      setVnpayUrl(null);
    } finally {
      setIsLoadingVNPay(false);
    }
  };

  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Xử lý chuyển đổi payment method
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setAmountPaid("");
    setChange(0);
    setVnpayUrl(null);
    setVnpayError(null);
    
    // Nếu chọn VNPay, tự động tạo payment URL
    if (method === "vnpay") {
      handleVNPayPayment();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "cash") {
      const paid = parseFloat(amountPaid.replace(/[^\d]/g, "")) || 0;
      if (paid < finalAmount) {
        return; // Don't submit if paid amount is less than final amount
      }
      onComplete({
        paymentMethod,
        amountPaid: paid,
        change,
      });
    } else if (paymentMethod === "vnpay") {
      // Với VNPay: xử lý hoàn tất hóa đơn tương tự tiền mặt,
      // không redirect sang sandbox, amountPaid = finalAmount
      onComplete({
        paymentMethod,
        amountPaid: finalAmount,
        change: 0,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative z-50 bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl animate-scaleIn overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-bold text-[#272424] font-montserrat">
              Thanh toán
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#737373]" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200"></div>

        {/* Form Content */}
        <div className="px-6 pt-6 pb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Payment Method Selection */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Cash Payment */}
              <button
                type="button"
                onClick={() => handlePaymentMethodChange("cash")}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all",
                  paymentMethod === "cash"
                    ? "border-[#e04d30] bg-[#e04d30]/5"
                    : "border-[#e7e7e7] bg-white hover:border-[#e04d30]/50"
                )}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  {paymentMethod === "cash" && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-[#272424]">Tiền mặt</span>
              </button>

              {/* VNPay */}
              <button
                type="button"
                onClick={() => handlePaymentMethodChange("vnpay")}
                disabled={isLoadingVNPay}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all",
                  paymentMethod === "vnpay"
                    ? "border-[#e04d30] bg-[#e04d30]/5"
                    : "border-[#e7e7e7] bg-white hover:border-[#e04d30]/50",
                  isLoadingVNPay && "opacity-50"
                )}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    {isLoadingVNPay ? (
                      <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 9l3 3 3-3"
                        />
                      </svg>
                    )}
                  </div>
                  {paymentMethod === "vnpay" && !isLoadingVNPay && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-[#272424]">
                  {isLoadingVNPay ? "Tạo QR..." : "VNPay"}
                </span>
              </button>
            </div>

            {/* VNPay QR Code Display */}
            {paymentMethod === "vnpay" && (
              <div className="mt-4 p-4 border border-[#e7e7e7] rounded-lg bg-gray-50">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-[#272424] mb-3">
                    Thanh toán VNPay
                  </h4>
                  
                  {isLoadingVNPay && (
                    <div className="flex flex-col items-center py-4">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                      <p className="text-sm text-gray-600">Đang tạo mã QR...</p>
                    </div>
                  )}
                  
                  {vnpayError && (
                    <div className="py-4">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
                        <p className="text-sm text-red-600">{vnpayError}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleVNPayPayment}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Thử lại
                      </button>
                    </div>
                  )}
                  
                  {vnpayUrl && !isLoadingVNPay && !vnpayError && (
                    <>
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-white rounded-lg border shadow-sm">
                          <QRCode
                            size={150}
                            value={vnpayUrl}
                            level="M"
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        Số tiền: {formatCurrency(finalAmount)}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Quét mã QR bằng ứng dụng ngân hàng của bạn
                      </p>
                      <button
                        type="button"
                        onClick={() => window.open(vnpayUrl, '_blank')}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        Hoặc nhấn để mở trình duyệt
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>


          {/* Transaction Details */}
          <div className="flex flex-col gap-4 pt-4 border-t border-[#e7e7e7]">
            {/* Customer owes */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#272424]">
                Khách phải trả
              </span>
              <span className="text-sm font-bold text-[#272424]">
                {formatCurrency(finalAmount)}
              </span>
            </div>

            {/* Amount paid (only show for cash) */}
            {paymentMethod === "cash" && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#272424]">
                  Tiền khách đưa
                </span>
                <input
                  type="text"
                  value={
                    amountPaid
                      ? formatCurrency(parseFloat(amountPaid))
                      : ""
                  }
                  onChange={handleAmountPaidChange}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      const currentValue = e.currentTarget.value;
                      // If current display has only currency format left, clear everything
                      if (!currentValue || currentValue === "0đ" || currentValue === "đ") {
                        e.preventDefault();
                        setAmountPaid("");
                      }
                    }
                  }}
                  placeholder="0đ"
                  className="text-sm font-bold text-[#272424] text-right border-b-2 border-[#272424] outline-none bg-transparent w-32"
                  required={paymentMethod === "cash"}
                />
              </div>
            )}

            {/* Change */}
            {paymentMethod === "cash" && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#272424]">
                  Tiền thừa trả khách
                </span>
                <span className="text-sm font-bold text-[#272424]">
                  {formatCurrency(change)}
                </span>
              </div>
            )}
          </div>

          {/* Complete Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={
                paymentMethod === "cash" &&
                (parseFloat(amountPaid.replace(/[^\d]/g, "")) || 0) <
                  finalAmount
              }
              className="w-full px-8 py-2.5"
            >
              <span className="text-sm font-bold">Hoàn tất</span>
            </Button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
