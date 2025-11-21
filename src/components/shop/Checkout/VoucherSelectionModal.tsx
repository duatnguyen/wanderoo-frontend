import React, { useEffect, useState } from "react";

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

interface VoucherSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (voucherId: string | null) => void;
  selectedVoucherId: string | null;
  sections: VoucherSection[];
}

const VoucherSelectionModal: React.FC<VoucherSelectionModalProps> = ({
  isOpen,
  onClose,
  onApply,
  selectedVoucherId,
  sections,
}) => {
  const [activeVoucher, setActiveVoucher] = useState<string | null>(
    selectedVoucherId
  );
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (isOpen) {
      setActiveVoucher(selectedVoucherId);
    }
  }, [isOpen, selectedVoucherId]);

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
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-gray-900">
            Chọn mã giảm giá
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <span className="text-gray-700 font-medium whitespace-nowrap">
                Mã Voucher
              </span>
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Mã Voucher"
                  className="flex-1 h-10 bg-white border border-gray-200 rounded-xl px-3 text-gray-900 focus:outline-none focus:border-[#E04D30] focus:ring-1 focus:ring-[#E04D30]"
                />
                <button className="h-10 px-5 rounded-xl border border-gray-200 text-gray-500 font-medium cursor-not-allowed bg-[#F5F6FA]">
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[360px] overflow-y-auto px-5 pb-6 space-y-5">
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              <div className="space-y-3">
                <div>
                  <h4 className="text-[15px] font-semibold text-gray-900">
                    {section.title}
                  </h4>
                  <p className="text-gray-500">{section.subtitle}</p>
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
                            <p
                              className={`${
                                isSelected ? "text-[#E04D30]" : "text-gray-500"
                              }`}
                            >
                              {voucher.description}
                            </p>
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
                        {expandedSections[section.id] ? "Thu gọn" : "Xem thêm"}
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
              {index < sections.length - 1 && (
                <hr className="border-gray-200" />
              )}
            </React.Fragment>
          ))}
        </div>

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

export default VoucherSelectionModal;
