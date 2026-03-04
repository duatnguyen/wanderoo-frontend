import React, { useState, useEffect } from "react";
import type { BrandResponse } from "../../../types";
import { formatCurrencyInput, parseCurrencyInput } from "../../../utils/formatCurrencyInput";

export type FilterState = {
  keyword: string;
  minPrice: string;
  maxPrice: string;
  brandIds: number[];
};

export const DEFAULT_FILTERS: FilterState = {
  keyword: "",
  minPrice: "",
  maxPrice: "",
  brandIds: [],
};

type FilterPanelProps = {
  filters: FilterState;
  brands: BrandResponse[];
  isBrandLoading: boolean;
  onPriceChange: (field: "minPrice" | "maxPrice", value: string) => void;
  onBrandToggle: (brandId: number) => void;
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  brands,
  isBrandLoading,
  onPriceChange,
  onBrandToggle,
}) => {
  // Local state for formatted display values
  const [minPriceDisplay, setMinPriceDisplay] = useState<string>("");
  const [maxPriceDisplay, setMaxPriceDisplay] = useState<string>("");

  // Update display values when filters change (from external source, e.g., reset)
  useEffect(() => {
    if (filters.minPrice) {
      const formatted = formatCurrencyInput(filters.minPrice);
      setMinPriceDisplay(formatted);
    } else {
      setMinPriceDisplay("");
    }
  }, [filters.minPrice]);

  useEffect(() => {
    if (filters.maxPrice) {
      const formatted = formatCurrencyInput(filters.maxPrice);
      setMaxPriceDisplay(formatted);
    } else {
      setMaxPriceDisplay("");
    }
  }, [filters.maxPrice]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow digits and dots (for formatting)
    const cleaned = inputValue.replace(/[^\d.]/g, "");
    
    // Parse to get numeric value (remove all non-digits)
    const parsedValue = parseCurrencyInput(cleaned);
    
    // Format for display
    const formatted = parsedValue ? formatCurrencyInput(parsedValue) : "";
    
    setMinPriceDisplay(formatted);
    // Save raw numeric value (without formatting)
    onPriceChange("minPrice", parsedValue);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow digits and dots (for formatting)
    const cleaned = inputValue.replace(/[^\d.]/g, "");
    
    // Parse to get numeric value (remove all non-digits)
    const parsedValue = parseCurrencyInput(cleaned);
    
    // Format for display
    const formatted = parsedValue ? formatCurrencyInput(parsedValue) : "";
    
    setMaxPriceDisplay(formatted);
    // Save raw numeric value (without formatting)
    onPriceChange("maxPrice", parsedValue);
  };

  return (
    <div className="space-y-6">
      {/* Khoảng giá */}
      <section>
        <h4 className="text-sm font-semibold text-[#0b1f3a] mb-3">
          Khoảng giá (VNĐ)
        </h4>
        <div className="flex items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            value={minPriceDisplay}
            onChange={handleMinPriceChange}
            placeholder="Từ"
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-[#454545] placeholder:text-gray-400 focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-colors"
          />
          <span className="text-gray-400 text-sm font-medium">-</span>
          <input
            type="text"
            inputMode="numeric"
            value={maxPriceDisplay}
            onChange={handleMaxPriceChange}
            placeholder="Đến"
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-[#454545] placeholder:text-gray-400 focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-colors"
          />
        </div>
      </section>

      {/* Thương hiệu */}
      <section>
        <h4 className="text-sm font-semibold text-[#0b1f3a] mb-3">Thương hiệu</h4>
        {isBrandLoading ? (
          <div className="flex items-center justify-center py-4">
            <p className="text-xs text-gray-400">Đang tải...</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <p className="text-xs text-gray-400">Chưa có thương hiệu</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {brands.map((brand) => (
              <label
                key={brand.id}
                className="flex cursor-pointer items-center gap-3 text-sm text-[#454545] hover:text-[#1c3b6c] transition-colors group"
              >
                <input
                  type="checkbox"
                  checked={filters.brandIds.includes(brand.id)}
                  onChange={() => onBrandToggle(brand.id)}
                  className="size-5 rounded border-2 border-gray-300 text-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 focus:ring-offset-0 cursor-pointer transition-all group-hover:border-[#f97316]"
                />
                <span className="flex-1">{brand.name}</span>
              </label>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FilterPanel;

