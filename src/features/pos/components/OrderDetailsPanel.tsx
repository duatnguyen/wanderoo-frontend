import React from "react";
import { Pencil, Printer } from "lucide-react";
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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
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
      <div className="p-6 border-b border-[#e7e7e7]">
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
                  Đổi hàng
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

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4">
          <div className="border border-[#e7e7e7] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f6f6f6] sticky top-0 z-10">
                <tr>
                  <th className="text-left px-4 h-[50px] text-sm font-bold text-[#272424]">
                    Sản phẩm
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
              <tbody className="divide-y divide-[#e7e7e7]">
                {order.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 h-[100px]">
                    <td className="px-4 h-[100px] align-middle">
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover border border-[#e7e7e7] flex-shrink-0"
                          />
                        )}
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
                    </td>
                    <td className="text-center px-4 h-[100px] align-middle">
                      <span className="text-sm text-[#272424] font-medium">
                        {formatCurrency(product.price)}
                      </span>
                    </td>
                    <td className="text-center px-4 h-[100px] align-middle">
                      <span className="text-sm text-[#272424] font-medium">
                        {product.quantity}
                      </span>
                    </td>
                    <td className="text-right px-4 h-[100px] align-middle">
                      <span className="text-sm font-bold text-[#272424]">
                        {formatCurrency(product.price * product.quantity)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border border-[#e7e7e7] rounded-lg p-4">
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
                {formatCurrency(order.discount)}
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
            <div className="flex justify-between items-center pt-3 border-t border-[#e7e7e7]">
              <span className="text-sm font-medium text-[#272424]">
                Tiền thừa trả khách
              </span>
              <span className="text-sm font-bold text-[#272424]">
                {formatCurrency(order.change)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPanel;
