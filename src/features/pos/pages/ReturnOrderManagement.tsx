import React, { useState } from "react";
import ReturnOrderSearchPanel, {
  type ReturnOrder,
} from "../../../components/pos/ReturnOrderSearchPanel";
import ReturnOrderDetailsPanel, {
  type ReturnOrderDetails,
} from "../../../components/pos/ReturnOrderDetailsPanel";
import SelectOrderModal from "../../../components/pos/SelectOrderModal";

const ReturnOrderManagement: React.FC = () => {
  // Mock data
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("2025-06-29");
  const [endDate, setEndDate] = useState("2025-06-29");
  const [selectedReturnOrderId, setSelectedReturnOrderId] =
    useState<string>("1003-R1");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSelectOrderModalOpen, setIsSelectOrderModalOpen] = useState(false);
  const totalPages = 1;

  // Mock return orders list
  const mockReturnOrders: ReturnOrder[] = [
    {
      id: "1003-R1",
      originalOrderId: "1003",
      status: "Đã hoàn trả",
      subStatus: "Đã nhận hàng",
      dateTime: "2025-06-29T14:30:00",
      totalAmount: 100000,
    },
    {
      id: "1004-R1",
      originalOrderId: "1004",
      status: "Chưa hoàn trả",
      subStatus: "Đã nhận hàng",
      dateTime: "2025-06-29T14:30:00",
      totalAmount: 150000,
    },
  ];

  // Mock return order details
  const mockReturnOrderDetails: Record<string, ReturnOrderDetails> = {
    "1003-R1": {
      id: "1003-R1",
      originalOrderId: "1003",
      createdBy: "Thanh",
      createdAt: "2025-06-29T14:30:00",
      customer: "---",
      note: "",
      receivedProducts: [
        {
          product: {
            id: "1",
            name: "Gậy Carbon Leo Núi Siêu Bền Nhẹ",
            image:
              "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=150&h=150&fit=crop",
            price: 100000,
            quantity: 1,
          },
          reason: "Không xác định",
        },
      ],
      isReceived: true,
      returnedSummary: {
        totalAmount: 100000,
        discount: 0,
        totalReturnValue: 100000,
      },
      isReturned: true,
    },
    "1004-R1": {
      id: "1004-R1",
      originalOrderId: "1004",
      createdBy: "Admin",
      createdAt: "2025-06-29T14:30:00",
      customer: "---",
      note: "",
      receivedProducts: [
        {
          product: {
            id: "1",
            name: "Túi ngoài trời lưu trữ leo núi Rucksack 30L",
            image:
              "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop",
            price: 150000,
            quantity: 1,
          },
          reason: "Sản phẩm lỗi",
        },
      ],
      isReceived: true,
      returnedSummary: {
        totalAmount: 150000,
        discount: 0,
        totalReturnValue: 150000,
      },
      isReturned: false,
    },
  };

  const selectedReturnOrder = selectedReturnOrderId
    ? mockReturnOrderDetails[selectedReturnOrderId]
    : undefined;

  const handleCreateReturnOrder = () => {
    setIsSelectOrderModalOpen(true);
  };

  const handleSelectOrder = (orderId: string) => {
    console.log("Selected order for return:", orderId);
    // Here you would typically create a new return order based on the selected order
    // For now, we'll just close the modal
    setIsSelectOrderModalOpen(false);
  };

  const handleViewOriginalOrder = (orderId: string) => {
    console.log("View original order:", orderId);
    // Navigate to order management page with the order ID
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Panel - Return Order Search and List */}
      <div className="w-[400px] border-r border-[#e7e7e7] flex-shrink-0">
        <ReturnOrderSearchPanel
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          returnOrders={mockReturnOrders}
          selectedReturnOrderId={selectedReturnOrderId}
          onReturnOrderSelect={setSelectedReturnOrderId}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onCreateReturnOrder={handleCreateReturnOrder}
        />
      </div>

      {/* Right Panel - Return Order Details */}
      <div className="flex-1 min-w-0">
        <ReturnOrderDetailsPanel
          returnOrder={selectedReturnOrder}
          onViewOriginalOrder={handleViewOriginalOrder}
        />
      </div>

      {/* Select Order Modal */}
      <SelectOrderModal
        isOpen={isSelectOrderModalOpen}
        onClose={() => setIsSelectOrderModalOpen(false)}
        onSelectOrder={handleSelectOrder}
      />
    </div>
  );
};

export default ReturnOrderManagement;
