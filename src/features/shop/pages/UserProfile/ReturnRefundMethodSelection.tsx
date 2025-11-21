import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import OrderTimeline from "../../../../components/admin/order/OrderTimeline";
import Button from "../../../../components/shop/Button";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
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
  products: Product[];
  refundAmount: number;
  bankInfo: string;
  returnOrderCode?: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  statusSteps: ReturnRefundStatus[];
}

type ReturnMethod = "pickup" | "dropoff";

type LocationState = { data?: ReturnRefundDetailData };

const formatCurrencyVND = (value: number) =>
  `${value.toLocaleString("vi-VN")}đ`;

const ReturnRefundMethodSelection: React.FC = () => {
  useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const requestData = (location.state as LocationState)?.data;

  const defaultData: ReturnRefundDetailData = {
    orderId: "WB0303168522",
    requestDate: "12:05 6/04/2025",
    status: "Chấp nhận yêu cầu",
    statusMessage:
      "Bạn vui lòng chọn phương thức trả hàng. Nếu không yêu cầu sẽ bị hủy tự động trong 24 giờ.",
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
    address: "Yên Tiến, Ý Yên, Nam Định",
    contactName: "Thanh Nguyễn",
    contactPhone: "0862684255",
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
        completed: true,
        date: "11/09/2024 18:26",
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

  const [selectedMethod, setSelectedMethod] = useState<ReturnMethod>("pickup");

  const pickupInfo = useMemo(
    () => ({
      title: "Đơn vị vận chuyển đến lấy hàng",
      badge: "Miễn ship hoàn về",
      description: "Đơn vị vận chuyển sẽ đến lấy hàng tại địa chỉ đã cung cấp.",
      refundAmount: data.refundAmount,
      contact: "Thanh Nguyên, 086268423",
      address:
        data.address ||
        "Đường Đắp Mỹ Tạp Hóa Cô Hoa Đối Diện Có Đường Bê Tông Chay Hết Đường Bê Tông Quẹo Trái Nhà Nằm Bên Phải Thị Trấn An Phú, Huyện An Phú, An Giang",
    }),
    [data]
  );

  const dropOffInfo = useMemo(
    () => ({
      title: "Trả hàng tại bưu cục",
      badge: "Miễn ship hoàn về",
      description:
        "Bạn có thể chủ động mang hàng ra bưu cục đối tác gần nhất để gửi đi.",
    }),
    []
  );

  const handleConfirm = () => {
    console.log("Selected return method:", selectedMethod);
    alert("Bạn đã chọn phương thức trả hàng: " + selectedMethod);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 sm:px-6 border-b border-gray-200 h-[60px] flex items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Quay lại"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[20px] font-normal text-gray-900">
            Chọn phương thức trả hàng
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 bg-gray-50 space-y-6">
        {/* Timeline */}
        <OrderTimeline steps={data.statusSteps} />

        {/* Status Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 text-[14px] space-y-2">
          <div className="text-[18px] font-bold text-gray-900">
            Yêu cầu đã được chấp nhận
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-[14px] text-gray-700">
              Bạn vui lòng chọn phương thức trả hàng. Nếu không yêu cầu sẽ bị
              hủy tự động trong 24 giờ.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Cancel return request for order:", data.orderId);
              }}
              className="!border-[#E04D30] !text-[#E04D30] !font-normal !rounded-[10px] hover:!bg-[#E04D30] hover:!text-white w-full sm:w-auto !h-6 !text-[13px]"
            >
              Hủy yêu cầu
            </Button>
          </div>
        </div>

        {/* Methods */}
        <div className="space-y-4">
          <MethodCard
            selected={selectedMethod === "pickup"}
            onSelect={() => setSelectedMethod("pickup")}
            title={pickupInfo.title}
            badge={pickupInfo.badge}
            description={pickupInfo.description}
            refundAmount={pickupInfo.refundAmount}
            contact={pickupInfo.contact}
            address={pickupInfo.address}
          />
          <MethodCard
            selected={selectedMethod === "dropoff"}
            onSelect={() => setSelectedMethod("dropoff")}
            title={dropOffInfo.title}
            badge={dropOffInfo.badge}
            description={dropOffInfo.description}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="!border-[#E04D30] !text-[#E04D30] !font-normal !rounded-[10px] hover:!bg-[#E04D30] hover:!text-white w-full sm:w-auto !h-9 !text-[13px]"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            className="!bg-[#E04D30] !border-[#E04D30] !font-normal !rounded-[10px] hover:!bg-[#c93d24] hover:!border-[#c93d24] w-full sm:w-auto !h-9 !text-[13px]"
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};

interface MethodCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  badge: string;
  description: string;
  refundAmount?: number;
  contact?: string;
  address?: string;
}

const MethodCard: React.FC<MethodCardProps> = ({
  selected,
  onSelect,
  title,
  badge,
  description,
  refundAmount,
  contact,
  address,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left bg-white rounded-lg border p-4 sm:p-6 transition-colors ${
        selected
          ? "border-[#E04D30] shadow-[0_8px_24px_rgba(224,77,48,0.12)]"
          : "border-gray-200 hover:border-[#E04D30]/60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            selected ? "border-[#E04D30]" : "border-gray-300"
          }`}
        >
          <span
            className={`block w-2.5 h-2.5 rounded-full transition-colors ${
              selected ? "bg-[#E04D30]" : "bg-transparent"
            }`}
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[16px] sm:text-[18px] font-semibold text-gray-900">
              {title}
            </h3>
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-[#E04D30] bg-[#FFE6DD] rounded-full">
              {badge}
            </span>
          </div>
          {title === "Đơn vị vận chuyển đến lấy hàng" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div className="space-y-3">
                <div>
                  <div className="text-[13px] text-gray-500">
                    Số tiền hoàn nhận được
                  </div>
                  <div className="text-[16px] font-semibold text-gray-900">
                    {typeof refundAmount === "number"
                      ? formatCurrencyVND(refundAmount)
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[13px] text-gray-500">
                    Địa chỉ lấy hàng
                  </div>
                  <div className="text-[14px] text-gray-700">
                    {address ||
                      "Đường Đắp Mỹ Tạp Hóa Cô Hoa Đối Diện Có Đường Bê Tông Chay Hết Đường Bê Tông Quẹo Trái Nhà Nằm Bên Phải Thị Trấn An Phú, Huyện An Phú, An Giang"}
                  </div>
                </div>
              </div>
              <div className="space-y-3 sm:text-right">
                <div>
                  <div className="text-[13px] text-gray-500">
                    Thông tin liên hệ
                  </div>
                  <div className="text-[14px] text-gray-700">
                    {contact || "—"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-gray-600">{description}</p>
          )}
        </div>
      </div>
    </button>
  );
};

export default ReturnRefundMethodSelection;
