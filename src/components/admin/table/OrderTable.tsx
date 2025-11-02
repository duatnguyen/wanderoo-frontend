import { ChipStatus } from "@/components/ui/chip-status";
import type { ChipStatusKey } from "@/components/ui/chip-status";
import { DetailIcon } from "@/components/icons";

export interface OrderProduct {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

export interface OrderRowData {
  id: string;
  customer: string;
  products: OrderProduct[];
  paymentType: string;
  status: string;
  paymentStatus: string;
  category: string;
  date: string;
  tabStatus: string;
}

export interface OrderTableProps {
  orders: OrderRowData[];
  onViewDetail: (orderId: string, orderStatus: string, orderSource: string) => void;
  getPaymentTypeStatus: (paymentType: string) => ChipStatusKey;
  getProcessingStatus: (status: string) => ChipStatusKey;
  getPaymentStatus: (paymentStatus: string) => ChipStatusKey;
  className?: string;
}

export const OrderTable = ({
  orders,
  onViewDetail,
  getPaymentTypeStatus,
  getProcessingStatus,
  getPaymentStatus,
  className = "w-full gap-2 flex flex-col -mt-[4px] overflow-x-auto",
}: OrderTableProps) => {
  return (
    <div className={className}>
      {/* Table Header */}
      <div className="bg-white w-full min-w-[1200px]">
        <div className="flex items-center w-full">
          <div className="bg-[#f6f6f6] flex items-center px-[16px] py-[14px] w-2/5 min-w-80 rounded-l-[6px]">
            <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4]">
              Tên sản phẩm
            </p>
          </div>
          <div className="bg-[#f6f6f6] flex items-center justify-center px-[16px] py-[14px] w-1/10 min-w-24">
            <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4]">
              Tổng đơn
            </p>
          </div>
          <div className="bg-[#f6f6f6] flex items-center justify-center px-[16px] py-[14px] w-1/10 min-w-20">
            <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4]">
              Nguồn
            </p>
          </div>
          <div className="bg-[#f6f6f6] flex items-center justify-center px-[16px] py-[14px] w-1/12 min-w-16">
            <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4]">
              ĐVVC
            </p>
          </div>
          <div className="bg-[#f6f6f6] flex items-center justify-center px-[16px] py-[14px] w-1/6 min-w-28">
            <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4]">
              Xử lý
            </p>
          </div>
          <div className="bg-[#f6f6f6] flex items-center justify-center px-[16px] py-[14px] w-1/6 min-w-28">
            <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4] text-center">
              Thanh toán
            </p>
          </div>
          <div className="bg-[#f6f6f6] flex items-center justify-center px-[16px] py-[14px] w-1/8 min-w-20 rounded-r-[6px]">
            <p className="font-montserrat font-semibold text-[#272424] text-[14px] leading-[1.4] text-center">
              Thao tác
            </p>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="w-full min-w-[1200px]">
        <div className="flex flex-col gap-[12px] w-full">
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onViewDetail={onViewDetail}
              getPaymentTypeStatus={getPaymentTypeStatus}
              getProcessingStatus={getProcessingStatus}
              getPaymentStatus={getPaymentStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export interface OrderRowProps {
  order: OrderRowData;
  onViewDetail: (orderId: string, orderStatus: string, orderSource: string) => void;
  getPaymentTypeStatus: (paymentType: string) => ChipStatusKey;
  getProcessingStatus: (status: string) => ChipStatusKey;
  getPaymentStatus: (paymentStatus: string) => ChipStatusKey;
}

export const OrderRow = ({
  order,
  onViewDetail,
  getPaymentTypeStatus,
  getProcessingStatus,
  getPaymentStatus,
}: OrderRowProps) => {
  return (
    <div className="w-full">
      {/* Customer Header Row */}
      <div className="flex justify-between px-[16px] py-[12px] border border-[#e7e7e7] bg-gray-50 rounded-t-[6px] min-w-[1200px]">
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
        <div className="flex border-b border-x rounded-b-[6px] border-[#e7e7e7] min-w-[1200px]">
          {/* Product Name Column */}
          <div className="flex items-start gap-0 px-[16px] py-[12px] flex-1 min-w-[450px]">
            <img
              src={order.products[0].image}
              alt={order.products[0].name}
              className="border border-[#d1d1d1] w-[56px] h-[56px] object-cover bg-gray-100"
            />
            <div className="flex flex-col gap-[8px] flex-1 pl-[8px] pr-[12px] pt-0">
              <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
                {order.products[0].name}
              </p>
              <p className="font-montserrat font-medium text-[#272424] text-[12px] leading-[1.4]">
                Phân loại hàng: Size 40
              </p>
            </div>
          </div>

          {/* Total Order Column */}
          <div className="flex flex-col items-center gap-[4px] px-[16px] py-[12px] w-[160px]">
            <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
              {order.products[0].price}
            </p>
            <ChipStatus
              status={getPaymentTypeStatus(order.paymentType)}
              labelOverride={order.paymentType}
            />
          </div>

          {/* Source Column */}
          <div className="flex items-center justify-center px-[16px] py-[12px] w-[150px]">
            <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
              {order.category}
            </p>
          </div>

          {/* Shipping Column */}
          <div className="flex items-center justify-center px-[16px] py-[12px] w-[120px]">
            <p className="font-montserrat font-medium text-[#272424] text-[14px] leading-[1.4]">
              .....
            </p>
          </div>

          {/* Processing Status Column */}
          <div className="flex items-center justify-center px-[16px] py-[12px] w-[200px]">
            <ChipStatus
              status={getProcessingStatus(order.status)}
              labelOverride={order.status}
            />
          </div>

          {/* Payment Status Column */}
          <div className="flex items-center justify-center px-[16px] py-[12px] w-[220px]">
            <ChipStatus
              status={getPaymentStatus(order.paymentStatus)}
              labelOverride={order.paymentStatus}
            />
          </div>

          {/* Actions Column */}
          <div className="flex items-center justify-center gap-[8px] px-[16px] py-[12px] w-[180px]">
            <button
              className="flex gap-[6px] items-center font-montserrat font-medium text-[#1a71f6] text-[14px] leading-[1.4] cursor-pointer hover:underline"
              onClick={() => onViewDetail(order.id, order.status, order.category)}
            >
              <DetailIcon size={16} color="#1a71f6" />
              Xem chi tiết
            </button>
          </div>
        </div>
      )}
    </div>
  );
};