import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ProductType {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  originalPrice?: number;
  variant?: string;
  quantity: number;
}

interface OrderType {
  id: string;
  orderDate: string;
}

interface ReturnRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: OrderType;
  product?: ProductType;
  allProducts?: ProductType[]; // For orders with multiple products
}

const ReturnRefundModal: React.FC<ReturnRefundModalProps> = ({
  isOpen,
  onClose,
  order,
  product,
  allProducts,
}) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<
    "received-with-issue" | "not-received" | null
  >(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedOption || !order) return;

    // If order has multiple products, navigate to product selection page
    if (allProducts && allProducts.length > 1) {
      navigate("/user/return-refund/select-products", {
        state: {
          order: {
            id: order.id,
            orderDate: order.orderDate,
            products: allProducts,
          },
          option: selectedOption,
        },
      });
    } else if (product) {
      // Single product - navigate directly to return/refund request page
      navigate("/user/return-refund", {
        state: { order, product, option: selectedOption },
      });
    }
    onClose();
    setSelectedOption(null);
  };

  const handleClose = () => {
    setSelectedOption(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Tình huống bạn đang gặp?
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-6">
            {/* Option 1: Received with issue */}
            {/* Option 1: Received with issue */}
            <Button
              variant="outline"
              onClick={() => setSelectedOption("received-with-issue")}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all h-auto justify-start items-start whitespace-normal ${
                selectedOption === "received-with-issue"
                  ? "border-blue-500 bg-blue-50 hover:bg-blue-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3 w-full">
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    selectedOption === "received-with-issue"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-400"
                  }`}
                >
                  {selectedOption === "received-with-issue" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm sm:text-base font-medium text-gray-900 mb-2 whitespace-normal">
                    Tôi đã nhận hàng nhưng hàng có vấn đề (bể vỡ, sai mẫu, hàng
                    lỗi, khác mô tả...) - Miễn ship hoàn về
                  </p>
                  <div className="mt-2">
                    <p className="text-xs sm:text-sm text-red-600 font-medium">
                      Lưu ý:
                    </p>
                    <p className="text-xs sm:text-sm text-red-600 whitespace-normal">
                      Trường hợp yêu cầu trả hàng hoàn tiền của bạn được chấp
                      nhận, voucher có thể không được hoàn lại
                    </p>
                  </div>
                </div>
              </div>
            </Button>

            {/* Option 2: Not received */}
            <Button
              variant="outline"
              onClick={() => setSelectedOption("not-received")}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all h-auto justify-start items-start whitespace-normal ${
                selectedOption === "not-received"
                  ? "border-blue-500 bg-blue-50 hover:bg-blue-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3 w-full">
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                    selectedOption === "not-received"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-400"
                  }`}
                >
                  {selectedOption === "not-received" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm sm:text-base font-medium text-gray-900 mb-2 whitespace-normal">
                    Tôi chưa nhận hàng/thùng hàng rỗng
                  </p>
                  <div className="mt-2">
                    <p className="text-xs sm:text-sm text-red-600 font-medium">
                      Lưu ý:
                    </p>
                    <p className="text-xs sm:text-sm text-red-600 whitespace-normal">
                      Trường hợp yêu cầu trả hàng hoàn tiền của bạn được chấp
                      nhận, voucher có thể không được hoàn lại
                    </p>
                  </div>
                </div>
              </div>
            </Button>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="w-full sm:w-auto"
            >
              Tiếp tục
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundModal;
