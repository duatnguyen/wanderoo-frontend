import React, { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import InventoryProductTable, {
  type InventoryProduct,
} from "@/components/pos/InventoryProductTable";
import { getInventory } from "@/api/endpoints/inventoryApi";
import type {
  SimpleInventoryItemResponse,
  SimpleInventoryPageResponse,
} from "@/types";

const PAGE_SIZE = 100;

const InventoryLookup: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  const serverSortParam = useMemo(() => {
    switch (sortBy) {
      case "price-asc":
        return "price-low-to-high";
      case "price-desc":
        return "price-high-to-low";
      default:
        return undefined;
    }
  }, [sortBy]);

  const { data, isLoading, isFetching, isError, error } =
    useQuery<SimpleInventoryPageResponse>({
      queryKey: [
        "inventory",
        { keyword: debouncedSearch, sort: serverSortParam },
      ],
      queryFn: () =>
        getInventory({
          keyword: debouncedSearch || undefined,
          sort: serverSortParam,
          page: 0,
          size: PAGE_SIZE,
        }),
      staleTime: 60 * 1000,
      placeholderData: keepPreviousData,
    });

  const rawProducts = data?.content ?? [];

  const normalizedProducts: InventoryProduct[] = useMemo(
    () =>
      rawProducts.map((item: SimpleInventoryItemResponse, index: number) => ({
        id: item.id != null ? item.id.toString() : `temp-${index}`,
        name: item.productName,
        image: item.imageUrl ?? undefined,
        barcode:
          item.barcode && item.barcode.trim().length > 0 ? item.barcode : "—",
        variant: item.attributes ?? undefined,
        available: item.posSoldQuantity ?? 0,
        price: item.sellingPrice ?? 0,
      })),
    [rawProducts]
  );

  const sortedProducts = useMemo(() => {
    const products = [...normalizedProducts];
    switch (sortBy) {
      case "name-asc":
        return products.sort((a, b) => a.name.localeCompare(b.name, "vi"));
      case "name-desc":
        return products.sort((a, b) => b.name.localeCompare(a.name, "vi"));
      case "available-asc":
        return products.sort((a, b) => a.available - b.available);
      case "available-desc":
        return products.sort((a, b) => b.available - a.available);
      case "price-asc":
        return products.sort((a, b) => a.price - b.price);
      case "price-desc":
        return products.sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  }, [normalizedProducts, sortBy]);

  const totalProducts = data?.totalElements ?? sortedProducts.length;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white border-2 border-[#e7e7e7] relative">
      <div className="flex-1 overflow-auto">
        <InventoryProductTable
          products={sortedProducts}
          totalProducts={totalProducts}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <div className="flex items-center gap-2 text-[#e04d30] font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Đang tải dữ liệu kho...</span>
            </div>
          </div>
        )}
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90">
            <div className="flex flex-col items-center gap-2 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <p className="font-semibold">Không thể tải dữ liệu kho</p>
              <p className="text-sm text-gray-600">
                {(error as Error)?.message ?? "Vui lòng thử lại sau."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryLookup;
