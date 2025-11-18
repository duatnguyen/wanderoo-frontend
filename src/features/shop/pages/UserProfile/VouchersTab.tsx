import React, { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import Button from "../../../../components/shop/Button";
import { Input } from "../../../../components/shop/Input";
import {
  getMyVouchers,
  getPublicDiscounts,
} from "../../../../api/endpoints/discountApi";
import type {
  DiscountPublicResponse,
  VoucherHistoryResponse,
} from "../../../../types";

function formatCurrencyVND(value?: number | null) {
  const safeValue = value ?? 0;
  return `${safeValue.toLocaleString("vi-VN")}đ`;
}

interface VoucherCard {
  id: string;
  code: string;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  maxDiscount?: number | null;
  minOrder?: number | null;
  status: "available" | "pending" | "expired";
  validAfter?: string;
  expiryDate?: string;
  discountText?: string | null;
  statusLabel?: string | null;
  origin: "public" | "my";
}

interface HistoryVoucher {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number;
  minOrder: number;
  expiryDate: string;
  status: "expired" | "used";
}

const VouchersTab: React.FC = () => {
  const [voucherCode, setVoucherCode] = useState("");
  const [currentView, setCurrentView] = useState<"list" | "history">("list");
  const [historyTab, setHistoryTab] = useState<"expired" | "used">("expired");
  const [publicVouchers, setPublicVouchers] = useState<VoucherCard[]>([]);
  const [myVouchers, setMyVouchers] = useState<VoucherCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date?: string | null) => {
    if (!date) return undefined;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return undefined;
    }
    return parsed.toLocaleDateString("vi-VN");
  };

  const determinePublicVoucherStatus = (
    voucher: DiscountPublicResponse
  ): VoucherCard["status"] => {
    const now = new Date();
    const startDate = voucher.startDate ? new Date(voucher.startDate) : null;
    const endDate = voucher.endDate ? new Date(voucher.endDate) : null;

    if (endDate && endDate.getTime() < now.getTime()) {
      return "expired";
    }
    if (startDate && startDate.getTime() > now.getTime()) {
      return "pending";
    }
    if (voucher.isAvailable === false) {
      return "pending";
    }
    return "available";
  };

  const mapVoucherHistoryStatus = (
    status?: VoucherHistoryResponse["status"]
  ): VoucherCard["status"] => {
    switch (status) {
      case "ACTIVE":
      case "AVAILABLE":
        return "available";
      case "EXPIRED":
      case "USED":
        return "expired";
      default:
        return "pending";
    }
  };

  const transformPublicVoucher = (
    voucher: DiscountPublicResponse
  ): VoucherCard => {
    const status = determinePublicVoucherStatus(voucher);
    return {
      id: `public-${voucher.id}`,
      code: voucher.code,
      discountType: voucher.type === "PERCENT" ? "percentage" : "fixed",
      discountValue: voucher.value,
      maxDiscount: voucher.maxOrderValue ?? null,
      minOrder: voucher.minOrderValue ?? null,
      status,
      validAfter:
        status === "pending" ? formatDate(voucher.startDate) : undefined,
      expiryDate:
        status !== "pending" ? formatDate(voucher.endDate) : undefined,
      discountText: voucher.discountText,
      origin: "public",
    };
  };

  const transformMyVoucher = (
    voucher: VoucherHistoryResponse
  ): VoucherCard => ({
    id: `my-${voucher.id}`,
    code: voucher.discountCode,
    status: mapVoucherHistoryStatus(voucher.status),
    discountText: voucher.discountText,
    maxDiscount: voucher.maxOrderValue ?? null,
    minOrder: voucher.minOrderValue ?? null,
    expiryDate: formatDate(voucher.expirationDate),
    statusLabel: voucher.statusLabel ?? null,
    origin: "my",
  });

  const loadVoucherData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [publicResponse, myResponse] = await Promise.all([
        getPublicDiscounts(),
        getMyVouchers(),
      ]);

      setPublicVouchers(publicResponse.map(transformPublicVoucher));
      setMyVouchers(myResponse.map(transformMyVoucher));
    } catch (err) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message ?? "Không thể tải danh sách voucher."
        );
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVoucherData();
  }, [loadVoucherData]);

  const handleSaveVoucher = () => {
    if (!voucherCode.trim()) {
      alert("Vui lòng nhập mã voucher");
      return;
    }
    console.log("Adding voucher:", voucherCode);
    // Here you would make an API call to add the voucher
    setVoucherCode("");
  };

  const handleUseVoucher = (voucherId: string, action: "use" | "save") => {
    console.log(`${action === "use" ? "Using" : "Saving"} voucher:`, voucherId);
    // Here you would handle voucher usage
  };

  const formatDiscountText = (
    voucher: VoucherCard | HistoryVoucher
  ): string => {
    if ("discountText" in voucher && voucher.discountText) {
      return voucher.discountText;
    }
    if (voucher.discountType === "percentage") {
      const discountText = `Giảm ${voucher.discountValue ?? 0}%`;
      const maxDiscountText = voucher.maxDiscount
        ? ` Giảm tối đa ${formatCurrencyVND(voucher.maxDiscount)}`
        : "";
      return discountText + maxDiscountText;
    } else {
      return `Giảm ${formatCurrencyVND(voucher.discountValue ?? 0)}`;
    }
  };

  const renderStatusBadge = (voucher: VoucherCard) => {
    const { status, statusLabel } = voucher;
    const baseClass =
      "inline-flex items-center px-3 py-1 rounded-full text-[14px] font-semibold";
    const text = statusLabel
      ? statusLabel
      : status === "available"
      ? "Có thể dùng ngay"
      : status === "pending"
      ? "Sẽ dùng được sau"
      : "Hết hạn";
    switch (status) {
      case "available":
        return (
          <span className={`${baseClass} bg-green-100 text-green-700`}>
            {text}
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClass} bg-amber-100 text-amber-700`}>
            {text}
          </span>
        );
      case "expired":
      default:
        return (
          <span className={`${baseClass} bg-gray-100 text-gray-600`}>
            {text}
          </span>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="px-4 sm:px-6 py-5 border-b border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-[24px] font-bold text-gray-900">
                {currentView === "history" ? "Lịch sử voucher" : "Kho voucher"}
              </h1>
              {currentView === "history" ? (
                <button
                  onClick={() => setCurrentView("list")}
                  className="text-orange-600 hover:text-orange-700 font-medium text-[14px] transition-colors self-start sm:self-auto"
                >
                  Quay lại kho voucher
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView("history")}
                  className="text-red-600 hover:text-red-700 font-medium text-[14px] transition-colors self-start sm:self-auto"
                >
                  Xem lịch sử voucher
                </button>
              )}
            </div>

            {/* Voucher Input Section */}
            {currentView === "list" && (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 flex items-center gap-3">
                    <label className="text-[14px] font-medium text-gray-700 whitespace-nowrap">
                      Mã voucher:
                    </label>
                    <Input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Nhập mã voucher tại đây"
                      fullWidth
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSaveVoucher();
                        }
                      }}
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSaveVoucher}
                    className="w-full sm:w-auto px-6 sm:px-8 whitespace-nowrap"
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            )}
          </div>

          {currentView === "list" ? (
            <VoucherListSection
              myVouchers={myVouchers}
              publicVouchers={publicVouchers}
              loading={isLoading}
              error={error}
              onRetry={loadVoucherData}
              formatDiscountText={formatDiscountText}
              renderStatusBadge={renderStatusBadge}
              handleUseVoucher={handleUseVoucher}
            />
          ) : (
            <VoucherHistorySection
              historyTab={historyTab}
              onChangeTab={setHistoryTab}
              formatDiscountText={formatDiscountText}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VouchersTab;

interface VoucherListSectionProps {
  myVouchers: VoucherCard[];
  publicVouchers: VoucherCard[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  formatDiscountText: (voucher: VoucherCard) => string;
  renderStatusBadge: (voucher: VoucherCard) => React.ReactNode;
  handleUseVoucher: (voucherId: string, action: "use" | "save") => void;
}

const VoucherListSection: React.FC<VoucherListSectionProps> = ({
  myVouchers,
  publicVouchers,
  loading,
  error,
  onRetry,
  formatDiscountText,
  renderStatusBadge,
  handleUseVoucher,
}) => {
  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-10 bg-gray-50 text-center text-gray-600">
        Đang tải dữ liệu voucher...
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 py-10 bg-gray-50 text-center space-y-4">
        <div className="text-red-600 font-semibold">{error}</div>
        <Button variant="primary" size="md" onClick={onRetry}>
          Thử lại
        </Button>
      </div>
    );
  }

  const renderVoucherGroup = (
    title: string,
    vouchers: VoucherCard[],
    emptyMessage: string
  ) => (
    <div className="space-y-4">
      <div className="space-y-3">
        <h2 className="text-[18px] font-bold text-gray-900">{title}</h2>
        <div className="h-px bg-gray-200" />
      </div>
      {vouchers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full"
            >
              <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-semibold text-blue-600">
                    {voucher.code}
                  </span>
                  {renderStatusBadge(voucher)}
                </div>
                <div className="text-[14px] text-gray-500">
                  {voucher.validAfter
                    ? `Hiệu lực sau: ${voucher.validAfter}`
                    : voucher.expiryDate
                    ? `HSD: ${voucher.expiryDate}`
                    : ""}
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-1">
                <div className="space-y-2">
                  <div className="text-[14px] text-gray-900 font-semibold">
                    {formatDiscountText(voucher)}
                  </div>
                  <div className="text-[14px] text-gray-700">
                    {typeof voucher.minOrder === "number" &&
                    voucher.minOrder > 0
                      ? `Đơn tối thiểu ${formatCurrencyVND(voucher.minOrder)}`
                      : "Không yêu cầu đơn tối thiểu"}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {voucher.status === "available" ? (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleUseVoucher(voucher.id, "use")}
                      className="!border-green-500 !text-green-600 hover:!bg-green-50 whitespace-nowrap"
                    >
                      Dùng ngay
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleUseVoucher(voucher.id, "save")}
                      className="!border-[#E04D30] !text-[#E04D30] hover:!bg-[#FFE6DD] whitespace-nowrap"
                    >
                      Dùng sau
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-[14px] text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );

  return (
    <div className="px-4 sm:px-6 py-5 bg-gray-50 space-y-8">
      {renderVoucherGroup(
        "Voucher của tôi",
        myVouchers,
        "Bạn chưa lưu voucher nào."
      )}
      {renderVoucherGroup(
        "Voucher có thể lưu",
        publicVouchers,
        "Không có voucher nào khả dụng."
      )}
    </div>
  );
};

interface VoucherHistorySectionProps {
  historyTab: "expired" | "used";
  onChangeTab: (tab: "expired" | "used") => void;
  formatDiscountText: (voucher: Voucher | HistoryVoucher) => string;
}

const VoucherHistorySection: React.FC<VoucherHistorySectionProps> = ({
  historyTab,
  onChangeTab,
  formatDiscountText,
}) => {
  const expiredVouchers: HistoryVoucher[] = [
    {
      id: "1",
      code: "FKSUD",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      expiryDate: "10/09/2025",
      status: "expired",
    },
    {
      id: "2",
      code: "SUDWDR",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      expiryDate: "11/08/2025",
      status: "expired",
    },
    {
      id: "3",
      code: "NHSS16%",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      expiryDate: "20/07/2025",
      status: "expired",
    },
    {
      id: "4",
      code: "16KUDL",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      expiryDate: "12/09/2025",
      status: "expired",
    },
  ];

  const usedVouchers: HistoryVoucher[] = [
    {
      id: "5",
      code: "USED1",
      discountType: "percentage",
      discountValue: 16,
      maxDiscount: 120000,
      minOrder: 300000,
      expiryDate: "15/08/2025",
      status: "used",
    },
    {
      id: "6",
      code: "USED2",
      discountType: "fixed",
      discountValue: 10000,
      minOrder: 300000,
      expiryDate: "20/08/2025",
      status: "used",
    },
  ];

  const historyVouchers =
    historyTab === "expired" ? expiredVouchers : usedVouchers;

  return (
    <div className="px-4 sm:px-6 py-5 bg-gray-50 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onChangeTab("expired")}
            className={`text-[18px] font-bold transition-colors ${
              historyTab === "expired"
                ? "text-red-600 border-b-2 border-red-600 pb-1"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Hết Hiệu Lực
          </button>
          <button
            onClick={() => onChangeTab("used")}
            className={`text-[18px] font-bold transition-colors ${
              historyTab === "used"
                ? "text-red-600 border-b-2 border-red-600 pb-1"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Đã sử dụng
          </button>
        </div>
        <div className="h-px bg-gray-200" />
      </div>

      {historyVouchers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {historyVouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full"
            >
              <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-semibold text-blue-600">
                    {voucher.code}
                  </span>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-[14px] font-semibold ${
                      voucher.status === "used"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {voucher.status === "expired"
                      ? "Hết lượt sử dụng"
                      : "Đã sử dụng"}
                  </span>
                </div>
                <span className="text-[14px] text-gray-500 whitespace-nowrap">
                  HSD: {voucher.expiryDate}
                </span>
              </div>

              <div className="px-4 sm:px-6 py-4 flex flex-col gap-2 flex-1">
                <div className="text-[14px] text-gray-900 font-semibold">
                  {formatDiscountText(voucher)}
                </div>
                <div className="text-[14px] text-gray-700">
                  Đơn tối thiểu {formatCurrencyVND(voucher.minOrder)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-[14px] text-gray-500">
          Không có voucher{" "}
          {historyTab === "expired" ? "hết hiệu lực" : "đã sử dụng"}
        </div>
      )}
    </div>
  );
};
