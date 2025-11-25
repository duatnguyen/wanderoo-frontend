import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ReturnOrderSearchPanel, {
  type ReturnOrder,
} from "../../../../components/pos/ReturnOrderSearchPanel";
import ReturnOrderDetailsPanel, {
  type ReturnOrderDetails,
} from "../../../../components/pos/ReturnOrderDetailsPanel";
import SelectOrderModal from "../../../../components/pos/SelectOrderModal";
import {
  getPosReturnOrderList,
  getPosReturnOrderDetail,
} from "../../../../api/endpoints/posApi";
import Loading from "../../../../components/common/Loading";

const ReturnOrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedReturnOrderId, setSelectedReturnOrderId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSelectOrderModalOpen, setIsSelectOrderModalOpen] = useState(false);
  const pageSize = 10;

  // Fetch return orders list
  const {
    data: returnOrdersData,
    isLoading: isLoadingReturnOrders,
    error: returnOrdersError,
    refetch: refetchReturnOrders,
  } = useQuery({
    queryKey: ["posReturnOrders", searchValue, startDate, endDate, currentPage],
    queryFn: async () => {
      return await getPosReturnOrderList({
        search: searchValue || undefined,
        fromDate: startDate || undefined,
        toDate: endDate || undefined,
        page: currentPage - 1, // Backend uses 0-based pagination
        size: pageSize,
        sortBy: "createdAt,desc",
      });
    },
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  // Fetch return order detail
  const {
    data: returnOrderDetailData,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useQuery({
    queryKey: ["posReturnOrderDetail", selectedReturnOrderId],
    queryFn: async () => {
      if (!selectedReturnOrderId) return null;
      try {
        return await getPosReturnOrderDetail(selectedReturnOrderId);
      } catch (error: any) {
        console.error("Error fetching return order detail:", error);
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Không thể tải chi tiết đơn trả hàng"
        );
      }
    },
    enabled: !!selectedReturnOrderId,
    retry: 1,
  });

  // Auto-select first return order when orders are loaded
  useEffect(() => {
    if (
      returnOrdersData?.content &&
      returnOrdersData.content.length > 0 &&
      !selectedReturnOrderId
    ) {
      setSelectedReturnOrderId(returnOrdersData.content[0].id);
    }
  }, [returnOrdersData, selectedReturnOrderId]);

  // Convert API response to component types
  const dedupeVariantText = (...sources: (string | undefined)[]): string | undefined => {
    const parts = sources.flatMap((text) => {
      if (!text) return [];
      return text
        .split("/")
        .map((part) => part.trim())
        .filter(Boolean);
    });
    const unique = Array.from(new Set(parts));
    return unique.length ? unique.join(" / ") : undefined;
  };

  const normalizeProductInfo = (
    productName?: string,
    category?: string
  ): { name: string; variant?: string } => {
    if (!productName) {
      return { name: "Sản phẩm", variant: dedupeVariantText(category) };
    }

    const trimmed = productName.trim();
    // Case: name starts with "/" meaning only variant stored
    if (trimmed.startsWith("/")) {
      const variantText = trimmed.replace(/^\s*\/\s*/, "").replace(/\s*\/\s*$/, "");
      const variantClean = variantText.replace(/\s*\/\s*$/, "");
      return {
        name: "Sản phẩm",
        variant: dedupeVariantText(category, variantClean),
      };
    }

    const [baseName, ...rest] = trimmed.split(/\s+-\s+/);
    if (rest.length > 0) {
      const variantText = rest.join(" - ").replace(/^\s*\/\s*/, "").trim();
      const finalVariant = dedupeVariantText(category, variantText);
      return {
        name: baseName.trim(),
        variant: finalVariant,
      };
    }

    return {
      name: trimmed,
      variant: dedupeVariantText(category),
    };
  };

  const returnOrders: ReturnOrder[] =
    returnOrdersData?.content.map((order) => ({
      id: order.code || order.id.toString(),
      originalOrderId: order.originalOrderCode || "",
      status: getReturnStatusText(order.status, order.returnType),
      subStatus: getReturnSubStatusText(order.status),
      dateTime: order.createdAt,
      totalAmount: order.totalReturnAmount || 0,
    })) || [];

  const totalPages = returnOrdersData?.totalPages || 1;

  // Convert return order detail to component type
  const selectedReturnOrder: ReturnOrderDetails | undefined = returnOrderDetailData
    ? {
        id: returnOrderDetailData.code || returnOrderDetailData.id.toString(),
        originalOrderId: returnOrderDetailData.originalOrderCode || "",
        createdBy: returnOrderDetailData.createdBy || "N/A",
        createdAt: returnOrderDetailData.createdAt,
        customer: "---", // Backend doesn't provide customer info in return order
        note: returnOrderDetailData.notes || "",
        receivedProducts: returnOrderDetailData.returnProducts.map((product) => {
          const normalized = normalizeProductInfo(product.productName, product.category);
          return {
            product: {
              id: product.id.toString(),
              name: normalized.name,
              image: product.productImage,
              variant: normalized.variant,
              price: product.unitPrice || 0,
              quantity: product.returnQuantity || 0,
            },
            reason: getReturnReasonText(returnOrderDetailData.returnReason),
          };
        }),
        isReceived: returnOrderDetailData.status === "COMPLETED" || returnOrderDetailData.status === "PENDING",
        returnedSummary: {
          totalAmount: returnOrderDetailData.returnProducts.reduce(
            (sum, p) => sum + (p.unitPrice * p.returnQuantity || 0),
            0
          ),
          discount: 0, // Backend doesn't provide discount in return order
          totalReturnValue: returnOrderDetailData.totalReturnAmount || 0,
        },
        isReturned: returnOrderDetailData.status === "COMPLETED",
      }
    : undefined;

  // Helper functions to convert enums to text
  function getReturnStatusText(status: string, returnType?: string): string {
    // If status is COMPLETED, check returnType to show appropriate text
    if (status === "COMPLETED") {
      if (returnType === "PARTIAL") {
        return "Trả một phần";
      }
      return "Đã hoàn trả";
    }
    
    const statusMap: Record<string, string> = {
      PENDING: "Chờ xử lý",
      CANCELLED: "Đã hủy",
    };
    return statusMap[status] || status;
  }

  function getReturnSubStatusText(status: string): string {
    if (status === "COMPLETED") {
      return "Đã nhận hàng";
    }
    return "";
  }

  function getReturnReasonText(reason: string): string {
    const reasonMap: Record<string, string> = {
      PRODUCT_ERROR: "Sản phẩm lỗi",
      CUSTOMER_CHANGE_MIND: "Khách đổi ý",
    };
    return reasonMap[reason] || "Không xác định";
  }

  const handleCreateReturnOrder = () => {
    setIsSelectOrderModalOpen(true);
  };

  const handleSelectOrder = (orderId: string) => {
    // Navigate to create return order page with the selected order ID
    navigate(`/pos/returns/create/${orderId}`);
    setIsSelectOrderModalOpen(false);
  };

  const handleViewOriginalOrder = (orderId: string) => {
    // Navigate to order management page - could filter by order code
    navigate(`/pos/orders?search=${orderId}`);
  };

  const handleReturnOrderSelect = (returnOrderId: string) => {
    // Find the actual return order ID from the code
    const returnOrder = returnOrdersData?.content.find(
      (o) => (o.code || o.id.toString()) === returnOrderId
    );
    if (returnOrder) {
      setSelectedReturnOrderId(returnOrder.id);
    }
  };

  if (isLoadingReturnOrders && !returnOrdersData) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (returnOrdersError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Lỗi khi tải danh sách đơn trả hàng</p>
          <button
            onClick={() => refetchReturnOrders()}
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
      {/* Left Panel - Return Order Search and List */}
      <div className="w-[400px] border-r border-[#e7e7e7] flex-shrink-0">
        <ReturnOrderSearchPanel
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          returnOrders={returnOrders}
          selectedReturnOrderId={
            selectedReturnOrderId
              ? returnOrdersData?.content.find((o) => o.id === selectedReturnOrderId)?.code ||
                selectedReturnOrderId.toString()
              : undefined
          }
          onReturnOrderSelect={handleReturnOrderSelect}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onCreateReturnOrder={handleCreateReturnOrder}
        />
      </div>

      {/* Right Panel - Return Order Details */}
      <div className="flex-1 min-w-0">
        {isLoadingDetail ? (
          <div className="h-full flex items-center justify-center">
            <Loading />
          </div>
        ) : detailError ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-red-500 mb-2">Lỗi khi tải chi tiết đơn trả hàng</p>
              <p className="text-sm text-gray-500">
                {detailError instanceof Error
                  ? detailError.message
                  : "Vui lòng thử lại sau"}
              </p>
              <button
                onClick={() => {
                  if (selectedReturnOrderId) {
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
          <ReturnOrderDetailsPanel
            returnOrder={selectedReturnOrder}
            onViewOriginalOrder={handleViewOriginalOrder}
          />
        )}
      </div>

      {/* Select Order Modal */}
      <SelectOrderModal
        isOpen={isSelectOrderModalOpen}
        onClose={() => setIsSelectOrderModalOpen(false)}
        onSelectOrder={handleSelectOrder}
      />
    </div>
  );
};

export default ReturnOrderManagement;
