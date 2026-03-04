import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageContainer, ContentCard } from "@/components/common";
import {
  getOverviewStatistics,
  getRevenueTrend,
  getProductPerformance,
} from "@/api/endpoints/warehouseApi";
import type {
  OverviewStatisticsResponse,
  RevenueTrendResponse,
  ProductPerformanceResponse,
} from "@/types/statistics";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  ArrowUpDown,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminReports: React.FC = () => {
  document.title = "Báo cáo thống kê | Wanderoo";

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "";
  const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : "";

  // Fetch overview statistics
  const { data: overview, isLoading: isOverviewLoading } = useQuery<OverviewStatisticsResponse>({
    queryKey: ["statistics-overview", startDate, endDate],
    queryFn: () => getOverviewStatistics(startDate || undefined, endDate || undefined),
  });

  // Fetch revenue trend
  const { data: revenueTrend, isLoading: isTrendLoading } = useQuery<RevenueTrendResponse[]>({
    queryKey: ["statistics-revenue-trend", startDate, endDate],
    queryFn: () => getRevenueTrend(startDate || undefined, endDate || undefined),
    enabled: !!startDate && !!endDate,
  });

  // Fetch product performance
  const { data: productPerformance, isLoading: isProductLoading } = useQuery<ProductPerformanceResponse[]>({
    queryKey: ["statistics-product-performance", startDate, endDate],
    queryFn: () => getProductPerformance(startDate || undefined, endDate || undefined),
  });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const formatCurrencyValue = (value: number) => {
    return `${formatNumber(value)}đ`;
  };

  // Format chart data for recharts
  const chartData = revenueTrend?.map((item) => ({
    date: format(new Date(item.date), "dd/MM", { locale: vi }),
    fullDate: item.date,
    doanhThu: item.revenue,
    chiPhi: item.cost,
    loiNhuan: item.profit,
  })) || [];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const labelMap: { [key: string]: string } = {
        doanhThu: "Doanh thu",
        chiPhi: "Chi phí",
        loiNhuan: "Lợi nhuận",
      };
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-[#272424] mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {labelMap[entry.dataKey] || entry.dataKey}: {formatCurrencyValue(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-[#272424] text-[24px] leading-normal">Báo cáo thống kê</h2>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy", { locale: vi })}
                  </>
                ) : (
                  format(dateRange.from, "dd/MM/yyyy", { locale: vi })
                )
              ) : (
                <span>Chọn khoảng thời gian</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={vi}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Revenue */}
        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">Tổng doanh thu</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-[24px] font-bold text-[#272424]">
                {overview ? formatCurrencyValue(overview.totalRevenue) : "0đ"}
              </p>
            )}
          </div>
        </ContentCard>

        {/* Total Cost */}
        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">Tổng chi phí</h3>
              <ShoppingCart className="w-5 h-5 text-orange-500" />
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-[24px] font-bold text-[#272424]">
                {overview ? formatCurrencyValue(overview.totalCost) : "0đ"}
              </p>
            )}
          </div>
        </ContentCard>

        {/* Total Profit */}
        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">Tổng lợi nhuận</h3>
              {overview && overview.totalProfit >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p
                className={`text-[24px] font-bold ${overview && overview.totalProfit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
                {overview ? formatCurrencyValue(overview.totalProfit) : "0đ"}
              </p>
            )}
          </div>
        </ContentCard>

        {/* Profit Margin */}
        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">Biên lợi nhuận</h3>
              <ArrowUpDown className="w-5 h-5 text-blue-500" />
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-[24px] font-bold text-[#272424]">
                {overview ? `${overview.profitMargin.toFixed(2)}%` : "0%"}
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
              <h3 className="text-[14px] font-medium text-[#888888]">Đơn nhập</h3>
              <Package className="w-5 h-5 text-purple-500" />
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-[24px] font-bold text-[#272424]">
                {overview ? formatNumber(overview.totalImportOrders) : "0"} đơn
              </p>
            )}
          </div>
        </ContentCard>

        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">Đơn xuất</h3>
              <Package className="w-5 h-5 text-yellow-500" />
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-[24px] font-bold text-[#272424]">
                {overview ? formatNumber(overview.totalExportOrders) : "0"} đơn
              </p>
            )}
          </div>
        </ContentCard>

        <ContentCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-medium text-[#888888]">Đơn bán</h3>
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
            {isOverviewLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-[24px] font-bold text-[#272424]">
                {overview ? formatNumber(overview.totalSalesOrders) : "0"} đơn
              </p>
            )}
          </div>
        </ContentCard>
      </div>

      {/* Revenue, Cost, Profit Trend Chart */}
      {startDate && endDate && (
        <ContentCard className="mb-6">
          <div className="p-6">
            <h3 className="text-[18px] font-bold text-[#272424] mb-4">Xu hướng Doanh thu - Chi phí - Lợi nhuận</h3>
            {isTrendLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#e04d30]" />
              </div>
            ) : chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDoanhThu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorChiPhi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
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
                  <Legend
                    formatter={(value) => {
                      const labels: { [key: string]: string } = {
                        doanhThu: "Doanh thu",
                        chiPhi: "Chi phí",
                        loiNhuan: "Lợi nhuận",
                      };
                      return labels[value] || value;
                    }}
                  />
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
                    dataKey="chiPhi"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorChiPhi)"
                    name="chiPhi"
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
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-center text-[#888888]">Chưa có dữ liệu trong khoảng thời gian này</p>
              </div>
            )}
          </div>
        </ContentCard>
      )}

      {/* Revenue vs Cost Comparison Chart */}
      {startDate && endDate && (
        <ContentCard className="mb-6">
          <div className="p-6">
            <h3 className="text-[18px] font-bold text-[#272424] mb-4">So sánh Doanh thu và Chi phí</h3>
            {isTrendLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#e04d30]" />
              </div>
            ) : chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                  <Legend
                    formatter={(value) => {
                      const labels: { [key: string]: string } = {
                        doanhThu: "Doanh thu",
                        chiPhi: "Chi phí",
                      };
                      return labels[value] || value;
                    }}
                  />
                  <Bar dataKey="doanhThu" fill="#10b981" name="doanhThu" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="chiPhi" fill="#f59e0b" name="chiPhi" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-center text-[#888888]">Chưa có dữ liệu trong khoảng thời gian này</p>
              </div>
            )}
          </div>
        </ContentCard>
      )}

      {/* Product Performance Table */}
      <ContentCard>
        <div className="p-6">
          <h3 className="text-[18px] font-bold text-[#272424] mb-4">Hiệu suất sản phẩm</h3>
          {isProductLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          ) : productPerformance && productPerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#D1D1D1]">
                    <th className="text-left py-3 px-4 text-[14px] font-semibold text-[#272424]">Sản phẩm</th>
                    <th className="text-right py-3 px-4 text-[14px] font-semibold text-[#272424]">Doanh thu</th>
                    <th className="text-right py-3 px-4 text-[14px] font-semibold text-[#272424]">Chi phí</th>
                    <th className="text-right py-3 px-4 text-[14px] font-semibold text-[#272424]">Lợi nhuận</th>
                    <th className="text-right py-3 px-4 text-[14px] font-semibold text-[#272424]">Biên lợi nhuận</th>
                    <th className="text-right py-3 px-4 text-[14px] font-semibold text-[#272424]">Số lượng bán</th>
                  </tr>
                </thead>
                <tbody>
                  {productPerformance.slice(0, 10).map((product) => (
                    <tr key={product.productId} className="border-b border-[#D1D1D1] hover:bg-gray-50">
                      <td className="py-3 px-4 text-[14px] text-[#272424]">
                        <div className="flex flex-col">
                          <span className="font-medium">{product.productName}</span>
                          {product.productDetailName && (
                            <span className="text-[12px] text-[#888888] mt-0.5">
                              {product.productDetailName}
                            </span>
                          )}
                          {product.sku && (
                            <span className="text-[12px] text-[#A3A3A3] mt-0.5">
                              Mã SKU: {product.sku}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[14px] text-[#272424] text-right">
                        {formatCurrencyValue(product.totalRevenue)}
                      </td>
                      <td className="py-3 px-4 text-[14px] text-[#272424] text-right">
                        {formatCurrencyValue(product.totalCost)}
                      </td>
                      <td
                        className={`py-3 px-4 text-[14px] text-right font-semibold ${product.totalProfit >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                      >
                        {formatCurrencyValue(product.totalProfit)}
                      </td>
                      <td className="py-3 px-4 text-[14px] text-[#272424] text-right">
                        {product.profitMargin.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-[14px] text-[#272424] text-right">
                        {formatNumber(product.totalQuantitySold)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-[#888888] py-8">Chưa có dữ liệu sản phẩm</p>
          )}
        </div>
      </ContentCard>
    </PageContainer>
  );
};

export default AdminReports;
