import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
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
import { getImageUrl } from "../../../../utils/imageUtils";

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
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const addingProductRef = useRef<string | null>(null);
  // Lưu đơn giá cố định cho từng item trong đơn nháp để không đổi khi tăng/giảm số lượng
  const [lockedUnitPrices, setLockedUnitPrices] = useState<Record<string, number>>({});

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

      // Nếu backend đã có các hóa đơn chờ → chỉ dùng hóa đơn đầu tiên để khởi tạo UI
      if (draftOrders.length > 0) {
        const firstOrder = draftOrders[0] as DraftOrderResponse | undefined;
        const firstId = firstOrder?.id ?? null;
        if (!firstId) {
          throw new Error("Không thể khởi tạo hóa đơn chờ");
        }

        // Chỉ hiển thị một tab duy nhất tương ứng với hóa đơn đầu tiên
        const orderTabs: { id: string; label: string }[] = [
          { id: firstId.toString(), label: "Đơn 1" },
        ];

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

  // Đồng bộ lockedUnitPrices từ dữ liệu backend (chỉ thiết lập lần đầu cho mỗi item)
  useEffect(() => {
    if (!orderDetail?.items) return;

    setLockedUnitPrices((prev) => {
      const next = { ...prev };
      let changed = false;

      const currentIds = new Set<string>();
      for (const item of orderDetail.items) {
        const id = item.id.toString();
        currentIds.add(id);
        if (next[id] == null) {
          next[id] = getUnitPrice(item);
          changed = true;
        }
      }

      // Xóa những id không còn trong đơn
      Object.keys(next).forEach((id) => {
        if (!currentIds.has(id)) {
          delete next[id];
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [orderDetail]);

  // Convert order items to products - giữ nguyên thứ tự từ backend, không sort
  // Đơn giá hiển thị được cố định theo lần đầu item xuất hiện (lockedUnitPrices)
  const products: POSProduct[] = useMemo(() => {
    if (!orderDetail) return [];
    // Giữ nguyên thứ tự items từ backend (theo thời gian thêm vào)
    return orderDetail.items.map((item) => {
      // BE luôn trả:
      // - unitPrice: giá gốc
      // - discountedPrice: giá sau khi đã áp dụng tất cả discount SẢN PHẨM (nếu có),
      //   còn nếu không có product-discount thì discountedPrice == unitPrice.
      const originalPrice = item.unitPrice ?? 0;
      const id = item.id.toString();
      const lockedPrice = lockedUnitPrices[id] ?? getUnitPrice(item);

      // Chỉ coi là "có giảm giá" khi đơn giá cố định < giá gốc một cách đáng kể
      const hasDiscount =
        lockedPrice != null &&
        originalPrice != null &&
        lockedPrice < originalPrice &&
        Math.abs(lockedPrice - originalPrice) > 0.01;

      // Process image URL - convert relative paths to full URLs
      const processedImageUrl = item.imageUrl
        ? (getImageUrl(item.imageUrl) || item.imageUrl)
        : undefined;

      return {
        id,
        name: item.productName,
        image: processedImageUrl,
        variant: item.attributes,
        // Đơn giá hiển thị cố định, không đổi khi tăng/giảm số lượng
        price: lockedPrice ?? originalPrice ?? 0,
        // Giá gốc chỉ hiển thị gạch ngang khi thực sự có giảm
        originalPrice: hasDiscount ? originalPrice ?? undefined : undefined,
        quantity: item.quantity,
      };
    });
  }, [orderDetail, lockedUnitPrices]);

  // Tính lại tổng tiền từ item hiển thị để tránh lệch so với BE (khi giá/đơn nháp cũ)
  const totalAmount = useMemo(() => {
    if (!orderDetail) return 0;
    return orderDetail.items.reduce((sum, item) => {
      const id = item.id?.toString() ?? "";
      const lockedPrice = lockedUnitPrices[id] ?? getUnitPrice(item);
      return sum + lockedPrice * item.quantity;
    }, 0);
  }, [orderDetail, lockedUnitPrices]);

  // Giảm giá chỉ áp dụng khi còn sản phẩm trong giỏ
  const orderDiscount = useMemo(() => {
    const hasItems = (orderDetail?.items?.length ?? 0) > 0;
    if (!hasItems) return 0;
    return orderDetail?.orderDiscountAmount ?? 0;
  }, [orderDetail?.items?.length, orderDetail?.orderDiscountAmount]);

  // Khách phải trả = tổng tiền hàng - giảm giá đơn (không âm)
  const finalAmount = useMemo(() => {
    const amount = totalAmount - orderDiscount;
    return amount > 0 ? amount : 0;
  }, [orderDiscount, totalAmount]);
  const employee = orderDetail?.employeeName ?? "Vũ Hữu Quân";

  const handleQuantityChange = useCallback(
    async (productId: string, quantity: number) => {
      if (!draftOrderId) {
        setError("Không tìm thấy hóa đơn để cập nhật số lượng");
        return;
      }

      const productDetailId = Number(productId);
      if (Number.isNaN(productDetailId)) {
        setError("ID sản phẩm không hợp lệ");
        return;
      }

      // Validate và normalize quantity
      let normalizedQuantity: number;
      if (!Number.isFinite(quantity) || quantity < 0) {
        normalizedQuantity = 1;
      } else {
        normalizedQuantity = Math.max(1, Math.floor(quantity));
      }

      // Tìm item hiện tại để kiểm tra
      const currentItem = orderDetail?.items.find((item) => item.id === productDetailId);
      if (!currentItem) {
        setError("Không tìm thấy sản phẩm trong đơn hàng");
        return;
      }

      // Nếu số lượng không thay đổi, không cần update
      if (currentItem.quantity === normalizedQuantity) {
        return;
      }

      // Kiểm tra nếu số lượng tăng (cần kiểm tra stock)
      const quantityDifference = normalizedQuantity - currentItem.quantity;
      if (quantityDifference > 0) {
        // Số lượng tăng - cần kiểm tra stock trước
        // Backend sẽ kiểm tra stock, nhưng có thể hiển thị warning nếu cần
        // Tạm thời để backend xử lý validation
      }

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
        const totalOrderPrice = totalProductPrice - (detail.orderDiscountAmount ?? 0);

        return {
          ...detail,
          items,
          totalProductPrice,
          totalOrderPrice,
        };
      });

      try {
        setIsRefreshing(true);
        setError(null);

        // Gọi API để update quantity - backend sẽ kiểm tra stock
        const response = await updateItemQuantity(draftOrderId, {
          productDetailId,
          quantity: normalizedQuantity,
        });

        // Cập nhật state trực tiếp từ response để tránh phải gọi thêm GET request
        if (response.data) {
          setOrderDetail(response.data);
          setNoteValue(response.data.notes ?? "");
          setNoteSyncedValue(response.data.notes ?? "");
        } else {
          // Fallback: reload nếu response không có data
          await loadDraftOrderDetail(draftOrderId);
        }
        setError(null);
      } catch (err: any) {
        console.error("Không thể cập nhật số lượng", err);

        // Parse error message từ backend
        let errorMessage = "Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại.";

        if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.message) {
          errorMessage = err.message;
        } else if (err?.response?.status === 400) {
          // Kiểm tra nếu lỗi liên quan đến stock
          const backendMessage = err?.response?.data?.message || "";
          if (backendMessage.includes("không đủ") ||
            backendMessage.includes("hết hàng") ||
            backendMessage.includes("có thể bán")) {
            errorMessage = backendMessage;
          } else {
            errorMessage = "Số lượng không hợp lệ hoặc vượt quá số lượng có thể bán.";
          }
        } else if (err?.response?.status === 500) {
          errorMessage = "Lỗi server khi cập nhật số lượng. Vui lòng thử lại sau.";
        }

        setError(errorMessage);

        // Revert optimistic update bằng cách reload từ backend
        try {
          await loadDraftOrderDetail(draftOrderId);
        } catch (reloadErr) {
          console.error("Không thể reload order detail sau khi cập nhật số lượng thất bại", reloadErr);
        }
      } finally {
        setIsRefreshing(false);
      }
    },
    [draftOrderId, orderDetail, loadDraftOrderDetail, updateOrderDetailState]
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
        // Reload lại từ BE ở background để có giá discount mới
        void loadDraftOrderDetail(draftOrderId);
        setError(null);
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
      if (!draftOrderId || !orderDetail) return;
      const productDetailId = Number(product.id);
      if (Number.isNaN(productDetailId)) return;

      // Check số lượng có thể bán trước khi thêm
      if (product.available != null && product.available <= 0) {
        setError("Sản phẩm này đã hết hàng. Không thể thêm vào giỏ hàng.");
        return;
      }

      // Debounce: Tránh click nhanh nhiều lần cùng một sản phẩm
      const productKey = `${productDetailId}`;
      if (addingProductRef.current === productKey || isAddingProduct) {
        return;
      }

      // Kiểm tra xem sản phẩm đã có trong giỏ chưa (để tăng số lượng thay vì thêm mới)
      const existingItem = orderDetail.items.find(
        (item) => item.id === productDetailId
      );

      // Optimistic UI update: Cập nhật UI ngay lập tức
      const tempItemId = existingItem ? existingItem.id : -Date.now(); // Sử dụng số âm làm temp ID
      const optimisticPrice = product.price;
      const optimisticQuantity = existingItem ? existingItem.quantity + 1 : 1;
      const optimisticAmount = optimisticPrice * optimisticQuantity;

      // Lưu state gốc để có thể revert nếu có lỗi
      const previousOrderDetail = orderDetail;

      // Cập nhật optimistic state
      setIsAddingProduct(true);
      addingProductRef.current = productKey;

      updateOrderDetailState((detail) => {
        if (existingItem) {
          // Tăng số lượng sản phẩm đã có
          const updatedItems = detail.items.map((item) =>
            item.id === productDetailId
              ? {
                ...item,
                quantity: item.quantity + 1,
                amount: getUnitPrice(item) * (item.quantity + 1),
              }
              : item
          );
          const totalProductPrice = updatedItems.reduce(
            (sum, item) => sum + item.amount,
            0
          );
          const totalOrderPrice =
            totalProductPrice - detail.orderDiscountAmount;

          return {
            ...detail,
            items: updatedItems,
            totalProductPrice,
            totalOrderPrice,
          };
        } else {
          // Thêm sản phẩm mới với dữ liệu tạm
          // Process image URL for optimistic update
          const processedImageUrl = product.imageUrl
            ? (getImageUrl(product.imageUrl) || product.imageUrl)
            : undefined;

          const tempItem: DraftOrderItemResponse = {
            id: tempItemId, // Sử dụng số âm làm temp ID
            productName: product.name,
            imageUrl: processedImageUrl,
            attributes: product.attributes ?? undefined,
            unitPrice: optimisticPrice,
            discountedPrice: optimisticPrice,
            quantity: 1,
            amount: optimisticAmount,
          };
          const updatedItems = [...detail.items, tempItem];
          const totalProductPrice = updatedItems.reduce(
            (sum, item) => sum + item.amount,
            0
          );
          const totalOrderPrice =
            totalProductPrice - detail.orderDiscountAmount;

          return {
            ...detail,
            items: updatedItems,
            totalProductPrice,
            totalOrderPrice,
          };
        }
      });

      try {
        const response = await addItemToOrder(draftOrderId, {
          productDetailId,
          quantity: 1,
        });
        // BE trả về DraftOrderDetailResponse đầy đủ → cập nhật trực tiếp state,
        // tránh phải gọi thêm 1 request GET chi tiết đơn nên nhanh hơn.
        const detail = response.data;
        if (detail) {
          setOrderDetail(detail);
          setNoteValue(detail.notes ?? "");
          setNoteSyncedValue(detail.notes ?? "");
        } else {
          // Fallback trong trường hợp BE không trả data (phòng hờ)
          void loadDraftOrderDetail(draftOrderId);
        }
        setError(null);
      } catch (err) {
        console.error("Không thể thêm sản phẩm", err);
        // Revert optimistic update nếu có lỗi
        setOrderDetail(previousOrderDetail);
        setError("Không thể thêm sản phẩm vào hóa đơn. Vui lòng thử lại.");
        // Reload để đảm bảo sync với backend
        void loadDraftOrderDetail(draftOrderId);
      } finally {
        setIsAddingProduct(false);
        addingProductRef.current = null;
      }
    },
    [draftOrderId, orderDetail, isAddingProduct, loadDraftOrderDetail, updateOrderDetailState]
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
      setError("Không tìm thấy hóa đơn để áp dụng voucher");
      return;
    }

    try {
      setIsRefreshing(true);
      setError(null);

      if (voucherId) {
        const discountId = Number(voucherId);
        if (Number.isNaN(discountId) || discountId <= 0) {
          throw new Error("Mã voucher không hợp lệ");
        }

        // Apply voucher - API trả về DraftOrderDetailResponse đầy đủ
        const response = await applyVoucherToOrder(draftOrderId, discountId);

        // Cập nhật state trực tiếp từ response để tránh phải gọi thêm GET request
        if (response.data) {
          setOrderDetail(response.data);
          setNoteValue(response.data.notes ?? "");
          setNoteSyncedValue(response.data.notes ?? "");
        } else {
          // Fallback: reload nếu response không có data
          await loadDraftOrderDetail(draftOrderId);
        }
      } else {
        // Remove voucher - API trả về DraftOrderDetailResponse đầy đủ
        const response = await removeVoucherFromOrder(draftOrderId);

        // Cập nhật state trực tiếp từ response
        if (response.data) {
          setOrderDetail(response.data);
          setNoteValue(response.data.notes ?? "");
          setNoteSyncedValue(response.data.notes ?? "");
        } else {
          // Fallback: reload nếu response không có data
          await loadDraftOrderDetail(draftOrderId);
        }
      }

      setError(null);
    } catch (err: any) {
      console.error("Không thể áp dụng voucher", err);

      // Parse error message từ backend
      let errorMessage = "Không thể áp dụng voucher. Vui lòng thử lại.";

      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.status === 400) {
        errorMessage = "Mã voucher không hợp lệ hoặc không thể áp dụng cho đơn hàng này.";
      } else if (err?.response?.status === 404) {
        errorMessage = "Không tìm thấy mã voucher.";
      } else if (err?.response?.status === 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau.";
      }

      setError(errorMessage);

      // Reload order detail để đảm bảo sync với backend
      try {
        await loadDraftOrderDetail(draftOrderId);
      } catch (reloadErr) {
        console.error("Không thể reload order detail sau khi áp dụng voucher thất bại", reloadErr);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [draftOrderId, loadDraftOrderDetail]);

  const handleCheckout = useCallback(
    async (data: { paymentMethod: "cash" | "vnpay"; amountPaid: number }) => {
      if (!draftOrderId) {
        throw new Error("Không tìm thấy hóa đơn để thanh toán");
      }
      try {
        setIsRefreshing(true);

        // Với yêu cầu mới: cả Tiền mặt và VNPay đều checkout ngay,
        // chỉ khác nhau ở method lưu trong DB (CASH / BANKING)
        await checkoutOrder(draftOrderId, {
          cashReceived: data.amountPaid,
          method: data.paymentMethod === "vnpay" ? "BANKING" : "CASH",
        });
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
            isRefreshing={isRefreshing}
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
            orderDiscountAmount={orderDiscount}
            productCount={orderDetail?.items?.length ?? 0}
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
