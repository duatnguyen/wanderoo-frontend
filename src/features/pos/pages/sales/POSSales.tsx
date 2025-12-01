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
  DraftOrderItemResponse,
} from "@/types/api";
import { Loader2 } from "lucide-react";

// Utility: tính đơn giá một item từ dữ liệu backend
const getUnitPrice = (item: DraftOrderItemResponse) => {
  if (item.quantity > 0 && item.amount) {
    return item.amount / item.quantity;
  }
  return item.discountedPrice ?? item.unitPrice ?? 0;
};

const POSPage: React.FC = () => {
  const {
    orders,
    setOrders,
    currentOrderId,
    setCurrentOrderId,
    setProductSelectHandler,
    setOrderHandlers,
  } = usePOSContext();
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

  const updateOrderDetailState = useCallback(
    (updater: (detail: DraftOrderDetailResponse) => DraftOrderDetailResponse) => {
      setOrderDetail((prev) => {
        if (!prev) return prev;
        return updater(prev);
      });
    },
    []
  );

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

      // Nếu backend đã có các hóa đơn chờ → map thành tabs
      if (draftOrders.length > 0) {
        const orderTabs = draftOrders.map((order: DraftOrderResponse, index: number) => ({
          id: order.id.toString(),
          label: `Đơn ${index + 1}`,
        }));

        const firstId = draftOrders[0]?.id ?? null;
        if (!firstId) {
          throw new Error("Không thể khởi tạo hóa đơn chờ");
        }

        setDraftOrderId(firstId);
        setOrders(orderTabs);
        setCurrentOrderId(firstId.toString());
        // Hiển thị layout ngay sau khi có tabs
        setIsLoading(false);
        // Load chi tiết đơn đầu tiên ở background, đồng thời hiển thị overlay nhẹ
        setIsRefreshing(true);
        try {
          await loadDraftOrderDetail(firstId);
        } finally {
          setIsRefreshing(false);
        }
        return;
      }

      // Không có hóa đơn chờ nào → tạo mới một hóa đơn và dùng ngay kết quả trả về
      try {
        const created = await createNewDraftOrder();
        const newOrder = created.data;
        const newOrderId = newOrder?.id ?? null;

        if (!newOrderId) {
          throw new Error("Không thể tạo hóa đơn chờ mới");
        }

        const orderTabs: { id: string; label: string }[] = [
          { id: newOrderId.toString(), label: "Đơn 1" },
        ];

        setOrders(orderTabs);
        setDraftOrderId(newOrderId);
        setCurrentOrderId(newOrderId.toString());
        setIsLoading(false);
        setIsRefreshing(true);
        try {
          await loadDraftOrderDetail(newOrderId);
        } finally {
          setIsRefreshing(false);
        }
      } catch (createErr: any) {
        const errorMessage = createErr?.response?.data?.message || createErr?.message;
        if (errorMessage?.includes("LIMIT_REACHED") || errorMessage?.includes("limit")) {
          setError(
            "Bạn đã đạt giới hạn 5 hóa đơn chờ. Vui lòng hoàn thành hoặc xóa một hóa đơn trước khi tạo mới."
          );
        } else {
          setError("Không thể tạo hóa đơn chờ mới. Vui lòng thử lại.");
        }
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải dữ liệu hóa đơn bán hàng"
      );
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
      // Kiểm tra có giảm giá không: có discountedPrice và nhỏ hơn originalPrice
      const hasDiscount = discountedPrice != null 
        && originalPrice != null
        && discountedPrice < originalPrice
        && Math.abs(discountedPrice - originalPrice) > 0.01; // Tránh sai số floating point
      
      const finalPrice = hasDiscount ? discountedPrice : originalPrice;
      
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

  const handleQuantityChange = useCallback(
    async (productId: string, quantity: number) => {
      if (!draftOrderId) return;
      const productDetailId = Number(productId);
      if (Number.isNaN(productDetailId)) return;
      const normalizedQuantity = Number.isFinite(quantity)
        ? Math.max(1, Math.floor(quantity))
        : 1;

      // Optimistic UI update
      updateOrderDetailState((detail) => {
        const items = detail.items.map((item) =>
          item.id === productDetailId
            ? {
                ...item,
                quantity: normalizedQuantity,
                amount: getUnitPrice(item) * normalizedQuantity,
              }
            : item
        );
        const totalProductPrice = items.reduce((sum, item) => sum + item.amount, 0);
        const totalOrderPrice = totalProductPrice - detail.orderDiscountAmount;

        return {
          ...detail,
          items,
          totalProductPrice,
          totalOrderPrice,
        };
      });

      try {
        await updateItemQuantity(draftOrderId, {
          productDetailId,
          quantity: normalizedQuantity,
        });
      } catch (err) {
        console.error("Không thể cập nhật số lượng", err);
        setError("Không thể cập nhật sản phẩm. Vui lòng thử lại.");
        void loadDraftOrderDetail(draftOrderId);
      }
    },
    [draftOrderId, loadDraftOrderDetail, updateOrderDetailState]
  );

  const handleRemove = useCallback(
    async (productId: string) => {
      if (!draftOrderId) return;
      const productDetailId = Number(productId);
      if (Number.isNaN(productDetailId)) return;

      // Optimistic UI update: remove item khỏi giỏ và cập nhật tổng tiền
      updateOrderDetailState((detail) => {
        const items = detail.items.filter((item) => item.id !== productDetailId);
        const totalProductPrice = items.reduce((sum, item) => sum + item.amount, 0);
        const totalOrderPrice = totalProductPrice - detail.orderDiscountAmount;

        return {
          ...detail,
          items,
          totalProductPrice,
          totalOrderPrice,
        };
      });

      try {
        await removeItemFromDraftOrder(draftOrderId, { productDetailId });
      } catch (err) {
        console.error("Không thể xóa sản phẩm", err);
        setError("Không thể xóa sản phẩm. Vui lòng thử lại.");
        void loadDraftOrderDetail(draftOrderId);
      }
    },
    [draftOrderId, loadDraftOrderDetail, updateOrderDetailState]
  );

  const handleNoteChange = (value: string) => {
    setNoteValue(value);
  };

  type ProductSelection = Parameters<POSProductSelectHandler>[0];

  const handleProductSelect = useCallback(
    async (product: ProductSelection) => {
      if (!draftOrderId) return;
      const productDetailId = Number(product.id);
      if (Number.isNaN(productDetailId)) return;

      // Optimistic: nếu sản phẩm đã có thì +1, nếu chưa có thì thêm dòng mới với dữ liệu tối thiểu
      updateOrderDetailState((detail) => {
        const existing = detail.items.find((item) => item.id === productDetailId);
        let items: DraftOrderItemResponse[];

        if (existing) {
          const newQuantity = existing.quantity + 1;
          const unitPrice = getUnitPrice(existing);
          items = detail.items.map((item) =>
            item.id === productDetailId
              ? { ...item, quantity: newQuantity, amount: unitPrice * newQuantity }
              : item
          );
        } else {
          const newItem: DraftOrderItemResponse = {
            id: productDetailId,
            imageUrl: product.imageUrl,
            productName: product.name,
            attributes: product.attributes ?? undefined,
            unitPrice: product.price,
            discountedPrice: product.price,
            quantity: 1,
            amount: product.price,
          };
          // Thêm sản phẩm mới lên đầu danh sách để luôn hiển thị sát ô tìm kiếm
          items = [newItem, ...detail.items];
        }

        const totalProductPrice = items.reduce((sum, item) => sum + item.amount, 0);
        const totalOrderPrice = totalProductPrice - detail.orderDiscountAmount;

        return {
          ...detail,
          items,
          totalProductPrice,
          totalOrderPrice,
        };
      });

      try {
        await addItemToOrder(draftOrderId, {
          productDetailId,
          quantity: 1,
        });
        setError(null);
      } catch (err) {
        console.error("Không thể thêm sản phẩm", err);
        setError("Không thể thêm sản phẩm vào hóa đơn. Vui lòng thử lại.");
        void loadDraftOrderDetail(draftOrderId);
      }
    },
    [draftOrderId, getUnitPrice, loadDraftOrderDetail, updateOrderDetailState]
  );

  const productSelectHandler = useCallback<POSProductSelectHandler>(
    (product) => {
      void handleProductSelect(product);
    },
    [handleProductSelect]
  );

  useEffect(() => {
    if (!draftOrderId) {
      setProductSelectHandler(null);
      return;
    }
    setProductSelectHandler(productSelectHandler);
    return () => setProductSelectHandler(null);
  }, [draftOrderId, productSelectHandler, setProductSelectHandler]);

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

        // Cập nhật tabs cục bộ, không reload toàn bộ từ server
        let remainingTabs: { id: string; label: string }[] = [];
        setOrders((prev) => {
          const filtered = prev.filter((tab) => tab.id !== orderId);
          const relabeled = filtered.map((tab, index) => ({
            ...tab,
            label: `Đơn ${index + 1}`,
          }));
          remainingTabs = relabeled;
          return relabeled;
        });

        // Xác định hóa đơn đang active sau khi xóa
        let nextActiveId: string | null = null;
        if (orderId === currentOrderId && remainingTabs.length > 0) {
          // Nếu xóa hóa đơn hiện tại → chọn tab đầu tiên trong danh sách mới
          nextActiveId = remainingTabs[0]?.id ?? null;
        } else {
          // Nếu xóa hóa đơn khác → giữ nguyên currentOrderId nếu vẫn còn
          const stillExists = remainingTabs.some((tab) => tab.id === currentOrderId);
          nextActiveId = stillExists
            ? currentOrderId
            : remainingTabs[0]?.id ?? null;
        }

        if (nextActiveId) {
          const nextIdNum = Number(nextActiveId);
          setDraftOrderId(nextIdNum);
          setCurrentOrderId(nextActiveId);
          await loadDraftOrderDetail(nextIdNum);
        } else {
          setDraftOrderId(null);
          setCurrentOrderId("");
        }

        setError(null);
      } catch (err) {
        console.error("Không thể xóa hóa đơn", err);
        setError("Không thể xóa hóa đơn. Vui lòng thử lại.");
      } finally {
        setIsRefreshing(false);
      }
    },
    [currentOrderId, loadDraftOrderDetail, orders, setOrders]
  );

  const handleOrderAdd = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const created = await createNewDraftOrder();
      const newOrder = created.data;
      const newOrderId = newOrder?.id;

      if (!newOrderId) {
        throw new Error("Không thể tạo hóa đơn mới");
      }

      // Cập nhật tabs cục bộ: thêm một tab mới ở cuối
      setOrders((prev) => {
        const nextIndex = prev.length + 1;
        return [
          ...prev,
          {
            id: newOrderId.toString(),
            label: `Đơn ${nextIndex}`,
          },
        ];
      });

      setDraftOrderId(newOrderId);
      setCurrentOrderId(newOrderId.toString());
      await loadDraftOrderDetail(newOrderId);
      setError(null);
    } catch (err: any) {
      console.error("Không thể tạo hóa đơn mới", err);
      const errorMessage = err?.response?.data?.message || err?.message;
      if (errorMessage?.includes("LIMIT_REACHED") || errorMessage?.includes("limit")) {
        setError(
          "Bạn đã đạt giới hạn 5 hóa đơn chờ. Vui lòng hoàn thành hoặc xóa một hóa đơn trước khi tạo mới."
        );
      } else {
        setError("Không thể tạo hóa đơn mới. Vui lòng thử lại.");
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [loadDraftOrderDetail, setOrders]);

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
