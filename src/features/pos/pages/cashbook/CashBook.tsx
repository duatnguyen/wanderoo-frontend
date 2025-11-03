import React, { useState } from "react";
import CashBookSearchPanel, {
  type CashBookTransaction,
} from "../../../../components/pos/CashBookSearchPanel";
import CashBookDetailsPanel, {
  type CashBookTransactionDetails,
} from "../../../../components/pos/CashBookDetailsPanel";

const CashBook: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState("2025-06-29");
  const [endDate, setEndDate] = useState("2025-06-29");
  const [selectedTransactionId, setSelectedTransactionId] =
    useState<string>("RVN00001");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  // Mock transactions
  const mockTransactions: CashBookTransaction[] = [
    {
      id: "RVN00001",
      amount: 1000000,
      dateTime: "2025-06-29T14:30:00",
      type: "income",
    },
    {
      id: "RVN00002",
      amount: 500000,
      dateTime: "2025-06-29T15:00:00",
      type: "income",
    },
  ];

  // Calculate totals
  const totalIncome = mockTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = mockTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Mock transaction details
  const mockTransactionDetails: Record<string, CashBookTransactionDetails> = {
    RVN00001: {
      id: "RVN00001",
      type: "income",
      dateTime: "2025-06-29T14:30:00",
      paymentMethod: "Tiền mặt",
      reason: "Thu tiền bán hàng",
      customer: "---",
      amount: 1000000,
      description: "",
      reference: "",
      images: [],
    },
    RVN00002: {
      id: "RVN00002",
      type: "income",
      dateTime: "2025-06-29T15:00:00",
      paymentMethod: "Chuyển khoản",
      reason: "Thu tiền bán hàng",
      customer: "---",
      amount: 500000,
      description: "",
      reference: "",
      images: [],
    },
  };

  const selectedTransaction = selectedTransactionId
    ? mockTransactionDetails[selectedTransactionId]
    : undefined;

  const handleCreateVoucher = () => {
    console.log("Create voucher");
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left Panel - Search and Transaction List */}
      <div className="w-[400px] border-r border-[#e7e7e7] flex-shrink-0">
        <CashBookSearchPanel
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          transactions={mockTransactions}
          selectedTransactionId={selectedTransactionId}
          onTransactionSelect={setSelectedTransactionId}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onCreateVoucher={handleCreateVoucher}
        />
      </div>

      {/* Right Panel - Transaction Details */}
      <div className="flex-1 min-w-0">
        <CashBookDetailsPanel transaction={selectedTransaction} />
      </div>
    </div>
  );
};

export default CashBook;

