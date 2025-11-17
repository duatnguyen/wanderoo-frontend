import React from "react";
import { Pencil, User, FileText, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { POSProduct } from "./POSProductList";
import { ReturnStatusIcon } from "./icons/ReturnStatusIcon";

export type ReturnOrderDetails = {
  id: string;
  originalOrderId: string;
  createdBy: string;
  createdAt: string;
  customer?: string;
  note?: string;
  receivedProducts: Array<{
    product: POSProduct;
    reason?: string;
  }>;
  isReceived: boolean;
  returnedSummary: {
    totalAmount: number;
    discount: number;
    totalReturnValue: number;
  };
  isReturned: boolean;
};

export type ReturnOrderDetailsPanelProps = {
  returnOrder?: ReturnOrderDetails;
  onViewOriginalOrder?: (orderId: string) => void;
  className?: string;
};

export const ReturnOrderDetailsPanel: React.FC<
  ReturnOrderDetailsPanelProps
> = ({ returnOrder, onViewOriginalOrder, className }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  if (!returnOrder) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full bg-white text-[#737373]",
          className
        )}
      >
        <p className="text-sm">Chọn đơn trả hàng để xem chi tiết</p>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col h-full bg-white overflow-hidden", className)}
    >
      {/* Return Order Header */}
      <div className="p-6 border-b border-[#e7e7e7]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[#272424]">
              #{returnOrder.id}
            </h2>
            <button
              onClick={() => onViewOriginalOrder?.(returnOrder.originalOrderId)}
              className="flex items-center gap-2 text-sm text-[#272424] hover:text-[#e04d30] transition-colors"
            >
              <span>Đơn hàng gốc: #{returnOrder.originalOrderId}</span>
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col gap-2 text-sm text-[#737373]">
            <div className="flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              <span>
                Tạo bởi {returnOrder.createdBy} lúc{" "}
                {formatDate(returnOrder.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Khách hàng: {returnOrder.customer || "---"}</span>
            </div>
            {returnOrder.note && (
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Ghi chú: {returnOrder.note}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Đã nhận hàng Section */}
        <div className="mb-6">
          {returnOrder.isReceived && (
            <>
              {/* Product Table */}
              <div className="border border-[#e7e7e7] rounded-lg overflow-hidden mb-4 bg-white">
                <table className="w-full">
                  <thead className="bg-[#f6f6f6]">
                    <tr>
                      <th className="text-left px-4 h-[50px] text-sm font-medium text-[#272424]">
                        <div className="flex items-center gap-2">
                          <ReturnStatusIcon
                            isSuccess={returnOrder.isReceived}
                          />
                          <span className="text-sm font-medium text-[#272424]">
                            Đã nhận hàng
                          </span>
                        </div>
                      </th>
                      <th className="text-center px-4 h-[50px] text-sm font-bold text-[#272424]">
                        Đơn giá
                      </th>
                      <th className="text-center px-4 h-[50px] text-sm font-bold text-[#272424]">
                        Số lượng
                      </th>
                      <th className="text-right px-4 h-[50px] text-sm font-bold text-[#272424]">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7e7e7] bg-white">
                    {returnOrder.receivedProducts.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 align-middle">
                          <div className="flex items-center gap-3">
                            {item.product.image && (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-16 h-16 rounded-lg object-cover border border-[#e7e7e7] flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#272424] line-clamp-2">
                                {item.product.name}
                              </p>
                              {(item.product.category ||
                                item.product.variant) && (
                                  <p className="text-xs text-[#737373] mt-1">
                                    Phân loại hàng:{" "}
                                    <span className="text-[#272424]">
                                      {item.product.variant ||
                                        item.product.category}
                                    </span>
                                  </p>
                                )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center px-4 py-3 align-middle">
                          <span className="text-sm text-[#272424] font-medium">
                            {formatCurrency(item.product.price)}
                          </span>
                        </td>
                        <td className="text-center px-4 py-3 align-middle">
                          <span className="text-sm text-[#272424] font-medium">
                            {item.product.quantity}
                          </span>
                        </td>
                        <td className="text-right px-4 py-3 align-middle">
                          <span className="text-sm font-bold text-[#272424]">
                            {formatCurrency(
                              item.product.price * item.product.quantity
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Reason Row */}
                    {returnOrder.receivedProducts.some(
                      (item) => item.reason
                    ) && (
                        <tr className="border-t border-[#e7e7e7]">
                          <td colSpan={4} className="px-4 py-3">
                            {returnOrder.receivedProducts.map((item, index) => (
                              <div key={index}>
                                {item.reason && (
                                  <p className="text-sm text-[#e04d30] font-medium">
                                    Lý do: {item.reason}
                                  </p>
                                )}
                              </div>
                            ))}
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Đã hoàn trả Section */}
        <div>
          <div className="border border-[#e7e7e7] rounded-lg overflow-hidden bg-white">
            <div className="bg-[#f6f6f6] px-4 h-[50px] flex items-center border-b border-[#e7e7e7]">
              <div className="flex items-center gap-2">
                <ReturnStatusIcon isSuccess={returnOrder.isReturned} />
                <span className="text-sm font-medium text-[#272424]">
                  {returnOrder.isReturned ? "Đã hoàn trả" : "Trả hàng thất bại"}
                </span>
              </div>
            </div>
            {returnOrder.isReturned && (
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#272424]">
                      Tổng tiền hàng
                    </span>
                    <span className="text-sm font-bold text-[#272424]">
                      {formatCurrency(returnOrder.returnedSummary.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#e04d30]">
                      Giảm giá
                    </span>
                    <span className="text-sm font-bold text-[#e04d30]">
                      {formatCurrency(returnOrder.returnedSummary.discount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#e7e7e7]">
                    <span className="text-sm font-medium text-[#272424]">
                      Tổng giá trị hoàn trả
                    </span>
                    <span className="text-sm font-bold text-[#272424]">
                      {formatCurrency(
                        returnOrder.returnedSummary.totalReturnValue
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnOrderDetailsPanel;
