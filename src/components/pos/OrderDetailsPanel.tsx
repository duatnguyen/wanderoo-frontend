import React, { useState } from "react";
import { Pencil, Printer, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { POSProduct } from "./POSProductList";

export type OrderDetails = {
  id: string;
  createdBy: string;
  createdAt: string;
  products: POSProduct[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  amountPaid: number;
  change: number;
};

export type OrderDetailsPanelProps = {
  order?: OrderDetails;
  onExchange?: () => void;
  onPrintInvoice?: () => void;
  className?: string;
};

export const OrderDetailsPanel: React.FC<OrderDetailsPanelProps> = ({
  order,
  onExchange,
  onPrintInvoice,
  className,
}) => {
  const [isOrderSummaryExpanded, setIsOrderSummaryExpanded] = useState(true);

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

  const handleToggleExpand = () => {
    setIsOrderSummaryExpanded(!isOrderSummaryExpanded);
  };

  if (!order) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full bg-white text-[#737373]",
          className
        )}
      >
        <p className="text-sm">Chọn đơn hàng để xem chi tiết</p>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col h-full bg-white overflow-hidden", className)}
    >
      {/* Order Header */}
      <div className="p-1 px-4 border-b border-[#e7e7e7]">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#272424] mb-2">
              #{order.id}
            </h2>
            <div className="flex flex-row justify-between items-center gap-2 text-sm text-[#737373]">
              <div className="flex flex-row gap-4">
                <Pencil className="w-4 h-4" />
                <span>
                  Tạo bởi {order.createdBy} lúc {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={onExchange}
                  className="px-6 py-2"
                >
                  Trả hàng
                </Button>
                <Button onClick={onPrintInvoice} className="px-6 py-2">
                  <Printer className="w-4 h-4 mr-2" />
                  In hóa đơn
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product List Header */}
      <div className="bg-[#f6f6f6] border-b border-[#e7e7e7] flex-shrink-0">
        <div className="flex items-center h-[50px]">
          <div className="flex-1 px-6">
            <span className="text-sm font-bold text-[#272424]">Sản phẩm</span>
          </div>
          <div className="w-40 px-6 text-center">
            <span className="text-sm font-bold text-[#272424]">Đơn giá</span>
          </div>
          <div className="w-30 px-6 text-center">
            <span className="text-sm font-bold text-[#272424]">Số lượng</span>
          </div>
          <div className="w-36 px-6 text-right">
            <span className="text-sm font-bold text-[#272424]">Thành tiền</span>
          </div>
        </div>
      </div>
      {/* Scrollable Product Items */}
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="divide-y divide-[#e7e7e7]">
          {order.products.map((product) => (
            <div key={product.id} className="flex items-center hover:bg-gray-50 h-[100px]">
              <div className="flex-1 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg border border-[#e7e7e7] flex-shrink-0 overflow-hidden bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#272424] line-clamp-2">
                      {product.name}
                    </p>
                    {(product.category || product.variant) && (
                      <p className="text-xs text-[#737373] mt-1">
                        Phân loại hàng:{" "}
                        <span className="text-[#272424]">
                          {product.variant || product.category}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-32 px-6 text-center">
                <span className="text-sm text-[#272424] font-medium">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <div className="w-28 px-6 text-center">
                <span className="text-sm text-[#272424] font-medium">
                  {product.quantity}
                </span>
              </div>
              <div className="w-36 px-6 text-right">
                <span className="text-sm font-bold text-[#272424]">
                  {formatCurrency(product.price * product.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary - Fixed at bottom */}
      <div className="border-t border-[#e7e7e7]">
        {/* Header */}
        <div
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleToggleExpand}
        >
          <h3 className="text-sm font-bold text-[#272424]">Tổng kết đơn hàng</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#e04d30]">
              {formatCurrency(order.finalAmount)}
            </span>
            {isOrderSummaryExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#737373]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#737373]" />
            )}
          </div>
        </div>

        {/* Collapsible Content */}
        {isOrderSummaryExpanded && (
          <div className="border-t border-[#e7e7e7] p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#272424]">
                  Tổng tiền hàng
                </span>
                <span className="text-sm font-bold text-[#272424]">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#e04d30]">
                  Giảm giá
                </span>
                <span className="text-sm font-bold text-[#e04d30]">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#272424]">
                  Khách phải trả
                </span>
                <span className="text-sm font-bold text-[#272424]">
                  {formatCurrency(order.finalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#272424]">
                  Tiền khách đưa
                </span>
                <span className="text-sm font-bold text-[#272424]">
                  {formatCurrency(order.amountPaid)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#272424]">
                  Tiền thừa trả khách
                </span>
                <span className="text-sm font-bold text-[#272424]">
                  {formatCurrency(order.change)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPanel;
