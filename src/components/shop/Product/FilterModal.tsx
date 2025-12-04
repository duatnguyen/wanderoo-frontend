import React from "react";
import FilterPanel, { type FilterState } from "./FilterPanel";
import type { BrandResponse } from "../../../types";

type FilterModalProps = {
  isOpen: boolean;
  filters: FilterState;
  brands: BrandResponse[];
  isBrandLoading: boolean;
  onClose: () => void;
  onPriceChange: (field: "minPrice" | "maxPrice", value: string) => void;
  onBrandToggle: (brandId: number) => void;
  onReset: () => void;
};

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  filters,
  brands,
  isBrandLoading,
  onClose,
  onPriceChange,
  onBrandToggle,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_rgba(4,12,24,0.45)]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h3 className="text-xl font-bold text-[#0b1f3a]">Bộ lọc</h3>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-sm font-medium text-[#1c3b6c] hover:text-[#f97316] hover:underline transition-colors"
              onClick={onReset}
            >
              Đặt lại
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Đóng"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
          <FilterPanel
            filters={filters}
            brands={brands}
            isBrandLoading={isBrandLoading}
            onPriceChange={onPriceChange}
            onBrandToggle={onBrandToggle}
          />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-2xl border-2 border-[#1c3b6c] py-3 text-sm font-semibold text-[#1c3b6c] hover:bg-[#1c3b6c] hover:text-white transition-colors"
              onClick={onReset}
            >
              Xóa bộ lọc
            </button>
            <button
              type="button"
              className="flex-1 rounded-2xl bg-[#f97316] py-3 text-sm font-semibold text-white hover:bg-[#ea580c] transition-colors shadow-md"
              onClick={onClose}
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;

