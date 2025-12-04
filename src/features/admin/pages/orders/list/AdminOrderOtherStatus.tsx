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

type ReturnOrderCategory = "RETURN" | "CANCEL" | "FAILED";
type ReturnOrderStatus = "UNDER_REVIEW" | "RETURNING" | "COMPLETED" | "INVALID";
type ReturnStatusFilter = ReturnOrderStatus | "DELIVERED";
type RefundStatus = "WAITING" | "PARTIAL" | "DONE";

interface ReturnOrder {
  id: string;
  orderCode: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerUsername: string;
  productName: string;
  productVariant?: string;
  productImage?: string;
  totalAmount: number;
  paymentMethod: string;
  reason: string;
  buyerOptions: string[];
  statusLabel: string;
  statusKey: ReturnOrderStatus;
  resolutionNote: string;
  forwardShippingStatus: string;
  returnShippingStatus: string;
  refundStatus: RefundStatus;
  refundStatusLabel: string;
  source: "Website" | "POS";
  category: ReturnOrderCategory;
  sourceNote?: string;
}

const mockReturnOrders: ReturnOrder[] = [
  {
    id: "RET-202411-001",
    orderCode: "WEB-0001",
    createdAt: "25/11/2025 13:01",
    customerId: "KH-002845",
    customerName: "Nguyễn Thảo",
    customerUsername: "nguyenthao",
    productName: "Áo khoác trekking nữ Wander Shield",
    productVariant: "Màu xanh ngọc · Size M",
    totalAmount: 1890000,
    paymentMethod: "Tiền mặt",
    reason: "Lý do trả hàng: Màu sắc thực tế không đúng như mô tả",
    buyerOptions: [
      "Trả hàng & hoàn tiền",
      "Hoàn tiền ngay khi xác nhận",
    ],
    statusLabel: "Đang chờ xét duyệt",
    statusKey: "UNDER_REVIEW",
    resolutionNote: "Đã hoàn tiền tạm giữ cho người mua",
    forwardShippingStatus: "Đã hoàn thành",
    returnShippingStatus: "Chờ lấy hàng",
    refundStatus: "WAITING",
    refundStatusLabel: "Chưa hoàn tiền",
    source: "Website",
    category: "RETURN",
    sourceNote: "Tạo từ Website · Ưu tiên đồng bộ kho",
  },
  {
    id: "RET-202411-002",
    orderCode: "POS-1205",
    createdAt: "24/11/2025 18:30",
    customerId: "KH-001523",
    customerName: "Trần Đăng",
    customerUsername: "trandangk",
    productName: "Giày leo núi Nam Summit Pro",
    productVariant: "Màu đen · Size 41",
    totalAmount: 2350000,
    paymentMethod: "Tiền mặt",
    reason: "Lý do trả hàng: Bị rộng, khách muốn đổi size khác",
    buyerOptions: [
      "Trả hàng & hoàn tiền",
    ],
    statusLabel: "Đang trả hàng",
    statusKey: "RETURNING",
    resolutionNote: "Có 1 phương án do người mua chọn: Trả hàng & hoàn tiền",
    forwardShippingStatus: "Với ở POS sẽ luôn đã hoàn thành",
    returnShippingStatus: "Đang giao",
    refundStatus: "PARTIAL",
    refundStatusLabel: "Đã hoàn tiền 1 phần",
    source: "Website",
    category: "RETURN",
    sourceNote: "Tạo từ POS · Giao cùng ngày",
  },
];

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
    return mockReturnOrders.reduce(
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
  }, []);

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

  const filteredOrders = useMemo(() => {
    return mockReturnOrders.filter((order) => {
      const matchPrimary =
        activePrimaryTab === "ALL" || order.category === activePrimaryTab;

      let matchStatus = true;
      if (activePrimaryTab === "CANCEL") {
        const isCashCancel = order.paymentMethod === "Tiền mặt";
        if (activeCancelSubTab === "PROCESSING") {
          matchStatus = !isCashCancel && order.statusKey !== "COMPLETED";
        } else if (activeCancelSubTab === "PROCESSED") {
          matchStatus = isCashCancel || order.statusKey === "COMPLETED";
        } else {
          matchStatus = true;
        }
      } else if (activePrimaryTab === "FAILED") {
        matchStatus = true;
      } else {
        if (activeStatusTab === "ALL") {
          matchStatus = true;
        } else if (activeStatusTab === "DELIVERED") {
          matchStatus =
            order.orderCode !== "WEB-0042" &&
            order.orderCode !== "POS-2211" &&
            order.returnShippingStatus.trim().startsWith("Đã");
        } else if (activeStatusTab === "RETURNING") {
          matchStatus = order.statusKey === "RETURNING" && order.orderCode !== "WEB-0043";
        } else {
          matchStatus = order.statusKey === activeStatusTab;
        }
      }

      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchSearch =
        normalizedSearch.length === 0 ||
        order.orderCode.toLowerCase().includes(normalizedSearch) ||
        order.customerId.toLowerCase().includes(normalizedSearch) ||
        order.customerName.toLowerCase().includes(normalizedSearch) ||
        order.productName.toLowerCase().includes(normalizedSearch);

      return matchPrimary && matchStatus && matchSearch;
    });
  }, [
    activePrimaryTab,
    activeStatusTab,
    activeCancelSubTab,
    activeFailedSubTab,
    searchTerm,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Payment method filter options
  const paymentMethodOptions = [
    { value: "ALL", label: "Tất cả phương thức" },
    { value: "CASH", label: "Tiền mặt" },
    { value: "BANKING", label: "Chuyển khoản" },
  ];

  const getPaymentMethodFilterLabel = (value: string) => {
    return paymentMethodOptions.find((opt) => opt.value === value)?.label || "Tất cả phương thức";
  };

  // Simulate async data fetching
  const fetchReturnOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching return orders:", err);
      setError("Không thể tải danh sách đơn trả hàng. Vui lòng thử lại.");
      toast.error("Không thể tải danh sách đơn trả hàng");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturnOrders();
  }, [fetchReturnOrders, activePrimaryTab, activeStatusTab, activeCancelSubTab, paymentMethodFilter, dateRange]);

  const handleViewDetail = (order: ReturnOrder) => {
    navigate(`/admin/orders/${order.orderCode}`, {
      state: {
        fakeOrder: order,
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

  // Transform ReturnOrder data to match OrderTable interface
  const transformedOrders = useMemo(() => {
    return paginatedOrders.map((order) => ({
      id: order.orderCode,
      customer: {
        name: order.customerName,
        username: order.customerUsername,
        image: order.productImage || "",
        orderCode: order.orderCode,
      },
      products: [{
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
      }],
      paymentType: order.paymentMethod,
      status: order.statusLabel,
      paymentStatus: order.refundStatusLabel,
      category: order.source,
      date: order.createdAt,
      tabStatus: order.statusKey,
      totalAmount: order.totalAmount,
      shippingFee: 0,
      itemsCount: 1,
    }));
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
    orderStatus: string,
    orderSource: string
  ) => {
    const order = paginatedOrders.find(o => o.orderCode === orderId);
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

              {/* Order Table */}
              <OrderTable
                columns={orderTableColumns}
                orders={transformedOrders}
                onViewDetail={handleOrderTableViewDetail}
                getPaymentTypeStatus={getPaymentTypeStatus}
                getProcessingStatus={getProcessingStatus}
                getPaymentStatus={getPaymentStatus}
              />

              <Pagination
                current={currentPage}
                total={totalPages}
                onChange={setCurrentPage}
              />
            </div>
          )}
        </ContentCard>
      </div>
    </PageContainer>
  );
};

export default AdminOrderOtherStatus;