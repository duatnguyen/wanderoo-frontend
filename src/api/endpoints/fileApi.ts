import api from '../apiClient';
import type { ApiResponse } from '@/types';

export const uploadFile = async (file: File, folder = 'misc'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await api.post<ApiResponse<string>>('/files/public', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

