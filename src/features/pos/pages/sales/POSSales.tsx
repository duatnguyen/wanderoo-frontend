import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  POSProductList,
  type POSProduct,
} from "../../../../components/pos/POSProductList";
import { POSOrderSummary } from "../../../../components/pos/POSOrderSummary";
import { POSFooter } from "../../../../components/pos/POSFooter";
import {
  usePOSContext,
  type POSProductSelectHandler,
} from "../../../../context/POSContext";
import {
  addItemToOrder,
  applyVoucherToOrder,
  checkoutOrder,
  createNewDraftOrder,
  deleteDraftOrder,
  getDraftOrderDetail,
  getOrCreateDraftOrders,
  removeCustomerFromOrder,
  removeItemFromDraftOrder,
  removeVoucherFromOrder,
  updateItemQuantity,
  updateOrderNote,
} from "@/api/endpoints/saleApi";
import type {
  DraftOrderDetailResponse,
  DraftOrderResponse,
} from "@/types/api";
import { Loader2 } from "lucide-react";

const POSPage: React.FC = () => {
  const { orders, setOrders, setCurrentOrderId, setProductSelectHandler, setOrderHandlers } =
    usePOSContext();
  const [draftOrderId, setDraftOrderId] = useState<number | null>(null);
  const [orderDetail, setOrderDetail] = useState<DraftOrderDetailResponse | null>(
    null
  );
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
    setError(null);
  }, []);

  const loadAllDraftOrders = useCallback(async () => {
    try {
      const draftOrders = await getOrCreateDraftOrders();
      return draftOrders;
    } catch (err) {
      console.error("Không thể tải danh sách hóa đơn chờ:", err);
      throw err;
    }
  }, []);

  const initializeDraftOrder = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const draftOrders = await loadAllDraftOrders();
      
      // Chuyển đổi draft orders thành format cho tabs
      const orderTabs = draftOrders.map((order: DraftOrderResponse, index: number) => ({
        id: order.id.toString(),
        label: `Đơn ${index + 1}`,
      }));

      let orderId: number | null = null;
      if (draftOrders.length > 0) {
        orderId = draftOrders[0]?.id ?? null;
      } else {
        // Nếu không có draft order nào, tạo mới
        try {
          const created = await createNewDraftOrder();
          orderId = created.data?.id ?? null;
          if (orderId) {
            // Reload danh sách sau khi tạo mới
            const refreshed = await loadAllDraftOrders();
            const refreshedTabs = refreshed.map((order: DraftOrderResponse, index: number) => ({
              id: order.id.toString(),
              label: `Đơn ${index + 1}`,
            }));
            setOrders(refreshedTabs);
            setCurrentOrderId(orderId.toString());
            setDraftOrderId(orderId);
            await loadDraftOrderDetail(orderId);
            setIsLoading(false);
            return;
          }
        } catch (createErr: any) {
          const errorMessage = createErr?.response?.data?.message || createErr?.message;
          if (errorMessage?.includes("LIMIT_REACHED") || errorMessage?.includes("limit")) {
            setError("Bạn đã đạt giới hạn 5 hóa đơn chờ. Vui lòng hoàn thành hoặc xóa một hóa đơn trước khi tạo mới.");
          } else {
            setError("Không thể tạo hóa đơn chờ mới. Vui lòng thử lại.");
          }
          setIsLoading(false);
          return;
        }
      }

      if (!orderId) {
        throw new Error("Không thể khởi tạo hóa đơn chờ");
      }

      setDraftOrderId(orderId);
      setOrders(orderTabs);
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
  }, [loadDraftOrderDetail, loadAllDraftOrders, setCurrentOrderId, setOrders]);

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
    return orderDetail.items.map((item) => {
      // Lấy giá sau giảm (nếu có) hoặc giá gốc
      const discountedPrice = item.discountedPrice;
      const originalPrice = item.unitPrice;
      
      // Debug log
      console.log('Product item:', {
        name: item.productName,
        unitPrice: originalPrice,
        discountedPrice: discountedPrice,
        hasDiscountedPrice: discountedPrice != null,
      });
      
      // Kiểm tra có giảm giá không: có discountedPrice và nhỏ hơn originalPrice
      const hasDiscount = discountedPrice != null 
        && originalPrice != null
        && discountedPrice < originalPrice
        && Math.abs(discountedPrice - originalPrice) > 0.01; // Tránh sai số floating point
      
      const finalPrice = hasDiscount ? discountedPrice : originalPrice;
      
      console.log('Product mapping:', {
        name: item.productName,
        hasDiscount,
        originalPrice,
        finalPrice,
      });
      
      return {
        id: item.id.toString(),
        name: item.productName,
        image: item.imageUrl,
        variant: item.attributes,
        price: finalPrice ?? 0, // Giá sau giảm (hiển thị chính)
        originalPrice: hasDiscount ? originalPrice : undefined, // Giá gốc (hiển thị gạch ngang nếu có giảm)
        quantity: item.quantity,
      };
    });
  }, [orderDetail]);

  // Tổng tiền hàng = tổng giá sau giảm (vì đã giảm ở từng sản phẩm)
  const totalAmount = orderDetail?.totalProductPrice ?? 0;
  // Khách phải trả = tổng tiền hàng (không có discount riêng nữa)
  const finalAmount = orderDetail?.totalOrderPrice ?? totalAmount;
  const employee = orderDetail?.employeeName ?? "Vũ Hữu Quân";

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (!draftOrderId) return;
    const productDetailId = Number(productId);
    if (Number.isNaN(productDetailId)) return;
    const normalizedQuantity = Number.isFinite(quantity)
      ? Math.max(1, Math.floor(quantity))
      : 1;

    try {
      setIsRefreshing(true);
      await updateItemQuantity(draftOrderId, {
        productDetailId,
        quantity: normalizedQuantity,
      });
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

  type ProductSelection = Parameters<POSProductSelectHandler>[0];

  const handleProductSelect = useCallback(
    async (product: ProductSelection) => {
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
    const handler: POSProductSelectHandler = (product) => {
      void handleProductSelect(product);
    };
    setProductSelectHandler(handler);
    return () => setProductSelectHandler(null);
  }, [draftOrderId, handleProductSelect, setProductSelectHandler]);

  const handleClearAssignedCustomer = useCallback(async () => {
    if (!draftOrderId) {
      return;
    }
    try {
      setIsRefreshing(true);
      await removeCustomerFromOrder(draftOrderId);
      await loadDraftOrderDetail(draftOrderId);
      setError(null);
    } catch (err) {
      console.error("Không thể gỡ khách hàng", err);
      setError("Không thể gỡ khách hàng khỏi hóa đơn. Vui lòng thử lại.");
    } finally {
      setIsRefreshing(false);
    }
  }, [draftOrderId, loadDraftOrderDetail]);

  const handleApplyVoucher = useCallback(async (voucherId: string | null) => {
    if (!draftOrderId) {
      return;
    }
    try {
      setIsRefreshing(true);
      if (voucherId) {
        const discountId = Number(voucherId);
        if (Number.isNaN(discountId)) {
          throw new Error("Mã voucher không hợp lệ");
        }
        await applyVoucherToOrder(draftOrderId, discountId);
      } else {
        await removeVoucherFromOrder(draftOrderId);
      }
      await loadDraftOrderDetail(draftOrderId);
      setError(null);
    } catch (err: any) {
      console.error("Không thể áp dụng voucher", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Không thể áp dụng voucher. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  }, [draftOrderId, loadDraftOrderDetail]);

  const handleCheckout = useCallback(
    async (data: { paymentMethod: "cash" | "transfer"; amountPaid: number }) => {
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
        throw (err instanceof Error ? err : new Error(message));
      } finally {
        setIsRefreshing(false);
      }
    },
    [draftOrderId, initializeDraftOrder]
  );

  const handleOrderSelect = useCallback(
    async (orderId: string) => {
      const numOrderId = Number(orderId);
      if (Number.isNaN(numOrderId)) return;

      try {
        setIsRefreshing(true);
        setCurrentOrderId(orderId);
        setDraftOrderId(numOrderId);
        await loadDraftOrderDetail(numOrderId);
      } catch (err) {
        console.error("Không thể chuyển đổi hóa đơn", err);
        setError("Không thể tải chi tiết hóa đơn. Vui lòng thử lại.");
      } finally {
        setIsRefreshing(false);
      }
    },
    [loadDraftOrderDetail, setCurrentOrderId]
  );

  const handleOrderClose = useCallback(
    async (orderId: string) => {
      const numOrderId = Number(orderId);
      if (Number.isNaN(numOrderId)) return;

      // Không cho phép xóa nếu chỉ còn 1 hóa đơn
      if (orders.length <= 1) {
        setError("Không thể xóa hóa đơn cuối cùng. Vui lòng tạo hóa đơn mới trước.");
        return;
      }

      try {
        setIsRefreshing(true);
        await deleteDraftOrder(numOrderId);

        // Nếu đang xóa hóa đơn hiện tại, chuyển sang hóa đơn khác
        if (numOrderId === draftOrderId) {
          const refreshed = await loadAllDraftOrders();
          if (refreshed.length > 0) {
            const newOrderId = refreshed[0]?.id;
            if (newOrderId) {
              setDraftOrderId(newOrderId);
              setCurrentOrderId(newOrderId.toString());
              await loadDraftOrderDetail(newOrderId);
            }
          }
        }

        // Reload danh sách tabs
        const refreshed = await loadAllDraftOrders();
        const refreshedTabs = refreshed.map((order: DraftOrderResponse, index: number) => ({
          id: order.id.toString(),
          label: `Đơn ${index + 1}`,
        }));
        setOrders(refreshedTabs);
        setError(null);
      } catch (err) {
        console.error("Không thể xóa hóa đơn", err);
        setError("Không thể xóa hóa đơn. Vui lòng thử lại.");
      } finally {
        setIsRefreshing(false);
      }
    },
    [draftOrderId, orders, loadAllDraftOrders, loadDraftOrderDetail, setCurrentOrderId, setOrders]
  );

  const handleOrderAdd = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const created = await createNewDraftOrder();
      const newOrderId = created.data?.id;
      
      if (!newOrderId) {
        throw new Error("Không thể tạo hóa đơn mới");
      }

      // Reload danh sách và chuyển sang hóa đơn mới
      const refreshed = await loadAllDraftOrders();
      const refreshedTabs = refreshed.map((order: DraftOrderResponse, index: number) => ({
        id: order.id.toString(),
        label: `Đơn ${index + 1}`,
      }));
      
      setOrders(refreshedTabs);
      setDraftOrderId(newOrderId);
      setCurrentOrderId(newOrderId.toString());
      await loadDraftOrderDetail(newOrderId);
      setError(null);
    } catch (err: any) {
      console.error("Không thể tạo hóa đơn mới", err);
      const errorMessage = err?.response?.data?.message || err?.message;
      if (errorMessage?.includes("LIMIT_REACHED") || errorMessage?.includes("limit")) {
        setError("Bạn đã đạt giới hạn 5 hóa đơn chờ. Vui lòng hoàn thành hoặc xóa một hóa đơn trước khi tạo mới.");
      } else {
        setError("Không thể tạo hóa đơn mới. Vui lòng thử lại.");
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [loadAllDraftOrders, loadDraftOrderDetail, setCurrentOrderId, setOrders]);

  // Đăng ký handlers với context để POSLayout có thể sử dụng
  useEffect(() => {
    setOrderHandlers({
      onOrderAdd: handleOrderAdd,
      onOrderClose: handleOrderClose,
      onOrderSelect: handleOrderSelect,
    });

    return () => {
      setOrderHandlers({});
    };
  }, [handleOrderAdd, handleOrderClose, handleOrderSelect, setOrderHandlers]);

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
            totalAmount={totalAmount}
            finalAmount={finalAmount}
            orderDiscountAmount={orderDetail?.orderDiscountAmount ?? 0}
            onCheckout={handleCheckout}
            assignedCustomer={{
              name: orderDetail?.customerName,
              phone: orderDetail?.customerPhone,
            }}
            onClearAssignedCustomer={handleClearAssignedCustomer}
            onApplyVoucher={handleApplyVoucher}
            draftOrderId={draftOrderId}
          />
        </div>
      </div>
    </div>
  );
};

export default POSPage;
