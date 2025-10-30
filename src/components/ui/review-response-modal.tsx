import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface ReviewResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (response: string) => void;
  customerName: string;
  initialResponse?: string;
}

const ReviewResponseModal: React.FC<ReviewResponseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialResponse = "",
}) => {
  const [response, setResponse] = useState(initialResponse);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(response);
    setResponse("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred overlay background */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="bg-white relative rounded-[12px] w-[95%] max-w-[650px] shadow-xl">
        {/* Header */}
        <div className="px-[16px] py-[16px] border-b border-[#d1d1d1]">
          <h3 className="font-bold text-[#272424] text-[16px]">
            Phản hồi đánh giá của khách hàng
          </h3>
        </div>

        {/* Content */}
        <div className="p-[16px]">
          <div className="border-2 border-[#e04d30] rounded-[12px] p-[16px]">
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full outline-none resize-none text-[12px] font-semibold placeholder:text-[#888888] bg-transparent min-h-[100px]"
              placeholder="Nhập phản hồi đánh giá"
              rows={4}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-[10px] items-center justify-end px-[16px] py-[12px]">
          <Button variant="secondary" onClick={onClose}>
            Huỷ
          </Button>
          <Button onClick={handleSubmit}>Xác nhận</Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewResponseModal;
