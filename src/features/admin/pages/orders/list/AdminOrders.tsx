// src/pages/admin/AdminOrders.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  TabMenuAccount,
  PageContainer,
  ContentCard,
  PageHeader,
  TableFilters,
  OrderTableHeader,
  OrderTableRow,
  type FilterOption,
  type OrderTableColumn,
} from "@/components/common";
import type { TabItem } from "@/components/ui/tab-menu-account";
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

// Order tabs data
const orderTabs: TabItem[] = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "confirmed", label: "Đã xác nhận" },
  { id: "shipping", label: "Đang giao" },
  { id: "completed", label: "Đã hoàn thành" },
  { id: "returned", label: "Đã hủy" },
];

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

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
  const handleViewOrderDetail = (
    orderId: string,
    orderStatus: string,
    orderSource: string
  ) => {
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
          order.category.toLowerCase() === "website") ||
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
      title: "Tên sản phẩm",
      width: "w-2/5",
      minWidth: "min-w-80",
      className: "",
    },
    {
      title: "Tổng đơn",
      width: "w-1/10",
      minWidth: "min-w-24",
    },
    {
      title: "Nguồn",
      width: "w-1/10",
      minWidth: "min-w-20",
    },
    {
      title: "ĐVVC",
      width: "w-1/12",
      minWidth: "min-w-16",
    },
    {
      title: "Xử lý",
      width: "w-1/6",
      minWidth: "min-w-28",
    },
    {
      title: "Thanh toán",
      width: "w-1/6",
      minWidth: "min-w-28",
    },
    {
      title: "Thao tác",
      width: "w-1/8",
      minWidth: "min-w-20",
    },
  ];

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader title="Danh sách đơn hàng" />

      {/* Tab Menu */}
      <div className="w-full shrink-0 mb-[10px] overflow-x-auto">
        <TabMenuAccount
          tabs={orderTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="min-w-[600px]"
        />
      </div>

      {/* Content Card */}
      <ContentCard className="bg-white border border-[#b0b0b0] flex flex-col gap-[16px] items-start px-[10px] md:px-[16px] lg:px-[24px] py-[16px] md:py-[24px] rounded-[8px] w-full">
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

        <h1 className="font-bold text-[20px] mb-0">101 đơn hàng</h1>
        {/* Order Table */}
        <div className="w-full gap-2 flex flex-col -mt-[4px] overflow-x-auto">
          {/* Table Header */}
          <OrderTableHeader columns={orderTableColumns} />

          {/* Table Body */}
          <div className="w-full min-w-[1200px]">
            <div className="flex flex-col gap-[12px] w-full">
              {paginatedOrders.map((order) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  onViewDetail={handleViewOrderDetail}
                  getPaymentTypeStatus={getPaymentTypeStatus}
                  getProcessingStatus={getProcessingStatus}
                  getPaymentStatus={getPaymentStatus}
                />
              ))}
            </div>
          </div>
        </div>

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
