export interface AdminStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  details?: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentActivity: UserActivity[];
  chartData?: any; // Có thể thay thế bằng type cụ thể cho chart
}
