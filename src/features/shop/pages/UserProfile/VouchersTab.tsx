import React, { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import Button from "../../../../components/shop/Button";
import { Input } from "../../../../components/shop/Input";
import {
  claimVoucher,
  getMyVouchers,
  getPublicDiscounts,
  getVoucherHistory,
  searchPublicDiscounts,
} from "../../../../api/endpoints/discountApi";
import type {
  DiscountPublicResponse,
  VoucherHistoryResponse,
} from "../../../../types";

function formatCurrencyVND(value?: number | null) {
  const safeValue = value ?? 0;
  return `${safeValue.toLocaleString("vi-VN")}đ`;
}

type HistoryTab = "expired" | "used";

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
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  maxDiscount?: number | null;
  minOrder?: number | null;
  expiryDate?: string;
  status: "expired" | "used";
  discountText?: string | null;
  statusLabel?: string | null;
}

const VouchersTab: React.FC = () => {
  const [voucherInput, setVoucherInput] = useState("");
  const [currentView, setCurrentView] = useState<"list" | "history">("list");
  const [historyTab, setHistoryTab] = useState<HistoryTab>("expired");
  const [publicVouchers, setPublicVouchers] = useState<VoucherCard[]>([]);
  const [myVouchers, setMyVouchers] = useState<VoucherCard[]>([]);
  const [historyVouchers, setHistoryVouchers] = useState<HistoryVoucher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeSearchKeyword, setActiveSearchKeyword] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimFeedback, setClaimFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const formatDate = useCallback((date?: string | null) => {
    if (!date) return undefined;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return undefined;
    }
    return parsed.toLocaleDateString("vi-VN");
  }, []);

  const determinePublicVoucherStatus = useCallback(
    (voucher: DiscountPublicResponse): VoucherCard["status"] => {
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
    },
    []
  );

  const mapVoucherHistoryStatus = useCallback(
    (status?: VoucherHistoryResponse["status"]): VoucherCard["status"] => {
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
    },
    []
  );

  const transformPublicVoucher = useCallback(
    (voucher: DiscountPublicResponse): VoucherCard => {
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
    },
    [determinePublicVoucherStatus, formatDate]
  );

  const transformMyVoucher = useCallback(
    (voucher: VoucherHistoryResponse): VoucherCard => ({
      id: `my-${voucher.id}`,
      code: voucher.discountCode,
      status: mapVoucherHistoryStatus(voucher.status),
      discountText: voucher.discountText,
      maxDiscount: voucher.maxOrderValue ?? null,
      minOrder: voucher.minOrderValue ?? null,
      expiryDate: formatDate(voucher.expirationDate),
      statusLabel: voucher.statusLabel ?? null,
      origin: "my",
    }),
    [mapVoucherHistoryStatus, formatDate]
  );

  const transformHistoryVoucher = useCallback(
    (voucher: VoucherHistoryResponse): HistoryVoucher => ({
      id: `history-${voucher.id}`,
      code: voucher.discountCode,
      discountText: voucher.discountText,
      maxDiscount: voucher.maxOrderValue ?? null,
      minOrder: voucher.minOrderValue ?? null,
      expiryDate: formatDate(voucher.expirationDate),
      statusLabel: voucher.statusLabel ?? null,
      status: voucher.status === "USED" ? "used" : "expired",
    }),
    [formatDate]
  );

  const loadVoucherData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSearchError(null);
    try {
      const [publicResponse, myResponse] = await Promise.all([
        getPublicDiscounts(),
        getMyVouchers(),
      ]);

      setPublicVouchers(publicResponse.map(transformPublicVoucher));
      setMyVouchers(myResponse.map(transformMyVoucher));
      setIsSearchActive(false);
      setActiveSearchKeyword("");
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
  }, [transformMyVoucher, transformPublicVoucher]);

  useEffect(() => {
    void loadVoucherData();
  }, [loadVoucherData]);

  const handleSearchVouchers = useCallback(
    async (keyword?: string) => {
      const query = keyword ?? voucherInput;
      const trimmed = query.trim();
      if (!trimmed) {
        setVoucherInput("");
        setActiveSearchKeyword("");
        setIsSearchActive(false);
        setSearchError(null);
        await loadVoucherData();
        return;
      }

      setIsSearching(true);
      setSearchError(null);
      try {
        const results = await searchPublicDiscounts({ keyword: trimmed });
        setPublicVouchers(results.map(transformPublicVoucher));
        setIsSearchActive(true);
        setActiveSearchKeyword(trimmed);
        if (results.length === 0) {
          setSearchError("Không tìm thấy voucher phù hợp.");
        }
      } catch (err) {
        if (isAxiosError(err)) {
          setSearchError(
            err.response?.data?.message ?? "Không thể tìm kiếm voucher."
          );
        } else {
          setSearchError("Có lỗi xảy ra khi tìm kiếm voucher.");
        }
      } finally {
        setIsSearching(false);
      }
    },
    [loadVoucherData, transformPublicVoucher, voucherInput]
  );

  const loadHistoryVouchers = useCallback(
    async (tab: HistoryTab) => {
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const statusParam = tab === "expired" ? "EXPIRED" : "USED";
        const response = await getVoucherHistory(statusParam);
        setHistoryVouchers(response.map(transformHistoryVoucher));
      } catch (err) {
        if (isAxiosError(err)) {
          setHistoryError(
            err.response?.data?.message ??
              "Không thể tải lịch sử voucher. Vui lòng thử lại."
          );
        } else {
          setHistoryError("Có lỗi xảy ra khi tải lịch sử voucher.");
        }
      } finally {
        setHistoryLoading(false);
      }
    },
    [transformHistoryVoucher]
  );

  useEffect(() => {
    if (currentView !== "history") return;
    void loadHistoryVouchers(historyTab);
  }, [currentView, historyTab, loadHistoryVouchers]);

  const handleSaveVoucher = useCallback(async () => {
    const trimmedCode = voucherInput.trim();
    if (!trimmedCode) {
      setClaimFeedback({
        type: "error",
        message: "Vui lòng nhập mã voucher",
      });
      return;
    }

    setIsClaiming(true);
    setClaimFeedback(null);
    try {
      await claimVoucher({ code: trimmedCode });
      setClaimFeedback({
        type: "success",
        message: "Lưu voucher thành công!",
      });
      setVoucherInput("");
      await loadVoucherData();
    } catch (err) {
      let message = "Không thể lưu voucher. Vui lòng thử lại.";
      if (isAxiosError(err)) {
        message = err.response?.data?.message ?? message;
      }
      setClaimFeedback({
        type: "error",
        message,
      });
    } finally {
      setIsClaiming(false);
    }
  }, [voucherInput, loadVoucherData]);

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
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 sm:p-5 space-y-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="flex-1 flex items-center gap-3">
                    <label className="text-[14px] font-medium text-gray-700 whitespace-nowrap">
                      Mã / tìm voucher:
                    </label>
                    <Input
                      type="text"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value)}
                      placeholder="Nhập mã để lưu hoặc tên/mã để tìm kiếm"
                      fullWidth
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          void handleSaveVoucher();
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSaveVoucher}
                      className="w-full sm:w-auto px-6 sm:px-8 whitespace-nowrap"
                      loading={isClaiming}
                      disabled={isClaiming}
                    >
                      Lưu
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        void handleSearchVouchers();
                      }}
                      className="w-full sm:w-auto px-6 sm:px-8 whitespace-nowrap"
                      loading={isSearching}
                      disabled={isSearching}
                    >
                      Tìm kiếm
                    </Button>
                    {isSearchActive && (
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => {
                          void handleSearchVouchers("");
                        }}
                        className="w-full sm:w-auto px-6 sm:px-8 whitespace-nowrap"
                        disabled={isSearching}
                      >
                        Xóa tìm kiếm
                      </Button>
                    )}
                  </div>
                </div>
                {claimFeedback && (
                  <p
                    className={`text-[14px] mt-1 ${
                      claimFeedback.type === "error"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {claimFeedback.message}
                  </p>
                )}
                {searchError && (
                  <p className="text-[14px] text-red-600">{searchError}</p>
                )}
                {isSearchActive && !searchError && (
                  <p className="text-[14px] text-gray-600">
                    Đang hiển thị kết quả tìm kiếm cho "
                    <span className="font-semibold">{activeSearchKeyword}</span>
                    "
                  </p>
                )}
              </div>
            )}
          </div>

          {currentView === "list" ? (
            <VoucherListSection
              myVouchers={myVouchers}
              publicVouchers={publicVouchers}
              loading={isLoading || isSearching}
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
              vouchers={historyVouchers}
              loading={historyLoading}
              error={historyError}
              onRetry={() => {
                void loadHistoryVouchers(historyTab);
              }}
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
  historyTab: HistoryTab;
  onChangeTab: (tab: HistoryTab) => void;
  formatDiscountText: (voucher: VoucherCard | HistoryVoucher) => string;
  vouchers: HistoryVoucher[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const VoucherHistorySection: React.FC<VoucherHistorySectionProps> = ({
  historyTab,
  onChangeTab,
  formatDiscountText,
  vouchers,
  loading,
  error,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-10 bg-gray-50 text-center text-gray-600">
        Đang tải lịch sử voucher...
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

      {vouchers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-[14px] font-semibold ${
                      voucher.status === "used"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {voucher.statusLabel
                      ? voucher.statusLabel
                      : voucher.status === "expired"
                      ? "Hết hiệu lực"
                      : "Đã sử dụng"}
                  </span>
                </div>
                <span className="text-[14px] text-gray-500 whitespace-nowrap">
                  {voucher.expiryDate ? `HSD: ${voucher.expiryDate}` : "Không rõ HSD"}
                </span>
              </div>

              <div className="px-4 sm:px-6 py-4 flex flex-col gap-2 flex-1">
                <div className="text-[14px] text-gray-900 font-semibold">
                  {formatDiscountText(voucher)}
                </div>
                <div className="text-[14px] text-gray-700">
                  {typeof voucher.minOrder === "number" && voucher.minOrder > 0
                    ? `Đơn tối thiểu ${formatCurrencyVND(voucher.minOrder)}`
                    : "Không yêu cầu đơn tối thiểu"}
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
