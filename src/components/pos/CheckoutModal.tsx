import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PaymentMethod = "cash" | "transfer";

export type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  finalAmount: number;
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
  onComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [change, setChange] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setPaymentMethod("cash");
      setAmountPaid("");
      setChange(0);
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
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
  };

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    if (value === "") {
      setAmountPaid("");
      return;
    }
    const numValue = parseInt(value, 10);
    setAmountPaid(numValue.toString());
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
    } else {
      // For bank transfer, amount paid equals final amount
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
            <div className="flex gap-4">
              {/* Cash Payment */}
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("cash");
                  setAmountPaid("");
                  setChange(0);
                }}
                className={cn(
                  "flex-1 flex flex-col items-center gap-3 p-4 border-2 rounded-lg transition-all",
                  paymentMethod === "cash"
                    ? "border-[#e04d30] bg-[#e04d30]/5"
                    : "border-[#e7e7e7] bg-white hover:border-[#e04d30]/50"
                )}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    {/* Banknotes icon */}
                    <svg
                      className="w-6 h-6 text-green-600"
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
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-[#272424]">
                  Tiền mặt
                </span>
              </button>

              {/* Bank Transfer */}
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("transfer");
                  setAmountPaid("");
                  setChange(0);
                }}
                className={cn(
                  "flex-1 flex flex-col items-center gap-3 p-4 border-2 rounded-lg transition-all",
                  paymentMethod === "transfer"
                    ? "border-[#e04d30] bg-[#e04d30]/5"
                    : "border-[#e7e7e7] bg-white hover:border-[#e04d30]/50"
                )}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    {/* Smartphone with document/checkmark icon */}
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4"
                      />
                    </svg>
                  </div>
                  {paymentMethod === "transfer" && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-[#272424]">
                  Chuyển khoản
                </span>
              </button>
            </div>
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
                    amountPaid ? formatCurrency(parseFloat(amountPaid)) : ""
                  }
                  onChange={handleAmountPaidChange}
                  placeholder="0₫"
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
