// src/pages/admin/AdminOrders.tsx
import { useState, useMemo, useEffect } from "react";
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
import { getAdminCustomerOrders } from "@/api/endpoints/orderApi";
import type { AdminOrderResponse } from "@/types";
import { toast } from "sonner";

const AdminOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<AdminOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const navigate = useNavigate();

  // Fetch orders from API
  const fetchOrders = async (page = 1, status?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: page - 1, // API uses 0-based pagination
        size: 10,
      };

      if (status && status !== 'all') {
        params.status = status;
      }

      const response = await getAdminCustomerOrders(params);

      // Debug logging to see the API response structure
      console.log('API Response:', response);
      console.log('Orders data:', response.data.orders);
      if (response.data.orders.length > 0) {
        console.log('First order items:', response.data.orders[0].items);
        if (response.data.orders[0].items?.length > 0) {
          console.log('First item variant attributes:', response.data.orders[0].items[0].snapshotVariantAttributes);
        }
      }

      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    const status = activeTab === 'all' ? undefined : activeTab;
    fetchOrders(currentPage, status);
  }, [activeTab, currentPage]);

  // Calculate order counts by status (this would ideally come from a separate API call)
  const orderCounts = useMemo(() => {
    // For now, we'll use placeholder counts since we don't have a summary API
    // In a real implementation, you'd call a separate endpoint for counts
    return {
      all: totalElements,
      pending: 0, // These would come from API
      confirmed: 0,
      shipping: 0,
      completed: 0,
      returned: 0,
    };
  }, [totalElements]);

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
    // Since we're already filtering by status in the API call,
    // we mainly need to handle search filtering on the client side
    const result = (orders || []).filter((order) => {
      // Search term filtering - search in order ID, customer name, phone
      const matchesSearch =
        searchTerm === "" ||
        String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.code && order.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        String(order.userId).toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    return result;
  }, [orders, searchTerm]);

  // Transform API response to match OrderTable component expectations
  const transformedOrders = useMemo(() => {
    return (filteredOrders || []).map((order) => ({
      id: String(order.id),
      customer: order.code || `User ID: ${order.userId}`,
      products: order.items?.map((item, index) => {
        // Format product name with variant attributes if available
        let displayName = item.snapshotProductName || 'N/A';

        // If we have variant attributes, show them in a more readable format
        if (item.snapshotVariantAttributes && item.snapshotVariantAttributes.length > 0) {
          const variantText = item.snapshotVariantAttributes
            .sort((a, b) => a.groupLevel - b.groupLevel)
            .map(attr => attr.value)
            .join(' / ');

          // If the product name doesn't already contain variant info, add it
          if (!displayName.includes('/')) {
            displayName = `${displayName} / ${variantText}`;
          }
        }

        return {
          id: item.id || index,
          name: displayName,
          price: `${item.snapshotProductPrice?.toLocaleString('vi-VN')}₫` || 'N/A',
          quantity: item.quantity,
          image: '', // No image data available from API
          variantAttributes: item.snapshotVariantAttributes?.map(attr => ({
            groupName: attr.name,
            value: attr.value,
            groupLevel: attr.groupLevel
          })) || []
        };
      }) || [],
      paymentType: order.method === 'CASH' ? 'Tiền mặt' : order.method === 'TRANSFER' ? 'Chuyển khoản' : 'N/A',
      status: order.status || "N/A",
      paymentStatus: order.paymentStatus || "N/A",
      category: order.source || "Website",
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') + ' ' + new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : "N/A",
      tabStatus: order.status?.toLowerCase() || "pending",
      totalAmount: order.totalOrderPrice || 0,
      shippingFee: order.shippingFee || 0,
      orderCode: order.code,
      itemsCount: order.items?.length || 0,
    }));
  }, [filteredOrders]);

  // No need for client-side pagination since API already does it
  const paginatedOrders = transformedOrders;

  // Filter options
  const statusFilterOptions: FilterOption[] = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "shipping", label: "Đang giao" },
    { value: "completed", label: "Đã hoàn thành" },
    { value: "returned", label: "Đã hủy" },
  ];

  // Order table columns definition
  const orderTableColumns: OrderTableColumn[] = [
    {
      title: "Đơn hàng",
      width: "flex-1",
      minWidth: "min-w-[300px]",
      className: "justify-start",
    },
    {
      title: "Tổng tiền",
      width: "w-[130px]",
      minWidth: "min-w-[120px]",
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
      width: "w-[145px]",
      minWidth: "min-w-[140px]",
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
        title={`Danh sách đơn hàng${totalElements > 0 ? ` (${totalElements.toLocaleString('vi-VN')} đơn)` : ''}`}
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
          <div className="flex items-center justify-center py-12">
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
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Không thể tải dữ liệu</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchOrders(currentPage, activeTab === 'all' ? undefined : activeTab)}
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
            <TableFilters
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Tìm kiếm mã đơn hàng, ID khách hàng..."
              filterValue={activeTab}
              onFilterChange={setActiveTab}
              filterOptions={statusFilterOptions}
              filterLabel="Trạng thái"
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
