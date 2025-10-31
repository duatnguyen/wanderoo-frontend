import React from "react";

const OrdersTab: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
        Đơn mua
      </h2>
      <p className="text-sm sm:text-base text-gray-600">
        Xem lịch sử đơn hàng của bạn tại đây.
      </p>
    </div>
  );
};

export default OrdersTab;
