import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ReturnRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  orderId?: string;
}

const ReturnRefundModal: React.FC<ReturnRefundModalProps> = ({
  isOpen,
  onClose,
  productId,
  orderId,
}) => {
  const navigate = useNavigate();
  const [selectedSituation, setSelectedSituation] = useState<string>("");

  const handleSituationSelect = (situationId: string) => {
    setSelectedSituation(situationId);
    // Navigate to return/refund page with selected situation
    if (situationId === "received-problem" && orderId && productId) {
      navigate(
        `/user/return-refund?orderId=${orderId}&productId=${productId}&situation=${situationId}`
      );
    }
  };

  const handleClose = () => {
    setSelectedSituation("");
    onClose();
  };

  if (!isOpen) return null;

  const situations = [
    {
      id: "received-problem",
      label:
        "Tôi đã nhận hàng nhưng hàng có vấn đề (bể vỡ, sai mẫu, hàng lỗi, khác mô tả...) - Miễn ship hoàn về",
    },
    {
      id: "not-received",
      label: "Tôi chưa nhận hàng/thùng hàng rỗng",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            Tình huống bạn đang gặp?
          </h2>
        </div>

        {/* Warning Note */}
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">
            Lưu ý: Trường hợp yêu cầu trả hàng hoàn tiền của bạn được chấp nhận,
            voucher có thể không được hoàn lại
          </p>
        </div>

        {/* Situation Options */}
        <div className="px-6 py-4 space-y-3">
          {situations.map((situation) => (
            <label
              key={situation.id}
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedSituation === situation.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="situation"
                value={situation.id}
                checked={selectedSituation === situation.id}
                onChange={(e) => handleSituationSelect(e.target.value)}
                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex-1 text-sm text-gray-900">
                {situation.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundModal;
