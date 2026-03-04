import React from "react";
import { useQuery } from "@tanstack/react-query";
import { PageContainer, ContentCard } from "@/components/common";
import {
  getOverviewStatistics,
  getRevenueTrend,
} from "@/api/endpoints/warehouseApi";
import { getOrderCounts } from "@/api/endpoints/websiteOrderApi";
import type {
  OverviewStatisticsResponse,
  RevenueTrendResponse,
} from "@/types/statistics";
import type { OrderCountResponse } from "@/types/orders";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  FileText,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard: React.FC = () => {
  document.title = "Dashboard | Wanderoo";
  const navigate = useNavigate();

  // Tính toán ngày: 30 ngày gần nhất cho overview, 7 ngày cho trend
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  const sevenDaysAgo = subDays(today, 7);

  const startDate30 = format(thirtyDaysAgo, "yyyy-MM-dd");
  const endDate30 = format(today, "yyyy-MM-dd");
  const startDate7 = format(sevenDaysAgo, "yyyy-MM-dd");
  const endDate7 = format(today, "yyyy-MM-dd");

  // Fetch overview statistics (30 ngày)
  const { data: overview, isLoading: isOverviewLoading } =
    useQuery<OverviewStatisticsResponse>({
      queryKey: ["dashboard-overview", startDate30, endDate30],
      queryFn: () => getOverviewStatistics(startDate30, endDate30),
    });

  // Fetch revenue trend (7 ngày gần nhất)
  const { data: revenueTrend, isLoading: isTrendLoading } =
    useQuery<RevenueTrendResponse[]>({
      queryKey: ["dashboard-revenue-trend", startDate7, endDate7],
      queryFn: () => getRevenueTrend(startDate7, endDate7),
    });

  // Fetch order counts
  const { data: orderCounts, isLoading: isOrderCountsLoading } =
    useQuery<OrderCountResponse>({
      queryKey: ["dashboard-order-counts"],
      queryFn: () => getOrderCounts(),
    });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const formatCurrencyValue = (value: number) => {
    return `${formatNumber(value)}đ`;
  };

  // Format chart data for 7-day trend
  const chartData =
    revenueTrend?.map((item) => ({
      date: format(new Date(item.date), "dd/MM", { locale: vi }),
      doanhThu: item.revenue,
      loiNhuan: item.profit,
    })) || [];

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-[#272424] mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === "doanhThu" ? "Doanh thu" : "Lợi nhuận"}:{" "}
              {formatCurrencyValue(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <h2 className="font-bold text-[#272424] text-[24px] leading-normal">
          Tổng quan
        </h2>
        <p className="text-[14px] text-[#888888] mt-1">
          Tổng quan hệ thống trong 30 ngày gần nhất
        </p>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Revenue */}
        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">
                Tổng doanh thu
              </h3>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-[24px] font-bold text-[#272424]">
                {overview ? formatCurrencyValue(overview.totalRevenue) : "0đ"}
              </p>
            )}
            <p className="text-[12px] text-[#888888] mt-1">30 ngày qua</p>
          </div>
        </ContentCard>

        {/* Total Cost */}
        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">
                Tổng chi phí
              </h3>
              <div className="p-2 bg-orange-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-[24px] font-bold text-[#272424]">
                {overview ? formatCurrencyValue(overview.totalCost) : "0đ"}
              </p>
            )}
            <p className="text-[12px] text-[#888888] mt-1">30 ngày qua</p>
          </div>
        </ContentCard>

        {/* Total Profit */}
        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">
                Tổng lợi nhuận
              </h3>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p
                className={`text-[24px] font-bold ${overview && overview.totalProfit >= 0
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                {overview ? formatCurrencyValue(overview.totalProfit) : "0đ"}
              </p>
            )}
            <p className="text-[12px] text-[#888888] mt-1">30 ngày qua</p>
          </div>
        </ContentCard>

        {/* Profit Margin */}
        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">
                Biên lợi nhuận
              </h3>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-[24px] font-bold text-[#272424]">
                {overview ? `${overview.profitMargin.toFixed(2)}%` : "0%"}
              </p>
            )}
            <p className="text-[12px] text-[#888888] mt-1">30 ngày qua</p>
          </div>
        </ContentCard>
      </div>

      {/* Quick Stats and Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Trend Chart (7 days) */}
        <ContentCard className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#272424]">
                  Xu hướng doanh thu
                </h3>
                <p className="text-[12px] text-[#888888] mt-1">7 ngày gần nhất</p>
              </div>
              <button
                onClick={() => navigate("/admin/reports")}
                className="flex items-center gap-1 text-[14px] text-[#e04d30] hover:text-[#c03d20] transition-colors"
              >
                Xem chi tiết
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            {isTrendLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#e04d30]" />
              </div>
            ) : chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDoanhThu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLoiNhuan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                      return value.toString();
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="doanhThu"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorDoanhThu)"
                    name="doanhThu"
                  />
                  <Area
                    type="monotone"
                    dataKey="loiNhuan"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorLoiNhuan)"
                    name="loiNhuan"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-center text-[#888888]">
                  Chưa có dữ liệu trong 7 ngày gần nhất
                </p>
              </div>
            )}
          </div>
        </ContentCard>

        {/* Order Status Summary */}
        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#272424] whitespace-nowrap">
                  Trạng thái đơn hàng
                </h3>
              </div>
              <button
                onClick={() => navigate("/admin/orders")}
                className="flex items-center gap-1 text-[14px] text-[#e04d30] hover:text-[#c03d20] transition-colors"
              >
                Xem tất cả
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            {isOrderCountsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 animate-pulse rounded"></div>
                ))}
              </div>
            ) : orderCounts ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-[14px] text-[#272424]">Chờ xác nhận</span>
                  </div>
                  <span className="text-[16px] font-bold text-[#272424]">
                    {formatNumber(orderCounts.pending)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-yellow-600" />
                    <span className="text-[14px] text-[#272424]">Đang giao</span>
                  </div>
                  <span className="text-[16px] font-bold text-[#272424]">
                    {formatNumber(orderCounts.shipping)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-[14px] text-[#272424]">Hoàn thành</span>
                  </div>
                  <span className="text-[16px] font-bold text-[#272424]">
                    {formatNumber(orderCounts.complete)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-red-600" />
                    <span className="text-[14px] text-[#272424]">Đã hủy</span>
                  </div>
                  <span className="text-[16px] font-bold text-[#272424]">
                    {formatNumber(orderCounts.canceled)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-center text-[#888888] py-8">
                Không có dữ liệu
              </p>
            )}
          </div>
        </ContentCard>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">
                Đơn nhập
              </h3>
              <Package className="w-5 h-5 text-purple-500" />
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-[24px] font-bold text-[#272424]">
                {overview ? formatNumber(overview.totalImportOrders) : "0"} đơn
              </p>
            )}
            <p className="text-[12px] text-[#888888] mt-1">30 ngày qua</p>
          </div>
        </ContentCard>

        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">
                Đơn xuất
              </h3>
              <Package className="w-5 h-5 text-yellow-500" />
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-[24px] font-bold text-[#272424]">
                {overview ? formatNumber(overview.totalExportOrders) : "0"} đơn
              </p>
            )}
            <p className="text-[12px] text-[#888888] mt-1">30 ngày qua</p>
          </div>
        </ContentCard>

        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">
                Đơn bán hoàn thành
              </h3>
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-[24px] font-bold text-[#272424]">
                {overview ? formatNumber(overview.totalSalesOrders) : "0"} đơn
              </p>
            )}
            <p className="text-[12px] text-[#888888] mt-1">30 ngày qua</p>
          </div>
        </ContentCard>
      </div>

      {/* Quick Actions */}
      <ContentCard>
        <div className="p-6">
          <h3 className="text-[18px] font-bold text-[#272424] mb-4">
            Truy cập nhanh
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/admin/orders")}
              className="p-4 border border-[#D1D1D1] rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <FileText className="w-6 h-6 text-[#e04d30] mb-2" />
              <p className="text-[14px] font-medium text-[#272424]">Đơn hàng</p>
            </button>
            <button
              onClick={() => navigate("/admin/products/all")}
              className="p-4 border border-[#D1D1D1] rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Package className="w-6 h-6 text-[#e04d30] mb-2" />
              <p className="text-[14px] font-medium text-[#272424]">Sản phẩm</p>
            </button>
            <button
              onClick={() => navigate("/admin/customers")}
              className="p-4 border border-[#D1D1D1] rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Users className="w-6 h-6 text-[#e04d30] mb-2" />
              <p className="text-[14px] font-medium text-[#272424]">Khách hàng</p>
            </button>
            <button
              onClick={() => navigate("/admin/reports")}
              className="p-4 border border-[#D1D1D1] rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <TrendingUp className="w-6 h-6 text-[#e04d30] mb-2" />
              <p className="text-[14px] font-medium text-[#272424]">Báo cáo</p>
            </button>
          </div>
        </div>
      </ContentCard>
    </PageContainer>
  );
};

export default AdminDashboard;
