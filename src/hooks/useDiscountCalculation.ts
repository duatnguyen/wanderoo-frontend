// src/hooks/useDiscountCalculation.ts - Hook for managing discount calculations in checkout
import { useState, useCallback, useMemo } from 'react';
import { calculateDiscount, getAvailableVouchersForCheckout } from '../api/endpoints/cartApi';
import type { 
  VoucherHistoryResponse, 
  CalculateDiscountRequest, 
  DiscountCalculationResponse,
  CartItemForDiscount,
  SelectedCartWithShippingResponse 
} from '../types';

interface UseDiscountCalculationProps {
  selectedCartData?: SelectedCartWithShippingResponse;
  shippingFee: number;
  onDiscountChange?: (discountData: DiscountCalculationResponse | null) => void;
}

export const useDiscountCalculation = ({
  selectedCartData,
  shippingFee,
  onDiscountChange
}: UseDiscountCalculationProps) => {
  const [availableVouchers, setAvailableVouchers] = useState<VoucherHistoryResponse[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [discountData, setDiscountData] = useState<DiscountCalculationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert selected cart items to discount request format
  const cartItemsForDiscount = useMemo((): CartItemForDiscount[] => {
    console.log("🎫 selectedCartData in hook:", selectedCartData);
    if (!selectedCartData?.cartItems) {
      console.log("🎫 No cartItems in selectedCartData");
      return [];
    }
    
    const converted = selectedCartData.cartItems.map(item => ({
      productDetailId: item.productDetailId,
      quantity: item.quantity,
      price: item.productPrice
    }));
    
    console.log("🎫 Converted cartItemsForDiscount:", converted);
    return converted;
  }, [selectedCartData]);

  // Load available vouchers for checkout
  const loadAvailableVouchers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const vouchers = await getAvailableVouchersForCheckout();
      setAvailableVouchers(vouchers);
    } catch (err) {
      console.error('Failed to load available vouchers:', err);
      setError('Failed to load available vouchers');
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate discount for selected voucher
  const calculateDiscountForVoucher = useCallback(async (voucherCode?: string) => {
    if (!cartItemsForDiscount.length) {
      console.log("🎫 No cart items for discount calculation");
      setDiscountData(null);
      onDiscountChange?.(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const request: CalculateDiscountRequest = {
        voucherCode: voucherCode || undefined,
        cartItems: cartItemsForDiscount,
        shippingFee
      };

      console.log("🎫 API Request payload:", request);
      console.log("🎫 Cart items for discount:", cartItemsForDiscount);

      const result = await calculateDiscount(request);
      console.log("🎫 API Response:", result);
      setDiscountData(result);
      onDiscountChange?.(result);
    } catch (err) {
      console.error('Failed to calculate discount:', err);
      console.error('Request that failed:', {
        voucherCode,
        cartItems: cartItemsForDiscount,
        shippingFee
      });
      setError('Failed to calculate discount');
      setDiscountData(null);
      onDiscountChange?.(null);
    } finally {
      setLoading(false);
    }
  }, [cartItemsForDiscount, shippingFee, onDiscountChange]);

  // Select a voucher and calculate discount
  const selectVoucher = useCallback(async (voucherCode: string | null) => {
    setSelectedVoucher(voucherCode);
    await calculateDiscountForVoucher(voucherCode || undefined);
  }, [calculateDiscountForVoucher]);

  // Clear selected voucher
  const clearVoucher = useCallback(() => {
    setSelectedVoucher(null);
    setDiscountData(null);
    onDiscountChange?.(null);
  }, [onDiscountChange]);

  // Calculate discount without voucher (base calculation)
  const calculateBaseDiscount = useCallback(async () => {
    await calculateDiscountForVoucher();
  }, [calculateDiscountForVoucher]);

  // Get voucher by code
  const getVoucherByCode = useCallback((code: string) => {
    return availableVouchers.find(v => v.discountCode === code);
  }, [availableVouchers]);

  return {
    // State
    availableVouchers,
    selectedVoucher,
    discountData,
    loading,
    error,
    
    // Actions
    loadAvailableVouchers,
    selectVoucher,
    clearVoucher,
    calculateBaseDiscount,
    getVoucherByCode,
    
    // Computed values
    hasDiscount: !!discountData?.isApplicable && (discountData?.discountAmount || 0) > 0,
    discountAmount: discountData?.discountAmount || 0,
    finalAmount: discountData?.finalOrderValue || 0,
    originalAmount: discountData?.originalOrderValue || 0
  };
};