export interface OverviewStatisticsResponse {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  totalImportOrders: number;
  totalExportOrders: number;
  totalSalesOrders: number;
  startDate?: string;
  endDate?: string;
}

export interface RevenueTrendResponse {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
}

export interface ProductPerformanceResponse {
  productId: number;
  productName: string;
  productDetailName: string;
  sku: string;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  totalQuantitySold: number;
  averageSellingPrice: number;
  averageCostPrice: number;
}

