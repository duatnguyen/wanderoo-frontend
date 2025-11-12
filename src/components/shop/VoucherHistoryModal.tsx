import React, { useState } from "react";
import Button from "./Button";

function formatCurrencyVND(value: number) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("vi-VN")}đ`;
  }
}

interface Voucher {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number;
  minOrder: number;
  expiryDate: string;
  status: "expired" | "used";
}

interface VoucherHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoucherHistoryModal: React.FC<VoucherHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"expired" | "used">("expired");

  // Mock expired vouchers
  const expiredVouchers: Voucher[] = [
    {
      id: "1",
      code: "FKSUD",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      expiryDate: "10/09/2025",
      status: "expired",
    },
    {
      id: "2",
      code: "SUDWDR",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      expiryDate: "11/08/2025",
      status: "expired",
    },
    {
      id: "3",
      code: "NHSS16%",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      expiryDate: "20/07/2025",
      status: "expired",
    },
    {
      id: "4",
      code: "16KUDL",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      expiryDate: "12/09/2025",
      status: "expired",
    },
  ];

  // Mock used vouchers
  const usedVouchers: Voucher[] = [
    {
      id: "5",
      code: "USED1",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      expiryDate: "15/08/2025",
      status: "used",
    },
    {
      id: "6",
      code: "USED2",
      discountType: "fixed",
      discountValue: 10000,
      minOrder: 300000,
      expiryDate: "20/08/2025",
      status: "used",
    },
  ];

  const vouchers = activeTab === "expired" ? expiredVouchers : usedVouchers;

  const formatDiscountText = (voucher: Voucher): string => {
    if (voucher.discountType === "percentage") {
      const discountText = `Giảm ${voucher.discountValue}%`;
      const maxDiscountText = voucher.maxDiscount
        ? ` Giảm tối đa ${formatCurrencyVND(voucher.maxDiscount)}`
        : "";
      return discountText + maxDiscountText;
    } else {
      return `Giảm ${formatCurrencyVND(voucher.discountValue)}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-50 bg-gray-50 rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Lịch sử voucher
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab("expired")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "expired"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Hết Hiệu Lực
            </button>
            <button
              onClick={() => setActiveTab("used")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "used"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Đã sử dụng
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {vouchers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-gray-100 rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5 relative"
                >
                  {/* Status Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded">
                      {voucher.status === "expired"
                        ? "Hết lượt sử dụng"
                        : "Đã sử dụng"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-6">
                    <div className="flex-1 space-y-2">
                      {/* Voucher Code */}
                      <div>
                        <span className="text-base sm:text-lg font-semibold text-blue-600">
                          {voucher.code}
                        </span>
                      </div>

                      {/* Discount Details */}
                      <div className="text-sm sm:text-base text-gray-900 font-medium">
                        {formatDiscountText(voucher)}
                      </div>

                      {/* Minimum Order */}
                      <div className="text-sm sm:text-base text-gray-700">
                        Đơn Tối Thiểu {formatCurrencyVND(voucher.minOrder)}
                      </div>

                      {/* Expiration Date */}
                      <div className="text-xs sm:text-sm text-gray-500">
                        HSD: {voucher.expiryDate}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Không có voucher{" "}
                {activeTab === "expired" ? "hết hiệu lực" : "đã sử dụng"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherHistoryModal;
