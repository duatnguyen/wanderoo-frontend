import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import OrderSearchPanel, {
  type Order,
} from "../../../../components/pos/OrderSearchPanel";
import OrderDetailsPanel, {
  type OrderDetails,
} from "../../../../components/pos/OrderDetailsPanel";
import { getPosOrderList, getPosOrderDetail } from "../../../../api/endpoints/posApi";
import Loading from "../../../../components/common/Loading";

const OrderManagement: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch orders list (backend already filters PAID orders only)
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["posOrders", searchValue, startDate, endDate, currentPage],
    queryFn: async () => {
      return await getPosOrderList({
        search: searchValue || undefined,
        fromDate: startDate || undefined,
        toDate: endDate || undefined,
        page: currentPage - 1, // Backend uses 0-based pagination
        size: pageSize,
        sort: "createdAt,desc",
      });
    },
  });

  // Fetch order detail
  const {
    data: orderDetailData,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useQuery({
    queryKey: ["posOrderDetail", selectedOrderId],
    queryFn: async () => {
      if (!selectedOrderId) return null;
      try {
        return await getPosOrderDetail(selectedOrderId);
      } catch (error: any) {
        console.error("Error fetching order detail:", error);
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Không thể tải chi tiết đơn hàng"
        );
      }
    },
    enabled: !!selectedOrderId,
    retry: 1,
  });

  // Auto-select first order when orders are loaded
  useEffect(() => {
    if (ordersData?.content && ordersData.content.length > 0 && !selectedOrderId) {
      const firstOrder = ordersData.content[0];
      setSelectedOrderId(firstOrder.id);
    }
  }, [ordersData, selectedOrderId]);

  // Convert API response to component types
  const orders: Order[] =
    ordersData?.content.map((order) => ({
      id: order.code || order.id.toString(), // Use code if available, fallback to id
      totalAmount: order.totalOrderPrice || 0,
      dateTime: order.createdAt,
      status: getPaymentStatusText(order.paymentStatus),
    })) || [];

  const totalPages = ordersData?.totalPages || 1;

  // Convert order detail to component type
  const selectedOrder: OrderDetails | undefined = orderDetailData
    ? {
        id: orderDetailData.code || orderDetailData.id.toString(), // Use code if available
        createdBy: orderDetailData.createdBy || "N/A",
        createdAt: orderDetailData.createdAt,
        products: orderDetailData.products.map((product) => ({
          id: product.id.toString(),
          name: product.productName,
          image: product.productImage,
          variant: product.category,
          price: product.unitPrice || 0,
          quantity: product.quantity || 0,
        })),
        totalAmount: orderDetailData.paymentSummary?.totalProductPrice || 0,
        discount: orderDetailData.paymentSummary?.discountAmount || 0,
        finalAmount: orderDetailData.paymentSummary?.totalOrderPrice || 0,
        amountPaid: orderDetailData.paymentSummary?.cashReceived || 0,
        change: orderDetailData.paymentSummary?.change || 0,
      }
    : undefined;

  // Helper function to convert payment status
  function getPaymentStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      PAID: "Đã thanh toán",
      UNPAID: "Chưa thanh toán",
      PARTIAL: "Thanh toán một phần",
      REFUNDED: "Đã hoàn tiền",
    };
    return statusMap[status] || status;
  }

  const handleExchange = () => {
    console.log("Exchange order:", selectedOrderId);
    // TODO: Implement exchange order functionality
  };

  const handlePrintInvoice = () => {
    console.log("Print invoice for order:", selectedOrderId);
    // TODO: Implement print invoice functionality
  };

  const handleOrderSelect = (orderId: string) => {
    // Find the actual order ID from the code
    const order = ordersData?.content.find(
      (o) => (o.code || o.id.toString()) === orderId
    );
    if (order) {
      setSelectedOrderId(order.id);
    }
  };

  if (isLoadingOrders && !ordersData) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Lỗi khi tải danh sách đơn hàng</p>
          <button
            onClick={() => refetchOrders()}
            className="px-4 py-2 bg-[#e04d30] text-white rounded hover:bg-[#d04327]"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Panel - Order Search and List */}
      <div className="w-[400px] border-r border-[#e7e7e7] flex-shrink-0">
        <OrderSearchPanel
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          orders={orders}
          selectedOrderId={
            selectedOrderId
              ? ordersData?.content.find((o) => o.id === selectedOrderId)?.code ||
                selectedOrderId.toString()
              : undefined
          }
          onOrderSelect={handleOrderSelect}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Right Panel - Order Details */}
      <div className="flex-1 min-w-0">
        {isLoadingDetail ? (
          <div className="h-full flex items-center justify-center">
            <Loading />
          </div>
        ) : detailError ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-red-500 mb-2">Lỗi khi tải chi tiết đơn hàng</p>
              <p className="text-sm text-gray-500">
                {detailError instanceof Error
                  ? detailError.message
                  : "Vui lòng thử lại sau"}
              </p>
              <button
                onClick={() => {
                  if (selectedOrderId) {
                    // Retry query by refetching
                    window.location.reload();
                  }
                }}
                className="mt-4 px-4 py-2 bg-[#e04d30] text-white rounded hover:bg-[#d04327] text-sm"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : (
          <OrderDetailsPanel
            order={selectedOrder}
            onExchange={handleExchange}
            onPrintInvoice={handlePrintInvoice}
          />
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
