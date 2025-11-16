import { useState } from "react";
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
              } ${index === 0 ? "px-[16px]" : "px-[8px]"} py-[14px] ${column.width} ${column.minWidth || ""} ${column.className || "justify-center"
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
      quantity: number;
      image: string;
      variantAttributes?: Array<{
        groupName: string;
        value: string;
        groupLevel: number;
      }>;
    }>;
    paymentType: string;
    status: string;
    paymentStatus: string;
    category: string;
    totalAmount: number;
    shippingFee: number;
    orderCode?: string;
    itemsCount: number;
    date: string;
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
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleProducts = isExpanded ? order.products : order.products.slice(0, 1);

  return (
    <div className="w-full">
      {/* Order Header with Order Information - Match with TableHeader Columns */}
      <div className="flex items-center border border-[#e7e7e7] bg-gray-50 rounded-t-[6px] w-full">
        {/* Đơn hàng Column - flex-1 min-w-[300px] */}
        <div className="flex items-center gap-[10px] px-[16px] py-[12px] flex-1 min-w-[300px]">
          {/* Avatar */}
          <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-montserrat font-semibold text-[14px]">
            {order.customer.charAt(0).toUpperCase()}
          </div>
          {/* Customer Info */}
          <div className="flex flex-col gap-[2px] flex-1 min-w-0">
            <div className="flex items-center gap-[6px]">
              <p className="font-montserrat font-semibold text-[#272424] text-[13px] leading-[1.4] truncate">
                Khách hàng #{order.id}
              </p>
              <p className="font-montserrat font-medium text-[#888] text-[11px] leading-[1.4]">
                @user{order.id}
              </p>
            </div>
            <p className="font-montserrat font-medium text-[#1a71f6] text-[11px] leading-[1.4]">
              Mã đơn: {order.orderCode || `DH${order.id}`}
            </p>
            <p className="font-montserrat font-medium text-[#888] text-[10px] leading-[1.4]">
              Đặt lúc: {order.date}
            </p>
          </div>
        </div>

        {/* Tổng tiền Column - w-[140px] */}
        <div className="flex items-center justify-start px-[16px] py-[12px] w-[140px] min-w-[120px]">
          <p className="font-montserrat font-semibold text-[#e04d30] text-[12px] leading-[1.3]">
            {order.totalAmount.toLocaleString('vi-VN')}₫
            {order.shippingFee > 0 && (
              <span className="font-normal text-[#888] text-[10px] ml-1">
                (+{order.shippingFee.toLocaleString('vi-VN')})
              </span>
            )}
          </p>
        </div>

        {/* Nguồn Column - w-[90px] */}
        <div className="flex items-center justify-start px-[16px] py-[12px] w-[90px] min-w-[80px]">
          <p className="font-montserrat font-medium text-[#272424] text-[12px] leading-[1.3]">
            {order.category}
          </p>
        </div>

        {/* Thanh toán Column - w-[120px] */}
        <div className="flex items-center justify-start px-[16px] py-[12px] w-[120px] min-w-[100px]">
          <ChipStatus
            status={getPaymentTypeStatus(order.paymentType)}
            labelOverride={order.paymentType}
            size="small"
          />
        </div>

        {/* TT Đơn hàng Column - w-[140px] */}
        <div className="flex items-center justify-start px-[16px] py-[12px] w-[140px] min-w-[140px]">
          <ChipStatus
            status={getProcessingStatus(order.status)}
            labelOverride={order.status}
            size="small"
          />
        </div>

        {/* TT Thanh toán Column - w-[140px] */}
        <div className="flex items-center justify-start px-[16px] py-[12px] w-[140px] min-w-[140px]">
          <ChipStatus
            status={getPaymentStatus(order.paymentStatus)}
            labelOverride={order.paymentStatus}
            size="small"
          />
        </div>

        {/* Thao tác Column - w-[120px] */}
        <div className="flex items-center justify-start px-[16px] py-[12px] w-[120px] min-w-[100px]">
          <button
            className="flex gap-[4px] items-center font-montserrat font-medium text-[#1a71f6] text-[11px] leading-[1.3] cursor-pointer hover:underline"
            onClick={() => onViewDetail(order.id, order.status, order.category)}
          >
            <DetailIcon size={14} color="#1a71f6" />
            Chi tiết
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div className="border-b border-x border-[#e7e7e7] w-full">
        {/* Products List */}
        {visibleProducts.map((product, index) => (
          <div key={product.id} className={`flex items-center px-[16px] py-[12px] ${index > 0 ? 'border-t border-gray-200' : ''}`}>
            {/* Product Image and Info */}
            <div className="flex items-start gap-3 flex-1">
              <img
                src={product.image || '/placeholder-product.png'}
                alt={product.name}
                className="border border-[#d1d1d1] w-[48px] h-[48px] object-cover bg-gray-100 rounded"
              />
              <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                <p className="font-montserrat font-medium text-[#272424] text-[13px] leading-[1.3] line-clamp-1">
                  {product.name.split(' / ')[0] || product.name}
                </p>
                {product.variantAttributes && product.variantAttributes.length > 0 && (
                  <p className="font-montserrat font-medium text-[#888] text-[11px] leading-[1.3]">
                    {product.variantAttributes
                      .sort((a, b) => a.groupLevel - b.groupLevel)
                      .map(attr => `${attr.groupName}: ${attr.value}`)
                      .join(' • ')}
                  </p>
                )}
              </div>
            </div>

            {/* Quantity and Price */}
            <div className="flex items-center gap-[16px] min-w-[200px]">
              <div className="text-center">
                <p className="font-montserrat font-medium text-[#888] text-[10px] leading-[1.3] mb-1">
                  Số lượng
                </p>
                <p className="font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.3]">
                  x{product.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-montserrat font-medium text-[#888] text-[10px] leading-[1.3] mb-1">
                  Đơn giá
                </p>
                <p className="font-montserrat font-semibold text-[#272424] text-[12px] leading-[1.3]">
                  {product.price}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Show More/Less Button */}
        {order.products.length > 1 && (
          <div className="flex justify-center py-[8px] border-t border-gray-200">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-[4px] font-montserrat font-medium text-[#1a71f6] text-[11px] leading-[1.3] cursor-pointer hover:underline"
            >
              {isExpanded ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Thu gọn
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Xem thêm {order.products.length - 1} sản phẩm
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Bottom rounded corner */}
      <div className="h-[1px] border-b border-x border-[#e7e7e7] rounded-b-[6px]"></div>
    </div>
  );
};
