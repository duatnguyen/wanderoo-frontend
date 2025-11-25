import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimpleDropdown } from "@/components/ui/SimpleDropdown";
import type { POSProduct } from "../../../../components/pos/POSProductList";
import {
  getPosOrderDetail,
  createPosReturnOrder,
  type ReturnTypeEnum,
  type ReturnReasonEnum,
} from "../../../../api/endpoints/posApi";
import Loading from "../../../../components/common/Loading";

const CreateReturnOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: orderDetailData,
    isLoading: isLoadingOrder,
    error: orderError,
  } = useQuery({
    queryKey: ["posOrderDetail", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      return await getPosOrderDetail(Number(orderId));
    },
    enabled: !!orderId,
  });

  const [returnProducts, setReturnProducts] = useState<
    Array<{
      product: POSProduct;
      orderDetailId: number;
      returnQuantity: number;
      reason: ReturnReasonEnum;
    }>
  >([]);

  const [note, setNote] = useState("");
  const [refundMethod, setRefundMethod] = useState("Chuyển khoản");
  const [refundAmount, setRefundAmount] = useState(0);

  useEffect(() => {
    if (orderDetailData?.products) {
      setReturnProducts(
        orderDetailData.products.map((product) => ({
          product: {
            id: product.id.toString(),
            name: product.productName,
            image: product.productImage,
            variant: product.category,
            price: product.unitPrice || 0,
            quantity: product.quantity || 0,
          },
          orderDetailId: product.id,
          returnQuantity: product.quantity || 0,
          reason: "CUSTOMER_CHANGE_MIND",
        }))
      );
    }
  }, [orderDetailData]);

  const returnReasons: Array<{ value: ReturnReasonEnum; label: string }> = [
    { value: "PRODUCT_ERROR", label: "Sản phẩm lỗi" },
    { value: "CUSTOMER_CHANGE_MIND", label: "Khách đổi ý" },
  ];

  const refundMethods = ["Chuyển khoản", "Tiền mặt"];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + "đ";

  const calculateDiscountedPrice = (originalPrice: number): number => {
    if (!orderDetailData?.paymentSummary) return originalPrice;
    const { totalProductPrice, totalOrderPrice } = orderDetailData.paymentSummary;
    if (!totalProductPrice) return originalPrice;
    const ratio = totalOrderPrice / totalProductPrice;
    return originalPrice * ratio;
  };

  const totalAmount = returnProducts.reduce((sum, item) => {
    const discounted = calculateDiscountedPrice(item.product.price);
    return sum + discounted * item.returnQuantity;
  }, 0);
  const discount = 0;
  const totalRefund = totalAmount - discount;

  useEffect(() => {
    setRefundAmount(totalRefund);
  }, [totalRefund]);

  const handleQuantityChange = (
    productId: string,
    newQuantity: number,
    maxQuantity: number
  ) => {
    setReturnProducts((prev) =>
    prev.map((item) =>
      item.product.id === productId
        ? {
            ...item,
            returnQuantity: Math.max(0, Math.min(newQuantity, maxQuantity)),
          }
        : item
    ));
  };

  const handleReasonChange = (productId: string, reasonLabel: string) => {
    const reasonValue =
      returnReasons.find((r) => r.label === reasonLabel)?.value ||
      "CUSTOMER_CHANGE_MIND";
    setReturnProducts((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, reason: reasonValue } : item
      )
    );
  };

  const createReturnOrderMutation = useMutation({
    mutationFn: async (data: {
      orderId: number;
      returnType: ReturnTypeEnum;
      returnReason: ReturnReasonEnum;
      notes?: string;
      returnProducts: Array<{
        orderDetailId: number;
        returnQuantity: number;
        returnPrice: number;
      }>;
    }) => createPosReturnOrder(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posReturnOrders"] });
      await queryClient.refetchQueries({ queryKey: ["posReturnOrders"] });
      navigate("/pos/returns");
    },
    onError: (error: any) => {
      console.error("Error creating return order:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Không thể tạo đơn trả hàng"
      );
    },
  });

  const handleCreateReturn = () => {
    if (!orderId) {
      alert("Không tìm thấy mã đơn");
      return;
    }

    const hasItem = returnProducts.some((item) => item.returnQuantity > 0);
    if (!hasItem) {
      alert("Vui lòng chọn ít nhất một sản phẩm để trả");
      return;
    }

    const totalOriginalQty = returnProducts.reduce(
      (sum, item) => sum + item.product.quantity,
      0
    );
    const totalReturnQty = returnProducts.reduce(
      (sum, item) => sum + item.returnQuantity,
      0
    );
    const returnType: ReturnTypeEnum =
      totalReturnQty >= totalOriginalQty ? "FULL" : "PARTIAL";

    const returnReason = returnProducts[0]?.reason || "CUSTOMER_CHANGE_MIND";

    const payloadProducts = returnProducts
      .filter((item) => item.returnQuantity > 0)
      .map((item) => ({
        orderDetailId: item.orderDetailId,
        returnQuantity: item.returnQuantity,
        returnPrice: calculateDiscountedPrice(item.product.price),
      }));

    createReturnOrderMutation.mutate({
      orderId: Number(orderId),
      returnType,
      returnReason,
      notes: note || undefined,
      returnProducts: payloadProducts,
    });
  };

  if (isLoadingOrder) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Lỗi khi tải thông tin đơn hàng</p>
          <button
            onClick={() => navigate("/pos/returns")}
            className="px-4 py-2 bg-[#e04d30] text-white rounded hover:bg-[#d04327]"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!orderDetailData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Không tìm thấy đơn hàng</p>
          <button
            onClick={() => navigate("/pos/returns")}
            className="px-4 py-2 bg-[#e04d30] text-white rounded hover:bg-[#d04327]"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden bg-gray-50">
      {/* Left Column - Product Selection */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Card 1: Chọn sản phẩm trả hàng + Lý do (theo ảnh 2) */}
          <div className="bg-white border border-[#e7e7e7] rounded-lg shadow-sm">
            {/* Header */}
            <div className="px-4 py-2.5 border-b border-[#e7e7e7]">
              <h2 className="text-lg font-semibold text-[#272424]">
                Chọn sản phẩm trả hàng
              </h2>
            </div>
            {/* Body: Product list (một item demo như ảnh) */}
            <div className="px-4 pt-3 pb-4 space-y-4">
              {orderDetailData.code && (
                <p className="text-lg font-semibold text-[#272424]">
                  #{orderDetailData.code}
                </p>
              )}
              {returnProducts.map((item) => (
                <div
                  key={item.product.id}
                  className="rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {/* Hình ảnh */}
                    <div className="w-[64px] h-[64px] rounded-lg border border-[#e7e7e7] flex-shrink-0 overflow-hidden bg-gray-100">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-7 h-7 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Thông tin + điều chỉnh số lượng + tổng tiền */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-medium text-[#272424] mb-1 line-clamp-2">
                            {item.product.name}
                          </p>
                          {item.product.variant && (
                            <p className="text-xs text-[#737373] mb-1">
                              Phân loại hàng:{" "}
                              <span className="text-[#272424]">
                                {item.product.variant}
                              </span>
                            </p>
                          )}
                          <p className="text-sm text-[#272424]">
                            {formatCurrency(
                              calculateDiscountedPrice(item.product.price)
                            )}
                          </p>
                        </div>
                        {/* Điều chỉnh số lượng theo style ảnh 2 */}
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                item.returnQuantity - 1,
                                item.product.quantity
                              )
                            }
                            disabled={item.returnQuantity <= 0}
                            className={cn(
                              "w-7 h-7 flex items-center justify-center rounded-full border border-[#e7e7e7] text-[#272424] hover:bg-gray-100 transition-colors",
                              item.returnQuantity <= 0 && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="text-sm text-[#272424] font-medium min-w-[52px] text-center border-b border-[#cfcfcf]">
                            {item.returnQuantity}/{item.product.quantity}
                          </div>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product.id,
                                item.returnQuantity + 1,
                                item.product.quantity
                              )
                            }
                            disabled={item.returnQuantity >= item.product.quantity}
                            className={cn(
                              "w-7 h-7 flex items-center justify-center rounded-full border border-[#e7e7e7] text-[#272424] hover:bg-gray-100 transition-colors",
                              item.returnQuantity >= item.product.quantity &&
                                "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Tổng tiền */}
                        <div className="text-right min-w-[100px]">
                          <p className="text-sm font-medium text-[#272424]">
                            {formatCurrency(
                              calculateDiscountedPrice(item.product.price) *
                                item.returnQuantity
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {returnProducts.length > 0 && (
                <div>
                  <p className="text-[15px] font-semibold text-[#272424] mb-2">
                    Lý do chọn trả hàng
                  </p>
                  <div className="bg-[#f5f5f5] rounded-md">
                    <div className="p-2.5">
                      <SimpleDropdown
                        value={
                          returnReasons.find(
                            (r) => r.value === returnProducts[0]?.reason
                          )?.label || ""
                        }
                        onValueChange={(reasonLabel) =>
                          handleReasonChange(
                            returnProducts[0]?.product.id || "",
                            reasonLabel
                          )
                        }
                        options={returnReasons.map((r) => r.label)}
                        placeholder="Chọn lý do"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Card 2: Ghi chú (theo ảnh 2) */}
          <div className="bg-white border border-[#e7e7e7] rounded-lg shadow-sm">
            <div className="px-6 pt-4 pb-2">
              <h3 className="text-xl font-bold text-[#272424]">Ghi chú</h3>
            </div>
            <div className="px-6 pt-1 pb-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú..."
                className="w-full min-h-[120px] p-3 border border-[#e7e7e7] rounded-lg text-sm text-[#272424] placeholder:text-[#737373] focus:outline-none focus:border-[#e04d30] resize-none"
              />
              <div className="mt-2 flex items-center gap-2 text-xs text-[#737373]">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f0f0f0] text-[11px] font-semibold text-[#737373]">
                  !
                </div>
                <p className="m-0">
                  Chỉ có bạn và nhân viên trong cửa hàng có thể nhìn thấy lý do này
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Summary and Refund */}
      <div className="w-[400px] bg-white border-l border-[#e7e7e7] flex-shrink-0 flex flex-col">
        {/* Summary Section */}
        <div className="p-6 border-b border-[#e7e7e7]">
          <h3 className="text-lg font-bold text-[#272424] mb-4">Tóm tắt</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#272424]">
                Tổng tiền hàng
              </span>
              <span className="text-sm font-bold text-[#272424]">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[#e04d30]">
                Giảm giá
              </span>
              <span className="text-sm font-bold text-[#e04d30]">
                {formatCurrency(discount)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm font-medium text-[#272424]">
                Tổng hoàn trả
              </span>
              <span className="text-sm font-bold text-[#272424]">
                {formatCurrency(totalRefund)}
              </span>
            </div>
          </div>
        </div>

        {/* Refund Section */}
        <div className="p-6 border-b border-[#e7e7e7] flex-1">
          <h3 className="text-lg font-bold text-[#272424] mb-4">Hoàn tiền</h3>
          <div className="space-y-4">
            <div>
              <div className="bg-gray-50 border-2 border-[#e04d30] rounded-lg px-4 py-3">
                <SimpleDropdown
                  value={refundMethod}
                  onValueChange={setRefundMethod}
                  options={refundMethods}
                  placeholder="Chọn phương thức"
                  className="[&>div:first-child]:border-0 [&>div:first-child]:bg-transparent [&>div:first-child]:px-0 [&>div:first-child]:h-auto [&>div:first-child]:rounded-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#272424] mb-2">
                Số tiền
              </label>
              <div className="bg-gray-50 border-2 border-[#e04d30] rounded-lg p-4 flex items-center gap-2">
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="flex-1 bg-transparent border-0 outline-none text-sm font-semibold text-[#272424]"
                  placeholder="0"
                />
                <span className="text-sm font-semibold text-[#272424]">đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <div className="p-6 border-t border-[#e7e7e7]">
          <button
            onClick={handleCreateReturn}
            disabled={createReturnOrderMutation.isPending}
            className="w-full bg-[#e04d30] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#d0442a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createReturnOrderMutation.isPending
              ? "Đang tạo..."
              : "Tạo đơn hoàn trả"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReturnOrder;
