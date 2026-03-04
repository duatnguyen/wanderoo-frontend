import { useState, useCallback } from "react";
import { toast } from "sonner";
import { calculateShippingFeeForAddress as calculateShippingFeeApi } from "../api/endpoints/cartApi";
import type { AddressOption } from "../types/checkout";
import type { BackendCartResponse, SelectAllRequest } from "../types/api";
import { SHIPPING_CONFIG } from "../types/checkout";

export const useShippingCalculation = () => {
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingFee, setShippingFee] = useState<number>(0);

  const calculateShippingFeeForAddress = useCallback(async (
    addressId: number,
    cartIds: number[]
  ) => {
    if (!addressId || !cartIds.length) {
      setShippingFee(0);
      return;
    }

    try {
      setIsCalculatingShipping(true);

      // Prepare request with cart IDs
      const request: SelectAllRequest = {
        getAll: cartIds
      };

      // Call the new API endpoint
      const fee = await calculateShippingFeeApi(addressId, request);
      setShippingFee(fee || 0);
      
    } catch (error: any) {
      console.error("Error calculating shipping fee:", error);
      setShippingFee(SHIPPING_CONFIG.DEFAULT_SHIPPING_FEE);
      toast.error("Không thể tính phí vận chuyển, sử dụng phí mặc định");
    } finally {
      setIsCalculatingShipping(false);
    }
  }, []);

  // Legacy method for backward compatibility
  const calculateShippingFeeForAddressLegacy = useCallback(async (
    address: AddressOption,
    cartData: BackendCartResponse[]
  ) => {
    if (!address?.id || !cartData.length) return;

    const cartIds = cartData.map(item => item.id);
    await calculateShippingFeeForAddress(address.id, cartIds);
  }, [calculateShippingFeeForAddress]);

  return {
    isCalculatingShipping,
    shippingFee,
    setShippingFee,
    calculateShippingFeeForAddress,
    calculateShippingFeeForAddressLegacy,
  };
};