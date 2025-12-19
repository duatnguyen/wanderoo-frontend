import React, { useState } from "react";
import { Package, X } from "lucide-react";
import { Select } from "antd";

interface CancelOrderConfirmationPopupWebsiteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reasonCancel: string) => void;
  orderData: any;
}

const CancelOrderConfirmationPopupWebsite: React.FC<
  CancelOrderConfirmationPopupWebsiteProps
> = ({ isOpen, onClose, onConfirm, orderData }) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All cancel reasons from OrderCancelReasonEnum (for admin)
  const cancelReasonOptions = [
    // Customer reasons
    { value: "CUSTOMER_CHANGE_MIND", label: "Khách hàng đổi ý" },
    { value: "CUSTOMER_NOT_WANT", label: "Khách hàng không muốn mua nữa" },
    { value: "CUSTOMER_NOT_RESPONDING", label: "Không liên lạc được khách hàng" },
    { value: "CUSTOMER_REFUSED", label: "Khách hàng từ chối nhận hàng" },
    { value: "CUSTOMER_FOUND_CHEAPER", label: "Khách hàng tìm được giá rẻ hơn" },
    { value: "CUSTOMER_WRONG_ORDER", label: "Khách hàng đặt nhầm đơn hàng" },
    { value: "CUSTOMER_ADDRESS_WRONG", label: "Khách hàng nhập sai địa chỉ" },
    { value: "CUSTOMER_NO_MONEY", label: "Khách hàng không đủ tiền" },
    { value: "CUSTOMER_DELAYED_DELIVERY", label: "Khách hàng không hài lòng về thời gian giao hàng" },
    { value: "CUSTOMER_PRODUCT_NOT_MATCH", label: "Sản phẩm không đúng như mô tả" },
    { value: "CUSTOMER_CANCEL_BEFORE_SHIP", label: "Khách hàng hủy trước khi giao hàng" },
    // Shop/System reasons
    { value: "OUT_OF_STOCK", label: "Hết hàng" },
    { value: "PRICE_CHANGED", label: "Giá sản phẩm thay đổi" },
    { value: "DELIVERY_ISSUE", label: "Vấn đề giao hàng" },
    { value: "PAYMENT_FAILED", label: "Thanh toán thất bại" },
    { value: "DUPLICATE_ORDER", label: "Đơn hàng trùng lặp" },
    { value: "SYSTEM_ERROR", label: "Lỗi hệ thống" },
    { value: "SHOP_CANNOT_FULFILL", label: "Shop không thể thực hiện đơn hàng" },
    { value: "OTHER", label: "Lý do khác" },
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert("Vui lòng chọn lý do hủy đơn hàng!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(selectedReason);
      // Reset form
      setSelectedReason("");
      onClose();
    } catch (error) {
      console.error("Error canceling order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason("");
      onClose();
    }
  };

  // Handle ESC key press and prevent body scroll
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isSubmitting]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-[20px] shadow-2xl max-w-[600px] w-full overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#dc3545] to-[#c82333] px-6 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-montserrat font-bold text-[20px] text-white leading-tight">
                  Xác nhận hủy đơn hàng
                </h2>
                <p className="font-montserrat font-medium text-[12px] text-white/80">
                  Vui lòng chọn lý do hủy đơn hàng
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order ID Section */}
          <div className="bg-gray-50 rounded-[12px] p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-montserrat font-medium text-[12px] text-gray-600 uppercase tracking-wide">
                  Đơn hàng sẽ bị hủy
                </p>
                <p className="font-montserrat font-bold text-[16px] text-gray-900 font-mono">
                  #{orderData.code}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-montserrat font-semibold text-[14px] text-amber-800">
                  Lưu ý quan trọng
                </p>
                <p className="font-montserrat font-medium text-[13px] text-amber-700 mt-1">
                  Hành động này không thể hoàn tác. Đơn hàng sẽ bị hủy vĩnh viễn
                  và khách hàng sẽ được thông báo.
                </p>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-[#dc3545] rounded-full"></div>
              <h3 className="font-montserrat font-semibold text-[16px] text-gray-900">
                Chọn lý do hủy đơn hàng <span className="text-red-500">*</span>
              </h3>
            </div>

            <Select
              value={selectedReason}
              onChange={(value) => setSelectedReason(value)}
              placeholder="Chọn lý do hủy đơn hàng"
              className="w-full"
              size="large"
              disabled={isSubmitting}
              getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
              options={cancelReasonOptions}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-montserrat font-semibold text-[14px] rounded-[12px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy bỏ
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason}
              className="flex-1 sm:flex-none px-8 py-3 bg-[#dc3545] hover:bg-[#c82333] active:bg-[#bd2130] text-white font-montserrat font-semibold text-[14px] rounded-[12px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang hủy đơn...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Xác nhận hủy đơn hàng</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderConfirmationPopupWebsite;
