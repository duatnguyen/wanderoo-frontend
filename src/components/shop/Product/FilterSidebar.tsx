import React from "react";
import { Button } from "@/components/ui/button";
import FilterPanel, { type FilterState } from "./FilterPanel";
import type { BrandResponse } from "../../../types";

type FilterSidebarProps = {
  filters: FilterState;
  brands: BrandResponse[];
  isBrandLoading: boolean;
  onPriceChange: (field: "minPrice" | "maxPrice", value: string) => void;
  onBrandToggle: (brandId: number) => void;
  onReset: () => void;
};

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  brands,
  isBrandLoading,
  onPriceChange,
  onBrandToggle,
  onReset,
}) => {
  return (
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
      <div className="sticky top-4 rounded-2xl border border-gray-200 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h3 className="text-xl font-bold text-[#0b1f3a]">Bộ lọc</h3>
          <Button
            variant="link"
            className="text-sm font-medium text-[#1c3b6c] hover:text-[#f97316] hover:underline transition-colors p-0 h-auto"
            onClick={onReset}
          >
            Đặt lại
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] px-6 py-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
          <FilterPanel
            filters={filters}
            brands={brands}
            isBrandLoading={isBrandLoading}
            onPriceChange={onPriceChange}
            onBrandToggle={onBrandToggle}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <Button
            className="w-full rounded-2xl bg-[#f97316] py-3 text-sm font-semibold text-white hover:bg-[#ea580c] transition-colors shadow-md h-auto"
            onClick={onReset}
          >
            Xóa bộ lọc
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;

