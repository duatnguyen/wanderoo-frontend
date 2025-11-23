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
import type { OrderTab } from "../../../../components/pos/POSOrderTabs";
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
import type {
  CustomerSearchResponse,
  DraftOrderDetailResponse,
} from "@/types/api";
import { Loader2 } from "lucide-react";

const POSPage: React.FC = () => {
  const { 
    setOrders, 
    setCurrentOrderId, 
    setProductSelectHandler, 
    setAddOrderHandler,
    currentOrderId: contextCurrentOrderId 
  } = usePOSContext();
  const [draftOrderId, setDraftOrderId] = useState<number | null>(null);
  const [orderDetail, setOrderDetail] = useState<DraftOrderDetailResponse | null>(
    null
  );
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
      // Lấy tất cả đơn nháp hiện có (tối đa 5)
      const draftOrders = await getOrCreateDraftOrders();
      
      if (Array.isArray(draftOrders) && draftOrders.length > 0) {
        // Chuyển đổi danh sách đơn nháp thành tabs với số thứ tự (1, 2, 3, 4, 5)
        const orderTabs: OrderTab[] = draftOrders.map((order, index) => ({
          id: order.id.toString(),
          label: `Đơn ${index + 1}`, // Đánh số theo thứ tự: Đơn 1, Đơn 2, Đơn 3, Đơn 4, Đơn 5
        }));
        
        setOrders(orderTabs);
        
        // Chọn đơn đầu tiên làm đơn hiện tại
        const firstOrderId = draftOrders[0].id;
        setDraftOrderId(firstOrderId);
        setCurrentOrderId(firstOrderId.toString());
        await loadDraftOrderDetail(firstOrderId);
      } else {
        // Nếu không có đơn nháp nào, tạo mới
        const created = await createNewDraftOrder();
        const newOrderId = created.data?.id;
        
        if (!newOrderId) {
          throw new Error("Không thể tạo hóa đơn chờ mới");
        }
        
        setDraftOrderId(newOrderId);
        setOrders([{ id: newOrderId.toString(), label: `Đơn 1` }]);
        setCurrentOrderId(newOrderId.toString());
        await loadDraftOrderDetail(newOrderId);
      }
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

  // Xử lý khi chuyển đổi giữa các đơn hàng
  useEffect(() => {
    if (!contextCurrentOrderId) return;
    
    const orderId = Number(contextCurrentOrderId);
    if (Number.isNaN(orderId)) return;
    
    // Nếu đơn hàng hiện tại khác với đơn hàng đang load
    if (draftOrderId !== orderId) {
      setDraftOrderId(orderId);
      void loadDraftOrderDetail(orderId);
    }
  }, [contextCurrentOrderId, draftOrderId, loadDraftOrderDetail]);

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
        throw (err instanceof Error ? err : new Error("Không thể gán khách hàng"));
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

  const handleAddNewOrder = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      // Gọi API tạo hóa đơn nháp mới
      console.log("Đang tạo hóa đơn nháp mới...");
      const created = await createNewDraftOrder();
      console.log("Response từ createNewDraftOrder:", created);
      
      // Kiểm tra response structure
      if (!created) {
        throw new Error("API không trả về dữ liệu");
      }
      
      // Lấy orderId từ response
      // Có thể là created.data.id hoặc created.data?.id tùy vào structure
      const newOrderId = created.data?.id || created.data?.data?.id;
      
      if (!newOrderId) {
        console.error("Response không có orderId:", created);
        throw new Error("Không thể lấy ID hóa đơn từ response");
      }

      console.log("Đã tạo hóa đơn mới với ID:", newOrderId);

      // Tải chi tiết hóa đơn mới
      const detail = await getDraftOrderDetail(newOrderId);
      
      // Cập nhật state
      setDraftOrderId(newOrderId);
      
      // Thêm tab mới vào danh sách với số thứ tự đúng
      // Đánh số lại tất cả các tab: Đơn 1, Đơn 2, Đơn 3, Đơn 4, Đơn 5
      setOrders((prev) => {
        const newTabs = [...prev, { id: newOrderId.toString(), label: "" }];
        // Đánh số lại tất cả các tab theo thứ tự
        return newTabs.map((tab, index) => ({
          ...tab,
          label: `Đơn ${index + 1}`,
        }));
      });
      setCurrentOrderId(newOrderId.toString());
      
      // Load chi tiết đơn hàng mới
      await loadDraftOrderDetail(newOrderId);
      
      console.log("Đã tạo và load hóa đơn mới thành công");
    } catch (err) {
      console.error("Lỗi khi tạo hóa đơn mới:", err);
      
      // Xử lý lỗi chi tiết hơn
      let errorMessage = "Không thể tạo hóa đơn mới. Vui lòng thử lại.";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // Kiểm tra nếu có response từ API
        const apiError = err as any;
        if (apiError?.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError?.message) {
          errorMessage = apiError.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  }, [setOrders, setCurrentOrderId, loadDraftOrderDetail]);

  // Đăng ký handler vào context
  useEffect(() => {
    setAddOrderHandler(() => handleAddNewOrder);
    return () => setAddOrderHandler(null);
  }, [handleAddNewOrder, setAddOrderHandler]);

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
