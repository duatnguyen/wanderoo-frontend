import type { ReactNode } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import CaretDown from "@/components/ui/caret-down";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FilterOption {
  value: string;
  label: string;
}

export interface TableFiltersProps {
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  searchClassName?: string;

  // Filter dropdown
  filterLabel?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];

  // Custom actions
  actions?: ReactNode;

  // Layout
  className?: string;
}

export const TableFilters = ({
  searchValue = "",
  onSearchChange,
  onSearchKeyDown,
  searchPlaceholder = "Tìm kiếm",
  searchClassName = "flex-1 min-w-0 max-w-[400px]",
  filterLabel = "Tất cả",
  filterValue = "all",
  onFilterChange,
  filterOptions = [],
  actions,
  className = "flex gap-[8px] items-center w-full",
}: TableFiltersProps) => {
  const currentFilterOption = filterOptions.find(
    (opt) => opt.value === filterValue
  );

  return (
    <div className={className}>
      {/* Search */}
      {onSearchChange && (
        <SearchBar
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={onSearchKeyDown}
          placeholder={searchPlaceholder}
          className={searchClassName}
        />
      )}

      {/* Filter Dropdown */}
      {filterOptions.length > 0 && onFilterChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-white border-2 border-[#e04d30] flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[8px] cursor-pointer">
              <span className="text-[#e04d30] text-[12px] font-semibold leading-[1.4]">
                {currentFilterOption?.label || filterLabel}
              </span>
              <CaretDown className="text-[#e04d30]" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {filterOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onFilterChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Custom Actions */}
      {actions}
    </div>
  );
};
