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
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, ArrowUpDown } from "lucide-react";

const AdminReports: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-[#272424] text-[24px] leading-normal">Báo cáo thống kê</h2>
        
        {/* Date Range Picker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[14px] text-[#272424] font-medium">Từ ngày:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-[#D1D1D1] rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#e04d30]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[14px] text-[#272424] font-medium">Đến ngày:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-[#D1D1D1] rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#e04d30]"
            />
          </div>
        </div>
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
                className={`text-[24px] font-bold ${
                  overview && overview.totalProfit >= 0 ? "text-green-600" : "text-red-600"
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

      {/* Revenue Trend Chart */}
      {startDate && endDate && (
        <ContentCard className="mb-6">
          <div className="p-6">
            <h3 className="text-[18px] font-bold text-[#272424] mb-4">Xu hướng doanh thu</h3>
            {isTrendLoading ? (
              <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
            ) : revenueTrend && revenueTrend.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {revenueTrend.slice(-4).map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-[12px] text-[#888888] mb-1">
                        {new Date(item.date).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-[16px] font-bold text-[#272424]">
                        {formatCurrencyValue(item.revenue)}
                      </p>
                      <p className="text-[12px] text-green-600">
                        Lợi nhuận: {formatCurrencyValue(item.profit)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="h-64 flex items-end justify-between gap-2">
                  {revenueTrend.map((item, index) => {
                    const maxRevenue = Math.max(...revenueTrend.map((r) => r.revenue));
                    const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-[#e04d30] to-[#ff6b4a] rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${height}%` }}
                          title={`${new Date(item.date).toLocaleDateString("vi-VN")}: ${formatCurrencyValue(item.revenue)}`}
                        ></div>
                        <p className="text-[10px] text-[#888888] mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                          {new Date(item.date).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-center text-[#888888] py-8">Chưa có dữ liệu trong khoảng thời gian này</p>
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
                      <td className="py-3 px-4 text-[14px] text-[#272424]">{product.productName}</td>
                      <td className="py-3 px-4 text-[14px] text-[#272424] text-right">
                        {formatCurrencyValue(product.totalRevenue)}
                      </td>
                      <td className="py-3 px-4 text-[14px] text-[#272424] text-right">
                        {formatCurrencyValue(product.totalCost)}
                      </td>
                      <td
                        className={`py-3 px-4 text-[14px] text-right font-semibold ${
                          product.totalProfit >= 0 ? "text-green-600" : "text-red-600"
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
