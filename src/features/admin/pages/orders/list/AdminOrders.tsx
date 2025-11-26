// src/pages/admin/AdminOrders.tsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  ContentCard,
  PageHeader,
  OrderTable,
  TabMenuWithBadge,
  type OrderTableColumn,
  type TabItemWithBadge,
} from "@/components/common";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CaretDown from "@/components/ui/caret-down";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import {
  getAdminCustomerOrders,
  getAdminCustomerOrdersByStatus,
  getAdminCustomerOrdersWithFilters,
  getOrderCounts,
  syncShippingStatus,
} from "@/api/endpoints/orderApi";
import type { AdminOrderResponse, OrderCountResponse } from "@/types";
import { toast } from "sonner";

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<AdminOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  // Order counts state
  const [orderCounts, setOrderCounts] = useState<OrderCountResponse>({
    all: 0,
    pending: 0,
    confirmed: 0,
    shipping: 0,
    complete: 0,
    canceled: 0,
    refund: 0,
    shippingFailed: 0,
  });
  
  // Filter states
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("ALL");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");
  
  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  
  const navigate = useNavigate();

  // Fetch orders from API
  const fetchOrders = async (page = 1, status?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: page, // Backend expects 1-based pagination
        size: 10,
      };

      // Use the new filter endpoint if any filters are active
      const hasFilters = 
        paymentStatusFilter !== "ALL" ||
        paymentMethodFilter !== "ALL" ||
        sourceFilter !== "ALL";

      let response;
      if (hasFilters) {
        // Use the new filter endpoint with all filters
        params.status = status && status !== "ALL" ? status : undefined;
        params.paymentStatus = paymentStatusFilter !== "ALL" ? paymentStatusFilter : undefined;
        params.method = paymentMethodFilter !== "ALL" ? paymentMethodFilter : undefined;
        params.source = sourceFilter !== "ALL" ? sourceFilter : undefined;
        response = await getAdminCustomerOrdersWithFilters(params);
      } else if (status && status !== "ALL") {
        // Use the status-specific endpoint
        response = await getAdminCustomerOrdersByStatus(status, params);
      } else {
        // Use the general endpoint for all orders
        response = await getAdminCustomerOrders(params);
      }

      // Debug: Log first order to check structure
      if (response.data.orders && response.data.orders.length > 0) {
        const firstOrder = response.data.orders[0];
        console.log("First order structure:", {
          id: firstOrder.id,
          hasOrderDetails: !!firstOrder.orderDetails,
          orderDetailsLength: firstOrder.orderDetails?.length || 0,
          hasItems: !!firstOrder.items,
          itemsLength: firstOrder.items?.length || 0,
          firstOrderDetail:
            firstOrder.orderDetails?.[0] || firstOrder.items?.[0],
        });
      }

      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Fetch order counts from API
  const fetchOrderCounts = async () => {
    try {
      const counts = await getOrderCounts();
      setOrderCounts(counts);
    } catch (err) {
      console.error("Error fetching order counts:", err);
      // Don't show error toast for counts, just log it
    }
  };

  // Fetch order counts on mount and when orders change
  useEffect(() => {
    fetchOrderCounts();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, paymentStatusFilter, paymentMethodFilter, sourceFilter]);

  // Fetch orders when page or filters change
  useEffect(() => {
    const status = activeTab === "ALL" ? undefined : activeTab;
    fetchOrders(currentPage, status);
    // Refresh counts after fetching orders
    fetchOrderCounts();
  }, [activeTab, currentPage, paymentStatusFilter, paymentMethodFilter, sourceFilter]);

  // Create order tabs with counts from API
  const orderTabsWithCounts: TabItemWithBadge[] = useMemo(
    () => [
      { id: "ALL", label: "TẤT CẢ", count: orderCounts.all },
      { id: "PENDING", label: "CHỜ XÁC NHẬN", count: orderCounts.pending },
      { id: "CONFIRMED", label: "ĐÃ XÁC NHẬN", count: orderCounts.confirmed },
      { id: "SHIPPING", label: "ĐANG GIAO", count: orderCounts.shipping },
      { id: "COMPLETE", label: "ĐÃ HOÀN THÀNH", count: orderCounts.complete },
      { id: "CANCELED", label: "ĐÃ HỦY", count: orderCounts.canceled },
    ],
    [orderCounts]
  );

  // Map payment type to chip status
  const getPaymentTypeStatus = (paymentType: string): ChipStatusKey => {
    if (paymentType === "Tiền mặt") return "cash";
    if (paymentType === "Chuyển khoản") return "transfer";
    return "default";
  };

  // Map order status to Vietnamese
  const getOrderStatusLabel = (status: string): string => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "SHIPPING":
        return "Đang giao";
      case "COMPLETE":
        return "Đã hoàn thành";
      case "CANCELED":
        return "Đã hủy";
      case "REFUND":
        return "Hoàn tiền";
      default:
        return "N/A";
    }
  };

  // Map payment status to Vietnamese
  const getPaymentStatusLabel = (paymentStatus: string): string => {
    switch (paymentStatus) {
      case "PENDING":
        return "Chưa thanh toán";
      case "PAID":
        return "Đã thanh toán";
      case "FAILED":
        return "Thanh toán thất bại";
      default:
        return "N/A";
    }
  };

  // Map processing status to chip status
  const getProcessingStatus = (status: string): ChipStatusKey => {
    if (status === "Đã hoàn thành") return "completed";
    if (status === "Đang giao") return "shipping";
    if (status === "Chờ xác nhận") return "pending";
    if (status === "Đã xác nhận") return "confirmed";
    if (status === "Đã hủy") return "cancelled";
    if (status === "Hoàn tiền") return "default";
    return "default";
  };

  // Map payment status to chip status
  const getPaymentStatus = (paymentStatus: string): ChipStatusKey => {
    if (paymentStatus === "Đã thanh toán") return "paid";
    if (paymentStatus === "Chưa thanh toán") return "unpaid";
    if (paymentStatus === "Đã hoàn tiền") return "unpaid";
    return "default";
  };

  // Handle view order detail
  const handleViewOrderDetail = (
    orderId: string,
    orderStatus: string,
    orderSource: string
  ) => {
    navigate(`/admin/orders/${orderId}`, {
      state: { status: orderStatus, source: orderSource },
    });
  };

  // Handle sync shipping status
  const handleSyncShippingStatus = async () => {
    try {
      setIsSyncing(true);
      const result = await syncShippingStatus();
      
      toast.success(
        `Đồng bộ thành công! Đã cập nhật ${result.syncedCount} đơn hàng.`,
        { duration: 3000 }
      );
      
      // Refresh orders and counts after sync
      const status = activeTab === "ALL" ? undefined : activeTab;
      await fetchOrders(currentPage, status);
      await fetchOrderCounts();
    } catch (error: any) {
      console.error("Error syncing shipping status:", error);
      const errorMessage = error?.response?.data?.message 
        || error?.message 
        || "Không thể đồng bộ trạng thái vận chuyển";
      toast.error(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter orders by search term only (other filters are handled server-side)
  const filteredOrders = useMemo(() => {
    // Only filter by search term on client-side since payment status, method, and source are filtered server-side
    if (!searchTerm || searchTerm.trim() === "") {
      return orders || [];
    }

    const searchLower = searchTerm.toLowerCase();
    return (orders || []).filter((order) => {
      return (
        String(order.id).toLowerCase().includes(searchLower) ||
        (order.code && order.code.toLowerCase().includes(searchLower)) ||
        String(order.userInfo?.id).toLowerCase().includes(searchLower) ||
        (order.userInfo?.name && order.userInfo.name.toLowerCase().includes(searchLower)) ||
        (order.userInfo?.phone && order.userInfo.phone.toLowerCase().includes(searchLower))
      );
    });
  }, [orders, searchTerm]);

  // Transform API response to match OrderTable component expectations
  const transformedOrders = useMemo(() => {
    return (filteredOrders || []).map((order) => ({
      id: String(order.id),
      customer: {
        name: order.userInfo?.name || "N/A",
        username: order.userInfo?.username || "N/A",
        image: order.userInfo?.image || "",
        orderCode: order.code,
      },
      products: (order.orderDetails && order.orderDetails.length > 0
        ? order.orderDetails
        : order.items && order.items.length > 0
          ? order.items
          : []
      ).map((item: any, index: number) => {
        // Get product name (clean, without variant info)
        const productName =
          item.snapshotProductName || item.name || "Sản phẩm không tên";

        // Format variant attributes for display
        let variantAttributes: Array<{
          groupName: string;
          value: string;
          groupLevel: number;
        }> = [];

        if (
          item.snapshotVariantAttributes &&
          Array.isArray(item.snapshotVariantAttributes) &&
          item.snapshotVariantAttributes.length > 0
        ) {
          variantAttributes = item.snapshotVariantAttributes
            .filter(
              (attr: any) => attr && (attr.name || attr.groupName) && attr.value
            ) // Filter out invalid attributes
            .map((attr: any) => ({
              groupName: attr.name || attr.groupName || "N/A",
              value: attr.value || "N/A",
              groupLevel: attr.groupLevel || 0,
            }));

          // Debug log for first item
          if (index === 0) {
            console.log("Variant attributes for first product:", {
              raw: item.snapshotVariantAttributes,
              processed: variantAttributes,
            });
          }
        }

        // Format price with proper currency formatting
        // Support both snapshotProductPrice (from orderDetails) and price (from items)
        const unitPrice = item.snapshotProductPrice || item.price || 0;
        const formattedPrice =
          unitPrice > 0
            ? `${Number(unitPrice).toLocaleString("vi-VN")}₫`
            : "0₫";

        return {
          id: item.id || index,
          name: productName, // Clean product name without variant info
          price: formattedPrice,
          unitPrice: Number(unitPrice), // Store numeric price for calculations
          quantity: item.quantity || 0,
          image: item.image || "", // Image if available
          sku: item.snapshotProductSku || item.sku || "",
          variantAttributes: variantAttributes,
        };
      }),
      paymentType:
        order.method === "CASH"
          ? "Tiền mặt"
          : order.method === "BANKING"
            ? "Chuyển khoản"
            : "N/A",
      status: getOrderStatusLabel(order.status || ""),
      paymentStatus: getPaymentStatusLabel(order.paymentStatus || ""),
      category: order.source || "Website",
      date: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("vi-VN") +
        " " +
        new Date(order.createdAt).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
        : "N/A",
      tabStatus: order.status || "PENDING",
      totalAmount: order.totalOrderPrice || 0,
      shippingFee: order.shippingFee || 0,
      itemsCount: (order.orderDetails || order.items || []).length,
    }));
  }, [filteredOrders]);

  // No need for client-side pagination since API already does it
  const paginatedOrders = transformedOrders;

  // Payment status filter options
  const paymentStatusOptions = [
    { value: "ALL", label: "Tất cả trạng thái thanh toán" },
    { value: "PENDING", label: "Chưa thanh toán" },
    { value: "PAID", label: "Đã thanh toán" },
    { value: "FAILED", label: "Thanh toán thất bại" },
  ];

  // Payment method filter options
  const paymentMethodOptions = [
    { value: "ALL", label: "Tất cả phương thức" },
    { value: "CASH", label: "Tiền mặt" },
    { value: "BANKING", label: "Chuyển khoản" },
  ];

  // Source filter options
  const sourceOptions = [
    { value: "ALL", label: "Tất cả nguồn" },
    { value: "WEBSITE", label: "Website" },
    { value: "POS", label: "POS" },
  ];

  const getPaymentStatusFilterLabel = (value: string) => {
    return paymentStatusOptions.find((opt) => opt.value === value)?.label || "Tất cả trạng thái thanh toán";
  };

  const getPaymentMethodFilterLabel = (value: string) => {
    return paymentMethodOptions.find((opt) => opt.value === value)?.label || "Tất cả phương thức";
  };

  const getSourceFilterLabel = (value: string) => {
    return sourceOptions.find((opt) => opt.value === value)?.label || "Tất cả nguồn";
  };

  // Order table columns definition
  const orderTableColumns: OrderTableColumn[] = [
    {
      title: "Đơn hàng",
      width: "flex-1",
      minWidth: "min-w-[300px]",
      className: "justify-start",
    },
    {
      title: "Nguồn",
      width: "w-[90px]",
      minWidth: "min-w-[80px]",
      className: "justify-start",
    },
    {
      title: "Thanh toán",
      width: "w-[120px]",
      minWidth: "min-w-[100px]",
      className: "justify-start",
    },
    {
      title: "TT Đơn hàng",
      width: "w-[140px]",
      minWidth: "min-w-[140px]",
      className: "justify-start",
    },
    {
      title: "TT Thanh toán",
      width: "w-[135px]",
      minWidth: "min-w-[130px]",
      className: "justify-start",
    },
    {
      title: "Tổng tiền",
      width: "w-[150px]",
      minWidth: "min-w-[120px]",
      className: "justify-start",
    },
    {
      title: "Thao tác",
      width: "w-[125px]",
      minWidth: "min-w-[100px]",
      className: "justify-start",
    },
  ];

  return (
    <PageContainer>
      {/* Page Header with Order Count */}
      <PageHeader
        title={`Danh sách đơn hàng${totalElements > 0 ? ` (${totalElements.toLocaleString("vi-VN")} đơn)` : ""}`}
      />

      {/* Tab Menu with Badge Counts */}
      <TabMenuWithBadge
        tabs={orderTabsWithCounts}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="min-w-[600px]"
      />

      {/* Content Card */}
      <ContentCard>
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px] w-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e04d30] mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Không thể tải dữ liệu
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() =>
                fetchOrders(
                  currentPage,
                  activeTab === "ALL" ? undefined : activeTab
                )
              }
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Content when loaded successfully */}
        {!loading && !error && (
          <>
            {/* Filters Section */}
            <div className="flex gap-[8px] items-center w-full flex-wrap">
              {/* Search Bar */}
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm mã đơn hàng, ID khách hàng, tên, SĐT..."
                className="flex-1 min-w-0 max-w-[400px]"
              />

              {/* Filter Dropdowns */}
              {/* Payment Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-white border-2 border-[#e04d30] flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[8px] cursor-pointer h-[40px]">
                    <span className="text-[#e04d30] text-[12px] font-semibold leading-[1.4] whitespace-nowrap">
                      {getPaymentStatusFilterLabel(paymentStatusFilter)}
                    </span>
                    <CaretDown className="text-[#e04d30]" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {paymentStatusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setPaymentStatusFilter(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Payment Method Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-white border-2 border-[#e04d30] flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[8px] cursor-pointer h-[40px]">
                    <span className="text-[#e04d30] text-[12px] font-semibold leading-[1.4] whitespace-nowrap">
                      {getPaymentMethodFilterLabel(paymentMethodFilter)}
                    </span>
                    <CaretDown className="text-[#e04d30]" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {paymentMethodOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setPaymentMethodFilter(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Source Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-white border-2 border-[#e04d30] flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[8px] cursor-pointer h-[40px]">
                    <span className="text-[#e04d30] text-[12px] font-semibold leading-[1.4] whitespace-nowrap">
                      {getSourceFilterLabel(sourceFilter)}
                    </span>
                    <CaretDown className="text-[#e04d30]" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {sourceOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSourceFilter(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sync Shipping Status Button */}
              <button
                onClick={handleSyncShippingStatus}
                disabled={isSyncing}
                className="bg-[#e04d30] hover:bg-[#d63924] disabled:bg-gray-400 disabled:cursor-not-allowed text-white flex gap-[6px] items-center justify-center px-[16px] py-[8px] rounded-[8px] h-[40px] transition-colors whitespace-nowrap"
              >
                {isSyncing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-[12px] font-semibold leading-[1.4]">
                      Đang đồng bộ...
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                    </svg>
                    <span className="text-[12px] font-semibold leading-[1.4]">
                      Đồng bộ vận chuyển
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Order Table */}
            <OrderTable
              columns={orderTableColumns}
              orders={paginatedOrders}
              onViewDetail={handleViewOrderDetail}
              getPaymentTypeStatus={getPaymentTypeStatus}
              getProcessingStatus={getProcessingStatus}
              getPaymentStatus={getPaymentStatus}
            />

            {/* Pagination */}
            <Pagination
              current={currentPage}
              total={totalPages}
              onChange={setCurrentPage}
            />
          </>
        )}
      </ContentCard>
    </PageContainer>
  );
};

export default AdminOrders;
