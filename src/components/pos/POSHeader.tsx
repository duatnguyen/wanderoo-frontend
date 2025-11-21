import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import ShopLogo from "@/assets/icons/ShopLogo.svg";
import { Loader2, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { POSOrderTabs, type OrderTab } from "./POSOrderTabs";
import { searchProducts } from "@/api/endpoints/saleApi";
import { usePOSContext } from "@/context/POSContext";
import type { SaleProductResponse } from "@/types/api.ts";

export type { OrderTab };

export type POSHeaderProps = {
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  currentOrderId?: string;
  orders?: OrderTab[];
  onOrderSelect?: (orderId: string) => void;
  onOrderClose?: (orderId: string) => void;
  onOrderAdd?: () => void;
  pageTitle?: string;
  pageSubtitle?: string;
  onProductSelect?: (product: {
    id: string;
    name: string;
    price: number;
    available?: number | null;
    attributes?: string | null;
    imageUrl?: string;
  }) => void;
  user?: {
    name: string;
    role: string;
  };
  className?: string;
};

export const POSHeader: React.FC<POSHeaderProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Nhập tên sản phẩm hoặc mã barcode",
  currentOrderId,
  orders = [],
  onOrderSelect,
  onOrderClose,
  onOrderAdd,
  onProductSelect,
  pageTitle,
  user = { name: "Admin", role: "Admin" },
  className,
}) => {
  const isSalesPage = searchValue !== undefined && orders !== undefined;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [productResults, setProductResults] = useState<SaleProductResponse[]>(
    []
  );
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [productSearchError, setProductSearchError] = useState<string | null>(
    null
  );
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const { productSelectHandler } = usePOSContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!isSalesPage) {
      setProductResults([]);
      setProductSearchError(null);
      setIsSearchingProducts(false);
      return;
    }

    const keyword = searchValue?.trim() ?? "";
    if (!keyword) {
      setProductResults([]);
      setProductSearchError(null);
      setIsSearchingProducts(false);
      return;
    }

    let isCancelled = false;
    setIsSearchingProducts(true);
    setProductSearchError(null);

    const handler = window.setTimeout(async () => {
      try {
        const results = await searchProducts(keyword);
        if (!isCancelled) {
          setProductResults(results);
        }
      } catch (error) {
        console.error("Không thể tìm sản phẩm:", error);
        if (!isCancelled) {
          setProductResults([]);
          setProductSearchError("Không thể tải danh sách sản phẩm");
        }
      } finally {
        if (!isCancelled) {
          setIsSearchingProducts(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(handler);
    };
  }, [isSalesPage, searchValue]);

  const formatCurrency = (amount?: number | null) => {
    if (amount == null) {
      return "—";
    }
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const effectiveProductSelect =
    onProductSelect ?? productSelectHandler ?? null;

  const renderProductDropdown = () => {
    if (!isDropdownOpen || !isSalesPage) {
      return null;
    }

    const keyword = searchValue?.trim() ?? "";
    const hasKeyword = keyword.length > 0;

    return (
      <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-40 overflow-hidden">
        <div className="max-h-80 overflow-y-auto divide-y divide-[#f0f0f0]">
          {!hasKeyword && !isSearchingProducts && (
            <p className="px-4 py-3 text-sm text-[#6F6F6F]">
              Nhập tên hoặc mã barcode để tìm sản phẩm
            </p>
          )}

          {isSearchingProducts && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-[#6F6F6F]">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tìm kiếm sản phẩm...
            </div>
          )}

          {!isSearchingProducts && productSearchError && (
            <p className="px-4 py-3 text-xs text-[#E04D30]">
              {productSearchError}
            </p>
          )}

          {!isSearchingProducts &&
            !productSearchError &&
            hasKeyword &&
            productResults.length === 0 && (
              <p className="px-4 py-3 text-xs text-[#6F6F6F]">
                Không tìm thấy sản phẩm phù hợp
              </p>
            )}

          {!isSearchingProducts &&
            !productSearchError &&
            productResults.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  effectiveProductSelect?.({
                    id: product.id?.toString() ?? "",
                    name: product.productName,
                    price: product.sellingPrice ?? 0,
                    available: product.posSoldQuantity ?? undefined,
                    attributes: product.attributes,
                    imageUrl: product.imageUrl,
                  });
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-[#f8f9ff] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 border border-[#e7e7e7] flex items-center justify-center text-xs text-[#6F6F6F] overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>No Img</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#272424] line-clamp-1">
                        {product.productName}
                      </p>
                      <p className="text-sm font-bold text-[#272424] whitespace-nowrap">
                        {formatCurrency(product.sellingPrice)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#737373] mt-1">
                      <span className="line-clamp-1">
                        {product.attributes || "—"}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        Có thể bán:{" "}
                        {product.posSoldQuantity != null
                          ? product.posSoldQuantity.toLocaleString("vi-VN")
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>
    );
  };

  return (
    <header
      className={cn(
        "bg-[#18345C] flex items-center gap-3 sm:gap-4 px-3 sm:px-4 lg:px-2 py-2 sm:py-4 h-16",
        className
      )}
    >
      {/* Logo and Title - Always visible */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <Link to="/admin/dashboard" className="cursor-pointer">
          <img
            src={ShopLogo}
            alt="Wanderoo Logo"
            className="h-150  w-auto object-contain max-h-full"
          />
        </Link>
        <h1 className="text-white text-lg sm:text-xl font-bold whitespace-nowrap">
          {pageTitle || "Bán hàng"}
        </h1>
      </div>

      {isSalesPage && (
        <>
          {/* Search Bar - Only on sales page */}
          <div className="flex items-center min-w-0 flex-shrink-0">
            <div
              className="w-[300px] sm:w-[400px] lg:w-[500px] relative"
              ref={searchContainerRef}
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4 text-[#737373]"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-[#272424] placeholder:text-[#737373] focus:outline-none focus:bg-white focus:border-[#e04d30]"
                onFocus={() => setIsDropdownOpen(true)}
              />
              {renderProductDropdown()}
            </div>
          </div>

          {/* Order Tabs - Only on sales page */}
          <div className="flex-1 min-w-0 max-w-[400px]">
            <POSOrderTabs
              orders={orders}
              currentOrderId={currentOrderId || "1"}
              onOrderSelect={onOrderSelect}
              onOrderClose={onOrderClose}
              onOrderAdd={onOrderAdd}
            />
          </div>
        </>
      )}

      {/* User Info - On the right */}
      <div className="hidden sm:flex items-center gap-2 bg-[#18345C] px-2 sm:px-3 py-1.5 ml-auto flex-shrink-0">
        <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
          <AvatarFallback className="bg-white text-[#18345C] text-xs">
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-white text-xs sm:text-sm font-medium leading-tight">
            {user.name}
          </span>
          <span className="text-white/70 text-[10px] sm:text-xs leading-tight">
            {user.role}
          </span>
        </div>
      </div>
    </header>
  );
};

export default POSHeader;
