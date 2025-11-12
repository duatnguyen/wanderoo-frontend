import React from "react";
import { formatCurrencyVND } from "../../../features/shop/pages/Checkout/utils/formatCurrency";

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
  discountCode: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingFee,
  discountCode,
  total,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-gray-700">
        <span>Tổng tiền hàng</span>
        <span>{formatCurrencyVND(subtotal)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Tổng tiền phí vận chuyển</span>
        <span>{formatCurrencyVND(shippingFee)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Mã giảm giá</span>
        <span>{formatCurrencyVND(discountCode)}</span>
      </div>
      <div className="border-t border-gray-300 pt-3 mt-3">
        <div className="flex justify-between">
          <span className="font-bold text-gray-900">Tổng tiền thanh toán</span>
          <span className="font-bold text-[#18345c] text-lg">
            {formatCurrencyVND(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

