import React, { useEffect, useState } from "react";
import type { VoucherHistoryResponse } from "../../../types";
import { Button } from "@/components/ui/button";

interface VoucherSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (voucherCode: string | null) => void;
  selectedVoucherCode: string | null;
  vouchers?: VoucherHistoryResponse[];
  loading?: boolean;
}

const VoucherSelectionModal: React.FC<VoucherSelectionModalProps> = ({
  isOpen,
  onClose,
  onApply,
  selectedVoucherCode,
  vouchers = [], // Default to empty array
  loading = false,
}) => {
  const [activeVoucherCode, setActiveVoucherCode] = useState<string | null>(
    selectedVoucherCode
  );
  const [manualVoucherCode, setManualVoucherCode] = useState<string>("");
  const [showAllVouchers, setShowAllVouchers] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setActiveVoucherCode(selectedVoucherCode);
      setManualVoucherCode("");
      setShowAllVouchers(false);
    }
  }, [isOpen, selectedVoucherCode]);

  if (!isOpen) return null;

  const handleApply = () => {
    // Ưu tiên mã voucher thủ công nếu có, nếu không thì dùng voucher đã chọn
    const voucherToApply = manualVoucherCode.trim() || activeVoucherCode;
    onApply(voucherToApply);
    onClose();
  };

  const handleVoucherSelect = (voucherCode: string) => {
    setActiveVoucherCode(voucherCode);
    setManualVoucherCode(""); // Clear manual input when selecting from list
  };

  const handleManualVoucherChange = (code: string) => {
    setManualVoucherCode(code);
    setActiveVoucherCode(null); // Clear selection when typing manually
  };

  const formatExpiry = (expirationDate?: string | null) => {
    if (!expirationDate) return "Không hạn chế";
    try {
      const date = new Date(expirationDate);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return "Không xác định";
    }
  };

  const formatMinOrder = (minOrderValue?: number | null) => {
    if (!minOrderValue) return "Không giới hạn";
    return `₫${(minOrderValue / 1000).toFixed(0)}k`;
  };

  // Ensure vouchers is an array before calling slice
  const safeVouchers = Array.isArray(vouchers) ? vouchers : [];
  const displayedVouchers = showAllVouchers ? safeVouchers : safeVouchers.slice(0, 3);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden text-[13px]">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-gray-900">
            Chọn mã giảm giá
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors h-auto w-auto p-1"
            aria-label="Đóng"
          >
            ✕
          </Button>
        </div>

        <div className="px-5 py-4">
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <span className="text-gray-700 font-medium whitespace-nowrap">
                Mã Voucher
              </span>
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Nhập mã voucher"
                  value={manualVoucherCode}
                  onChange={(e) => handleManualVoucherChange(e.target.value)}
                  className="flex-1 h-10 bg-white border border-gray-200 rounded-xl px-3 text-gray-900 focus:outline-none focus:border-[#E04D30] focus:ring-1 focus:ring-[#E04D30]"
                />
                <Button 
                  onClick={() => setManualVoucherCode("")}
                  disabled={!manualVoucherCode.trim()}
                  className={`h-10 px-5 rounded-xl border font-medium transition-colors h-auto ${
                    manualVoucherCode.trim() 
                      ? 'border-[#E04D30] text-[#E04D30] hover:bg-[#E04D30] hover:text-white' 
                      : 'border-gray-200 text-gray-500 cursor-not-allowed bg-[#F5F6FA]'
                  }`}
                  variant="outline"
                >
                  {manualVoucherCode.trim() ? "Xóa" : "Lưu"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[360px] overflow-y-auto px-5 pb-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Đang tải voucher...</div>
            </div>
          ) : safeVouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">🎫</div>
                <div>Bạn chưa có voucher nào</div>
                <div className="text-sm mt-1">Hãy tìm kiếm và thu thập voucher để tiết kiệm chi phí!</div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-3">
                <div>
                  <h4 className="text-[15px] font-semibold text-gray-900">
                    Voucher của bạn
                  </h4>
                  <p className="text-gray-500">
                    {safeVouchers.length} voucher có thể sử dụng
                  </p>
                </div>
                <div className="space-y-3">
                  {displayedVouchers.map((voucher) => {
                    const isSelected = activeVoucherCode === voucher.discountCode;
                    return (
                      <label
                        key={voucher.id}
                        className={`flex items-stretch rounded-2xl border ${
                          isSelected
                            ? "border-[#E04D30] shadow-[0_8px_20px_rgba(224,77,48,0.12)]"
                            : "border-gray-200 hover:border-[#E04D30]/60"
                        } bg-white transition-colors cursor-pointer`}
                      >
                        <div
                          className={`flex-1 px-4 py-3 text-[13px] ${
                            isSelected ? "text-[#E04D30]" : "text-gray-900"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-semibold uppercase tracking-wide ${
                                isSelected ? "text-[#E04D30]" : "text-[#1B5CF0]"
                              }`}
                            >
                              {voucher.discountCode}
                            </span>
                            <span
                              className={`${
                                isSelected ? "text-[#E04D30]" : "text-gray-500"
                              }`}
                            >
                              HSD: {formatExpiry(voucher.expirationDate)}
                            </span>
                          </div>
                          <div className="mt-3 space-y-1">
                            <p
                              className={`font-semibold leading-snug ${
                                isSelected ? "text-[#E04D30]" : "text-gray-900"
                              }`}
                            >
                              {voucher.discountName || voucher.discountText}
                            </p>
                            <p
                              className={`${
                                isSelected ? "text-[#E04D30]" : "text-gray-600"
                              }`}
                            >
                              Đơn tối thiểu {formatMinOrder(voucher.minOrderValue)}
                            </p>
                            {voucher.discountText && (
                              <p
                                className={`${
                                  isSelected ? "text-[#E04D30]" : "text-gray-500"
                                }`}
                              >
                                {voucher.discountText}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-center px-4 border-l border-gray-100">
                          <input
                            type="radio"
                            name="voucher"
                            className="h-5 w-5 text-[#E04D30] focus:ring-[#E04D30]"
                            checked={isSelected}
                            onChange={() => handleVoucherSelect(voucher.discountCode)}
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
                {safeVouchers.length > 3 && (
                  <div className="flex justify-center pt-1">
                    <Button
                      variant="ghost"
                      onClick={() => setShowAllVouchers(!showAllVouchers)}
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors h-auto bg-transparent hover:bg-transparent"
                    >
                      <span>
                        {showAllVouchers ? "Thu gọn" : `Xem thêm ${safeVouchers.length - 3} voucher`}
                      </span>
                      <span
                        className={`inline-block transition-transform ${
                          showAllVouchers ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
          {/* Option to not use any voucher */}
          <div className="mb-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="voucher"
                className="h-4 w-4 text-[#E04D30] focus:ring-[#E04D30]"
                checked={!activeVoucherCode && !manualVoucherCode}
                onChange={() => {
                  setActiveVoucherCode(null);
                  setManualVoucherCode("");
                }}
              />
              <span className="text-gray-700 font-medium">
                Không sử dụng voucher
              </span>
            </label>
          </div>
          
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              {manualVoucherCode ? (
                <span>Sử dụng mã: <strong>{manualVoucherCode}</strong></span>
              ) : activeVoucherCode ? (
                <span>Đã chọn: <strong>{activeVoucherCode}</strong></span>
              ) : (
                <span>Chưa chọn voucher</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:border-gray-400 hover:text-gray-900 transition-colors h-auto bg-transparent hover:bg-transparent"
              >
                Hủy
              </Button>
              <Button
                onClick={handleApply}
                className="px-5 py-2 rounded-lg bg-[#E04D30] text-white font-semibold hover:bg-[#c53b1d] transition-colors h-auto border-none"
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherSelectionModal;
