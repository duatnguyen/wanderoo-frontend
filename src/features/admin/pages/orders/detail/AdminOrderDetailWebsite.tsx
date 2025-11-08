// src/pages/admin/AdminOrderDetailWebsite.tsx
import React, { useState } from "react";
import { ArrowLeft, MapPin, Truck, Wallet, Package, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  PageContainer,
  ContentCard,
} from "@/components/common";
// Mock data cho order detail Website
const getMockOrderData = (status: string) => {
  const baseOrder = {
    source: "Website",
    customer: {
      name: "buiminhhang",
      avatar: "",
    },
    shipping: {
      address: "0862684255, Nguyễn Thị Thanh",
      district: "Xóm *** - thị xã ***-tỉnh Thái Bình",
      method: "SPX: #123F5124Q412",
    },
  };

  switch (status) {
    case "Chờ xác nhận":
      return {
        ...baseOrder,
        id: "8F878Q01",
        status: "Chờ xác nhận",
        timeline: [
          {
            status: "Chờ xác nhận đơn hàng",
            date: "13:20 12/3/2003",
            isCompleted: false,
          },
        ],
      };
    case "Đã xác nhận":
      return {
        ...baseOrder,
        id: "8F878Q02",
        status: "Đã xác nhận",
        timeline: [
          {
            status: "Đơn hàng đang được chuẩn bị",
            date: "13:20 12/3/2003",
            isCompleted: false,
          },
        ],
      };
    case "Đang giao":
      return {
        ...baseOrder,
        id: "8F878Q03",
        status: "Đang giao",
        timeline: [
          {
            status: "Đang trong quá trình giao hàng",
            date: "13:20 12/3/2003",
            isCompleted: false,
          },
        ],
      };
    case "Đã hủy":
      return {
        ...baseOrder,
        id: "8F878Q04",
        status: "Đã hủy",
        timeline: [
          {
            status: "Đơn hàng đã bị hủy",
            date: "13:20 12/3/2003",
            isCompleted: true,
          },
        ],
      };
    default:
      return {
        ...baseOrder,
        id: "8F878Q29",
        status: "Đã hoàn thành",
        timeline: [
          {
            status: "Giao hàng thành công",
            date: "13:20 12/3/2003",
            isCompleted: true,
          },
        ],
      };
  }
};

const baseOrderData = {
  items: [
    {
      id: 1,
      name: "Áo thun cờ giấn thoáng khí Rockbros LKW008",
      price: 1500000,
      quantity: 1,
      total: 1500000,
      image: "/api/placeholder/80/80",
    },
    {
      id: 2,
      name: "Áo thun đài tay nhanh khô Northshengwolf ch...",
      price: 850000,
      quantity: 2,
      total: 1700000,
      image: "/api/placeholder/80/80",
    },
    {
      id: 3,
      name: "Áo thun ngắn tay nam Gothiar Active",
      price: 650000,
      quantity: 1,
      total: 650000,
      image: "/api/placeholder/80/80",
    },
    {
      id: 4,
      name: "Áo thun dài tay nam Gothiar Active",
      price: 750000,
      quantity: 1,
      total: 750000,
      image: "/api/placeholder/80/80",
    },
    {
      id: 5,
      name: "Gậy chống di chuyển dễ dàng Ryder Straight-Bar Hiki...",
      price: 400000,
      quantity: 3,
      total: 1200000,
      image: "/api/placeholder/80/80",
    },
  ],
  summary: {
    subtotal: 5800000,
    shipping: 30000,
    fee: 34000,
    total: 5796000,
  },
  payment: {
    subtotal: 5800000,
    shipping: 0,
    discount: 34000,
    total: 5766000,
  },
};

// Payment Summary Component with Dropdown for Website
const PaymentSummaryWebsite: React.FC<{ orderData: any }> = ({ orderData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const summaryData = [
    { label: "Tổng tiền sản phẩm", amount: orderData.summary.subtotal },
    { label: "Tổng phí vận chuyển", amount: orderData.summary.shipping },
    { label: "Phụ phí", amount: orderData.summary.fee },
    { label: "Doanh thu đơn hàng", amount: orderData.summary.total, isTotal: true },
  ];

  return (
    <div className="border border-[#e7e7e7] box-border relative rounded-bl-[6px] rounded-br-[6px] shrink-0 w-full bg-white">
      {/* Collapsed View - Always Visible */}
      <div
        className="flex items-center justify-between px-[16px] py-[12px] cursor-pointer hover:bg-[#f8f9fa] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center justify-center w-[32px] h-[32px] bg-[#e8f5e8] rounded-[6px]">
            <Wallet className="w-[16px] h-[16px] text-[#28a745]" />
          </div>
          <div className="flex flex-col">
            <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424]">
              Doanh thu đơn hàng
            </p>
            <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
              {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[8px]">
          <p className="font-montserrat font-bold text-[18px] leading-[1.3] text-[#28a745]">
            {formatCurrency(orderData.summary.total)}
          </p>
          <div className="flex items-center justify-center w-[24px] h-[24px] text-[#737373]">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Expanded View - Payment Details */}
      {isExpanded && (
        <div className="border-t border-[#e7e7e7] px-[16px] py-[12px] bg-[#fafbfc]">
          <div className="space-y-[8px]">
            {summaryData.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between py-[4px] ${item.isTotal ? 'border-t border-[#e7e7e7] pt-[8px]' : ''
                  }`}
              >
                <p
                  className={`font-montserrat ${item.isTotal
                    ? 'font-semibold text-[14px] text-[#272424]'
                    : 'font-medium text-[13px] text-[#737373]'
                    }`}
                >
                  {item.label}
                </p>
                <p
                  className={`font-montserrat ${item.isTotal
                    ? 'font-bold text-[16px] text-[#28a745]'
                    : 'font-medium text-[13px] text-[#272424]'
                    }`}
                >
                  {formatCurrency(item.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Payment Information Component with Dropdown for Website
const PaymentInformationWebsite: React.FC<{ orderData: any; disabled?: boolean }> = ({ orderData, disabled = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const paymentData = [
    { label: "Tổng tiền sản phẩm", amount: orderData.payment.subtotal },
    { label: "Phí vận chuyển", amount: orderData.payment.shipping },
    { label: "Mã giảm giá của shop", amount: orderData.payment.discount },
    { label: "Tổng tiền thanh toán", amount: orderData.payment.total, isTotal: true },
  ];

  return (
    <div
      className={`bg-white border-2 border-[#e7e7e7] box-border relative rounded-[8px] w-full overflow-hidden min-w-0 ${disabled ? "opacity-50" : ""
        }`}
    >
      {/* Collapsed View - Always Visible */}
      <div
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-[12px] px-[16px] sm:px-[24px] py-[15px] cursor-pointer hover:bg-[#f8f9fa] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex gap-[5px] items-start relative self-stretch shrink-0 min-w-0">
          <Wallet className="relative shrink-0 size-[24px] flex-shrink-0" />
          <p className="font-montserrat font-semibold leading-[1.4] relative shrink-0 text-[#272424] text-[18px] text-nowrap">
            Thanh toán của người mua
          </p>
        </div>
        <div className="flex items-center gap-[8px]">
          <p className="font-montserrat font-bold text-[18px] leading-[1.3] text-[#28a745]">
            {formatCurrency(orderData.payment.total)}
          </p>
          <div className="flex items-center gap-[4px]">
            <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
              {isExpanded ? "Thu gọn" : "Chi tiết"}
            </p>
            <div className="flex items-center justify-center w-[24px] h-[24px] text-[#737373]">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded View - Payment Details */}
      {isExpanded && (
        <div className="border-t border-[#e7e7e7] px-[16px] sm:px-[24px] py-[15px] bg-[#fafbfc]">
          <div className="box-border flex items-center justify-between px-[10px] py-[12px] relative shrink-0 w-full min-w-0">
            <div className="flex flex-col gap-[4px] h-[72px] items-end justify-center leading-[1.4] relative shrink-0 text-[#272424] text-nowrap">
              {paymentData.map((item, index) => (
                <p
                  key={index}
                  className={`font-montserrat ${item.isTotal ? 'font-semibold' : 'font-medium'
                    } relative shrink-0 text-[14px]`}
                >
                  {item.label}
                </p>
              ))}
            </div>
            <div className="flex flex-col gap-[4px] items-end justify-center leading-[1.4] relative shrink-0 text-[#272424] text-nowrap">
              {paymentData.map((item, index) => (
                <p
                  key={index}
                  className={`font-montserrat ${item.isTotal ? 'font-semibold' : 'font-medium'
                    } relative shrink-0 text-[14px]`}
                >
                  {formatCurrency(item.amount)}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Delivery Confirmation Popup Component for Website
const DeliveryConfirmationPopupWebsite: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (deliveryMethod: 'self' | 'pickup') => void;
  orderData: any;
}> = ({ isOpen, onClose, onConfirm, orderData }) => {
  const [selectedMethod, setSelectedMethod] = useState<'self' | 'pickup' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMethod) {
      alert("Vui lòng chọn phương thức giao hàng!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(selectedMethod);
      // Reset form
      setSelectedMethod(null);
      onClose();
    } catch (error) {
      console.error("Error confirming delivery:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedMethod(null);
      onClose();
    }
  };

  // Handle ESC key press and prevent body scroll
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-[20px] shadow-2xl max-w-[520px] w-full overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e04d30] to-[#d63924] px-6 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-montserrat font-bold text-[20px] text-white leading-tight">
                  Xác nhận giao hàng
                </h2>
                <p className="font-montserrat font-medium text-[12px] text-white/80">
                  Chọn phương thức giao hàng cho đơn hàng
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order ID Section */}
          <div className="bg-gray-50 rounded-[12px] p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-montserrat font-medium text-[12px] text-gray-600 uppercase tracking-wide">
                  Mã đơn hàng
                </p>
                <p className="font-montserrat font-bold text-[16px] text-gray-900 font-mono">
                  #{orderData.id}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Method Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-[#e04d30] rounded-full"></div>
              <h3 className="font-montserrat font-semibold text-[16px] text-gray-900">
                Chọn phương thức giao hàng
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Self Delivery Option */}
              <button
                onClick={() => setSelectedMethod('self')}
                disabled={isSubmitting}
                className={`group relative p-4 rounded-[14px] border-2 transition-all duration-200 ${selectedMethod === 'self'
                  ? 'border-[#1a71f6] bg-[#1a71f6]/5 shadow-lg shadow-blue-500/20'
                  : 'border-gray-200 bg-white hover:border-[#1a71f6]/50 hover:shadow-md'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedMethod === 'self'
                    ? 'bg-[#1a71f6] text-white'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-[#1a71f6]/10 group-hover:text-[#1a71f6]'
                    }`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`font-montserrat font-semibold text-[13px] leading-tight transition-colors ${selectedMethod === 'self' ? 'text-[#1a71f6]' : 'text-gray-900'
                      }`}>
                      Tự mang hàng
                    </p>
                    <p className="font-montserrat font-medium text-[11px] text-gray-500 mt-1">
                      Tôi sẽ tự đem ra bưu cục
                    </p>
                  </div>
                </div>
                {selectedMethod === 'self' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#1a71f6] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Courier Pickup Option */}
              <button
                onClick={() => setSelectedMethod('pickup')}
                disabled={isSubmitting}
                className={`group relative p-4 rounded-[14px] border-2 transition-all duration-200 ${selectedMethod === 'pickup'
                  ? 'border-[#e04d30] bg-[#e04d30]/5 shadow-lg shadow-red-500/20'
                  : 'border-gray-200 bg-white hover:border-[#e04d30]/50 hover:shadow-md'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${selectedMethod === 'pickup'
                    ? 'bg-[#e04d30] text-white'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-[#e04d30]/10 group-hover:text-[#e04d30]'
                    }`}>
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className={`font-montserrat font-semibold text-[13px] leading-tight transition-colors ${selectedMethod === 'pickup' ? 'text-[#e04d30]' : 'text-gray-900'
                      }`}>
                      Shipper đến lấy
                    </p>
                    <p className="font-montserrat font-medium text-[11px] text-gray-500 mt-1">
                      Đơn vị vận chuyển đến lấy hàng
                    </p>
                  </div>
                </div>
                {selectedMethod === 'pickup' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#e04d30] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Selection Info */}
          {selectedMethod && (
            <div className={`p-4 rounded-[12px] border animate-in slide-in-from-top-2 duration-300 ${selectedMethod === 'self'
              ? 'bg-blue-50 border-blue-200'
              : 'bg-red-50 border-red-200'
              }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedMethod === 'self' ? 'bg-blue-100' : 'bg-red-100'
                  }`}>
                  <svg className={`w-4 h-4 ${selectedMethod === 'self' ? 'text-blue-600' : 'text-red-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className={`font-montserrat font-medium text-[13px] ${selectedMethod === 'self' ? 'text-blue-800' : 'text-red-800'
                    }`}>
                    {selectedMethod === 'self'
                      ? 'Bạn sẽ tự mang hàng đến bưu cục gần nhất'
                      : 'Shipper sẽ đến địa chỉ của shop để lấy hàng'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-montserrat font-semibold text-[14px] rounded-[12px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy bỏ
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedMethod}
              className="flex-1 sm:flex-none px-8 py-3 bg-[#e04d30] hover:bg-[#d63924] active:bg-[#c73621] text-white font-montserrat font-semibold text-[14px] rounded-[12px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Xác nhận giao hàng</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cancel Order Confirmation Popup Component for Website
const CancelOrderConfirmationPopupWebsite: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  orderData: any;
}> = ({ isOpen, onClose, onConfirm, orderData }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancelReasons = [
    'Khách hàng yêu cầu hủy',
    'Sản phẩm hết hàng',
    'Thông tin giao hàng không chính xác',
    'Khách hàng không liên lạc được',
    'Sản phẩm bị lỗi/hỏng',
    'Giá sản phẩm thay đổi',
    'Khác (tự nhập lý do)'
  ];

  const handleSubmit = async () => {
    const finalReason = selectedReason === 'Khác (tự nhập lý do)' ? customReason.trim() : selectedReason;

    if (!finalReason) {
      alert("Vui lòng chọn hoặc nhập lý do hủy đơn hàng!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(finalReason);
      // Reset form
      setSelectedReason('');
      setCustomReason('');
      onClose();
    } catch (error) {
      console.error("Error canceling order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason('');
      setCustomReason('');
      onClose();
    }
  };

  // Handle ESC key press and prevent body scroll
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isSubmitting) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-[20px] shadow-2xl max-w-[600px] w-full overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#dc3545] to-[#c82333] px-6 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="font-montserrat font-bold text-[20px] text-white leading-tight">
                  Xác nhận hủy đơn hàng
                </h2>
                <p className="font-montserrat font-medium text-[12px] text-white/80">
                  Vui lòng chọn lý do hủy đơn hàng
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order ID Section */}
          <div className="bg-gray-50 rounded-[12px] p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-montserrat font-medium text-[12px] text-gray-600 uppercase tracking-wide">
                  Đơn hàng sẽ bị hủy
                </p>
                <p className="font-montserrat font-bold text-[16px] text-gray-900 font-mono">
                  #{orderData.id}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-[12px] p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="font-montserrat font-semibold text-[14px] text-amber-800">
                  Lưu ý quan trọng
                </p>
                <p className="font-montserrat font-medium text-[13px] text-amber-700 mt-1">
                  Hành động này không thể hoàn tác. Đơn hàng sẽ bị hủy vĩnh viễn và khách hàng sẽ được thông báo.
                </p>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-[#dc3545] rounded-full"></div>
              <h3 className="font-montserrat font-semibold text-[16px] text-gray-900">
                Chọn lý do hủy đơn hàng
              </h3>
            </div>

            <div className="space-y-3">
              {cancelReasons.map((reason, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 rounded-[12px] border-2 cursor-pointer transition-all duration-200 ${selectedReason === reason
                    ? 'border-[#dc3545] bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    disabled={isSubmitting}
                    className="w-4 h-4 text-[#dc3545] border-gray-300 focus:ring-[#dc3545] focus:ring-2"
                  />
                  <span className={`ml-3 font-montserrat font-medium text-[14px] ${selectedReason === reason ? 'text-[#dc3545]' : 'text-gray-700'
                    }`}>
                    {reason}
                  </span>
                </label>
              ))}
            </div>

            {/* Custom Reason Input */}
            {selectedReason === 'Khác (tự nhập lý do)' && (
              <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                <label className="block font-montserrat font-medium text-[14px] text-gray-700 mb-2">
                  Nhập lý do cụ thể
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Vui lòng mô tả lý do hủy đơn hàng..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-[10px] font-montserrat text-[14px] focus:ring-2 focus:ring-[#dc3545] focus:border-[#dc3545] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-2 font-montserrat font-medium text-[12px] text-gray-500">
                  Tối thiểu 10 ký tự ({customReason.length}/10)
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-montserrat font-semibold text-[14px] rounded-[12px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy bỏ
            </button>

            <button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !selectedReason ||
                (selectedReason === 'Khác (tự nhập lý do)' && customReason.trim().length < 10)
              }
              className="flex-1 sm:flex-none px-8 py-3 bg-[#dc3545] hover:bg-[#c82333] active:bg-[#bd2130] text-white font-montserrat font-semibold text-[14px] rounded-[12px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-w-[160px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang hủy đơn...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Xác nhận hủy đơn hàng</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Action Buttons Component for Website
const ActionButtonsWebsite: React.FC<{ status: string; onConfirm: () => void; onCancel: () => void }> = ({
  status,
  onConfirm,
  onCancel
}) => {
  if (status !== "Chờ xác nhận") {
    return null;
  }

  return (
    <div className="bg-white border-2 border-[#e7e7e7] rounded-[8px] p-[20px] w-full">
      <div className="flex flex-col gap-[12px] w-full">
        {/* Header */}
        <div className="flex items-center gap-[8px] mb-[8px]">
          <div className="w-[4px] h-[20px] bg-[#e04d30] rounded-[2px]"></div>
          <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
            Thao tác với đơn hàng
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-[12px] items-stretch sm:items-center justify-end w-full">
          <button
            onClick={onCancel}
            className="flex items-center justify-center gap-[8px] px-[20px] py-[12px] bg-[#dc3545] hover:bg-[#c82333] active:bg-[#bd2130] text-white font-montserrat font-semibold text-[14px] rounded-[8px] transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px]"
          >
            <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Hủy đơn hàng
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-[8px] px-[20px] py-[12px] bg-[#28a745] hover:bg-[#218838] active:bg-[#1e7e34] text-white font-montserrat font-semibold text-[14px] rounded-[8px] transition-all duration-200 shadow-sm hover:shadow-md min-h-[44px]"
          >
            <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Xác nhận đơn hàng
          </button>
        </div>

        {/* Note */}
        <div className="bg-[#fff3cd] border border-[#ffeaa7] rounded-[6px] p-[12px] mt-[8px]">
          <p className="font-montserrat font-medium text-[12px] text-[#856404] leading-[1.4]">
            <strong>Lưu ý:</strong> Sau khi xác nhận, đơn hàng sẽ chuyển sang trạng thái "Đã xác nhận" và không thể hủy.
          </p>
        </div>
      </div>
    </div>
  );
};

const AdminOrderDetailWebsite: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams<{ orderId: string }>();
  const [isTimelineExpanded, setIsTimelineExpanded] = React.useState(false);
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleToggleTimeline = () => {
    setIsTimelineExpanded(!isTimelineExpanded);
  };

  const handleConfirmOrder = () => {
    // Mở popup xác nhận giao hàng
    setShowDeliveryPopup(true);
  };

  const handleDeliveryConfirm = async (deliveryMethod: 'self' | 'pickup') => {
    console.log("Confirming order:", orderId, "with delivery method:", deliveryMethod);

    try {
      // TODO: Thêm API call để cập nhật trạng thái đơn hàng và phương thức giao hàng
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      alert(`Đơn hàng đã được xác nhận thành công với phương thức: ${deliveryMethod === 'self' ? 'Tự mang ra bưu cục' : 'Đơn vị vận chuyển đến lấy'
        }!`);

      // Có thể redirect về trang danh sách đơn hàng hoặc cập nhật state
      // navigate("/admin/orders");
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Có lỗi xảy ra khi xác nhận đơn hàng!");
      throw error; // Re-throw để popup xử lý
    }
  };

  const handleCancelOrder = () => {
    // Mở popup xác nhận hủy đơn hàng
    setShowCancelPopup(true);
  };

  const handleCancelConfirm = async (reason: string) => {
    console.log("Canceling order:", orderId, "with reason:", reason);

    try {
      // TODO: Thêm API call để hủy đơn hàng với lý do
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      alert(`Đơn hàng đã được hủy thành công với lý do: ${reason}`);

      // Có thể redirect về trang danh sách đơn hàng hoặc cập nhật state
      // navigate("/admin/orders");
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Có lỗi xảy ra khi hủy đơn hàng!");
      throw error; // Re-throw để popup xử lý
    }
  };

  // Function to get order data based on orderId
  const getOrderData = () => {
    // Get status from navigation state if available
    const statusFromState = (location.state as { status?: string })?.status;

    // Get mock data based on status or default
    const mockData = getMockOrderData(statusFromState || "Đã hoàn thành");

    // Combine with base order data
    return {
      ...mockData,
      ...baseOrderData,
      id: orderId || mockData.id,
      status: statusFromState || mockData.status,
    };
  };

  const currentOrder = getOrderData();

  // Get complete timeline steps based on order status
  const getTimelineSteps = () => {
    const baseSteps = [
      {
        id: 1,
        status: "Đơn hàng đã được đặt",
        date: "10:30 10/3/2003",
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: 2,
        status: "Đơn hàng đã được xác nhận",
        date: "11:15 10/3/2003",
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: 3,
        status: "Đơn hàng đang được chuẩn bị",
        date: "14:20 10/3/2003",
        isCompleted: true,
        isCurrent: false,
      },
    ];

    switch (currentOrder.status) {
      case "Chờ xác nhận":
        return [
          {
            id: 1,
            status: "Đơn hàng đã được đặt",
            date: "13:20 12/3/2003",
            isCompleted: true,
            isCurrent: false,
          },
          {
            id: 2,
            status: "Chờ xác nhận đơn hàng",
            date: "",
            isCompleted: false,
            isCurrent: true,
          },
        ];
      case "Đã xác nhận":
        return [
          ...baseSteps.slice(0, 2),
          {
            id: 3,
            status: "Đơn hàng đang được chuẩn bị",
            date: "",
            isCompleted: false,
            isCurrent: true,
          },
        ];
      case "Đang giao":
        return [
          ...baseSteps,
          {
            id: 4,
            status: "Đơn vị vận chuyển lấy hàng thành công",
            date: "09:45 11/3/2003",
            isCompleted: true,
            isCurrent: false,
          },
          {
            id: 5,
            status: "Đang trong quá trình giao hàng",
            date: "13:20 12/3/2003",
            isCompleted: false,
            isCurrent: true,
          },
        ];
      case "Đã hoàn thành":
        return [
          ...baseSteps,
          {
            id: 4,
            status: "Đơn vị vận chuyển lấy hàng thành công",
            date: "09:45 11/3/2003",
            isCompleted: true,
            isCurrent: false,
          },
          {
            id: 5,
            status: "Đang trong quá trình giao hàng",
            date: "08:30 12/3/2003",
            isCompleted: true,
            isCurrent: false,
          },
          {
            id: 6,
            status: "Giao hàng thành công",
            date: "13:20 12/3/2003",
            isCompleted: true,
            isCurrent: true,
          },
        ];
      case "Đã hủy":
        return [
          {
            id: 1,
            status: "Đơn hàng đã được đặt",
            date: "10:30 10/3/2003",
            isCompleted: true,
            isCurrent: false,
          },
          {
            id: 2,
            status: "Đơn hàng đã bị hủy",
            date: "13:20 12/3/2003",
            isCompleted: true,
            isCurrent: true,
          },
        ];
      default:
        return baseSteps;
    }
  };

  // Get timeline text based on order status (for collapsed view)
  const getTimelineText = () => {
    const steps = getTimelineSteps();
    const currentStep = steps.find(step => step.isCurrent) || steps[steps.length - 1];
    return {
      status: currentStep.status,
      date: currentStep.date,
    };
  };

  // Get status card styling based on order status
  const getStatusCardStyle = () => {
    switch (currentOrder.status) {
      case "Đang giao":
        return {
          bg: "bg-[#cce5ff]",
          text: "text-[#004085]",
        };
      case "Đã hoàn thành":
        return {
          bg: "bg-[#b2ffb4]",
          text: "text-[#04910c]",
        };
      case "Chờ xác nhận":
        return {
          bg: "bg-[#e7e7e7]",
          text: "text-[#737373]",
        };
      case "Đã xác nhận":
        return {
          bg: "bg-[#D1E7DD]",
          text: "text-[#28A745]",
        };
      case "Đã hủy":
        return {
          bg: "bg-[#ffdcdc]",
          text: "text-[#eb2b0b]",
        };
      default:
        return {
          bg: "bg-[#b2ffb4]",
          text: "text-[#04910c]",
        };
    }
  };

  const statusCardStyle = getStatusCardStyle();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-[10px] items-center w-full">
        {/* Header */}
        <div className="flex flex-col gap-[8px] items-start justify-center w-full">
          <div className="flex gap-[4px] items-center">
            <button
              onClick={handleBackClick}
              className="relative shrink-0 size-[24px] flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-[#737373]" />
            </button>
            <h1 className="font-montserrat font-bold text-[#272424] text-[24px] leading-[1.5] whitespace-nowrap">
              Chi tiết đơn hàng
            </h1>
          </div>
        </div>

        {/* Status Cards */}
        <ContentCard>
          <div className="flex flex-col lg:flex-row gap-[16px] w-full">
            {/* Order Status Card */}
            <div className="flex-1 min-w-0">
              <div
                className={`${statusCardStyle.bg} border-2 border-opacity-20 box-border flex gap-[12px] items-center p-[16px] relative rounded-[12px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-white bg-opacity-80 rounded-full">
                  {currentOrder.status === "Đang giao" ? (
                    <Truck className="w-5 h-5 text-[#004085]" />
                  ) : currentOrder.status === "Đã hoàn thành" ? (
                    <Package className="w-5 h-5 text-[#04910c]" />
                  ) : currentOrder.status === "Chờ xác nhận" ? (
                    <svg className="w-5 h-5 text-[#737373]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  ) : currentOrder.status === "Đã xác nhận" ? (
                    <svg className="w-5 h-5 text-[#28A745]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-[#eb2b0b]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[14px] text-black text-opacity-70 leading-[1.4]">
                    Trạng thái đơn hàng
                  </p>
                  <p className={`font-montserrat font-bold ${statusCardStyle.text} text-[18px] leading-[1.2] truncate`}>
                    {currentOrder.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Source Card */}
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 box-border flex gap-[12px] items-center p-[16px] relative rounded-[12px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full shadow-sm">
                  {currentOrder.source === "Website" ? (
                    <svg className="w-5 h-5 text-[#272424]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                      <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-1V7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-[#272424]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm2 2a1 1 0 000 2h.01a1 1 0 100-2H5zm3 0a1 1 0 000 2h3a1 1 0 100-2H8z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[14px] text-gray-600 leading-[1.4]">
                    Nguồn đơn hàng
                  </p>
                  <p className="font-montserrat font-bold text-[#272424] text-[18px] leading-[1.2] truncate">
                    {currentOrder.source}
                  </p>
                </div>
              </div>
            </div>

            {/* Order ID Card */}
            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 box-border flex gap-[12px] items-center p-[16px] relative rounded-[12px] w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-white rounded-full shadow-sm">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-col gap-[4px] flex-1 min-w-0">
                  <p className="font-montserrat font-medium text-[14px] text-blue-700 leading-[1.4]">
                    Mã đơn hàng
                  </p>
                  <p className="font-montserrat font-bold text-blue-800 text-[18px] leading-[1.2] truncate font-mono">
                    #{currentOrder.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Website Order Info */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[20px] items-start p-[20px] sm:p-[28px] relative rounded-[8px] w-full overflow-hidden min-w-0">
            {/* Header */}
            <div className="flex items-center gap-[8px] w-full">
              <div className="w-[4px] h-[20px] bg-[#e04d30] rounded-[2px]"></div>
              <h3 className="font-montserrat font-semibold text-[16px] text-[#272424]">
                Thông tin WEBSITE
              </h3>
            </div>


            {/* Shipping Address Section */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f0f8ff] rounded-[8px] shrink-0">
                <MapPin className="h-[20px] w-[20px] text-[#2563eb]" />
              </div>
              <div className="flex flex-col gap-[6px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
                  Địa chỉ nhận hàng
                </p>
                <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424] break-words min-w-0">
                  {currentOrder.shipping.address}
                </p>
                <p className="font-montserrat font-medium text-[13px] leading-[1.3] text-[#737373] break-words min-w-0">
                  {currentOrder.shipping.district}
                </p>
              </div>
            </div>

            {/* Shipping Method Section */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f0f9ff] rounded-[8px] shrink-0">
                <Truck className="h-[20px] w-[20px] text-[#0284c7]" />
              </div>
              <div className="flex flex-col gap-[6px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
                  Phương thức vận chuyển
                </p>
                <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424]">
                  {currentOrder.shipping.method}
                </p>
              </div>
            </div>

            {/* Order Date Section */}
            <div className="flex gap-[14px] items-start w-full">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#f8f9fa] rounded-[8px] shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                    stroke="#6b7280"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.6947 13.7002H15.7037M15.6947 16.7002H15.7037M11.9955 13.7002H12.0045M11.9955 16.7002H12.0045M8.29431 13.7002H8.30329M8.29431 16.7002H8.30329"
                    stroke="#6b7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-[6px] items-start flex-1 min-w-0">
                <p className="font-montserrat font-medium text-[12px] leading-[1.3] text-[#737373]">
                  Ngày đặt hàng
                </p>
                <p className="font-montserrat font-semibold text-[14px] leading-[1.3] text-[#272424]">
                  12/03/2003 - 13:20
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="border border-[#e7e7e7] box-border flex flex-col relative rounded-[8px] w-full overflow-hidden min-w-0">
              {/* Timeline Header - Always visible */}
              <div className="flex flex-col sm:flex-row h-auto sm:h-[77px] items-start justify-between p-[12px] gap-[8px] sm:gap-0">
                <div className="box-border flex gap-[10px] items-start p-[10px] relative shrink-0 min-w-0 flex-1">
                  <div
                    className={`flex items-center justify-center relative self-stretch shrink-0 flex-shrink-0 ${currentOrder.status === "Đang giao" ? "w-[33px]" : "w-[35px]"
                      }`}
                  >
                    <div className="flex-none h-full rotate-[90deg]">
                      <div
                        className={`h-full relative ${currentOrder.status === "Đang giao"
                          ? "w-[33px]"
                          : "w-[35px]"
                          }`}
                      >
                        <div className="absolute inset-[-1px]">
                          <svg
                            width={
                              currentOrder.status === "Đang giao" ? "33" : "35"
                            }
                            height="1"
                            viewBox={`0 0 ${currentOrder.status === "Đang giao" ? "33" : "35"
                              } 1`}
                            fill="none"
                            className="stroke-[#737373]"
                          >
                            <line
                              x1="0"
                              y1="0.5"
                              x2={currentOrder.status === "Đang giao" ? "33" : "35"}
                              y2="0.5"
                              strokeWidth="1"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  {currentOrder.status === "Đang giao" ? (
                    <div className="flex flex-col font-montserrat font-medium gap-[5px] items-start leading-[normal] text-[10px] text-[#04910c] relative shrink-0 min-w-0">
                      <p className="leading-[1.4] break-words">{getTimelineText().status}</p>
                      <p className="leading-[1.4] whitespace-nowrap">{getTimelineText().date}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col font-inter font-bold gap-[5px] items-start leading-[normal] text-[14px] text-[#04910c] relative shrink-0 min-w-0">
                      <p className="leading-[normal] break-words">{getTimelineText().status}</p>
                      <p className="leading-[normal] whitespace-nowrap">{getTimelineText().date}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleToggleTimeline}
                  className="box-border flex gap-[10px] items-center justify-center p-[12px] relative rounded-[8px] shrink-0 whitespace-nowrap cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <span className="font-inter font-bold text-[12px] leading-[normal] text-[#888888]">
                    {isTimelineExpanded ? "Thu gọn" : "Mở rộng"}
                  </span>
                  <div className={`relative shrink-0 size-[18px] transition-transform ${isTimelineExpanded ? "rotate-180" : ""}`}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 12L5 8M9 12L13 8M9 12V3"
                        stroke="#888888"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Expanded Timeline Steps */}
              {isTimelineExpanded && (
                <div className="border-t border-[#e7e7e7] p-[16px] bg-[#fafafa]">
                  <div className="flex flex-col gap-[16px]">
                    <h3 className="font-montserrat font-semibold text-[16px] text-[#272424] mb-[8px]">
                      Lịch sử đơn hàng
                    </h3>
                    <div className="flex flex-col gap-[12px]">
                      {getTimelineSteps().map((step, index) => (
                        <div key={step.id} className="flex items-start gap-[12px]">
                          {/* Timeline Icon */}
                          <div className="flex flex-col items-center gap-[4px] shrink-0">
                            <div className={`w-[12px] h-[12px] rounded-full border-2 ${step.isCompleted
                              ? step.isCurrent
                                ? "bg-[#04910c] border-[#04910c]"
                                : "bg-[#28a745] border-[#28a745]"
                              : step.isCurrent
                                ? "bg-[#ffc107] border-[#ffc107]"
                                : "bg-white border-[#d1d1d1]"
                              }`}>
                              {step.isCompleted && (
                                <svg width="8" height="6" viewBox="0 0 8 6" fill="none" className="m-[2px]">
                                  <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            {index < getTimelineSteps().length - 1 && (
                              <div className={`w-[2px] h-[20px] ${step.isCompleted ? "bg-[#28a745]" : "bg-[#d1d1d1]"
                                }`} />
                            )}
                          </div>

                          {/* Timeline Content */}
                          <div className="flex flex-col gap-[2px] min-w-0 flex-1">
                            <p className={`font-montserrat font-medium text-[14px] leading-[1.4] ${step.isCurrent ? "text-[#04910c]" : "text-[#272424]"
                              }`}>
                              {step.status}
                            </p>
                            {step.date && (
                              <p className="font-montserrat font-medium text-[12px] leading-[1.4] text-[#737373]">
                                {step.date}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white border-2 border-[#e7e7e7] box-border flex gap-[8px] items-center px-[16px] sm:px-[24px] py-[8px] relative rounded-[8px] w-full overflow-hidden min-w-0">
            <div className="basis-0 box-border flex gap-[6px] grow items-center min-h-px min-w-px px-[6px] py-[4px] relative shrink-0 min-w-0">
              <div className="flex gap-[10px] items-center relative shrink-0 min-w-0">
                <Avatar className="relative rounded-full size-[54px]">
                  <AvatarFallback className="bg-gray-200 rounded-full">
                    {currentOrder.customer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-[8px] items-center relative shrink-0 min-w-0">
                  <span className="font-montserrat font-bold text-[#2a2a2a] text-[14px] leading-[1.5] truncate">
                    {currentOrder.customer.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Table */}
          <div
            className={`bg-white border-2 border-[#e7e7e7] box-border flex flex-col gap-[8px] items-start p-[16px] sm:p-[24px] relative rounded-[8px] w-full overflow-x-auto ${currentOrder.status === "Đã hủy" ? "opacity-50" : ""
              }`}
          >
            <div className="w-full">
              <div className="box-border flex gap-[6px] items-center px-[6px] py-01 mb-2 relative shrink-0 w-full">
                <Wallet className="relative shrink-0 size-[24px]" />
                <h2 className="font-montserrat font-semibold text-[#272424] text-[18px] leading-[1.4]">
                  Thông tin thanh toán
                </h2>
              </div>
              <div className="w-full overflow-x-auto">
                <div className="flex flex-col items-start relative rounded-[8px] w-full min-w-[700px]">
                  {/* Table Header */}
                  <div className="flex items-start relative shrink-0 w-full">
                    <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] relative rounded-tl-[6px] self-stretch shrink-0 w-[60px] min-w-[60px]">
                      <div className="box-border flex gap-[8px] h-full items-center overflow-clip pb-[15px] pt-[14px] px-[8px] relative rounded-[inherit]">
                        <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                          STT
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] items-center justify-start pb-[15px] pt-[14px] px-[12px] relative self-stretch flex-1 min-w-[200px]">
                      <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                        Sản phẩm
                      </p>
                    </div>
                    <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] items-center justify-center pb-[15px] pt-[14px] px-[12px] relative self-stretch w-[100px] min-w-[100px]">
                      <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                        Đơn giá
                      </p>
                    </div>
                    <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] items-center justify-center pb-[15px] pt-[14px] px-[12px] relative self-stretch w-[80px] min-w-[80px]">
                      <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                        SL
                      </p>
                    </div>
                    <div className="bg-[#f6f6f6] border-[0px_0px_1px] border-[#e7e7e7] box-border flex gap-[4px] items-center justify-end pb-[15px] pt-[14px] px-[12px] relative rounded-tr-[6px] self-stretch w-[120px] min-w-[120px]">
                      <p className="font-montserrat font-semibold leading-[1.5] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                        Thành tiền
                      </p>
                    </div>
                  </div>
                  {/* Table Body */}
                  {currentOrder.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center relative shrink-0 w-full min-w-[700px] border-b border-[#e7e7e7]"
                    >
                      <div className="box-border flex gap-[8px] items-center justify-center p-[12px] relative shrink-0 w-[60px] min-w-[60px]">
                        <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                          {index + 1}
                        </p>
                      </div>
                      <div className="box-border flex gap-[8px] items-start justify-start p-[12px] relative flex-1 min-w-[200px]">
                        <div className="border-[0.5px] border-[#d1d1d1] relative shrink-0 size-[40px] rounded-[4px] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-0 items-start min-w-0 flex-1">
                          <p className="font-montserrat font-medium leading-[1.4] text-[#272424] text-[12px] truncate">
                            {item.name}
                          </p>
                          <p className="font-montserrat font-medium text-[10px] leading-[1.4] text-[#737373] -mt-[2px]">
                            Phân loại hàng: Size M, Màu cam
                          </p>
                        </div>
                      </div>
                      <div className="box-border flex gap-[4px] items-center justify-center p-[12px] relative w-[100px] min-w-[100px]">
                        <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="box-border flex gap-[4px] items-center justify-center p-[12px] relative w-[80px] min-w-[80px]">
                        <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                          {item.quantity}
                        </p>
                      </div>
                      <div className="box-border flex gap-[4px] items-center justify-end p-[12px] relative w-[120px] min-w-[120px]">
                        <p className="font-montserrat font-medium leading-[1.4] relative shrink-0 text-[#272424] text-[12px] text-nowrap">
                          {formatCurrency(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* Summary Row - Website */}
                  <PaymentSummaryWebsite orderData={currentOrder} />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information Card */}
          <PaymentInformationWebsite
            orderData={currentOrder}
            disabled={currentOrder.status === "Đã hủy"}
          />

          {/* Action Buttons */}
          <ActionButtonsWebsite
            status={currentOrder.status}
            onConfirm={handleConfirmOrder}
            onCancel={handleCancelOrder}
          />
        </ContentCard>
      </div>

      {/* Delivery Confirmation Popup */}
      <DeliveryConfirmationPopupWebsite
        isOpen={showDeliveryPopup}
        onClose={() => setShowDeliveryPopup(false)}
        onConfirm={handleDeliveryConfirm}
        orderData={currentOrder}
      />

      {/* Cancel Order Confirmation Popup */}
      <CancelOrderConfirmationPopupWebsite
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleCancelConfirm}
        orderData={currentOrder}
      />
    </PageContainer>
  );
};

export default AdminOrderDetailWebsite;

