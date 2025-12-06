import React, { useEffect, useState } from "react";
import EnhancedVoucherSelectionModal from "./EnhancedVoucherSelectionModal";
import type { VoucherHistoryResponse } from "../../../types";
import { getPublicDiscounts, getMyVouchers } from "../../../api/endpoints/discountApi";
import { useAuth } from "../../../context/AuthContext";

// Legacy types for backward compatibility
type LegacyVoucher = {
    id: string;
    code: string;
    title: string;
    description: string;
    expiry: string;
    minimumOrder: string;
};

type LegacyVoucherSection = {
    id: string;
    title: string;
    subtitle: string;
    vouchers: LegacyVoucher[];
};

interface LegacyVoucherSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (voucherId: string | null) => void;
    selectedVoucherId: string | null;
    sections: LegacyVoucherSection[];
}

// Wrapper component to bridge legacy props with new VoucherSelectionModal
const LegacyVoucherSelectionModal: React.FC<LegacyVoucherSelectionModalProps> = ({
    isOpen,
    onClose,
    onApply,
    selectedVoucherId,
    sections, // Legacy sections - we'll ignore these and fetch real data
}) => {
    const { isAuthenticated } = useAuth();
    const [vouchers, setVouchers] = useState<VoucherHistoryResponse[]>([]);
    const [loading, setLoading] = useState(false);

    // Convert DiscountPublicResponse to VoucherHistoryResponse format (for public vouchers)
    const convertPublicToVoucherFormat = (discount: any): VoucherHistoryResponse => {
        return {
            id: discount.id,
            discountId: discount.id,
            discountCode: discount.code,
            discountName: discount.name,
            discountText: discount.description,
            expirationDate: discount.endDate,
            minOrderValue: discount.minOrderValue,
            maxOrderValue: discount.maxOrderValue,
            quantity: discount.quantity,
            status: 'AVAILABLE' as any,
            statusLabel: 'Có thể sử dụng',
            createdAt: null, // Public vouchers have no createdAt
            updatedAt: null
        };
    };

    // Convert DiscountPublicResponse to VoucherHistoryResponse format (for personal vouchers)
    const convertPersonalToVoucherFormat = (discount: any): VoucherHistoryResponse => {
        return {
            id: discount.id,
            discountId: discount.id,
            discountCode: discount.code,
            discountName: discount.name,
            discountText: discount.discountText || discount.description,
            expirationDate: discount.endDate,
            minOrderValue: discount.minOrderValue,
            maxOrderValue: discount.maxOrderValue,
            quantity: discount.quantity,
            status: discount.isAvailable ? 'AVAILABLE' : 'USED',
            statusLabel: discount.isAvailable ? 'Có thể sử dụng' : 'Đã sử dụng',
            createdAt: new Date().toISOString(), // Mark as personal voucher
            updatedAt: null
        };
    };

    // Load voucher data when modal opens
    useEffect(() => {
        if (isOpen) {
            const loadVouchers = async () => {
                try {
                    setLoading(true);

                    let allVouchers: VoucherHistoryResponse[] = [];

                    // Always load public vouchers first
                    console.log("Loading public vouchers...");
                    const publicDiscounts = await getPublicDiscounts();
                    console.log("Loaded public discounts:", publicDiscounts);
                    const publicVouchers = publicDiscounts.map(convertPublicToVoucherFormat);

                    // If authenticated, also try to get user's personal vouchers
                    if (isAuthenticated) {
                        try {
                            console.log("User authenticated, loading personal vouchers...");
                            const myDiscountVouchers = await getMyVouchers();
                            console.log("Loaded my discount vouchers:", myDiscountVouchers);

                            // Convert personal vouchers (from my-discounts API)
                            const personalVouchers = myDiscountVouchers.map(convertPersonalToVoucherFormat);

                            // Combine personal vouchers first, then public vouchers not already in personal list
                            const personalVoucherCodes = personalVouchers.map(v => v.discountCode);
                            const uniquePublicVouchers = publicVouchers.filter(v => !personalVoucherCodes.includes(v.discountCode));

                            allVouchers = [...personalVouchers, ...uniquePublicVouchers];
                            console.log("Combined vouchers:", allVouchers);
                        } catch (authError: any) {
                            console.log("Failed to load personal vouchers, using public only:", authError);
                            // Continue with public vouchers only
                            allVouchers = publicVouchers;
                        }
                    } else {
                        console.log("User not authenticated, showing public vouchers only");
                        allVouchers = publicVouchers;
                    }

                    setVouchers(allVouchers);
                } catch (error: any) {
                    console.error("Failed to load vouchers:", error);
                    setVouchers([]); // Fallback to empty array on error
                } finally {
                    setLoading(false);
                }
            };

            loadVouchers();
        }
    }, [isOpen, isAuthenticated]);

    // Convert legacy voucher ID to voucher code
    const selectedVoucherCode = selectedVoucherId ?
        // Try to extract code from legacy voucher ID format
        sections.flatMap(s => s.vouchers).find(v => v.id === selectedVoucherId)?.code || null
        : null;

    // Convert voucher code back to legacy voucher ID for onApply callback
    const handleApply = (voucherCode: string | null) => {
        if (!voucherCode) {
            onApply(null);
            return;
        }

        // Try to find matching legacy voucher ID
        const legacyVoucher = sections.flatMap(s => s.vouchers).find(v => v.code === voucherCode);
        if (legacyVoucher) {
            onApply(legacyVoucher.id);
        } else {
            // If no legacy match, create a temporary ID format
            onApply(`voucher-${voucherCode}`);
        }
    };

    return (
        <EnhancedVoucherSelectionModal
            isOpen={isOpen}
            onClose={onClose}
            onApply={handleApply}
            selectedVoucherCode={selectedVoucherCode}
            vouchers={vouchers}
            loading={loading}
            isAuthenticated={isAuthenticated}
        />
    );
};

export default LegacyVoucherSelectionModal;