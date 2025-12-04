import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getPublicCategoryParents,
  getPublicCategoryChildren,
} from "../api/endpoints/attributeApi";
import {
  getPublicCategoryBrands,
  getPublicProductsByCategory,
} from "../api/endpoints/productApi";
import { DEFAULT_FILTERS, type FilterState } from "../components/shop/Product/FilterPanel";
import type { BrandResponse, ProductCategoryItemResponse } from "../types";

const PAGE_SIZE = 12;
const DEBOUNCE_DELAY = 500;

// Helper function để chuyển đổi sort option thành format API
const getSortParam = (sortOption: string): string | undefined => {
  switch (sortOption) {
    case "PRICE_ASC":
      return "price_asc";
    case "PRICE_DESC":
      return "price_desc";
    case "RATING":
      return "rating_desc";
    case "IN_STOCK":
      return "in_stock";
    case "ALL":
    default:
      return undefined;
  }
};

// Hook để debounce giá trị
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useProductCategoryFilters = (
  parentId: string | undefined,
  categoryId: string | undefined
) => {
  // State management
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounce keyword
  const debouncedKeyword = useDebounce(filters.keyword, DEBOUNCE_DELAY);

  // Convert URL params to numbers
  const numericParentId = Number(parentId);
  const resolvedCategoryId = Number(categoryId ?? 0);

  // Fetch category data
  const { data: parentCategories = [] } = useQuery({
    queryKey: ["publicCategoryParents"],
    queryFn: getPublicCategoryParents,
  });

  const { data: childCategories = [] } = useQuery({
    queryKey: ["publicCategoryChildren", numericParentId],
    queryFn: () => getPublicCategoryChildren(numericParentId),
    enabled: Number.isFinite(numericParentId),
  });

  // Find current category info
  const parentCategory = parentCategories.find(
    (cat) => cat.id === numericParentId
  );
  const childCategory = childCategories.find(
    (child) => child.id === Number(categoryId)
  );

  // Fetch brands for filter
  const brandQuery = useQuery({
    queryKey: ["publicBrands"],
    queryFn: () => getPublicCategoryBrands(),
  });

  const brandOptions = brandQuery.data ?? [];

  // Build API filters object
  const apiFilters = useMemo(
    () => ({
      keyword: debouncedKeyword || undefined,
      brandIds: filters.brandIds.length ? filters.brandIds : undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      sort: getSortParam(sortOption),
    }),
    [
      debouncedKeyword,
      filters.brandIds,
      filters.minPrice,
      filters.maxPrice,
      sortOption,
    ]
  );

  // Fetch products - chỉ fetch khi có categoryId (danh mục con)
  const productQuery = useQuery({
    queryKey: ["publicCategoryProducts", resolvedCategoryId, apiFilters, page],
    enabled: resolvedCategoryId > 0 && !!categoryId, // Chỉ fetch khi có categoryId
    keepPreviousData: true,
    queryFn: () =>
      getPublicProductsByCategory(resolvedCategoryId, {
        ...apiFilters,
        page: Math.max(page - 1, 0), // Convert 1-based to 0-based
        size: PAGE_SIZE,
      }),
  });

  const products = productQuery.data?.productCategoryResponseList ?? [];
  const totalPages = productQuery.data?.totalPages ?? 1;

  // Client-side sort fallback
  const sortedProducts = useMemo(() => {
    let list = [...products];

    // Filter "Còn hàng"
    if (sortOption === "IN_STOCK") {
      list = list.filter((p) => p.minSellingPrice > 0);
    }

    // Client-side sort như fallback
    switch (sortOption) {
      case "PRICE_ASC":
        return list.sort((a, b) => a.minSellingPrice - b.minSellingPrice);
      case "PRICE_DESC":
        return list.sort((a, b) => b.minSellingPrice - a.minSellingPrice);
      case "RATING":
        return list.sort((a, b) => b.rating - a.rating);
      case "IN_STOCK":
        return list; // Đã filter ở trên
      default:
        return list;
    }
  }, [products, sortOption]);

  // Đếm số bộ lọc đang áp dụng
  const appliedFilterCount = useMemo(() => {
    return (
      filters.brandIds.length +
      (filters.minPrice ? 1 : 0) +
      (filters.maxPrice ? 1 : 0)
    );
  }, [filters]);

  // Reset filters khi categoryId thay đổi
  useEffect(() => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      keyword: prev.keyword, // Giữ keyword
    }));
    setPage(1);
  }, [categoryId, parentId]);

  // Đảm bảo page không vượt quá totalPages
  useEffect(() => {
    if (productQuery.data && page > productQuery.data.totalPages) {
      setPage(productQuery.data.totalPages || 1);
    }
  }, [productQuery.data, page]);

  // Event handlers
  const handleKeywordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFilters((prev) => ({ ...prev, keyword: value }));
      setPage(1);
    },
    []
  );

  const handleSortChange = useCallback((value: string) => {
    setSortOption(value);
    setPage(1);
  }, []);

  const handlePriceChange = useCallback(
    (field: "minPrice" | "maxPrice", value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
      setPage(1);
    },
    []
  );

  const handleBrandToggle = useCallback((brandId: number) => {
    setFilters((prev) => ({
      ...prev,
      brandIds: prev.brandIds.includes(brandId)
        ? prev.brandIds.filter((id) => id !== brandId)
        : [...prev.brandIds, brandId],
    }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  const openFilter = useCallback(() => {
    setIsFilterOpen(true);
  }, []);

  const closeFilter = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  return {
    // State
    filters,
    sortOption,
    page,
    isFilterOpen,
    appliedFilterCount,

    // Category data
    parentCategory,
    childCategory,
    childCategories, // Danh sách danh mục con

    // Products data
    products: sortedProducts,
    totalPages,
    isLoading: productQuery.isLoading,

    // Brands data
    brands: brandOptions,
    isBrandLoading: brandQuery.isLoading,

    // Handlers
    handleKeywordChange,
    handleSortChange,
    handlePriceChange,
    handleBrandToggle,
    resetFilters,
    setPage,
    openFilter,
    closeFilter,
  };
};

export type UseProductCategoryFiltersReturn = ReturnType<
  typeof useProductCategoryFilters
>;

