import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { DateRange } from "react-day-picker";
import {
  PageContainer,
  ContentCard,
  PageHeader,
  TabMenuWithBadge,
  TabMenu,
  OrderTable,
  type OrderTableColumn,
  type TabItemWithBadge,
  type TabItem,
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
import { toast } from "sonner";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import { returnOrderService, type ReturnOrderListItem, type ReturnOrderCategory, type ReturnOrderStatus, type GetReturnOrdersParams } from "@/api/returnOrderService";

type ReturnStatusFilter = ReturnOrderStatus | "DELIVERED";

const primaryTabs: TabItemWithBadge[] = [
  { id: "ALL", label: "Tất cả" },
  { id: "RETURN", label: "Đơn Trả hàng Hoàn tiền" },
  { id: "CANCEL", label: "Đơn Hủy" },
  { id: "FAILED", label: "Đơn Giao hàng không thành công" },
];

const statusTabs: TabItem[] = [
  { id: "ALL", label: "Tất cả" },
  { id: "UNDER_REVIEW", label: "Đang chờ xét duyệt" },
  { id: "RETURNING", label: "Đang trả hàng" },
  { id: "DELIVERED", label: "Giao thành công" },
  { id: "COMPLETED", label: "Đã hoàn tiền cho người mua" },
  { id: "INVALID", label: "Yêu cầu bị huỷ/không hợp lệ" },
];

const cancelSubTabs: TabItem[] = [
  { id: "ALL", label: "Tất cả" },
  { id: "PROCESSING", label: "Đang xử lý" },
  { id: "PROCESSED", label: "Đã xử lý" },
];

const PAGE_SIZE = 5;

interface OtherStatusNavigationState {
  pathname?: string;
  activePrimaryTab?: ReturnOrderCategory | "ALL";
  activeStatusTab?: "ALL" | ReturnOrderStatus;
  activeCancelSubTab?: "ALL" | "PROCESSING" | "PROCESSED";
  activeFailedSubTab?: "ALL";
  searchTerm?: string;
}

const AdminOrderOtherStatus = () => {
  document.title = "Trả hàng/Hoàn tiền/Huỷ | Wanderoo";

  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [returnOrders, setReturnOrders] = useState<ReturnOrderListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [activePrimaryTab, setActivePrimaryTab] = useState<ReturnOrderCategory | "ALL">("ALL");
  const [activeStatusTab, setActiveStatusTab] = useState<"ALL" | ReturnStatusFilter>("ALL");
  const [activeCancelSubTab, setActiveCancelSubTab] = useState<
    "ALL" | "PROCESSING" | "PROCESSED"
  >("ALL");
  const [activeFailedSubTab, setActiveFailedSubTab] = useState<"ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    const preservedState = (location.state as { returnTo?: OtherStatusNavigationState } | null)
      ?.returnTo;
    if (preservedState) {
      if (preservedState.activePrimaryTab) {
        setActivePrimaryTab(preservedState.activePrimaryTab);
      }
      if (preservedState.activeStatusTab) {
        setActiveStatusTab(preservedState.activeStatusTab);
      }
      if (preservedState.activeCancelSubTab) {
        setActiveCancelSubTab(preservedState.activeCancelSubTab);
      }
      if (preservedState.activeFailedSubTab) {
        if (preservedState.activeFailedSubTab === "ALL") {
          setActiveFailedSubTab(preservedState.activeFailedSubTab);
        }
      }
      if (typeof preservedState.searchTerm === "string") {
        setSearchTerm(preservedState.searchTerm);
      }
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const tabCounts = useMemo(() => {
    return returnOrders.reduce(
      (acc, order) => {
        acc.ALL += 1;
        acc[order.category] += 1;
        return acc;
      },
      {
        ALL: 0,
        RETURN: 0,
        CANCEL: 0,
        FAILED: 0,
      } as Record<"ALL" | ReturnOrderCategory, number>
    );
  }, [returnOrders]);

  const decoratedPrimaryTabs = useMemo(
    () =>
      primaryTabs.map((tab) => ({
        ...tab,
        count: tabCounts[tab.id as keyof typeof tabCounts],
      })),
    [tabCounts]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activePrimaryTab,
    activeStatusTab,
    activeCancelSubTab,
    activeFailedSubTab,
    searchTerm,
  ]);

  useEffect(() => {
    if (activePrimaryTab !== "CANCEL") {
      setActiveCancelSubTab("ALL");
    }
    if (activePrimaryTab !== "FAILED") {
      setActiveFailedSubTab("ALL");
    }
    if (activePrimaryTab === "ALL" && activeStatusTab !== "ALL") {
      setActiveStatusTab("ALL");
    }
  }, [activePrimaryTab]);

  const paginatedOrders = useMemo(() => {
    return returnOrders;
  }, [returnOrders]);

  // Payment method filter options
  const paymentMethodOptions = [
    { value: "ALL", label: "Tất cả phương thức" },
    { value: "CASH", label: "Tiền mặt" },
    { value: "BANKING", label: "Chuyển khoản" },
  ];

  const getPaymentMethodFilterLabel = (value: string) => {
    return paymentMethodOptions.find((opt) => opt.value === value)?.label || "Tất cả phương thức";
  };

  // Fetch return orders from API
  const fetchReturnOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: GetReturnOrdersParams = {
        page: currentPage - 1, // Backend uses 0-based indexing
        size: PAGE_SIZE,
        sortBy: "createdAt",
        sortDir: "desc"
      };

      // Add filters
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (activePrimaryTab !== "ALL") {
        params.category = activePrimaryTab;
      }

      if (activeStatusTab !== "ALL") {
        params.status = activeStatusTab;
      }

      // Only show return orders from Website (not POS)
      params.source = "WEBSITE";

      if (paymentMethodFilter !== "ALL") {
        // Map UI filter to backend parameter if needed
        // params.paymentMethod = paymentMethodFilter;
      }

      if (dateRange?.from) {
        params.fromDate = format(dateRange.from, "yyyy-MM-dd");
      }

      if (dateRange?.to) {
        params.toDate = format(dateRange.to, "yyyy-MM-dd");
      }

      const response = await returnOrderService.getReturnOrders(params);

      setReturnOrders(response.content);
      setTotalPages(Math.max(1, response.totalPages));
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching return orders:", err);
      const errorMessage = err.message || "Không thể tải danh sách đơn trả hàng. Vui lòng thử lại.";
      setError(errorMessage);
      toast.error("Không thể tải danh sách đơn trả hàng");
      setLoading(false);
    }
  }, [currentPage, activePrimaryTab, activeStatusTab, activeCancelSubTab, paymentMethodFilter, dateRange, searchTerm]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchReturnOrders();
    }, searchTerm ? 500 : 0); // 500ms delay for search, immediate for other changes

    return () => clearTimeout(timeoutId);
  }, [fetchReturnOrders]);

  const handleViewDetail = (order: ReturnOrderListItem) => {
    navigate(`/admin/orders/otherstatus/${order.returnOrderCode || order.orderCode}`, {
      state: {
        returnOrderId: order.id.toString(),
        returnTo: {
          pathname: "/admin/orders/otherstatus",
          activePrimaryTab,
          activeStatusTab,
          activeCancelSubTab,
          activeFailedSubTab,
          searchTerm,
        },
      },
    });
  };

  // Helper functions for OrderTable
  const getPaymentTypeStatus = (paymentType: string): ChipStatusKey => {
    if (paymentType === "Tiền mặt") return "cash";
    if (paymentType === "Chuyển khoản") return "transfer";
    return "default";
  };

  const getProcessingStatus = (status: string): ChipStatusKey => {
    if (status === "Đã hoàn thành") return "completed";
    if (status === "Đang trả hàng") return "shipping";
    if (status === "Đang chờ xét duyệt") return "pending";
    if (status === "Yêu cầu không hợp lệ") return "cancelled";
    return "default";
  };

  const getPaymentStatus = (paymentStatus: string): ChipStatusKey => {
    if (paymentStatus === "Đã hoàn tiền đủ") return "paid";
    if (paymentStatus === "Chưa hoàn tiền") return "unpaid";
    if (paymentStatus === "Đã hoàn tiền 1 phần") return "transfer";
    return "default";
  };

  // Transform ReturnOrderListItem data to match OrderTable interface
  const transformedOrders = useMemo(() => {
    return paginatedOrders.map((order) => {
      // Use returnOrderDetails if available, otherwise fallback to single product
      const products = order.returnOrderDetails && order.returnOrderDetails.length > 0
        ? order.returnOrderDetails.map((detail) => ({
            id: detail.id,
            name: detail.snapshotProductName || order.productName || "Sản phẩm không tên",
            price: `${Number(detail.totalReturnPrice || detail.returnPrice || 0).toLocaleString("vi-VN")}₫`,
            unitPrice: detail.returnPrice || 0,
            quantity: detail.returnQuantity,
            image: order.productImage || "",
            sku: detail.snapshotProductSku || order.orderCode,
            variantAttributes: order.productVariant ? [{
              groupName: "Phân loại",
              value: order.productVariant,
              groupLevel: 1,
            }] : [],
          }))
        : [{
            id: 1,
            name: order.productName,
            price: `${Number(order.totalAmount).toLocaleString("vi-VN")}₫`,
            unitPrice: order.totalAmount,
            quantity: 1,
            image: order.productImage || "",
            sku: order.orderCode,
            variantAttributes: order.productVariant ? [{
              groupName: "Phân loại",
              value: order.productVariant,
              groupLevel: 1,
            }] : [],
          }];

      const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

      return {
        id: order.returnOrderCode || order.orderCode,
        customer: {
          name: order.customerInfo?.name || order.customerName,
          username: order.customerInfo?.username || order.customerUsername,
          image: order.customerInfo?.image || order.productImage || "",
          orderCode: order.orderCode,
        },
        products,
        paymentType: order.paymentMethod,
        status: order.statusLabel,
        paymentStatus: order.refundStatusLabel,
        category: order.source || "Website",
        date: order.createdAt,
        tabStatus: order.statusKey,
        totalAmount: order.totalAmount,
        shippingFee: 0,
        itemsCount: totalQuantity,
      };
    });
  }, [paginatedOrders]);

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
      title: "TT Hoàn tiền",
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

  // Handle view detail for OrderTable
  const handleOrderTableViewDetail = (
    orderId: string,
    _orderStatus: string,
    _orderSource: string
  ) => {
    const order = paginatedOrders.find(o => 
      o.returnOrderCode === orderId || o.orderCode === orderId
    );
    if (order) {
      handleViewDetail(order);
    }
  };

  return (
    <PageContainer className="flex flex-col gap-3 w-full max-w-full">
      <div className="flex flex-col gap-0 w-full">
        <PageHeader title="Trả hàng/Hoàn tiền/Huỷ" />

        <TabMenuWithBadge
          tabs={decoratedPrimaryTabs}
          activeTab={activePrimaryTab}
          onTabChange={(tabId) => setActivePrimaryTab(tabId as ReturnOrderCategory | "ALL")}
          className="min-w-[700px]"
        />

        <ContentCard>
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center min-h-[400px] w-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e04d30] mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải danh sách đơn trả hàng...</p>
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
                onClick={fetchReturnOrders}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Content when loaded successfully */}
          {!loading && !error && (
            <div className="flex flex-col gap-4 w-full">
              {/* Filters Section */}
              <div className="flex gap-[8px] items-center w-full flex-wrap">
                {/* Search Bar */}
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm mã đơn, ID khách hoặc tên sản phẩm..."
                  className="flex-1 min-w-0 max-w-[400px]"
                />

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

              {activePrimaryTab === "CANCEL" ? (
                <TabMenu
                  tabs={cancelSubTabs}
                  activeTab={activeCancelSubTab}
                  onTabChange={(tabId) => setActiveCancelSubTab(tabId as "ALL" | "PROCESSING" | "PROCESSED")}
                  variant="underline"
                  className="overflow-x-auto"
                />
              ) : (
                <TabMenu
                  tabs={
                    activePrimaryTab === "ALL" || activePrimaryTab === "FAILED"
                      ? [{ id: "ALL", label: "Tất cả" }]
                      : statusTabs
                  }
                  activeTab={activeStatusTab}
                  onTabChange={(tabId) => setActiveStatusTab(tabId as "ALL" | ReturnStatusFilter)}
                  variant="underline"
                  className="overflow-x-auto"
                />
              )}

              {/* Results summary */}
              {returnOrders.length > 0 && (
                <div className="text-sm text-gray-600 mb-2">
                  Hiển thị {returnOrders.length} kết quả trên trang {currentPage}/{totalPages}
                </div>
              )}

              {/* Empty state */}
              {returnOrders.length === 0 && !loading && !error && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Không tìm thấy đơn trả hàng nào
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc" : "Chưa có đơn trả hàng nào trong hệ thống"}
                  </p>
                </div>
              )}

              {/* Order Table */}
              {returnOrders.length > 0 && (
                <OrderTable
                  columns={orderTableColumns}
                  orders={transformedOrders}
                  onViewDetail={handleOrderTableViewDetail}
                  getPaymentTypeStatus={getPaymentTypeStatus}
                  getProcessingStatus={getProcessingStatus}
                  getPaymentStatus={getPaymentStatus}
                />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  current={currentPage}
                  total={totalPages}
                  onChange={setCurrentPage}
                />
              )}
            </div>
          )}
        </ContentCard>
      </div>
    </PageContainer>
  );
};

export default AdminOrderOtherStatus;