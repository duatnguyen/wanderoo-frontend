// Test API endpoints for return orders
export const API_ENDPOINTS = {
  RETURN_ORDERS: {
    // Admin endpoints
    ADMIN: {
      LIST: '/api/admin/return-orders',
      DETAIL: (id: string) => `/api/admin/return-orders/${id}`,
      APPROVE: (id: string) => `/api/admin/return-orders/${id}/approve`,
      REJECT: (id: string) => `/api/admin/return-orders/${id}/reject`,
      REQUEST_INFO: (id: string) => `/api/admin/return-orders/${id}/request-info`,
      CONFIRM_RECEIPT: (id: string) => `/api/admin/return-orders/${id}/confirm-receipt`,
      PROCESS_REFUND: (id: string) => `/api/admin/return-orders/${id}/process-refund`,
      STATS: '/api/admin/return-orders/stats'
    },
    
    // Customer endpoints  
    CUSTOMER: {
      CREATE: '/api/return-orders/customer',
      LIST: '/api/return-orders/customer',
      DETAIL: (id: string) => `/api/return-orders/customer/${id}`,
      CANCEL: (id: string) => `/api/return-orders/customer/${id}`,
    },
    
    // Utility endpoints
    CHECK_ELIGIBILITY: (orderId: string) => `/api/return-orders/check-eligibility/${orderId}`,
    CALCULATE_REFUND: (returnOrderId: string) => `/api/return-orders/${returnOrderId}/calculate-refund`,
  }
} as const;

export default API_ENDPOINTS;