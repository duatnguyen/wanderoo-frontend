import React, { useState } from "react";
import { Trash2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CheckoutModal from "./CheckoutModal";
import POSVoucherModal from "./POSVoucherModal";

export type POSOrderSummaryProps = {
  totalAmount: number;
  finalAmount: number;
  orderDiscountAmount?: number;
  onCheckout?: (data: {
    paymentMethod: "cash" | "transfer";
    amountPaid: number;
    change: number;
  }) => Promise<void> | void;
  assignedCustomer?: {
    name?: string | null;
    phone?: string | null;
  };
  onClearAssignedCustomer?: () => void;
  onApplyVoucher?: (voucherId: string | null) => Promise<void> | void;
  draftOrderId?: number | null;
  className?: string;
};

export const POSOrderSummary: React.FC<POSOrderSummaryProps> = ({
  totalAmount = 0,
  finalAmount = 0,
  orderDiscountAmount = 0,
  onCheckout,
  assignedCustomer,
  onClearAssignedCustomer,
  onApplyVoucher,
  draftOrderId,
  className,
}) => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const handleRemoveCustomer = () => {
    onClearAssignedCustomer?.();
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


  return (
    <>
      <div
        className={cn(
          "bg-white border-l border-[#e7e7e7] w-[350px] flex flex-col h-full overflow-hidden flex-shrink-0",
          className
        )}
      >
        {/* Assigned Customer Display */}
        {assignedCustomer?.name && (
          <div className="p-4 border-b border-[#e7e7e7]">
            <div className="bg-[#F0F0F0] rounded-lg px-4 h-[42px] flex items-center gap-3 border border-[#E04D30]">
              {/* User Icon */}
              <div className="flex-shrink-0">
                <User className="w-4 h-4 text-[#4A4A4A]" />
              </div>
              {/* Customer Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#E04D30] font-medium truncate">
                  {assignedCustomer.name}{" "}
                  {assignedCustomer.phone ? `- ${assignedCustomer.phone}` : ""}
                </p>
              </div>
              {/* Delete Button */}
              {onClearAssignedCustomer && (
                <button
                  type="button"
                  onClick={handleRemoveCustomer}
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-[#F0F0F0] rounded-full hover:bg-gray-200 transition-colors"
                  aria-label="Remove customer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#E04D30]" />
                </button>
              )}
            </div>
          </div>
        )}

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
              <button
                onClick={() => setIsVoucherModalOpen(true)}
                className="text-sm text-[#1B5CF0] hover:text-[#164aba] font-medium transition-colors cursor-pointer"
              >
                Giảm giá
              </button>
              {orderDiscountAmount > 0 && (
                <span className="text-sm text-[#272424] font-bold text-[#E04D30]">
                  -{formatCurrency(orderDiscountAmount)}
                </span>
              )}
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

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        finalAmount={finalAmount}
        onComplete={handleCompleteCheckout}
      />

      {/* Voucher Selection Modal */}
      <POSVoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onApply={async (voucherId) => {
          setSelectedVoucherId(voucherId);
          if (onApplyVoucher) {
            try {
              await onApplyVoucher(voucherId);
              setIsVoucherModalOpen(false);
            } catch (error) {
              console.error("Error applying voucher:", error);
            }
          }
        }}
        selectedVoucherId={selectedVoucherId}
        orderTotal={totalAmount}
      />
    </>
  );
};

export default POSOrderSummary;
