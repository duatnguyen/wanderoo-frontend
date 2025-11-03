import React, { useState } from "react";
import Button from "../../../../components/shop/Button";
import { Input } from "../../../../components/shop/Input";
import VoucherHistoryModal from "../../../../components/shop/VoucherHistoryModal";

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
  status: "available" | "pending" | "expired";
  validAfter?: string; // "9 giờ" format
  expiryDate?: string; // "21/12/2025" format
}

const VouchersTab: React.FC = () => {
  const [voucherCode, setVoucherCode] = useState("");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Mock voucher data
  const vouchers: Voucher[] = [
    {
      id: "1",
      code: "WDR16%",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      status: "pending",
      validAfter: "9 giờ",
    },
    {
      id: "2",
      code: "WDR10K",
      discountType: "fixed",
      discountValue: 10000,
      minOrder: 300000,
      status: "available",
      expiryDate: "21/12/2025",
    },
    {
      id: "3",
      code: "WDR16%",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      status: "pending",
      validAfter: "9 giờ",
    },
    {
      id: "4",
      code: "WDR16%",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      status: "pending",
      validAfter: "9 giờ",
    },
  ];

  const handleSaveVoucher = () => {
    if (!voucherCode.trim()) {
      alert("Vui lòng nhập mã voucher");
      return;
    }
    console.log("Adding voucher:", voucherCode);
    // Here you would make an API call to add the voucher
    setVoucherCode("");
  };

  const handleUseVoucher = (voucherId: string, action: "use" | "save") => {
    console.log(`${action === "use" ? "Using" : "Saving"} voucher:`, voucherId);
    // Here you would handle voucher usage
  };

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

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Kho voucher
          </h1>
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="text-red-600 hover:text-red-700 font-medium text-sm sm:text-base transition-colors self-start sm:self-auto"
          >
            Xem lịch sử voucher
          </button>
        </div>

        {/* Voucher Input Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 flex items-center gap-3">
              <label className="text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap">
                Mã voucher:
              </label>
              <Input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Nhập mã voucher tại đây"
                fullWidth
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSaveVoucher();
                  }
                }}
              />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveVoucher}
              className="w-full sm:w-auto px-6 sm:px-8 whitespace-nowrap"
            >
              Lưu
            </Button>
          </div>
        </div>

        {/* All Vouchers Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Tất cả
            </h2>
            <div className="h-px bg-gray-300"></div>
          </div>

          {/* Voucher Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
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
                      Đơn Tối Thiếu {formatCurrencyVND(voucher.minOrder)}
                    </div>

                    {/* Validity/Expiration */}
                    <div className="text-xs sm:text-sm text-gray-500">
                      {voucher.validAfter
                        ? `Hiệu lực sau: ${voucher.validAfter}`
                        : voucher.expiryDate
                          ? `HSD: ${voucher.expiryDate}`
                          : ""}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {voucher.status === "available" ? (
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => handleUseVoucher(voucher.id, "use")}
                        className="border-green-500 text-green-600 hover:bg-green-50 whitespace-nowrap"
                      >
                        Dùng ngay
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => handleUseVoucher(voucher.id, "save")}
                        className="border-red-500 text-red-600 hover:bg-red-50 whitespace-nowrap"
                      >
                        Dùng sau
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Voucher History Modal */}
      <VoucherHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </div>
  );
};

export default VouchersTab;
