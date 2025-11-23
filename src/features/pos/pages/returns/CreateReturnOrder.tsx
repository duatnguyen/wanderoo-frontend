import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimpleDropdown } from "@/components/ui/SimpleDropdown";
import type { POSProduct } from "../../../../components/pos/POSProductList";

const CreateReturnOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // Mock order data - in real app, this would come from API
  const mockOrderProducts: POSProduct[] = [
    {
      id: "1",
      name: "Giày leo núi The North Face Ultra Fastpack IV Futurelight.",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop",
      price: 100000,
      quantity: 1,
      variant: "Size 42",
    },
  ];

  const [returnProducts, setReturnProducts] = useState<
    Array<{
      product: POSProduct;
      returnQuantity: number;
      reason: string;
    }>
  >(
    mockOrderProducts.map((p) => ({
      product: p,
      returnQuantity: p.quantity,
      reason: "Không xác định",
    }))
  );

  const [note, setNote] = useState("");
  const [refundMethod, setRefundMethod] = useState("Chuyển khoản");
  const [refundAmount, setRefundAmount] = useState(0);

  const returnReasons = [
    "Không xác định",
    "Sản phẩm lỗi",
    "Không đúng mô tả",
    "Không vừa",
    "Thay đổi ý định",
  ];

  const refundMethods = ["Chuyển khoản", "Tiền mặt"];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  // Calculate totals
  const totalAmount = returnProducts.reduce(
    (sum, item) => sum + item.product.price * item.returnQuantity,
    0
  );
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
    setReturnProducts(
      returnProducts.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              returnQuantity: Math.max(0, Math.min(newQuantity, maxQuantity)),
            }
          : item
      )
    );
  };

  const handleReasonChange = (productId: string, reason: string) => {
    setReturnProducts(
      returnProducts.map((item) =>
        item.product.id === productId ? { ...item, reason } : item
      )
    );
  };

  const handleCreateReturn = () => {
    console.log("Creating return order:", {
      orderId,
      returnProducts,
      note,
      refundMethod,
      refundAmount,
    });
    // Navigate back to returns page after creation
    navigate("/pos/returns");
  };

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
              {orderId && (
                <p className="text-lg font-semibold text-[#272424]">
                  #{orderId}
                </p>
              )}
              {returnProducts.map((item) => (
                <div
                  key={item.product.id}
                  className="rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {/* Hình ảnh */}
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-[64px] h-[64px] rounded-lg object-cover border border-[#e7e7e7] flex-shrink-0"
                      />
                    )}
                    {/* Thông tin + điều chỉnh số lượng + tổng tiền */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-medium text-[#272424] mb-1 line-clamp-2">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-[#272424]">
                            {formatCurrency(item.product.price)}
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
                              item.product.price * item.returnQuantity
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Lý do chọn trả hàng */}
              <div>
                <p className="text-[15px] font-semibold text-[#272424] mb-2">
                  Lí do chọn trả hàng
                </p>
                <div className="bg-[#f5f5f5] rounded-md">
                  <div className="p-2.5">
                    <SimpleDropdown
                      value={returnProducts[0]?.reason || ""}
                      onValueChange={(reason) =>
                        handleReasonChange(returnProducts[0]?.product.id || "", reason)
                      }
                      options={returnReasons}
                      placeholder="Chọn lý do"
                    />
                  </div>
                </div>
              </div>
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
            className="w-full bg-[#e04d30] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#d0442a] transition-colors"
          >
            Tạo đơn hoàn trả
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateReturnOrder;
