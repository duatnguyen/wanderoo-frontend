import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

interface CategoryItem {
  id: string;
  label: string;
}

interface MainCategory {
  id: string;
  label: string;
  subcategories: CategoryItem[];
}

interface CategoryDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  mainCategories: MainCategory[];
  onCategoryClick?: (categoryId: string, mainCategoryId?: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  isOpen,
  onClose,
  mainCategories,
  onCategoryClick,
}) => {
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null
  );

  if (!isOpen) return null;

  // Get the currently hovered category's subcategories
  const hoveredCategory = mainCategories.find(
    (cat) => cat.id === hoveredCategoryId
  );
  const displayedSubcategories = hoveredCategory?.subcategories || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dropdown */}
      <div
        className="absolute top-full left-0 mt-1 z-40 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden flex"
        onMouseLeave={() => setHoveredCategoryId(null)}
      >
        {/* Left Column - Main Categories (Wider) */}
        <div className="w-[280px] border-r border-gray-200 bg-white">
          <ul className="py-2">
            {mainCategories.map((category, index) => {
              const isHovered = hoveredCategoryId === category.id;
              return (
                <li key={category.id}>
                  <button
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                      isHovered
                        ? "bg-gray-50 text-[#18345c] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onMouseEnter={() => setHoveredCategoryId(category.id)}
                    onClick={() => {
                      onCategoryClick?.(category.id);
                      onClose();
                    }}
                  >
                    <span>{category.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  {index < mainCategories.length - 1 && (
                    <div className="mx-4 border-t border-gray-200" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Column - Subcategories (Narrower) */}
        {hoveredCategoryId && (
          <div className="w-[220px] bg-gray-50">
            {displayedSubcategories.length > 0 ? (
              <ul className="py-2">
                {displayedSubcategories.map((subcategory, index) => (
                  <li key={subcategory.id}>
                    <button
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-white hover:text-[#18345c] transition-colors"
                      onClick={() => {
                        onCategoryClick?.(
                          subcategory.id,
                          hoveredCategoryId || undefined
                        );
                        onClose();
                      }}
                    >
                      <span>{subcategory.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    {index < displayedSubcategories.length - 1 && (
                      <div className="mx-4 border-t border-gray-200" />
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400 py-8">
                Chọn danh mục để xem
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryDropdown;
