// src/api/endpoints/inventoryApi.ts - Inventory management API calls
import api from '../apiClient';
import type {
    ApiResponse,
    SimpleInventoryPageResponse,
} from '../../types';

// Inventory APIs
export const getInventory = async (params?: {
    keyword?: string;
    sort?: string;
    page?: number;
    size?: number;
}): Promise<SimpleInventoryPageResponse> => {
    const response = await api.get<ApiResponse<SimpleInventoryPageResponse>>('/auth/v1/private/inventory', { params });
    return response.data.data;
};