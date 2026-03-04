import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, LogOut, User, Search, X } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";
import shopLogo from "../../assets/icons/ShopLogo.png";
import { useAuth } from "../../context/AuthContext";
import {
  getPublicCategoryParents,
  getPublicCategoryChildren,
} from "../../api/endpoints/attributeApi";
import { searchProducts } from "../../api/endpoints/productApi";
import { getCartItemCount } from "../../api/endpoints/cartApi";
import type { ProductSearchResponse } from "../../types";
import { getImageUrl } from "../../utils/imageUtils";

import { Button } from "@/components/ui/button";

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="flex items-center hover:opacity-80 transition-opacity  overflow-hidden cursor-pointer p-0 h-auto hover:bg-transparent"
      aria-label="Về trang chủ"
      type="button"
    >
      <img
        src={shopLogo}
        alt="Wanderoo Logo"
        className="h-20 w-auto max-h-[80px] object-contain"
      />
    </Button>
  );
}

function UserAvatar({ src, userName }: { src?: string; userName?: string }) {
  const avatarUrl = src ? getImageUrl(src) : undefined;
  const displayName = userName?.trim() || "";
  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="size-9 rounded-full border-2 border-white overflow-hidden bg-gradient-to-br from-[#18345C] to-[#1c3b6c] flex items-center justify-center">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          className="w-full h-full object-cover"
          alt="User Avatar"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              const fallback = parent.querySelector(".avatar-fallback") as HTMLElement;
              if (fallback) {
                fallback.style.display = "flex";
              }
            }
          }}
        />
      ) : null}
      <div
        className={`avatar-fallback w-full h-full flex items-center justify-center text-white text-xs font-semibold ${avatarUrl ? "hidden" : ""}`}
      >
        {initials}
      </div>
    </div>
  );
}

export type HeaderProps = {
  userName?: string;
  avatarUrl?: string;
  cartCount?: number;
  onMenuClick?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  userName,
  avatarUrl,
  cartCount = 0,
  onMenuClick,
}) => {
  const navigate = useNavigate();
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<ProductSearchResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const categoryButtonRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user: authUser, isAuthenticated, logout } = useAuth();

  const resolvedUsername = authUser?.username?.trim() || "";

  const displayName =
    userName?.trim() ||
    authUser?.name?.trim() ||
    resolvedUsername ||
    "Thanh";

  // Get avatar URL and process it with getImageUrl helper
  const rawAvatar = avatarUrl || authUser?.avatar;
  const displayAvatar = rawAvatar ? getImageUrl(rawAvatar) || rawAvatar : undefined;
  const usernameTag = resolvedUsername ? `@${resolvedUsername}` : "";

  type DropdownCategory = {
    id: string;
    label: string;
    subcategories: { id: string; label: string }[];
    rawId: number;
  };
  const [mainCategories, setMainCategories] = useState<DropdownCategory[]>([]);
  const [childLoadingState, setChildLoadingState] = useState<Record<string, boolean>>({});
  const [cartItemCount, setCartItemCount] = useState<number>(cartCount || 0);

  // Debounce search
  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchProducts(searchValue, 10);
        setSearchResults(results);
        setShowSearchResults(results.length > 0);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setShowSearchResults(false);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }

    if (showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showSearchResults]);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    
    // Nếu có kết quả tìm kiếm, chuyển đến sản phẩm đầu tiên
    if (searchResults.length > 0) {
      handleProductClick(searchResults[0].id);
    } else {
      // Nếu không có kết quả, có thể navigate đến trang search (nếu có)
      // Hoặc chỉ đóng dropdown
      setShowSearchResults(false);
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/shop/products/${productId}`);
    setSearchValue("");
    setShowSearchResults(false);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSearchResults([]);
    setShowSearchResults(false);
    searchInputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    }

    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isCategoryDropdownOpen]);

  useEffect(() => {
    // Fetch main categories
    getPublicCategoryParents()
      .then((response) => {
        const categories: DropdownCategory[] = response.map((attr: any) => ({
          id: attr.id.toString(),
          label: attr.name,
          subcategories: [], // Will be loaded on hover
          rawId: attr.id,
        }));
        setMainCategories(categories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Fetch cart count when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchCartCount = async () => {
        try {
          const count = await getCartItemCount();
          setCartItemCount(count);
        } catch (error) {
          console.error("Error fetching cart count:", error);
          // Keep current count or use prop value
          setCartItemCount(cartCount || 0);
        }
      };
      fetchCartCount();
    } else {
      // Reset to 0 if not authenticated
      setCartItemCount(0);
    }
  }, [isAuthenticated, cartCount]);

  // Update cart count when prop changes (for real-time updates from other pages)
  useEffect(() => {
    if (cartCount !== undefined) {
      setCartItemCount(cartCount);
    }
  }, [cartCount]);

  const handleCategoryHover = useCallback(
    async (categoryId: string) => {
      const currentCategory = mainCategories.find((cat) => cat.id === categoryId);
      if (
        !currentCategory ||
        currentCategory.subcategories.length > 0 ||
        childLoadingState[categoryId]
      ) {
        return;
      }

      setChildLoadingState((prev) => ({ ...prev, [categoryId]: true }));
      try {
        const children = await getPublicCategoryChildren(currentCategory.rawId);
        setMainCategories((prev) =>
            prev.map((cat) =>
              cat.id === categoryId
                ? {
                    ...cat,
                    subcategories: children.map((child) => ({
                      id: child.id.toString(),
                      label: child.name,
                    })),
                  }
                : cat
            )
          );
      } catch (error) {
        console.error("Không thể tải danh mục con", error);
      } finally {
        setChildLoadingState((prev) => ({ ...prev, [categoryId]: false }));
      }
    },
    [mainCategories, childLoadingState]
  );

  const handleCategoryClick = (categoryId: string, mainCategoryId?: string) => {
    if (mainCategoryId) {
      navigate(`/shop/category/${mainCategoryId}/${categoryId}`);
    } else {
      const parent = mainCategories.find((cat) => cat.id === categoryId);
      const firstChild = parent?.subcategories?.[0];
      if (firstChild) {
        navigate(`/shop/category/${categoryId}/${firstChild.id}`);
      } else {
        navigate(`/shop/category/${categoryId}`);
      }
    }
    setIsCategoryDropdownOpen(false);
  };

  return (
    <header className="w-full bg-gradient-to-r from-[#132543] via-[#1c3b6c] to-[#132543] shadow-[0_4px_20px_rgba(9,22,45,0.25)] relative z-40 text-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-1 px-4 py-0.5">
        <div className="flex flex-wrap items-center gap-3 md:flex-nowrap md:gap-4">
          <Logo onClick={() => navigate("/shop")} />
          <div
            ref={categoryButtonRef}
            className="relative flex h-[48px] flex-shrink-0 items-center gap-3 px-4 md:ml-6"
          >
            <Button
              variant="ghost"
              className="flex items-center gap-2 cursor-pointer p-0 h-auto text-white hover:text-white/80 hover:bg-transparent"
              aria-label="Mở menu danh mục"
              onClick={() => {
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                onMenuClick?.();
              }}
              type="button"
            >
              <Menu className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-[16px] select-none">
                Danh mục
              </span>
            </Button>
            <CategoryDropdown
              isOpen={isCategoryDropdownOpen}
              onClose={() => setIsCategoryDropdownOpen(false)}
              mainCategories={mainCategories}
              onCategoryClick={handleCategoryClick}
              onCategoryHover={handleCategoryHover}
            />
          </div>
          <div className="flex-1 max-w-[800px] relative" ref={searchRef}>
            <div className="flex flex-1 items-center rounded-2xl bg-white/95 px-3 py-2 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
              <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
              <input
                ref={searchInputRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  } else if (e.key === "Escape") {
                    setShowSearchResults(false);
                  }
                }}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowSearchResults(true);
                  }
                }}
                placeholder="Tìm kiếm lều, balo, phụ kiện..."
                className="flex-1 bg-transparent text-sm text-[#1f2937] placeholder:text-gray-400 focus:outline-none"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="mr-2 p-1 hover:bg-gray-100 rounded-full transition-colors h-auto w-auto"
                  type="button"
                  aria-label="Xóa tìm kiếm"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </Button>
              )}
              <div className="h-4 w-px bg-gray-200" />
              <Button
                onClick={handleSearch}
                className="ml-3 rounded-xl bg-[#f97316] px-3 py-1 text-xs font-semibold text-white shadow-[0_8px_16px_rgba(249,115,22,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ea580c] h-auto"
                type="button"
              >
                Tìm kiếm
              </Button>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Đang tìm kiếm...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((product) => {
                      const imageUrl = getImageUrl(product.imageUrl);
                      
                      return (
                        <Button
                          key={product.id}
                          variant="ghost"
                          onClick={() => handleProductClick(product.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0 h-auto rounded-none font-normal"
                          type="button"
                        >
                          <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "";
                                  target.style.display = "none";
                                }}
                              />
                            ) : (
                              <Search className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                ) : searchValue.trim() ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Không tìm thấy sản phẩm nào
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 pl-5">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/shop/cart")}
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Giỏ hàng"
              type="button"
            >
              <ShoppingBag className="w-6 h-6 text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ffc107] text-[#18345c] rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#1c3b6c]">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Button>

            {/* User Actions */}
            {isAuthenticated ? (
              <>
                {/* Profile Avatar Button */}
                <Button
                  variant="ghost"
                  onClick={() => navigate("/user/profile/")}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity group h-auto p-0 hover:bg-transparent"
                  aria-label="Xem hồ sơ"
                  type="button"
                >
                  <UserAvatar src={displayAvatar} userName={displayName} />
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-semibold text-white group-hover:underline">
                      {displayName}
                    </span>
                    {usernameTag && (
                      <span className="text-[10px] text-white/70">
                        {usernameTag}
                      </span>
                    )}
                  </div>
                </Button>
                
                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
                  aria-label="Đăng xuất"
                  type="button"
                >
                  <LogOut size={18} />
                </Button>
              </>
            ) : (
              /* Login Icon Button */
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/login")}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Đăng nhập"
                type="button"
                title="Đăng nhập"
              >
                <User className="w-6 h-6 text-white" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
