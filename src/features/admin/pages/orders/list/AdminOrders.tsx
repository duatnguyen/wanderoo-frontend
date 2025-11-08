// src/pages/admin/AdminOrders.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  ContentCard,
  PageHeader,
  TableFilters,
  OrderTable,
  TabMenuWithBadge,
  type FilterOption,
  type OrderTableColumn,
  type TabItemWithBadge,
} from "@/components/common";
import { Pagination } from "@/components/ui/pagination";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CaretDown } from "@/components/ui/caret-down";
// Mock data dựa trên hình ảnh
const mockOrders = [
  {
    id: "A122F23153",
    customer: "nguyenbh96",
    products: [
      {
        id: 1,
        name: "Áo thun cờ giấn thoáng khí Rockbros LKW008",
        price: "1.500.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
      {
        id: 2,
        name: "Áo thun đài tay nhanh khô Northshengwolf ch...",
        price: "850.000đ",
        quantity: 2,
        image: "/api/placeholder/50/50",
      },
      {
        id: 3,
        name: "Áo thun ngắn tay nam Gothiar Active",
        price: "650.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
      {
        id: 4,
        name: "Áo thun dài tay nam Gothiar Active",
        price: "750.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Tiền mặt",
    status: "Đã hoàn thành",
    paymentStatus: "Đã thanh toán",
    category: "POS",
    date: "2024-10-17",
    tabStatus: "completed",
  },
  {
    id: "ORD001",
    customer: "nguyenlan",
    products: [
      {
        id: 1,
        name: "Áo thun nữ cộc tay Jouthing Kill Producer LOVEGOS",
        price: "250.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Tiền mặt",
    status: "Chờ xác nhận",
    paymentStatus: "Chưa thanh toán",
    category: "Website",
    date: "2024-10-17",
    tabStatus: "pending",
  },
  {
    id: "ORD002",
    customer: "maianh",
    products: [
      {
        id: 1,
        name: "Áo thun đài tay nhanh Kid Northumberland",
        price: "180.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Chuyển khoản",
    status: "Đã xác nhận",
    paymentStatus: "Đã thanh toán",
    category: "Website",
    date: "2024-10-17",
    tabStatus: "confirmed",
  },
  {
    id: "ORD003",
    customer: "vanminh",
    products: [
      {
        id: 1,
        name: "Giày thể thao nữ chất liệu thoáng khí hiking",
        price: "450.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Chuyển khoản",
    status: "Đang giao",
    paymentStatus: "Đã thanh toán",
    category: "Website",
    date: "2024-10-16",
    tabStatus: "shipping",
  },
  {
    id: "ORD004",
    customer: "vanlinh",
    products: [
      {
        id: 1,
        name: "Áo hoodie ghi chữ Hip Hop crphone Vintage",
        price: "320.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Chuyển khoản",
    status: "Đã hoàn thành",
    paymentStatus: "Đã thanh toán",
    category: "POS",
    date: "2024-10-16",
    tabStatus: "completed",
  },
  {
    id: "ORD005",
    customer: "minhquan",
    products: [
      {
        id: 1,
        name: "Túi ba lô nam từ Canvas Performance Cross Series",
        price: "280.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Tiền mặt",
    status: "Đã hủy",
    paymentStatus: "Đã hoàn tiền",
    category: "Website",
    date: "2024-10-15",
    tabStatus: "returned",
  },
  {
    id: "ORD006",
    customer: "thanhha",
    products: [
      {
        id: 1,
        name: "Váy dài màu xanh vintage style",
        price: "350.000đ",
        quantity: 1,
        image: "/api/placeholder/50/50",
      },
    ],
    paymentType: "Tiền mặt",
    status: "Chờ xác nhận",
    paymentStatus: "Chưa thanh toán",
    category: "Website",
    date: "2024-10-15",
    tabStatus: "pending",
  },
];



const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Calculate order counts by status
  const orderCounts = useMemo(() => {
    const counts = {
      all: orders.length,
      pending: 0,
      confirmed: 0,
      shipping: 0,
      completed: 0,
      returned: 0,
    };

    orders.forEach(order => {
      counts[order.tabStatus as keyof typeof counts]++;
    });

    return counts;
  }, [orders]);

  // Create order tabs with counts
  const orderTabsWithCounts: TabItemWithBadge[] = useMemo(() => [
    { id: "all", label: "Tất cả", count: orderCounts.all },
    { id: "pending", label: "Chờ xác nhận", count: orderCounts.pending },
    { id: "confirmed", label: "Đã xác nhận", count: orderCounts.confirmed },
    { id: "shipping", label: "Đang giao", count: orderCounts.shipping },
    { id: "completed", label: "Đã hoàn thành", count: orderCounts.completed },
    { id: "returned", label: "Đã hủy", count: orderCounts.returned },
  ], [orderCounts]);

  // Map payment type to chip status
  const getPaymentTypeStatus = (paymentType: string): ChipStatusKey => {
    if (paymentType === "Tiền mặt") return "cash";
    if (paymentType === "Chuyển khoản") return "transfer";
    return "default";
  };

  // Map processing status to chip status
  const getProcessingStatus = (status: string): ChipStatusKey => {
    if (status === "Đã hoàn thành") return "completed";
    if (status === "Đang giao") return "shipping";
    if (status === "Chờ xác nhận") return "pending";
    if (status === "Đã xác nhận") return "confirmed";
    if (status === "Đã hủy") return "cancelled";
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
  const handleViewOrderDetail = (orderId: string, orderStatus: string, orderSource: string) => {
    navigate(`/admin/orders/${orderId}`, {
      state: { status: orderStatus, source: orderSource },
    });
  };

  // Filter orders by active tab, search term, and source
  const filteredOrders = useMemo(() => {
    const result = orders.filter((order) => {
      // Filter by tab
      const matchesTab = activeTab === "all" || order.tabStatus === activeTab;

      // Filter by search term - search in all products
      const matchesSearch =
        searchTerm === "" ||
        order.products.some((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by source
      const matchesSource =
        sourceFilter === "all" ||
        (sourceFilter === "website" &&
          (order.category.toLowerCase() === "website")) ||
        (sourceFilter === "pos" && order.category.toLowerCase() === "pos");

      return matchesTab && matchesSearch && matchesSource;
    });

    // Reset to page 1 when filters change
    if (currentPage > 1) {
      setCurrentPage(1);
    }
    return result;
  }, [orders, activeTab, searchTerm, sourceFilter, currentPage]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage]);

  // Filter options
  const statusFilterOptions: FilterOption[] = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "shipping", label: "Đang giao" },
    { value: "completed", label: "Đã hoàn thành" },
    { value: "returned", label: "Đã hủy" },
  ];

  const sourceFilterOptions: FilterOption[] = [
    { value: "all", label: "Tất cả" },
    { value: "website", label: "Website" },
    { value: "pos", label: "POS" },
  ];

  // Order table columns definition
  const orderTableColumns: OrderTableColumn[] = [
    {
      title: "Sản phẩm",
      width: "flex-1",
      minWidth: "min-w-[260px]",
      className: "justify-start",
    },
    {
      title: "Tổng tiền",
      width: "w-[140px]",
      minWidth: "min-w-[100px]",
      className: "justify-start",
    },
    {
      title: "Nguồn",
      width: "w-[80px]",
      minWidth: "min-w-[80px]",
      className: "justify-start",
    },
    {
      title: "Vận chuyển",
      width: "w-[100px]",
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
      width: "w-[140px]",
      minWidth: "min-w-[140px]",
      className: "justify-start",
    },
    {
      title: "Thao tác",
      width: "w-[100px]",
      minWidth: "min-w-[100px]",
      className: "justify-start",
    },
  ];

  return (
    <PageContainer>
      {/* Page Header with Order Count */}
      <PageHeader title="Danh sách đơn hàng" />

      {/* Tab Menu with Badge Counts */}
      <TabMenuWithBadge
        tabs={orderTabsWithCounts}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="min-w-[600px]"
      />

      {/* Content Card */}
      <ContentCard >
        {/* Filters Section */}
        <TableFilters
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Tìm kiếm"
          filterValue={activeTab}
          onFilterChange={setActiveTab}
          filterOptions={statusFilterOptions}
          filterLabel="Trạng thái"
          actions={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-white border-2 border-[#e04d30] flex gap-[6px] items-center justify-center px-[20px] py-[8px] rounded-[10px] cursor-pointer flex-shrink-0 whitespace-nowrap">
                  <span className="text-[#e04d30] text-[12px] font-semibold leading-[1.4]">
                    Nguồn đơn
                  </span>
                  <CaretDown className="text-[#e04d30]" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {sourceFilterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSourceFilter(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />

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
          total={Math.ceil(filteredOrders.length / 10)}
          onChange={setCurrentPage}
        />
      </ContentCard>
    </PageContainer>
  );
};

export default AdminOrders;
