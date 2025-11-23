import React, { useState } from "react";
import { Package } from "lucide-react";

interface CancelOrderConfirmationPopupWebsiteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderData: any;
}

const CancelOrderConfirmationPopupWebsite: React.FC<CancelOrderConfirmationPopupWebsiteProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderData,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancelReasons = [
    "Khách hàng yêu cầu hủy",
    "Sản phẩm hết hàng",
    "Thông tin giao hàng không chính xác",
    "Khách hàng không liên lạc được",
    "Sản phẩm bị lỗi/hỏng",
    "Giá sản phẩm thay đổi",
    "Khác (tự nhập lý do)",
  ];

  const handleSubmit = async () => {
    const finalReason =
      selectedReason === "Khác (tự nhập lý do)"
        ? customReason.trim()
        : selectedReason;

    if (!finalReason) {
      alert("Vui lòng chọn hoặc nhập lý do hủy đơn hàng!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm();
      // Reset form
      setSelectedReason("");
      setCustomReason("");
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
      setCustomReason("");
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
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
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
                Chọn lý do hủy đơn hàng
              </h3>
            </div>

            <div className="space-y-3">
              {cancelReasons.map((reason, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 rounded-[12px] border-2 cursor-pointer transition-all duration-200 ${selectedReason === reason
                    ? "border-[#dc3545] bg-red-50"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-[#dc3545] border-gray-300 focus:ring-[#dc3545] focus:ring-2"
                  />
                  <span
                    className={`ml-3 font-montserrat font-medium text-[14px] ${selectedReason === reason
                      ? "text-[#dc3545]"
                      : "text-gray-700"
                      }`}
                  >
                    {reason}
                  </span>
                </label>
              ))}
            </div>

            {/* Custom Reason Input */}
            {selectedReason === "Khác (tự nhập lý do)" && (
              <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                <label className="block font-montserrat font-medium text-[14px] text-gray-700 mb-2">
                  Nhập lý do cụ thể
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Vui lòng mô tả lý do hủy đơn hàng..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-[10px] font-montserrat text-[14px] focus:ring-2 focus:ring-[#dc3545] focus:border-[#dc3545] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-2 font-montserrat font-medium text-[12px] text-gray-500">
                  Tối thiểu 10 ký tự ({customReason.length}/10)
                </p>
              </div>
            )}
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
              disabled={
                isSubmitting ||
                !selectedReason ||
                (selectedReason === "Khác (tự nhập lý do)" &&
                  customReason.trim().length < 10)
              }
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