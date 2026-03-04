// src/components/common/OrderTable.tsx
import React from "react";
import {
  OrderTableHeader,
  OrderTableRow,
  type OrderTableColumn,
} from "@/components/admin/table/OrderTableComponents";
import type { ChipStatusKey } from "@/components/ui/chip-status";

interface Order {
  id: string;
  customer: {
    name: string;
    username: string;
    image: string;
    orderCode: string;
  };
  products: Array<{
    id: number;
    name: string;
    price: string;
    unitPrice?: number;
    quantity: number;
    image: string;
    sku?: string;
    variantAttributes?: Array<{
      groupName: string;
      value: string;
      groupLevel: number;
    }>;
  }>;
  paymentType: string;
  status: string;
  paymentStatus: string;
  category: string;
  date: string;
  tabStatus: string;
  totalAmount: number;
  shippingFee: number;
  orderCode?: string;
  itemsCount: number;
}

export interface OrderTableProps {
  columns: OrderTableColumn[];
  orders: Order[];
  onViewDetail: (
    orderId: string,
    orderStatus: string,
    orderSource: string
  ) => void;
  getPaymentTypeStatus: (paymentType: string) => ChipStatusKey;
  getProcessingStatus: (status: string) => ChipStatusKey;
  getPaymentStatus: (paymentStatus: string) => ChipStatusKey;
  className?: string;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  columns,
  orders,
  onViewDetail,
  getPaymentTypeStatus,
  getProcessingStatus,
  getPaymentStatus,
  className = "",
}) => {
  return (
    <div className={`w-full flex flex-col gap-2 -mt-[4px] ${className}`}>
      {/* Fixed Table Header */}
      <div className="sticky top-0 z-10 bg-white">
        <OrderTableHeader columns={columns} className="bg-white w-full" />
      </div>

      {/* Scrollable Table Body */}
      <div className="w-full max-h-[500px] overflow-y-auto">
        <div className="flex flex-col gap-[12px] w-full">
          {orders.map((order) => (
            <OrderTableRow
              key={order.id}
              order={order}
              onViewDetail={onViewDetail}
              getPaymentTypeStatus={getPaymentTypeStatus}
              getProcessingStatus={getProcessingStatus}
              getPaymentStatus={getPaymentStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
