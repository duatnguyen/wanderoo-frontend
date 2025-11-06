import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function formatCurrencyVND(value: number) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("vi-VN")}đ`;
  }
}

interface ProductType {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  originalPrice?: number;
  variant?: string;
  quantity: number;
}

interface ReturnRefundStatus {
  id: string;
  label: string;
  completed: boolean;
  date?: string;
}

interface ReturnRefundDetailData {
  orderId: string;
  requestDate: string;
  status: string;
  statusMessage: string;
  products: ProductType[];
  refundAmount: number;
  bankInfo: string;
  returnOrderCode?: string;
  reason: string;
  description: string;
  images: string[];
  statusSteps: ReturnRefundStatus[];
}

function ArrowLeftIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

const ReturnRefundDetail: React.FC = () => {
  useParams<{ requestId: string }>(); // Get requestId from URL params
  const navigate = useNavigate();
  const location = useLocation();

  // Get data from location state or use mock data
  const requestData = (location.state as { data?: ReturnRefundDetailData })
    ?.data;

  // Mock data for demonstration
  const defaultData: ReturnRefundDetailData = {
    orderId: "WB0303168522",
    requestDate: "12:05 6/04/2025",
    status: "Yêu cầu đang được xem xét",
    statusMessage: "Shop đang xem xét yêu cầu trả hàng & hoàn tiền của bạn",
    products: [
      {
        id: "1",
        imageUrl: "",
        name: "Lều Dã Ngoại Bền Đẹp Rằn ri - Đồ Câu Simano",
        price: 199000,
        originalPrice: 230000,
        variant: "Đen",
        quantity: 1,
      },
    ],
    refundAmount: 199000,
    bankInfo: "Ngân hàng Mb -0862684255 -Nguyễn Thị Thanh",
    returnOrderCode: "250618UY3NJWXH",
    reason: "Khác với mô tả",
    description:
      "Mô tả sản phẩm ghi kích thước 2m nhưng tôi nhận được về có 1m9",
    images: ["", "", "", ""],
    statusSteps: [
      {
        id: "reviewing",
        label: "Yêu cầu đang được xem xét",
        completed: true,
        date: "10/09/2024 18:26",
      },
      {
        id: "accepted",
        label: "Chấp nhận yêu cầu",
        completed: false,
      },
      {
        id: "returning",
        label: "Trả hàng",
        completed: false,
      },
      {
        id: "checking",
        label: "Kiểm tra hàng hoàn",
        completed: false,
      },
      {
        id: "refunded",
        label: "Đã hoàn tiền",
        completed: false,
      },
    ],
  };

  const data = requestData || defaultData;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon />
          <span className="text-sm sm:text-base">Quay lại</span>
        </button>
        <div className="text-sm text-gray-600 text-right">
          <div>
            Đơn hàng: #{data.orderId} | Đã yêu cầu lúc: {data.requestDate}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="relative">
            {/* Continuous horizontal gray line */}
            <div
              className="hidden sm:block absolute left-0 right-0 h-0.5 bg-gray-300"
              style={{ top: "16px" }}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-0 relative">
              {data.statusSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center gap-2 sm:flex-1 relative"
                >
                  {/* Icon */}
                  <div className="relative z-10">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        step.completed
                          ? "bg-blue-600 text-white"
                          : "bg-white border-2 border-gray-300"
                      }`}
                    >
                      {step.completed && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col items-center text-center mt-2">
                    <div
                      className={`text-sm font-medium ${
                        step.completed ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </div>
                    {step.date && step.completed && (
                      <div className="text-xs text-gray-500 mt-1">
                        {step.date}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Status Box */}
        <div className="bg-gray-100 rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {data.status}
          </div>
          <div className="text-sm sm:text-base text-gray-700">
            {data.statusMessage}
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Sản phẩm trả hàng
          </h2>
          <div className="space-y-4">
            {data.products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-gray-300 bg-transparent flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-base sm:text-lg font-semibold text-red-600">
                      {formatCurrencyVND(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs sm:text-sm text-gray-500 line-through">
                        {formatCurrencyVND(product.originalPrice)}
                      </span>
                    )}
                    {product.variant && (
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        {product.variant}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-700">
                    Số lượng: {product.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Thông tin hoàn tiền
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-700">
                Số tiền hoàn nhận được
              </span>
              <span className="text-base sm:text-lg font-bold text-red-600">
                {formatCurrencyVND(data.refundAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-700">
                Hoàn tiền vào
              </span>
              <span className="text-sm sm:text-base text-gray-900">
                {data.bankInfo}
              </span>
            </div>
            {data.returnOrderCode && (
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-700">
                  Mã đơn hàng
                </span>
                <button
                  onClick={() => {
                    // Navigate to order detail or copy code
                    console.log("Order code:", data.returnOrderCode);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium transition-colors"
                >
                  {data.returnOrderCode}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reason and Description */}
        <div className="bg-gray-100 rounded-lg border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
            Lý do: {data.reason}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4 whitespace-pre-line">
            {data.description}
          </p>
          {data.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              {data.images.map((_, index) => (
                <div
                  key={index}
                  className="w-full aspect-square rounded-lg border border-gray-300 bg-transparent"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnRefundDetail;
