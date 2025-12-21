import { useState } from "react";
import { ChipStatus } from "@/components/ui/chip-status";
import { DetailIcon } from "@/components/icons";

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl || imageUrl.trim() === '') return undefined;
  
  // Clean up the image URL
  const cleanUrl = imageUrl.trim();
  
  // If already a full URL (http/https), return as is
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  
  // Get base URL from environment or default to localhost
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  
  // If relative path starting with /, add base URL
  if (cleanUrl.startsWith('/')) {
    return `${baseUrl}${cleanUrl}`;
  }
  
  // Handle common image paths from backend
  if (cleanUrl.startsWith('uploads/') || cleanUrl.startsWith('static/')) {
    return `${baseUrl}/${cleanUrl}`;
  }
  
  // Default: assume it's from uploads directory
  return `${baseUrl}/uploads/${cleanUrl}`;
};

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
              index === 0
                ? "rounded-l-[6px]"
                : index === columns.length - 1
                  ? "rounded-r-[6px]"
                  : ""
            } ${index === 0 ? "px-[16px]" : "px-[8px]"} py-[14px] ${column.width} ${column.minWidth || ""} ${
              column.className || "justify-center"
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
    customer: {
      name: string;
      username: string;
      image: string;
      orderCode: string;
    };
    products: Array<{
      id: number;
      name: string;
      price: string;
      unitPrice?: number; // Giá gốc per unit (snapshotProductPrice)
      productFinalPrice?: number; // Giá sau giảm per unit (snapshotProductFinalPrice)
      quantity?: number; // Số lượng (có thể undefined nếu null/0)
      image: string;
      sku?: string;
      variantAttributes?: Array<{
        groupName: string;
        value: string;
        groupLevel: number;
      }>;
      discountAmount?: number; // Tổng giá giảm (snapshotDiscountAmount)
      finalPrice?: number; // Tổng đơn giá (snapshotFinalPrice)
    }>;
    paymentType: string;
    status: string;
    paymentStatus: string;
    category: string;
    totalAmount: number;
    shippingFee: number;
    orderCode?: string;
    returnOrderCode?: string;
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
  const visibleProducts = isExpanded
    ? order.products
    : order.products.slice(0, 1);

  return (
    <div className="w-full">
      {/* Order Header with Order Information - Match with TableHeader Columns */}
      <div className="flex items-center border border-[#e7e7e7] bg-gray-50 rounded-t-[6px] w-full">
        {/* Đơn hàng Column - flex-1 min-w-[300px] */}
        <div className="flex items-center gap-[10px] px-[16px] py-[12px] flex-1 min-w-[300px]">
          {/* Avatar */}
          <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-montserrat font-semibold text-[14px] overflow-hidden">
            {order.customer.image ? (
              <img
                src={getImageUrl(order.customer.image)}
                alt={order.customer.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // Fallback to letter avatar if image fails to load
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.letter-avatar')) {
                    target.style.display = 'none';
                    const letterDiv = document.createElement('div');
                    letterDiv.className = 'letter-avatar flex items-center justify-center w-full h-full';
                    letterDiv.textContent = (order.customer.name || "?").charAt(0).toUpperCase();
                    parent.appendChild(letterDiv);
                  }
                }}
              />
            ) : (
              <span className="letter-avatar">
                {(order.customer.name || "?").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {/* Customer Info */}
          <div className="flex flex-col gap-[2px] flex-1 min-w-0">
            <div className="flex items-center gap-[6px]">
              <p className="font-montserrat font-semibold text-[#272424] text-[13px] leading-[1.4] truncate">
                {order.customer.name || "Khách hàng không tên"}
              </p>
              <p className="font-montserrat font-medium text-[#888] text-[11px] leading-[1.4]">
                @{order.customer.username || "N/A"}
              </p>
            </div>
            <p className="font-montserrat font-medium text-[#1a71f6] text-[11px] leading-[1.4]">
              Mã đơn trả hàng: {order.returnOrderCode || order.customer.orderCode || order.id}
            </p>
            <p className="font-montserrat font-medium text-[#888] text-[10px] leading-[1.4]">
              Đặt lúc: {order.date}
            </p>
          </div>
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

        {/* Tổng tiền Column - w-[140px] */}
        <div className="flex items-center justify-start px-[16px] py-[12px] w-[140px] min-w-[120px]">
          <p className="font-montserrat font-semibold text-[#e04d30] text-[12px] leading-[1.3]">
            {order.totalAmount.toLocaleString("vi-VN")}₫
            {order.shippingFee > 0 && (
              <span className="font-normal text-[#888] text-[10px] ml-1">
                (+{order.shippingFee.toLocaleString("vi-VN")})
              </span>
            )}
          </p>
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
      <div className="border-b border-x border-[#e7e7e7] rounded-b-[6px] w-full">
        {/* Products List */}
        {visibleProducts.map((product, index) => (
          <div
            key={product.id}
            className={`flex items-center px-[16px] py-[12px] ${index > 0 ? "border-t border-gray-200" : ""}`}
          >
            {/* Product Image and Info */}
            <div className="flex items-start gap-3 flex-1">
              <div className="border border-[#d1d1d1] w-[48px] h-[48px] object-cover bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                {product.image ? (
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      // Better fallback handling when image fails to load
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.fallback-content')) {
                        target.style.display = 'none';
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.className = 'fallback-content flex flex-col items-center justify-center w-full h-full bg-gray-100';
                        
                        if (product.sku) {
                          fallbackDiv.innerHTML = `
                            <svg class="w-4 h-4 text-gray-400 mb-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                            <span class="font-montserrat font-semibold text-[7px] text-gray-500 text-center px-1 leading-tight">${product.sku}</span>
                          `;
                        } else {
                          fallbackDiv.innerHTML = `
                            <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                          `;
                        }
                        
                        parent.appendChild(fallbackDiv);
                      }
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
                    <svg className="w-4 h-4 text-gray-400 mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    {product.sku && (
                      <span className="font-montserrat font-semibold text-[7px] text-gray-500 text-center px-1 leading-tight">
                        {product.sku}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                <p className="font-montserrat font-semibold text-[#272424] text-[13px] leading-[1.4] line-clamp-2">
                  {product.name}
                </p>
                
                {/* Giá gốc và giá sau giảm */}
                {(product.unitPrice && product.unitPrice > 0) && (
                  <div className="flex items-center gap-2 mt-0.5">
                    {product.productFinalPrice && 
                     product.productFinalPrice > 0 && 
                     product.productFinalPrice < product.unitPrice ? (
                      // Có discount: hiển thị giá gốc gạch ngang + giá sau giảm
                      <>
                        <span className="font-montserrat font-medium text-[#666] text-[11px] leading-[1.3] line-through">
                          {product.unitPrice.toLocaleString("vi-VN")}₫
                        </span>
                        <span className="font-montserrat font-semibold text-red-600 text-[11px] leading-[1.3]">
                          {product.productFinalPrice.toLocaleString("vi-VN")}₫
                        </span>
                      </>
                    ) : (
                      // Không có discount: chỉ hiển thị giá gốc màu đỏ (không gạch ngang)
                      <span className="font-montserrat font-semibold text-red-600 text-[11px] leading-[1.3]">
                        {product.unitPrice.toLocaleString("vi-VN")}₫
                      </span>
                    )}
                  </div>
                )}

                {product.variantAttributes &&
                product.variantAttributes.length > 0 ? (
                  <div className="flex flex-wrap gap-x-1.5 gap-y-1 mt-0.5">
                    {product.variantAttributes
                      .sort((a, b) => (a.groupLevel || 0) - (b.groupLevel || 0))
                      .map((attr, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 border border-blue-200 shadow-sm"
                          title={`${attr.groupName}: ${attr.value}`}
                        >
                          <span className="font-montserrat font-medium text-[10px] leading-[1.2] whitespace-nowrap">
                            <span className="text-[#666] font-semibold">
                              {attr.groupName}:
                            </span>
                            <span className="text-[#1a71f6] ml-1">
                              {attr.value}
                            </span>
                          </span>
                        </span>
                      ))}
                  </div>
                ) : (
                  <p className="font-montserrat font-medium text-[#999] text-[10px] leading-[1.3] italic">
                    Không có phân loại
                  </p>
                )}
                {product.sku && (
                  <p className="font-montserrat font-medium text-[#999] text-[10px] leading-[1.3] mt-0.5">
                    SKU: <span className="font-semibold">{product.sku}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Quantity, Discount, and Final Price */}
            <div className="flex items-center gap-[16px] min-w-[280px] justify-end">
              {product.quantity && product.quantity > 0 && (
                <div className="text-center min-w-[60px]">
                  <p className="font-montserrat font-medium text-[#888] text-[10px] leading-[1.3] mb-1">
                    Số lượng
                  </p>
                  <p className="font-montserrat font-semibold text-[#272424] text-[13px] leading-[1.3]">
                    x{product.quantity}
                  </p>
                </div>
              )}
              {product.discountAmount && product.discountAmount > 0 && (
                <div className="text-right min-w-[90px]">
                  <p className="font-montserrat font-medium text-[#888] text-[10px] leading-[1.3] mb-1">
                    Tổng giảm
                  </p>
                  <p className="font-montserrat font-semibold text-red-600 text-[12px] leading-[1.3]">
                    -{product.discountAmount.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              )}
              {product.finalPrice && product.finalPrice > 0 && (
                <div className="text-right min-w-[100px]">
                  <p className="font-montserrat font-medium text-[#888] text-[10px] leading-[1.3] mb-1">
                    Tổng đơn giá
                  </p>
                  <p className="font-montserrat font-semibold text-[#e04d30] text-[13px] leading-[1.3]">
                    {product.finalPrice.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              )}
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
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  Thu gọn
                </>
              ) : (
                <>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  Xem thêm {order.products.length - 1} sản phẩm
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
