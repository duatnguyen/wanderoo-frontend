import React, { useState, useEffect, useRef } from "react";
import { searchDiscountsByKeyword } from "@/api/endpoints/saleApi";
import type { DiscountResponse } from "@/types/api";
import { Loader2 } from "lucide-react";

type Voucher = {
  id: string;
  code: string;
  title: string;
  description: string;
  expiry: string;
  minimumOrder: string;
};

type VoucherSection = {
  id: string;
  title: string;
  subtitle: string;
  vouchers: Voucher[];
};

interface POSVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (voucherId: string | null) => void;
  selectedVoucherId: string | null;
}

const POSVoucherModal: React.FC<POSVoucherModalProps> = ({
  isOpen,
  onClose,
  onApply,
  selectedVoucherId,
}) => {
  const [activeVoucher, setActiveVoucher] = useState<string | null>(
    selectedVoucherId
  );
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [voucherCode, setVoucherCode] = useState("");
  const [sections, setSections] = useState<VoucherSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [allVouchers, setAllVouchers] = useState<Voucher[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Convert DiscountResponse to Voucher
  const convertDiscountToVoucher = (discount: DiscountResponse): Voucher => {
    const discountType = discount.type === "PERCENT" ? "%" : "đ";
    const discountValue = discount.value;
    const maxDiscount = discount.maxOrderValue
      ? ` tối đa ${formatCurrency(discount.maxOrderValue)}`
      : "";
    const title = `Giảm ${discountValue}${discountType}${maxDiscount}`;
    const minOrder = discount.minOrderValue
      ? formatCurrency(discount.minOrderValue)
      : "0đ";
    const description = discount.description || "";

    return {
      id: discount.id.toString(),
      code: discount.code,
      title,
      description,
      expiry: formatDate(discount.endDate),
      minimumOrder: minOrder,
    };
  };

  // Fetch all discounts from API when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveVoucher(selectedVoucherId);
      setIsLoading(true);
      setError(null);
      setVoucherCode("");
      setSearchError(null);
      
      searchDiscountsByKeyword()
        .then((discounts: DiscountResponse[]) => {
          const vouchers = discounts.map(convertDiscountToVoucher);
          setAllVouchers(vouchers);
          setSections([
            {
              id: "discount",
              title: "Voucher giảm giá",
              subtitle: "Có thể chọn 1 voucher",
              vouchers,
            },
          ]);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching discounts:", err);
          setError("Không thể tải danh sách mã giảm giá. Vui lòng thử lại.");
          setIsLoading(false);
        });
    }
  }, [isOpen, selectedVoucherId]);

  // Auto search when typing with debounce
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If input is empty, show all vouchers
    if (!voucherCode || voucherCode.trim().length === 0) {
      setSections([
        {
          id: "discount",
          title: "Voucher giảm giá",
          subtitle: "Có thể chọn 1 voucher",
          vouchers: allVouchers,
        },
      ]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    // Set loading state
    setIsSearching(true);
    setSearchError(null);

    // Debounce search - wait 300ms after user stops typing
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const discounts = await searchDiscountsByKeyword(voucherCode.trim());
        const vouchers = discounts.map(convertDiscountToVoucher);
        
        setSections([
          {
            id: "discount",
            title: "Voucher giảm giá",
            subtitle: vouchers.length > 0 
              ? `Tìm thấy ${vouchers.length} voucher` 
              : "Có thể chọn 1 voucher",
            vouchers,
          },
        ]);
        setIsSearching(false);
      } catch (err: any) {
        console.error("Error searching discounts:", err);
        setSearchError("Không thể tìm kiếm mã giảm giá. Vui lòng thử lại.");
        setIsSearching(false);
      }
    }, 300);

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucherCode]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(activeVoucher);
    onClose();
  };

  const toggleSectionExpand = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };


  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden text-[13px]">
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-gray-900">
            Chọn mã giảm giá
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {/* Voucher Code Input */}
        <div className="px-5 py-4">
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <span className="text-gray-700 font-medium whitespace-nowrap">
                Mã Voucher
              </span>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Nhập mã voucher để tìm kiếm..."
                  value={voucherCode}
                  onChange={(e) => {
                    setVoucherCode(e.target.value);
                    setSearchError(null);
                  }}
                  className="w-full h-10 bg-white border border-gray-200 rounded-xl px-3 text-gray-900 focus:outline-none focus:border-[#E04D30] focus:ring-1 focus:ring-[#E04D30]"
                />
                {searchError && (
                  <p className="text-red-500 text-xs mt-1">{searchError}</p>
                )}
                {isSearching && (
                  <div className="flex items-center gap-2 mt-1">
                    <Loader2 className="w-3 h-3 animate-spin text-[#E04D30]" />
                    <p className="text-gray-500 text-xs">Đang tìm kiếm...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Voucher List */}
        <div className="h-[360px] overflow-y-auto px-5 pb-6 space-y-5">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#E04D30]" />
                <p className="text-gray-500 text-sm">Đang tải danh sách mã giảm giá...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-500 text-sm mb-2">{error}</p>
                <button
                  onClick={() => {
                    setIsLoading(true);
                    setError(null);
                    searchDiscountsByKeyword()
                      .then((discounts: DiscountResponse[]) => {
                        const vouchers = discounts.map(convertDiscountToVoucher);
                        setAllVouchers(vouchers);
                        setSections([
                          {
                            id: "discount",
                            title: "Voucher giảm giá",
                            subtitle: "Có thể chọn 1 voucher",
                            vouchers,
                          },
                        ]);
                        setIsLoading(false);
                      })
                      .catch((err) => {
                        console.error("Error fetching discounts:", err);
                        setError("Không thể tải danh sách mã giảm giá. Vui lòng thử lại.");
                        setIsLoading(false);
                      });
                  }}
                  className="text-sm text-[#1B5CF0] hover:text-[#164aba] font-medium"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : sections.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">Không có mã giảm giá nào</p>
            </div>
          ) : (
            sections.map((section, index) => (
            <React.Fragment key={section.id}>
              <div className="space-y-3">
                <div>
                  <h4 className="text-[15px] font-semibold text-gray-900">
                    {section.title}
                  </h4>
                  <p className="text-gray-500 text-[13px]">
                    {section.subtitle}
                  </p>
                </div>
                <div className="space-y-3">
                  {(expandedSections[section.id]
                    ? section.vouchers
                    : section.vouchers.slice(0, 2)
                  ).map((voucher) => {
                    const isSelected = activeVoucher === voucher.id;
                    return (
                      <label
                        key={voucher.id}
                        className={`flex items-stretch rounded-2xl border ${
                          isSelected
                            ? "border-[#E04D30] shadow-[0_8px_20px_rgba(224,77,48,0.12)]"
                            : "border-gray-200 hover:border-[#E04D30]/60"
                        } bg-white transition-colors cursor-pointer`}
                      >
                        <div
                          className={`flex-1 px-4 py-3 text-[13px] ${
                            isSelected ? "text-[#E04D30]" : "text-gray-900"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-semibold uppercase tracking-wide ${
                                isSelected ? "text-[#E04D30]" : "text-[#1B5CF0]"
                              }`}
                            >
                              {voucher.code}
                            </span>
                            <span
                              className={`${
                                isSelected ? "text-[#E04D30]" : "text-gray-500"
                              }`}
                            >
                              HSD: {voucher.expiry}
                            </span>
                          </div>
                          <div className="mt-3 space-y-1">
                            <p
                              className={`font-semibold leading-snug ${
                                isSelected ? "text-[#E04D30]" : "text-gray-900"
                              }`}
                            >
                              {voucher.title}
                            </p>
                            <p
                              className={`${
                                isSelected ? "text-[#E04D30]" : "text-gray-600"
                              }`}
                            >
                              Đơn tối thiểu {voucher.minimumOrder}
                            </p>
                            {voucher.description && (
                              <p
                                className={`${
                                  isSelected ? "text-[#E04D30]" : "text-gray-500"
                                }`}
                              >
                                {voucher.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-center px-4 border-l border-gray-100">
                          <input
                            type="radio"
                            name="voucher"
                            className="h-5 w-5 text-[#E04D30] focus:ring-[#E04D30]"
                            checked={isSelected}
                            onChange={() => setActiveVoucher(voucher.id)}
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
                {section.vouchers.length > 2 && (
                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={() => toggleSectionExpand(section.id)}
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <span>
                        {expandedSections[section.id]
                          ? "Thu gọn"
                          : "Xem thêm"}
                      </span>
                      <span
                        className={`inline-block transition-transform ${
                          expandedSections[section.id] ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                  </div>
                )}
              </div>
              {index < sections.length - 1 && <hr className="border-gray-200" />}
            </React.Fragment>
          ))
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            Trở lại
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-lg bg-[#E04D30] text-white font-semibold hover:bg-[#c53b1d] transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSVoucherModal;

