// src/api/endpoints/paymentApi.ts - Payment API calls
import api from "../apiClient";
import type { ApiResponse } from "../../types";

export interface VNPayPaymentResponse {
  status: number;
  message: string;
  url: string;
}

export interface VNPayCallbackResponse {
  status: number;
  message: string;
  orderId?: number;
  vnp_ResponseCode?: string;
}

// VNPay APIs
export const createVNPayPayment = async (
  orderId: number
): Promise<VNPayPaymentResponse> => {
  // Backend returns Map<String, Object> directly, not wrapped in ApiResponse
  const response = await api.post<VNPayPaymentResponse>(
    "/payment/vn-pay",
    null,
    {
      params: { orderId },
    }
  );
  return response.data;
};

