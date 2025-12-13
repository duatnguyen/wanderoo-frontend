import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, LogOut, User } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";
import shopLogo from "../../assets/icons/ShopLogo.png";
import { useAuth } from "../../context/AuthContext";
import {
  getPublicCategoryParents,
  getPublicCategoryChildren,
} from "../../api/endpoints/attributeApi";

// Helper function to get full image URL (same as order/components)
const getImageUrl = (imageUrl: string | null | undefined): string | undefined => {
  if (!imageUrl || imageUrl.trim() === '') return undefined;
  
  // Clean up the image URL
  const cleanUrl = imageUrl.trim();
  
  // If already a full URL (http/https), return as is
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  
  // Get base URL from environment or default to localhost
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  
  // If relative path starting with /, add base URL
  if (cleanUrl.startsWith('/')) {
    return `${baseUrl}${cleanUrl}`;
  }
  
  // Handle common image paths from backend
  if (cleanUrl.startsWith('uploads/') || cleanUrl.startsWith('static/')) {
    return `${baseUrl}/${cleanUrl}`;
  }
  
  // Default: assume it's from uploads directory
  return `${baseUrl}/uploads/${cleanUrl}`;
};

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center hover:opacity-80 transition-opacity  overflow-hidden cursor-pointer"
      aria-label="Về trang chủ"
      type="button"
    >
      <img
        src={shopLogo}
        alt="Wanderoo Logo"
        className="h-32 w-auto max-h-[140px] object-contain"
      />
    </button>
  );
}

function UserAvatar({ src }: { src?: string }) {
  const avatarUrl = src ? getImageUrl(src) : undefined;
  const fallbackAvatar = "https://randomuser.me/api/portraits/men/32.jpg";

  return (
    <img
      src={avatarUrl || fallbackAvatar}
      className="size-9 rounded-full object-cover border-2 border-white"
      alt="User Avatar"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (target.src !== fallbackAvatar) {
          target.src = fallbackAvatar;
        }
      }}
    />
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
  const categoryButtonRef = useRef<HTMLDivElement>(null);
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

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    console.log("Search:", searchValue);
    // navigate(`/shop/search?keyword=${encodeURIComponent(searchValue)}`);
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
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-1 px-4 py-1">
        <div className="flex flex-wrap items-center gap-3 md:flex-nowrap md:gap-4">
          <Logo onClick={() => navigate("/shop")} />
          <div
            ref={categoryButtonRef}
            className="relative flex h-[60px] flex-shrink-0 items-center gap-3 px-4 md:ml-6"
          >
            <button
              className="flex items-center gap-2 cursor-pointer"
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
            </button>
            <CategoryDropdown
              isOpen={isCategoryDropdownOpen}
              onClose={() => setIsCategoryDropdownOpen(false)}
              mainCategories={mainCategories}
              onCategoryClick={handleCategoryClick}
              onCategoryHover={handleCategoryHover}
            />
          </div>
          <div className="flex-1 max-w-[800px]">
            <div className="flex flex-1 items-center rounded-2xl bg-white/95 px-3 py-2 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Tìm kiếm lều, balo, phụ kiện..."
                className="flex-1 bg-transparent text-sm text-[#1f2937] placeholder:text-gray-400 focus:outline-none"
              />
              <div className="h-4 w-px bg-gray-200" />
              <button
                onClick={handleSearch}
                className="ml-3 rounded-xl bg-[#f97316] px-3 py-1 text-xs font-semibold text-white shadow-[0_8px_16px_rgba(249,115,22,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ea580c]"
                type="button"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 pl-5">
            {/* Cart Button */}
            <button
              onClick={() => navigate("/shop/cart")}
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Giỏ hàng"
              type="button"
            >
              <ShoppingBag className="w-6 h-6 text-white" />
              {cartCount !== undefined && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ffc107] text-[#18345c] rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#1c3b6c]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* User Actions */}
            {isAuthenticated ? (
              <>
                {/* Profile Avatar Button */}
                <button
                  onClick={() => navigate("/user/profile/")}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                  aria-label="Xem hồ sơ"
                  type="button"
                >
                  <UserAvatar src={displayAvatar} />
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
                </button>
                
                {/* Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
                  aria-label="Đăng xuất"
                  type="button"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              /* Login Icon Button */
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Đăng nhập"
                type="button"
                title="Đăng nhập"
              >
                <User className="w-6 h-6 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
