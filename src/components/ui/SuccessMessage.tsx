import React from "react";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  title?: string;
  message: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title = "Thành công!",
  message,
  onClose,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative z-50 bg-white rounded-[24px] p-6 max-w-md mx-4 shadow-2xl">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-[20px] font-bold text-[#272424] font-montserrat mb-2">
            {title}
          </h2>
          <p className="text-[14px] text-[#666666] font-montserrat mb-6">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          {onClose && (
            <Button variant="secondary" onClick={onClose}>
              Đóng
            </Button>
          )}
          {onAction && actionLabel && (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
