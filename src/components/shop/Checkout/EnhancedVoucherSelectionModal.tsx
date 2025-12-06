import React, { useEffect, useState } from "react";
import type { VoucherHistoryResponse } from "../../../types";

interface EnhancedVoucherSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (voucherCode: string | null) => void;
    selectedVoucherCode: string | null;
    vouchers?: VoucherHistoryResponse[];
    loading?: boolean;
    isAuthenticated?: boolean;
}

const EnhancedVoucherSelectionModal: React.FC<EnhancedVoucherSelectionModalProps> = ({
    isOpen,
    onClose,
    onApply,
    selectedVoucherCode,
    vouchers = [],
    loading = false,
    isAuthenticated = false,
}) => {
    const [activeVoucherCode, setActiveVoucherCode] = useState<string | null>(
        selectedVoucherCode
    );
    const [manualVoucherCode, setManualVoucherCode] = useState<string>("");
    const [showAllPersonal, setShowAllPersonal] = useState<boolean>(false);
    const [showAllPublic, setShowAllPublic] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setActiveVoucherCode(selectedVoucherCode);
            setManualVoucherCode("");
            setShowAllPersonal(false);
            setShowAllPublic(false);
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

    // Separate vouchers into personal and public
    // Personal vouchers have createdAt (marked as such when converted)
    const personalVouchers = vouchers.filter(v => v.createdAt !== null);
    // Public vouchers have no createdAt
    const publicVouchers = vouchers.filter(v => v.createdAt === null);

    const displayedPersonalVouchers = showAllPersonal ? personalVouchers : personalVouchers.slice(0, 3);
    const displayedPublicVouchers = showAllPublic ? publicVouchers : publicVouchers.slice(0, 3);

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
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Đóng"
                    >
                        ✕
                    </button>
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
                                <button
                                    onClick={() => setManualVoucherCode("")}
                                    disabled={!manualVoucherCode.trim()}
                                    className={`h-10 px-5 rounded-xl border font-medium transition-colors ${manualVoucherCode.trim()
                                        ? 'border-[#E04D30] text-[#E04D30] hover:bg-[#E04D30] hover:text-white'
                                        : 'border-gray-200 text-gray-500 cursor-not-allowed bg-[#F5F6FA]'
                                        }`}
                                >
                                    {manualVoucherCode.trim() ? "Xóa" : "Lưu"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-[360px] overflow-y-auto px-5 pb-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-gray-500">Đang tải voucher...</div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Personal Vouchers Section - Only show if authenticated */}
                            {isAuthenticated && personalVouchers.length > 0 && (
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
                                            <span className="text-blue-500">👤</span>
                                            Voucher của bạn
                                        </h4>
                                        <p className="text-gray-500">
                                            {personalVouchers.length} voucher cá nhân
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {displayedPersonalVouchers.map((voucher) => {
                                            const isSelected = activeVoucherCode === voucher.discountCode;
                                            const isExpired = voucher.status === 'EXPIRED';
                                            const isUsed = voucher.status === 'USED';
                                            const canUse = voucher.status === 'AVAILABLE';

                                            return (
                                                <label
                                                    key={voucher.id}
                                                    className={`flex items-stretch rounded-2xl border ${isSelected
                                                        ? "border-[#E04D30] shadow-[0_8px_20px_rgba(224,77,48,0.12)]"
                                                        : "border-gray-200 hover:border-[#E04D30]/60"
                                                        } bg-white transition-colors ${canUse ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
                                                        }`}
                                                >
                                                    <div
                                                        className={`flex-1 px-4 py-3 text-[13px] ${isSelected ? "text-[#E04D30]" : "text-gray-900"
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span
                                                                className={`font-semibold uppercase tracking-wide ${isSelected ? "text-[#E04D30]" : "text-[#1B5CF0]"
                                                                    }`}
                                                            >
                                                                {voucher.discountCode}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                {isExpired && (
                                                                    <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                                                                        Hết hạn
                                                                    </span>
                                                                )}
                                                                {isUsed && (
                                                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                                                        Đã dùng
                                                                    </span>
                                                                )}
                                                                <span
                                                                    className={`text-xs ${isSelected ? "text-[#E04D30]" : "text-gray-500"
                                                                        }`}
                                                                >
                                                                    HSD: {formatExpiry(voucher.expirationDate)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 space-y-1">
                                                            <p
                                                                className={`font-semibold leading-snug ${isSelected ? "text-[#E04D30]" : "text-gray-900"
                                                                    }`}
                                                            >
                                                                {voucher.discountName}
                                                            </p>
                                                            <p
                                                                className={`${isSelected ? "text-[#E04D30]" : "text-gray-600"
                                                                    }`}
                                                            >
                                                                Đơn tối thiểu {formatMinOrder(voucher.minOrderValue)}
                                                            </p>
                                                            {voucher.discountText && (
                                                                <p
                                                                    className={`${isSelected ? "text-[#E04D30]" : "text-gray-500"
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
                                                            disabled={!canUse}
                                                            onChange={() => canUse && handleVoucherSelect(voucher.discountCode)}
                                                        />
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {personalVouchers.length > 3 && (
                                        <div className="flex justify-center pt-1">
                                            <button
                                                type="button"
                                                onClick={() => setShowAllPersonal(!showAllPersonal)}
                                                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                                            >
                                                <span>
                                                    {showAllPersonal ? "Thu gọn" : `Xem thêm ${personalVouchers.length - 3} voucher`}
                                                </span>
                                                <span
                                                    className={`inline-block transition-transform ${showAllPersonal ? "rotate-180" : ""
                                                        }`}
                                                >
                                                    ▼
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Public Vouchers Section */}
                            {publicVouchers.length > 0 && (
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
                                            <span className="text-green-500">🌐</span>
                                            Voucher công khai
                                        </h4>
                                        <p className="text-gray-500">
                                            {publicVouchers.length} voucher có thể claim
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        {displayedPublicVouchers.map((voucher) => {
                                            const isSelected = activeVoucherCode === voucher.discountCode;
                                            return (
                                                <label
                                                    key={voucher.id}
                                                    className={`flex items-stretch rounded-2xl border ${isSelected
                                                        ? "border-[#E04D30] shadow-[0_8px_20px_rgba(224,77,48,0.12)]"
                                                        : "border-gray-200 hover:border-[#E04D30]/60"
                                                        } bg-white transition-colors cursor-pointer`}
                                                >
                                                    <div
                                                        className={`flex-1 px-4 py-3 text-[13px] ${isSelected ? "text-[#E04D30]" : "text-gray-900"
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span
                                                                className={`font-semibold uppercase tracking-wide ${isSelected ? "text-[#E04D30]" : "text-[#1B5CF0]"
                                                                    }`}
                                                            >
                                                                {voucher.discountCode}
                                                            </span>
                                                            <span
                                                                className={`text-xs ${isSelected ? "text-[#E04D30]" : "text-gray-500"
                                                                    }`}
                                                            >
                                                                HSD: {formatExpiry(voucher.expirationDate)}
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 space-y-1">
                                                            <p
                                                                className={`font-semibold leading-snug ${isSelected ? "text-[#E04D30]" : "text-gray-900"
                                                                    }`}
                                                            >
                                                                {voucher.discountName}
                                                            </p>
                                                            <p
                                                                className={`${isSelected ? "text-[#E04D30]" : "text-gray-600"
                                                                    }`}
                                                            >
                                                                Đơn tối thiểu {formatMinOrder(voucher.minOrderValue)}
                                                            </p>
                                                            {voucher.discountText && (
                                                                <p
                                                                    className={`${isSelected ? "text-[#E04D30]" : "text-gray-500"
                                                                        }`}
                                                                >
                                                                    {voucher.discountText}
                                                                </p>
                                                            )}
                                                            {!isAuthenticated && (
                                                                <p className="text-xs text-orange-600">
                                                                    💡 Đăng nhập để claim voucher này
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
                                    {publicVouchers.length > 3 && (
                                        <div className="flex justify-center pt-1">
                                            <button
                                                type="button"
                                                onClick={() => setShowAllPublic(!showAllPublic)}
                                                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                                            >
                                                <span>
                                                    {showAllPublic ? "Thu gọn" : `Xem thêm ${publicVouchers.length - 3} voucher`}
                                                </span>
                                                <span
                                                    className={`inline-block transition-transform ${showAllPublic ? "rotate-180" : ""
                                                        }`}
                                                >
                                                    ▼
                                                </span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Empty state */}
                            {!loading && personalVouchers.length === 0 && publicVouchers.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">🎫</div>
                                        <div>Không có voucher nào</div>
                                        <div className="text-sm mt-1">
                                            {isAuthenticated
                                                ? "Bạn chưa có voucher nào. Hãy tìm kiếm và thu thập voucher để tiết kiệm chi phí!"
                                                : "Đăng nhập để xem voucher của bạn và claim voucher mới!"
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
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
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:border-gray-400 hover:text-gray-900 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleApply}
                                className="px-5 py-2 rounded-lg bg-[#E04D30] text-white font-semibold hover:bg-[#c53b1d] transition-colors"
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedVoucherSelectionModal;