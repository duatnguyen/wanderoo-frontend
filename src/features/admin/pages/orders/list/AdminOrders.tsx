// src/pages/admin/AdminOrders.tsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { DateRange } from "react-day-picker";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, XCircle } from "lucide-react";
import { format } from "date-fns";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import {
  getAdminCustomerOrders,
  getAdminCustomerOrdersWithFilters,
  getPOSOrders,
  getWebsiteOrders,
  getPOSOrdersWithFilters,
  getWebsiteOrdersWithFilters,
} from "@/api/endpoints/orderApi";
import type { CustomerOrderResponse, OrderCountResponse } from "@/types";
import { toast } from "sonner";
import { useWebSocket } from "@/hooks/useWebSocket";

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<CustomerOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const navigate = useNavigate();
  const location = useLocation();

  // Determine order source from path
  const getOrderSource = () => {
    const path = location.pathname;
    if (path.includes('/orders/pos')) {
      return 'POS';
    } else if (path.includes('/orders/website')) {
      return 'WEBSITE';
    }
    return 'ALL';
  };

  // Fetch orders from API
  const fetchOrders = async (page = 1, status?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: page, // Backend expects 1-based pagination
        size: 10,
      };

      const orderSource = getOrderSource();
      const hasDateFilter = dateRange?.from || dateRange?.to;
      const hasFilters = paymentStatusFilter !== "ALL" || paymentMethodFilter !== "ALL" || (status && status !== "ALL") || hasDateFilter;
      let response;

      // Add date filters if provided
      if (dateRange?.from) {
        params.fromDate = format(dateRange.from, "yyyy-MM-dd");
      }
      if (dateRange?.to) {
        params.toDate = format(dateRange.to, "yyyy-MM-dd");
      }

      // Determine which API to use based on order source
      if (orderSource === 'POS') {
        // For POS orders, use POS-specific APIs
        if (hasFilters) {
          params.status = status && status !== "ALL" ? status : undefined;
          params.paymentStatus = paymentStatusFilter !== "ALL" ? paymentStatusFilter : undefined;
          params.method = paymentMethodFilter !== "ALL" ? paymentMethodFilter : undefined;
          response = await getPOSOrdersWithFilters(params);
        } else {
          response = await getPOSOrders(params);
        }
      } else if (orderSource === 'WEBSITE') {
        // For WEBSITE orders, use WEBSITE-specific APIs
        if (hasFilters) {
          params.status = status && status !== "ALL" ? status : undefined;
          params.paymentStatus = paymentStatusFilter !== "ALL" ? paymentStatusFilter : undefined;
          params.method = paymentMethodFilter !== "ALL" ? paymentMethodFilter : undefined;
          response = await getWebsiteOrdersWithFilters(params);
        } else {
          response = await getWebsiteOrders(params);
        }
      } else {
        // For ALL orders, use general Customer Order API
        if (hasFilters) {
          params.status = status && status !== "ALL" ? status : undefined;
          params.paymentStatus = paymentStatusFilter !== "ALL" ? paymentStatusFilter : undefined;
          params.method = paymentMethodFilter !== "ALL" ? paymentMethodFilter : undefined;
          response = await getAdminCustomerOrdersWithFilters(params);
        } else {
          response = await getAdminCustomerOrders(params);
        }
      }

      // CustomerOrderPageResponse structure: { pageNumber, pageSize, totalElements, totalPages, orders: [...] }
      const ordersData = response.orders || [];
      if (ordersData && ordersData.length > 0) {
        const firstOrder = ordersData[0];
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

      setOrders(ordersData);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Fetch order counts from API
  // const fetchOrderCounts = async () => {
  //   try {
  //     const counts = await getOrderCounts();
  //     setOrderCounts(counts);
  //   } catch (err) {
  //     console.error("Error fetching order counts:", err);
  //     // Don't show error toast for counts, just log it
  //   }
  // };

  // Fetch order counts on mount and when orders change
  // useEffect(() => {
  //   fetchOrderCounts();
  // }, []);

  // Reset to page 1 when filters or location change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, paymentStatusFilter, paymentMethodFilter, dateRange, location.pathname]);

  // Fetch orders when page, filters, or location changes
  useEffect(() => {
    const status = activeTab === "ALL" ? undefined : activeTab;
    fetchOrders(currentPage, status);
    // Refresh counts after fetching orders
    // fetchOrderCounts();
  }, [activeTab, currentPage, paymentStatusFilter, paymentMethodFilter, dateRange, location.pathname]);

  // WebSocket subscription for real-time order updates
  useWebSocket({
    autoConnect: true,
    topics: ["/topic/orders/updates"],
    onMessage: (message: CustomerOrderResponse) => {
      // Update order in the list if it exists
      setOrders((prevOrders) => {
        const orderIndex = prevOrders.findIndex((o) => o.code === message.code || o.id === message.id);
        if (orderIndex >= 0) {
          // Update existing order
          const updatedOrders = [...prevOrders];
          updatedOrders[orderIndex] = message;
          return updatedOrders;
        }
        // If order not in current page, just refresh the list
        // This handles cases where the order might be on a different page
        return prevOrders;
      });
    },
    onError: (error) => {
      console.error("[AdminOrders] WebSocket error:", error);
    },
  });

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

  // Handle view order detail - uses order code (not numeric id)
  const handleViewOrderDetail = (
    orderCode: string,
    orderStatus: string,
    orderSource: string
  ) => {
    navigate(`/admin/orders/${orderCode}`, {
      state: { status: orderStatus, source: orderSource },
    });
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
      // Sử dụng order code làm id cho bảng, để khi xem chi tiết truyền code thay vì numeric id
      id: order.code || String(order.id),
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

  const getPaymentStatusFilterLabel = (value: string) => {
    return paymentStatusOptions.find((opt) => opt.value === value)?.label || "Tất cả trạng thái thanh toán";
  };

  const getPaymentMethodFilterLabel = (value: string) => {
    return paymentMethodOptions.find((opt) => opt.value === value)?.label || "Tất cả phương thức";
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
        title={"Danh sách đơn hàng"}
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

              {/* Date Range Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="bg-white border-2 border-[#e04d30] flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[8px] cursor-pointer h-[40px]">
                    <CalendarIcon className="h-4 w-4 text-[#e04d30]" />
                    <span className="text-[#e04d30] text-[12px] font-semibold leading-[1.4] whitespace-nowrap">
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        "Chọn ngày"
                      )}
                    </span>
                    {dateRange?.from && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDateRange(undefined);
                        }}
                        className="ml-1 text-[#e04d30] hover:text-[#d63924]"
                      >
                        <XCircle className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
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
