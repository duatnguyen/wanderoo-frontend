import React, { useState } from "react";
import OrderSearchPanel, {
  type Order,
} from "../../../../components/pos/OrderSearchPanel";
import OrderDetailsPanel, {
  type OrderDetails,
} from "../../../../components/pos/OrderDetailsPanel";

const OrderManagement: React.FC = () => {
  // Mock data
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("2025-06-29");
  const [endDate, setEndDate] = useState("2025-06-29");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("1003");

  // Mock orders list
  const mockOrders: Order[] = [
    {
      id: "1003",
      totalAmount: 400000,
      dateTime: "2025-06-29T14:30:00",
      status: "Đã thanh toán",
    },
    {
      id: "1004",
      totalAmount: 250000,
      dateTime: "2025-06-29T15:00:00",
      status: "Đã thanh toán",
    },
    {
      id: "1005",
      totalAmount: 150000,
      dateTime: "2025-06-29T16:00:00",
      status: "Đã thanh toán",
    },
  ];

  // Mock order details
  const mockOrderDetails: Record<string, OrderDetails> = {
    "1003": {
      id: "1003",
      createdBy: "Thanh",
      createdAt: "2025-06-29T14:30:00",
      products: [
        {
          id: "1",
          name: "Vòng Đuổi Muỗi Di Động - Bảo Vệ Gia Đình Khỏi Muỗi Đốt, Thiết Kế Hiện Đại",
          image:
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "2",
          name: "Tất Chống Thấm Nước Đệm Chống Mài Mòn Trượt",
          image:
            "https://images.unsplash.com/photo-1586350977773-bd8d9d2f8c55?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "2",
          name: "Tất Chống Thấm Nước Đệm Chống Mài Mòn Trượt",
          image:
            "https://images.unsplash.com/photo-1586350977773-bd8d9d2f8c55?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "2",
          name: "Tất Chống Thấm Nước Đệm Chống Mài Mòn Trượt",
          image:
            "https://images.unsplash.com/photo-1586350977773-bd8d9d2f8c55?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "2",
          name: "Tất Chống Thấm Nước Đệm Chống Mài Mòn Trượt",
          image:
            "https://images.unsplash.com/photo-1586350977773-bd8d9d2f8c55?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "2",
          name: "Tất Chống Thấm Nước Đệm Chống Mài Mòn Trượt",
          image:
            "https://images.unsplash.com/photo-1586350977773-bd8d9d2f8c55?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "2",
          name: "Tất Chống Thấm Nước Đệm Chống Mài Mòn Trượt",
          image:
            "https://images.unsplash.com/photo-1586350977773-bd8d9d2f8c55?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "2",
          name: "Tất Chống Thấm Nước Đệm Chống Mài Mòn Trượt",
          image:
            "https://images.unsplash.com/photo-1586350977773-bd8d9d2f8c55?w=150&h=150&fit=crop",
          variant: "Xanh",
          price: 100000,
          quantity: 1,
        },
        {
          id: "3",
          name: "Túi ngoài trời lưu trữ leo núi Rucksack 30L",
          image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop",
          variant: "Nâu",
          price: 100000,
          quantity: 2,
        },
      ],
      totalAmount: 400000,
      discount: 0,
      finalAmount: 400000,
      amountPaid: 400000,
      change: 0,
    },
    "1004": {
      id: "1004",
      createdBy: "Admin",
      createdAt: "2025-06-29T15:00:00",
      products: [
        {
          id: "1",
          name: "Product A",
          price: 150000,
          quantity: 1,
        },
        {
          id: "2",
          name: "Product B",
          price: 100000,
          quantity: 1,
        },
      ],
      totalAmount: 250000,
      discount: 0,
      finalAmount: 250000,
      amountPaid: 250000,
      change: 0,
    },
    "1005": {
      id: "1005",
      createdBy: "Admin",
      createdAt: "2025-06-29T16:00:00",
      products: [
        {
          id: "1",
          name: "Product C",
          price: 150000,
          quantity: 1,
        },
      ],
      totalAmount: 150000,
      discount: 0,
      finalAmount: 150000,
      amountPaid: 150000,
      change: 0,
    },
  };

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const selectedOrder = selectedOrderId
    ? mockOrderDetails[selectedOrderId]
    : undefined;

  const handleExchange = () => {
    console.log("Exchange order:", selectedOrderId);
  };

  const handlePrintInvoice = () => {
    console.log("Print invoice for order:", selectedOrderId);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Panel - Order Search and List */}
      <div className="w-[400px] border-r border-[#e7e7e7] flex-shrink-0">
        <OrderSearchPanel
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          orders={mockOrders}
          selectedOrderId={selectedOrderId}
          onOrderSelect={setSelectedOrderId}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Right Panel - Order Details */}
      <div className="flex-1 min-w-0">
        <OrderDetailsPanel
          order={selectedOrder}
          onExchange={handleExchange}
          onPrintInvoice={handlePrintInvoice}
        />
      </div>
    </div>
  );
};

export default OrderManagement;
