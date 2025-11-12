import React, { useState } from "react";
import { Plus, Trash2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  const [selectedCustomer, setSelectedCustomer] = useState<
    (CustomerFormData & { id: string }) | null
  >(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const handleAddCustomer = (data: CustomerFormData) => {
    const newCustomer = {
      ...data,
      id: Date.now().toString(),
    };
    setSelectedCustomer(newCustomer);
    onAddCustomer?.(data);
    setIsAddCustomerModalOpen(false);
  };

  const handleRemoveCustomer = () => {
    setSelectedCustomer(null);
    onCustomerSearchChange("");
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
            {selectedCustomer ? (
              <div className="bg-[#F0F0F0] rounded-lg px-4 h-[42px] flex items-center gap-3 border border-[#E04D30]">
                {/* User Icon */}
                <div className="flex-shrink-0">
                  <User className="w-4 h-4 text-[#4A4A4A]" />
                </div>
                {/* Customer Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#E04D30] font-medium truncate">
                    {selectedCustomer.fullName} - {selectedCustomer.phoneNumber}
                  </p>
                </div>
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={handleRemoveCustomer}
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#F0F0F0] rounded-full hover:bg-gray-200 transition-colors"
                  aria-label="Remove customer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#E04D30]" />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4 text-gray-400"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.3-4.3" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => onCustomerSearchChange(e.target.value)}
                    placeholder="Tìm kiếm khách hàng"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-[#272424] placeholder:text-gray-400 focus:outline-none focus:border-[#E04D30] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setIsAddCustomerModalOpen(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#E04D30] hover:text-[#d04327] transition-colors z-10"
                    aria-label="Add customer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
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
