import React, { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import AddCustomerModal, { type CustomerFormData } from "./AddCustomerModal";
import CheckoutModal from "./CheckoutModal";

export type POSOrderSummaryProps = {
  customerSearch: string;
  onCustomerSearchChange: (value: string) => void;
  onAddCustomer?: (data: CustomerFormData) => void;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  onCheckout?: () => void;
  className?: string;
};

export const POSOrderSummary: React.FC<POSOrderSummaryProps> = ({
  customerSearch,
  onCustomerSearchChange,
  onAddCustomer,
  totalAmount = 0,
  discount = 0,
  finalAmount = 0,
  onCheckout,
  className,
}) => {
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const handleAddCustomer = (data: CustomerFormData) => {
    onAddCustomer?.(data);
    setIsAddCustomerModalOpen(false);
  };

  const handleCheckoutClick = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleCompleteCheckout = (data: {
    paymentMethod: "cash" | "transfer";
    amountPaid: number;
    change: number;
  }) => {
    // Handle checkout completion
    console.log("Checkout completed:", data);
    onCheckout?.();
  };

  return (
    <>
      <div
        className={cn(
          "bg-white border-l border-[#e7e7e7] w-[350px] flex flex-col h-full overflow-hidden flex-shrink-0",
          className
        )}
      >
        {/* Customer Search */}
        <div className="p-4 border-b border-[#e7e7e7]">
          <div className="relative">
            <SearchBar
              value={customerSearch}
              onChange={(e) => onCustomerSearchChange(e.target.value)}
              placeholder="Tìm kiếm khách hàng"
            />
            <button
              type="button"
              onClick={() => setIsAddCustomerModalOpen(true)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-[#e04d30] hover:text-[#d04327] transition-colors z-10"
              aria-label="Add customer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#272424] font-medium">
                Tổng tiền hàng
              </span>
              <span className="text-sm text-[#272424] font-bold">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#e04d30] font-medium">
                Giảm giá
              </span>
              <span className="text-sm text-[#e04d30] font-bold">
                {formatCurrency(discount)}
              </span>
            </div>
            <div className="border-t border-[#e7e7e7] pt-4 flex justify-between items-center">
              <span className="text-base text-[#272424] font-bold">
                Khách phải trả
              </span>
              <span className="text-base text-[#272424] font-bold">
                {formatCurrency(finalAmount)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="mt-auto pt-4">
            <Button
              onClick={handleCheckoutClick}
              className="w-full px-8 py-2.5"
            >
              <span className="text-sm font-bold">Thanh toán</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        onAdd={handleAddCustomer}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        finalAmount={finalAmount}
        onComplete={handleCompleteCheckout}
      />
    </>
  );
};

export default POSOrderSummary;
