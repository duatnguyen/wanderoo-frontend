import React, { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Trash2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AddCustomerModal, { type CustomerFormData } from "./AddCustomerModal";
import CheckoutModal from "./CheckoutModal";
import { searchCustomers } from "@/api/endpoints/saleApi";
import type { CustomerSearchResponse } from "@/types/api";

export type POSOrderSummaryProps = {
  customerSearch: string;
  onCustomerSearchChange: (value: string) => void;
  onAddCustomer?: (data: CustomerFormData) => void;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  onCheckout?: (data: {
    paymentMethod: "cash" | "transfer";
    amountPaid: number;
    change: number;
  }) => Promise<void> | void;
  assignedCustomer?: {
    name?: string | null;
    phone?: string | null;
  };
  onAssignCustomer?: (customer: CustomerSearchResponse) => Promise<void> | void;
  onClearAssignedCustomer?: () => void;
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
  assignedCustomer,
  onAssignCustomer,
  onClearAssignedCustomer,
  className,
}) => {
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<CustomerSearchResponse[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigningCustomer, setIsAssigningCustomer] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const handleAddCustomer = (data: CustomerFormData) => {
    const newCustomer = {
      ...data,
      id: Date.now().toString(),
    };
    onAddCustomer?.(data);
    onCustomerSearchChange(newCustomer.fullName ?? newCustomer.id);
    setIsAddCustomerModalOpen(false);
  };

  const handleRemoveCustomer = () => {
    onClearAssignedCustomer?.();
    onCustomerSearchChange("");
    setIsDropdownOpen(false);
  };

  const handleCheckoutClick = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleCompleteCheckout = async (data: {
    paymentMethod: "cash" | "transfer";
    amountPaid: number;
    change: number;
  }) => {
    try {
      await onCheckout?.(data);
    } catch (error) {
      console.error("Không thể thanh toán:", error);
    }
  };

  const handleSelectCustomer = async (customer: CustomerSearchResponse) => {
    if (!onAssignCustomer) {
      onCustomerSearchChange(customer.name);
      setIsDropdownOpen(false);
      return;
    }

    setIsAssigningCustomer(true);
    setSearchError(null);
    try {
      await onAssignCustomer(customer);
      onCustomerSearchChange(customer.name);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Không thể gán khách hàng:", error);
      setSearchError("Không thể gán khách hàng vào đơn");
    } finally {
      setIsAssigningCustomer(false);
    }
  };

  useEffect(() => {
    if (!isDropdownOpen || !customerSearch.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    let isCancelled = false;
    setIsSearching(true);
    setSearchError(null);

    const handler = setTimeout(async () => {
      try {
        const result = await searchCustomers(customerSearch.trim());
        if (!isCancelled) {
          setSearchResults(result ?? []);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Không thể tìm khách hàng:", error);
          setSearchError("Không thể tải danh sách khách hàng");
          setSearchResults([]);
        }
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(handler);
    };
  }, [customerSearch, isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <div
        className={cn(
          "bg-white border-l border-[#e7e7e7] w-[350px] flex flex-col h-full overflow-hidden flex-shrink-0",
          className
        )}
      >
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
