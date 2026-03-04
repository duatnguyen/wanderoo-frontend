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
    subtotal?: number; // Total order value to check voucher eligibility
}

// Wrapper component to bridge legacy props with new VoucherSelectionModal
const LegacyVoucherSelectionModal: React.FC<LegacyVoucherSelectionModalProps> = ({
    isOpen,
    onClose,
    onApply,
    selectedVoucherId,
    sections, // Legacy sections - we'll ignore these and fetch real data
    subtotal = 0, // Default to 0 if not provided
}) => {
    const { isAuthenticated } = useAuth();
    const [vouchers, setVouchers] = useState<VoucherHistoryResponse[]>([]);
    const [loading, setLoading] = useState(false);

    // Convert DiscountPublicResponse to VoucherHistoryResponse format (for public vouchers)
    const convertPublicToVoucherFormat = (discount: any): VoucherHistoryResponse => {
        // Use discountText from backend if available (contains formatted discount info)
        // Otherwise use description
        const discountText = discount.discountText || discount.description;
        
        return {
            id: discount.id,
            discountId: discount.id,
            discountCode: discount.code,
            discountName: discount.name,
            discountText: discountText,
            expirationDate: discount.endDate,
            minOrderValue: discount.minOrderValue,
            maxOrderValue: discount.maxOrderValue, // This is max discount amount for PERCENT type
            quantity: discount.quantity,
            status: 'AVAILABLE' as any,
            statusLabel: 'Có thể sử dụng',
            createdAt: null, // Public vouchers have no createdAt
            updatedAt: null,
            // Store additional info for display
            type: discount.type,
            value: discount.value,
        } as VoucherHistoryResponse & { type?: string; value?: number };
    };

    // Convert DiscountPublicResponse to VoucherHistoryResponse format (for personal vouchers)
    const convertPersonalToVoucherFormat = (discount: any): VoucherHistoryResponse => {
        // Use discountText from backend if available (contains formatted discount info)
        const discountText = discount.discountText || discount.description;
        
        return {
            id: discount.id,
            discountId: discount.id,
            discountCode: discount.code,
            discountName: discount.name,
            discountText: discountText,
            expirationDate: discount.endDate,
            minOrderValue: discount.minOrderValue,
            maxOrderValue: discount.maxOrderValue, // This is max discount amount for PERCENT type
            quantity: discount.quantity,
            status: discount.isAvailable ? 'AVAILABLE' : 'USED',
            statusLabel: discount.isAvailable ? 'Có thể sử dụng' : 'Đã sử dụng',
            createdAt: new Date().toISOString(), // Mark as personal voucher
            updatedAt: null,
            // Store additional info for display
            type: discount.type,
            value: discount.value,
        } as VoucherHistoryResponse & { type?: string; value?: number };
    };

    // Load voucher data when modal opens
    useEffect(() => {
        if (isOpen) {
            const loadVouchers = async () => {
                try {
                    setLoading(true);
                    let allVouchers: VoucherHistoryResponse[] = [];
                    
                    // Only get ORDER_DISCOUNT category vouchers for checkout
                    const publicDiscounts = await getPublicDiscounts({ category: 'ORDER_DISCOUNT' });
                    const publicVouchers = publicDiscounts.map(convertPublicToVoucherFormat);
                    
                    // If authenticated, also try to get user's personal vouchers
                    if (isAuthenticated) {
                        try {
                            const myDiscountVouchers = await getMyVouchers();

                            // Convert personal vouchers (from my-discounts API)
                            // Filter to only include ORDER_DISCOUNT category
                            const orderDiscountVouchers = myDiscountVouchers
                                .filter((discount: any) => discount.category === 'ORDER_DISCOUNT')
                                .map(convertPersonalToVoucherFormat);

                            // Combine personal vouchers first, then public vouchers not already in personal list
                            const personalVoucherCodes = orderDiscountVouchers.map(v => v.discountCode);
                            const uniquePublicVouchers = publicVouchers.filter(v => !personalVoucherCodes.includes(v.discountCode));

                            allVouchers = [...orderDiscountVouchers, ...uniquePublicVouchers];
                        } catch (authError: any) {
                            // Continue with public vouchers only
                            allVouchers = publicVouchers;
                        }
                    } else {
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

    // Convert legacy voucher ID to voucher code (prefill selection when reopening)
    const selectedVoucherCode = selectedVoucherId
        ? (() => {
            // If legacy format "voucher-CODE", strip prefix
            if (selectedVoucherId.startsWith("voucher-")) {
                return selectedVoucherId.replace("voucher-", "");
            }
            // Try find in provided sections
            const fromSection = sections
                .flatMap((s) => s.vouchers)
                .find((v) => v.id === selectedVoucherId)?.code;
            if (fromSection) return fromSection;
            // Fallback: treat selectedVoucherId itself as the code
            return selectedVoucherId;
        })()
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
            subtotal={subtotal}
        />
    );
};

export default LegacyVoucherSelectionModal;