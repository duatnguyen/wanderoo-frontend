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
            className={`bg-[#f6f6f6] flex items-center ${index === 0
                ? "rounded-l-[6px]"
                : index === columns.length - 1
                  ? "rounded-r-[6px]"
                  : ""
              } px-[16px] py-[14px] ${column.width} ${column.minWidth || ""} ${column.className || "justify-center"
              }`}
          >
            <p
              className={`font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.2] whitespace-pre-line ${column.className?.includes("justify-start") ? "text-left" : "text-center"}`}
            >
              {column.title.includes("&")
                ? column.title.replace("&", "&\n")
                : column.title}
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
  onViewDetail: (
    orderId: string,
    orderStatus: string,
    orderSource: string
  ) => void;
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
          {/* Sản phẩm Column - flex-1 with min-w-[260px] to match header */}
          <div className="flex items-start gap-2 px-[8px] py-[12px] flex-1 min-w-[260px] justify-start">
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

          {/* Giá và T.toán Column - w-[140px] min-w-[100px] to match header */}
          <div className="flex flex-col items-start justify-center gap-[4px] px-[8px] py-[12px] w-[140px] min-w-[100px]">
            <p className="font-montserrat font-medium text-[#272424] text-[12px] leading-[1.3]">
              {order.products[0].price}
            </p>
            <ChipStatus
              status={getPaymentTypeStatus(order.paymentType)}
              labelOverride={order.paymentType}
              size="small"
            />
          </div>

          {/* Nguồn Column - w-[80px] min-w-[80px] to match header */}
          <div className="flex items-center px-[8px] py-[12px] w-[80px] min-w-[80px] justify-start">
            <p className="font-montserrat font-medium text-[#272424] text-[12px] leading-[1.3]">
              {order.category}
            </p>
          </div>

          {/* Vận chuyển Column - w-[100px] min-w-[100px] to match header */}
          <div className="flex items-center px-[8px] py-[12px] w-[100px] min-w-[100px] justify-start">
            <p className="font-montserrat font-medium text-[#888] text-[12px] leading-[1.3]">
              Giao hàng
            </p>
          </div>

          {/* TT Đơn hàng Column - w-[140px] min-w-[140px] to match header */}
          <div className="flex items-center px-[8px] py-[12px] w-[140px] min-w-[140px] justify-start">
            <ChipStatus
              status={getProcessingStatus(order.status)}
              labelOverride={order.status}
              size="small"
            />
          </div>

          {/* TT Thanh toán Column - w-[140px] min-w-[140px] to match header */}
          <div className="flex items-center px-[8px] py-[12px] w-[140px] min-w-[140px] justify-start">
            <ChipStatus
              status={getPaymentStatus(order.paymentStatus)}
              labelOverride={order.paymentStatus}
              size="small"
            />
          </div>

          {/* Thao tác Column - w-[100px] min-w-[100px] to match header */}
          <div className="flex items-center gap-[4px] px-[8px] py-[12px] w-[100px] min-w-[100px] justify-start">
            <button
              className="flex gap-[4px] items-center font-montserrat font-medium text-[#1a71f6] text-[11px] leading-[1.3] cursor-pointer hover:underline"
              onClick={() =>
                onViewDetail(order.id, order.status, order.category)
              }
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
