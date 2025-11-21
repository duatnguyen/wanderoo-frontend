import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  POSProductList,
  type POSProduct,
} from "../../../../components/pos/POSProductList";
import { POSOrderSummary } from "../../../../components/pos/POSOrderSummary";
import { POSFooter } from "../../../../components/pos/POSFooter";
import { usePOSContext } from "../../../../context/POSContext";
import {
  addItemToOrder,
  assignCustomerToOrder,
  checkoutOrder,
  createNewDraftOrder,
  getDraftOrderDetail,
  getOrCreateDraftOrders,
  removeCustomerFromOrder,
  removeItemFromDraftOrder,
  updateItemQuantity,
  updateOrderNote,
} from "@/api/endpoints/saleApi";
import type { CustomerSearchResponse, DraftOrderDetailResponse } from "@/types";
import { Loader2 } from "lucide-react";

const POSPage: React.FC = () => {
  const { setOrders, setCurrentOrderId, setProductSelectHandler } =
    usePOSContext();
  const [draftOrderId, setDraftOrderId] = useState<number | null>(null);
  const [orderDetail, setOrderDetail] =
    useState<DraftOrderDetailResponse | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [noteValue, setNoteValue] = useState("");
  const [noteSyncedValue, setNoteSyncedValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDraftOrderDetail = useCallback(async (orderId: number) => {
    const detail = await getDraftOrderDetail(orderId);
    setOrderDetail(detail);
    setNoteValue(detail.notes ?? "");
    setNoteSyncedValue(detail.notes ?? "");
    setCustomerSearch(detail.customerName ?? "");
    setError(null);
  }, []);

  const initializeDraftOrder = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const draftOrders = await getOrCreateDraftOrders();
      let orderId: number | null = null;
      if (Array.isArray(draftOrders) && draftOrders.length > 0) {
        orderId = draftOrders[0]?.id ?? null;
      }
      if (!orderId) {
        const created = await createNewDraftOrder();
        orderId = created.data?.id ?? null;
        if (!orderId) {
          const refreshed = await getOrCreateDraftOrders();
          if (Array.isArray(refreshed) && refreshed.length > 0) {
            orderId = refreshed[0]?.id ?? null;
          }
        }
      }
      if (!orderId) {
        throw new Error("Không thể khởi tạo hóa đơn chờ");
      }
      setDraftOrderId(orderId);
      setOrders([{ id: orderId.toString(), label: "Hóa đơn chờ" }]);
      setCurrentOrderId(orderId.toString());
      await loadDraftOrderDetail(orderId);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải dữ liệu hóa đơn bán hàng"
      );
    } finally {
      setIsLoading(false);
    }
  }, [loadDraftOrderDetail, setCurrentOrderId, setOrders]);

  useEffect(() => {
    void initializeDraftOrder();
  }, [initializeDraftOrder]);

  useEffect(() => {
    if (!draftOrderId) return;
    if (noteValue === noteSyncedValue) return;

    const handler = window.setTimeout(async () => {
      try {
        await updateOrderNote(draftOrderId, { note: noteValue });
        setNoteSyncedValue(noteValue);
      } catch (err) {
        console.error("Không thể cập nhật ghi chú", err);
      }
    }, 600);

    return () => clearTimeout(handler);
  }, [draftOrderId, noteValue, noteSyncedValue]);

  const products: POSProduct[] = useMemo(() => {
    if (!orderDetail) return [];
    return orderDetail.items.map((item) => ({
      id: item.id.toString(),
      name: item.productName,
      image: item.imageUrl,
      variant: item.attributes,
      price: item.unitPrice,
      quantity: item.quantity,
    }));
  }, [orderDetail]);

  const totalAmount = orderDetail?.totalProductPrice ?? 0;
  const discount =
    (orderDetail?.orderDiscountAmount ?? 0) +
    (orderDetail?.productDiscountAmount ?? 0);
  const finalAmount = orderDetail?.totalOrderPrice ?? totalAmount - discount;
  const employee = orderDetail?.employeeName ?? "Vũ Hữu Quân";

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (!draftOrderId) return;
    const productDetailId = Number(productId);
    if (Number.isNaN(productDetailId)) return;

    try {
      setIsRefreshing(true);
      if (quantity <= 0) {
        await removeItemFromDraftOrder(draftOrderId, { productDetailId });
      } else {
        await updateItemQuantity(draftOrderId, {
          productDetailId,
          quantity,
        });
      }
      await loadDraftOrderDetail(draftOrderId);
    } catch (err) {
      console.error("Không thể cập nhật số lượng", err);
      setError("Không thể cập nhật sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRemove = async (productId: string) => {
    if (!draftOrderId) return;
    const productDetailId = Number(productId);
    if (Number.isNaN(productDetailId)) return;
    try {
      setIsRefreshing(true);
      await removeItemFromDraftOrder(draftOrderId, { productDetailId });
      await loadDraftOrderDetail(draftOrderId);
    } catch (err) {
      console.error("Không thể xóa sản phẩm", err);
      setError("Không thể xóa sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNoteChange = (value: string) => {
    setNoteValue(value);
  };

  const handleProductSelect = useCallback(
    async (product: { id: string }) => {
      if (!draftOrderId) return;
      const productDetailId = Number(product.id);
      if (Number.isNaN(productDetailId)) return;

      try {
        setIsRefreshing(true);
        await addItemToOrder(draftOrderId, {
          productDetailId,
          quantity: 1,
        });
        await loadDraftOrderDetail(draftOrderId);
        setError(null);
      } catch (err) {
        console.error("Không thể thêm sản phẩm", err);
        setError("Không thể thêm sản phẩm vào hóa đơn. Vui lòng thử lại.");
      } finally {
        setIsRefreshing(false);
      }
    },
    [draftOrderId, loadDraftOrderDetail]
  );

  useEffect(() => {
    if (!draftOrderId) {
      setProductSelectHandler(null);
      return;
    }
    const handler = (product: { id: string }) => {
      void handleProductSelect(product);
    };
    setProductSelectHandler(handler);
    return () => setProductSelectHandler(null);
  }, [draftOrderId, handleProductSelect, setProductSelectHandler]);

  const handleAssignCustomer = useCallback(
    async (customer: CustomerSearchResponse) => {
      if (!draftOrderId) {
        throw new Error("Không tìm thấy hóa đơn để gán khách hàng");
      }
      try {
        setIsRefreshing(true);
        await assignCustomerToOrder(draftOrderId, { customerId: customer.id });
        await loadDraftOrderDetail(draftOrderId);
        setError(null);
      } catch (err) {
        console.error("Không thể gán khách hàng", err);
        setError("Không thể gán khách hàng. Vui lòng thử lại.");
        throw err instanceof Error
          ? err
          : new Error("Không thể gán khách hàng");
      } finally {
        setIsRefreshing(false);
      }
    },
    [draftOrderId, loadDraftOrderDetail]
  );

  const handleClearAssignedCustomer = useCallback(async () => {
    if (!draftOrderId) {
      return;
    }
    try {
      setIsRefreshing(true);
      await removeCustomerFromOrder(draftOrderId);
      await loadDraftOrderDetail(draftOrderId);
      setCustomerSearch("");
      setError(null);
    } catch (err) {
      console.error("Không thể gỡ khách hàng", err);
      setError("Không thể gỡ khách hàng khỏi hóa đơn. Vui lòng thử lại.");
    } finally {
      setIsRefreshing(false);
    }
  }, [draftOrderId, loadDraftOrderDetail]);

  const handleCheckout = useCallback(
    async (data: {
      paymentMethod: "cash" | "transfer";
      amountPaid: number;
    }) => {
      if (!draftOrderId) {
        throw new Error("Không tìm thấy hóa đơn để thanh toán");
      }
      try {
        setIsRefreshing(true);
        await checkoutOrder(draftOrderId, { cashReceived: data.amountPaid });
        setError(null);
        await initializeDraftOrder();
      } catch (err) {
        console.error("Không thể thanh toán", err);
        const message =
          err instanceof Error
            ? err.message
            : "Không thể thanh toán đơn hàng. Vui lòng thử lại.";
        setError(message);
        throw err instanceof Error ? err : new Error(message);
      } finally {
        setIsRefreshing(false);
      }
    },
    [draftOrderId, initializeDraftOrder]
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#18345C]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Đang tải dữ liệu bán hàng...</span>
        </div>
      </div>
    );
  }

  if (error && !orderDetail) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-[#e04d30] font-semibold">{error}</p>
        <button
          onClick={() => void initializeDraftOrder()}
          className="px-4 py-2 bg-[#18345C] text-white rounded-lg"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {error && orderDetail && (
        <div className="px-4 py-2 bg-red-50 text-red-600 text-sm text-center">
          {error}
        </div>
      )}
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-5 h-5 animate-spin text-[#e04d30]" />
        </div>
      )}
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Product List with Footer - Left Side */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <POSProductList
            products={products}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
            className="flex-1"
          />
          {/* Footer */}
          <POSFooter
            note={noteValue}
            onNoteChange={handleNoteChange}
            employee={employee}
            className="flex-shrink-0"
          />
        </div>

        {/* Order Summary - Fixed on Right Side */}
        <div className="hidden lg:flex flex-shrink-0">
          <POSOrderSummary
            customerSearch={customerSearch}
            onCustomerSearchChange={setCustomerSearch}
            totalAmount={totalAmount}
            discount={discount}
            finalAmount={finalAmount}
            onCheckout={handleCheckout}
            assignedCustomer={{
              name: orderDetail?.customerName,
              phone: orderDetail?.customerPhone,
            }}
            onAssignCustomer={handleAssignCustomer}
            onClearAssignedCustomer={handleClearAssignedCustomer}
          />
        </div>
      </div>
    </div>
  );
};

export default POSPage;
