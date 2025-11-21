import React, { useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import OrderTimeline from "../../../../components/admin/order/OrderTimeline";

function formatCurrencyVND(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
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
    bankInfo: "Ngân hàng Mb - 0862684255 - Nguyễn Thị Thanh",
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
  const [isCancelled, setIsCancelled] = useState(false);

  const stepsToRender = useMemo(() => {
    if (!isCancelled) {
      return data.statusSteps;
    }

    return [
      ...data.statusSteps.map((step) => ({
        ...step,
        completed: step.id === "reviewing",
      })),
      {
        id: "cancelled",
        label: "Yêu cầu đã được hủy",
        completed: true,
      },
    ];
  }, [data.statusSteps, isCancelled]);

  const latestCompletedStep = stepsToRender
    .filter((step) => step.completed)
    .slice(-1)[0];
  const activeStatus = isCancelled ? "Yêu cầu đã được hủy" : data.status;
  const statusTitle =
    activeStatus === "Chấp nhận yêu cầu"
      ? "Yêu cầu đã được chấp nhận"
      : activeStatus;
  const statusAdditionalNote = (() => {
    if (activeStatus === "Chấp nhận yêu cầu") {
      return "Bạn vui lòng chọn phương thức trả hàng. Nếu không yêu cầu sẽ bị hủy tự động trong 24 giờ.";
    }
    if (activeStatus === "Trả hàng") {
      return "Đơn hàng đang được hoàn trả.";
    }
    return undefined;
  })();
  const statusMessage = isCancelled
    ? "Bạn đã hủy yêu cầu Trả hàng hoàn tiền."
    : data.statusMessage;
  const statusCardClasses = isCancelled
    ? "bg-[#FFF8F1] border-[#FBD1BF]"
    : "bg-white border-gray-200";
  const statusTitleClasses = isCancelled
    ? "text-[18px] font-bold text-[#E04D30]"
    : "text-[18px] font-bold text-gray-900";
  const canCancelRequest =
    ["Yêu cầu đang được xem xét", "Chấp nhận yêu cầu"].includes(activeStatus) &&
    !isCancelled;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 border-b border-gray-200 h-[60px] flex items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              // Determine current step label to show in orders list
              const lastCompleted = data.statusSteps
                .filter((s) => s.completed)
                .slice(-1)[0];
              const currentLabel = lastCompleted?.label || "Trả hàng/Hoàn tiền";

              // Navigate back to orders page with "return" tab active
              // and override chip label for this order
              navigate("/user/profile/orders", {
                state: {
                  activeTab: "return",
                  statusOverride: {
                    orderId: data.orderId,
                    label: currentLabel,
                  },
                },
              });
            }}
            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Quay lại"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[20px] font-normal text-gray-900">
            Chi tiết yêu cầu trả hàng / hoàn tiền
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gray-50 space-y-6">
        {/* Status Timeline - same style as order detail */}
        {!isCancelled && <OrderTimeline steps={stepsToRender} />}

        {/* Current Status Box */}
        <div
          className={`rounded-lg border p-3 sm:p-4 text-[14px] space-y-3 ${statusCardClasses}`}
        >
          {/* Title + Cancel button */}
          <div className={statusTitleClasses}>{statusTitle}</div>

          {/* Description + select method */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col gap-1 text-[14px] text-gray-700 sm:flex-1">
              {statusAdditionalNote ? (
                <span className="text-[13px] text-gray-500">
                  {statusAdditionalNote}
                </span>
              ) : (
                <span className="text-[13px] text-gray-500">
                  {statusMessage}
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center sm:justify-end">
              {canCancelRequest && (
                <button
                  type="button"
                  onClick={() => {
                    console.log(
                      "Cancel return request for order:",
                      data.orderId
                    );
                    setIsCancelled(true);
                  }}
                  className="px-4 h-6 text-[13px] font-normal rounded-[10px] border border-[#E04D30] text-[#E04D30] bg-white hover:bg-[#E04D30] hover:text-white transition-colors w-full sm:w-auto"
                >
                  Hủy yêu cầu
                </button>
              )}
              {data.status === "Chấp nhận yêu cầu" && !isCancelled && (
                <button
                  type="button"
                  onClick={() => {
                    navigate(
                      `/user/profile/return-refund/${data.orderId}/method`,
                      {
                        state: { data },
                      }
                    );
                  }}
                  className="px-4 h-6 text-[13px] font-normal rounded-[10px] border border-[#E04D30] text-white bg-[#E04D30] hover:bg-[#c93d24] hover:border-[#c93d24] transition-colors w-full sm:w-auto sm:self-start"
                >
                  Chọn phương thức trả hàng
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tổng quan (Overview) Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-[14px]">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-[18px] font-bold text-gray-900 mb-0">
              Sản phẩm trả
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-[14px] text-gray-700 sm:justify-end sm:text-right">
              <span>Đơn hàng:</span>
              <button
                type="button"
                onClick={() => navigate(`/user/profile/orders/${data.orderId}`)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                #{data.orderId}
              </button>
              <span className="hidden sm:inline">|</span>
              <span>Đã yêu cầu lúc: {data.requestDate}</span>
            </div>
          </div>

          {/* Product Details */}
          {data.products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row gap-4 pb-4 last:pb-0"
            >
              <div className="flex-shrink-0">
                <div className="w-[60px] h-[60px] rounded-lg border border-gray-300 bg-transparent" />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-[14px] font-medium text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[14px] font-semibold text-gray-900">
                        {formatCurrencyVND(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[12px] text-gray-500 line-through">
                          {formatCurrencyVND(product.originalPrice)}
                        </span>
                      )}
                      {product.variant && (
                        <span className="inline-block px-3 py-1 rounded-lg bg-gray-100 text-[12px] text-gray-600">
                          {product.variant}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-[14px] text-gray-700">
                    Số lượng: {product.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Refund Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-[14px]">
          <h2 className="text-[18px] font-bold text-gray-900 mb-4">
            Thông tin hoàn tiền
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-gray-700">
                Số tiền hoàn nhận được
              </span>
              <span className="text-[14px] font-semibold text-red-600">
                {formatCurrencyVND(data.refundAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-gray-700">Hoàn tiền vào</span>
              <span className="text-[14px] text-gray-900">{data.bankInfo}</span>
            </div>
          </div>
        </div>

        {/* Reason and Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 text-[14px]">
          <h2 className="text-[18px] font-bold text-gray-900 mb-3">
            Lý do: {data.reason}
          </h2>
          <div className="border-b border-gray-200 mb-4" />
          <p className="text-[14px] text-gray-700 mb-4 whitespace-pre-line">
            {data.description}
          </p>
          {data.images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {data.images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl || "https://via.placeholder.com/60"}
                  alt={`Return evidence ${index + 1}`}
                  className="w-[60px] h-[60px] rounded border border-gray-300 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/60";
                  }}
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
