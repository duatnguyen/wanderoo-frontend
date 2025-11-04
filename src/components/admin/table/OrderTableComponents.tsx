import { ChipStatus } from "@/components/ui/chip-status";
import { DetailIcon } from "@/components/icons";

export interface OrderTableColumn {
  title: string;
  width: string;
  minWidth?: string;
  className?: string;
}

export interface OrderTableHeaderProps {
  columns: OrderTableColumn[];
  className?: string;
}

export const OrderTableHeader = ({
  columns,
  className = "bg-white w-full",
}: OrderTableHeaderProps) => {
  return (
    <div className={className}>
      <div className="flex items-center w-full">
        {columns.map((column, index) => (
          <div
            key={column.title}
            className={`bg-[#f6f6f6] flex items-center ${
              index === 0 ? "rounded-l-[6px]" : index === columns.length - 1 ? "rounded-r-[6px]" : ""
            } px-[8px] py-[12px] ${column.width} ${column.minWidth || ""} ${
              column.className || "justify-center"
            }`}
          >
            <p className={`font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.2] whitespace-pre-line ${column.className?.includes('justify-start') ? 'text-left' : 'text-center'}`}>
              {column.title.includes("&") ? column.title.replace("&", "&\n") : column.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export interface OrderRowProps {
  order: {
    id: string;
    customer: string;
    products: Array<{
      id: number;
      name: string;
      price: string;
      image: string;
    }>;
    paymentType: string;
    status: string;
    paymentStatus: string;
    category: string;
  };
  onViewDetail: (orderId: string, orderStatus: string, orderSource: string) => void;
  getPaymentTypeStatus: (paymentType: string) => any;
  getProcessingStatus: (status: string) => any;
  getPaymentStatus: (paymentStatus: string) => any;
}

export const OrderTableRow = ({
  order,
  onViewDetail,
  getPaymentTypeStatus,
  getProcessingStatus,
  getPaymentStatus,
}: OrderRowProps) => {

  return (
    <div className="w-full">
      {/* Customer Header Row */}
      <div className="flex justify-between px-[16px] py-[12px] border border-[#e7e7e7] bg-gray-50 rounded-t-[6px] w-full">
        <div className="flex gap-[10px]">
          <div className="w-[30px] h-[30px] rounded-[24px] bg-gray-200"></div>
          <div className="flex items-center gap-[8px]">
            <p className="font-montserrat font-semibold text-[#1a71f6] text-[12px] leading-[1.4]">
              {order.customer}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4]">
            Mã đơn hàng: {order.id}
          </p>
        </div>
      </div>

      {/* Product Row - Only show first product */}
      {order.products[0] && (
        <div className="flex border-b border-x rounded-b-[6px] border-[#e7e7e7] w-full">
          {/* Product Name Column - flex-1 với min-width 280px */}
          <div className="flex items-start gap-2 px-[12px] py-[12px] flex-1 min-w-[280px]">
            <img
              src={order.products[0].image}
              alt={order.products[0].name}
              className="border border-[#d1d1d1] w-[48px] h-[48px] object-cover bg-gray-100 rounded"
            />
            <div className="flex flex-col gap-[4px] flex-1 min-w-0">
              <p className="font-montserrat font-medium text-[#272424] text-[13px] leading-[1.3] line-clamp-2">
                {order.products[0].name}
              </p>
              <p className="font-montserrat font-medium text-[#888] text-[11px] leading-[1.3]">
                Phân loại: Size 40
              </p>
            </div>
          </div>

          {/* Price & Payment Type Column - 140px */}
          <div className="flex flex-col items-center justify-center gap-[4px] px-[8px] py-[12px] w-[140px]">
            <p className="font-montserrat font-medium text-[#272424] text-[12px] leading-[1.3] text-center">
              {order.products[0].price}
            </p>
            <ChipStatus
              status={getPaymentTypeStatus(order.paymentType)}
              labelOverride={order.paymentType}
            />
          </div>

          {/* Source Column - 80px */}
          <div className="flex items-center justify-center px-[8px] py-[12px] w-[80px]">
            <p className="font-montserrat font-medium text-[#272424] text-[12px] leading-[1.3] text-center">
              {order.category}
            </p>
          </div>

          {/* Shipping Column - 100px */}
          <div className="flex items-center justify-center px-[8px] py-[12px] w-[100px]">
            <p className="font-montserrat font-medium text-[#888] text-[12px] leading-[1.3] text-center">
              Giao hàng
            </p>
          </div>

          {/* Processing Status Column - 140px */}
          <div className="flex items-center justify-center px-[8px] py-[12px] w-[140px]">
            <ChipStatus
              status={getProcessingStatus(order.status)}
              labelOverride={order.status}
            />
          </div>

          {/* Payment Status Column - 140px */}
          <div className="flex items-center justify-center px-[8px] py-[12px] w-[140px]">
            <ChipStatus
              status={getPaymentStatus(order.paymentStatus)}
              labelOverride={order.paymentStatus}
            />
          </div>

          {/* Actions Column - 100px */}
          <div className="flex items-center justify-center gap-[4px] px-[8px] py-[12px] w-[100px]">
            <button
              className="flex gap-[4px] items-center font-montserrat font-medium text-[#1a71f6] text-[11px] leading-[1.3] cursor-pointer hover:underline text-center"
              onClick={() => onViewDetail(order.id, order.status, order.category)}
            >
              <DetailIcon size={14} color="#1a71f6" />
              Chi tiết
            </button>
          </div>
        </div>
      )}
    </div>
  );
};