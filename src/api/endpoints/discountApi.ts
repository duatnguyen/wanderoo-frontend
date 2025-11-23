// src/api/endpoints/discountApi.ts - Discount management API calls
import api from "../apiClient";
import type {
    ApiResponse,
    SelectAllRequest,
    DiscountPublicResponse,
    VoucherHistoryResponse,
} from '@/types/api';
import type {
    AdminDiscountPageResponse,
    AdminDiscountResponse,
    AdminDiscountMetadataResponse,
    AdminDiscountCreateRequest,
    DiscountStateValue,
} from '@/types/discount';

// Discount APIs
export const getDiscounts = async (params?: {
    keyword?: string;
    sort?: string;
    page?: number;
    size?: number;
    state?: DiscountStateValue;
}): Promise<AdminDiscountPageResponse> => {
    const response = await api.get<ApiResponse<AdminDiscountPageResponse>>('/auth/v1/private/discount', {params});
    return response.data.data;
};

export const getDiscountMetadata = async (): Promise<AdminDiscountMetadataResponse> => {
    const response = await api.get<ApiResponse<AdminDiscountMetadataResponse>>('/auth/v1/private/discount/metadata');
    return response.data.data;
};

export const getDiscountDetail = async (id: number): Promise<AdminDiscountResponse> => {
    const response = await api.get<ApiResponse<AdminDiscountResponse>>(`/auth/v1/private/discount/${id}`);
    return response.data.data;
};

export const createDiscount = async (discountData: AdminDiscountCreateRequest): Promise<ApiResponse<number>> => {
    const response = await api.post<ApiResponse<number>>('/auth/v1/private/discount', discountData);
    return response.data;
};

export const updateDiscount = async (
    id: number,
    discountData: AdminDiscountCreateRequest
): Promise<ApiResponse<null>> => {
    const response = await api.put<ApiResponse<null>>(`/auth/v1/private/discount/${id}`, discountData);
    return response.data;
};

export const deleteDiscount = async (
    id: number
): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(
        `/auth/v1/private/discount/${id}`
    );
    return response.data;
};

export const deleteAllDiscounts = async (
    request: SelectAllRequest
): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(
        "/auth/v1/private/discount",
        {
            data: request,
        }
    );
    return response.data;
};

// Public Discount/Voucher APIs
export const getPublicDiscounts = async (params?: {
    category?: string;
}): Promise<DiscountPublicResponse[]> => {
    const response = await api.get<ApiResponse<DiscountPublicResponse[]>>(
        "/public/v1/discount/list",
        {params}
    );
    return response.data.data ?? [];
};

export const searchPublicDiscounts = async (params?: {
    keyword?: string;
    category?: string;
}): Promise<DiscountPublicResponse[]> => {
    const response = await api.get<ApiResponse<DiscountPublicResponse[]>>(
        "/public/v1/discount/search",
        {params}
    );
    return response.data.data ?? [];
};

export const getMyVouchers = async (): Promise<VoucherHistoryResponse[]> => {
    const response = await api.get<ApiResponse<VoucherHistoryResponse[]>>(
        '/public/v1/discount/voucher/my-vouchers',
    );
    return response.data.data ?? [];
};

export const applyDiscountToProducts = async (
    discountId: number,
    productDetailIds: number[]
): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>(
        '/auth/v1/private/discount/apply-to-products',
        {
            discountId,
            productDetailIds,
        }
    );
    return response.data;
};

export const getProductDetailIdsByDiscountId = async (
    discountId: number
): Promise<number[]> => {
    const response = await api.get<ApiResponse<number[]>>(
        `/auth/v1/private/discount/${discountId}/product-details`
    );
    console.log(`API Response for discount ${discountId}:`, response.data);
    const productDetailIds = response.data.data ?? [];
    console.log(`Parsed product detail IDs:`, productDetailIds);
    return productDetailIds;
};

export const removeDiscountFromProducts = async (
    discountId: number,
    productDetailIds: number[]
): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>(
        '/auth/v1/private/discount/remove-from-products',
        {
            discountId,
            productDetailIds,
        }
    );
    return response.data;
};
