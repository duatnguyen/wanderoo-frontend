import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, LogOut, LogIn } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";
import shopLogo from "../../assets/icons/ShopLogo.png";
<<<<<<< HEAD
import { useAuth } from "../../context/AuthContext";
=======
import {
  getPublicCategoryParents,
  getPublicCategoryChildren,
} from "../../api/endpoints/attributeApi";

const { Search: SearchInput } = Input;
>>>>>>> a9f5ca7641fcbea590212719f28c9f3a4f15ff7a

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
        className="h-20 w-auto max-h-[80px] object-contain"
      />
    </button>
  );
}

function UserAvatar({ src }: { src?: string }) {
  return (
    <img
      src={src ?? "https://randomuser.me/api/portraits/men/32.jpg"}
      className="size-9 rounded-full object-cover border-2 border-white"
      alt="avatar"
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
<<<<<<< HEAD
  const { user: authUser, isAuthenticated, logout } = useAuth();

  const resolvedUsername = authUser?.username?.trim() || "";

  const displayName =
    userName?.trim() ||
    authUser?.name?.trim() ||
    resolvedUsername ||
    "Thanh";

  const displayAvatar = (avatarUrl || authUser?.avatar) ?? undefined;
  const usernameTag = resolvedUsername ? `@${resolvedUsername}` : "";

  // Category data - matching the image description
  const mainCategories = [
    {
      id: "camping",
      label: "Cắm trại",
      subcategories: [
        { id: "backpack", label: "Balo & Túi" },
        { id: "mountain-clothing", label: "Trang phục đi núi" },
        { id: "shoes-sticks", label: "Giày & Gậy hỗ trợ" },
        { id: "eating-utensils", label: "Dụng cụ ăn uống" },
        { id: "lights", label: "Đèn" },
        { id: "survival-accessories", label: "Phụ kiện sinh tồn" },
        { id: "flashlights", label: "Đèn pin" },
        { id: "hats", label: "Mũ" },
        { id: "tents", label: "Lều" },
        { id: "sleeping-bags", label: "Túi ngủ" },
        { id: "air-mattresses", label: "Đệm hơi" },
        { id: "camping-tables", label: "Bàn cắm trại" },
        { id: "cooking-utensils", label: "Dụng cụ nấu ăn" },
      ],
    },
    {
      id: "outdoor-sports",
      label: "Thể thao ngoài trời",
      subcategories: [
        { id: "hiking-gear", label: "Đồ leo núi" },
        { id: "water-sports", label: "Đồ dùng dưới nước" },
        { id: "cycling", label: "Xe đạp" },
        { id: "running", label: "Chạy bộ" },
      ],
    },
    {
      id: "accessories",
      label: "Phụ kiện",
      subcategories: [
        { id: "backpacks", label: "Ba lô" },
        { id: "tools", label: "Dụng cụ" },
        { id: "electronics", label: "Thiết bị điện tử" },
        { id: "clothing", label: "Quần áo" },
      ],
    },
  ];
=======
  type DropdownCategory = {
    id: string;
    label: string;
    subcategories: { id: string; label: string }[];
    rawId: number;
  };
  const [mainCategories, setMainCategories] = useState<DropdownCategory[]>([]);
  const [childLoadingState, setChildLoadingState] = useState<Record<string, boolean>>({});
>>>>>>> a9f5ca7641fcbea590212719f28c9f3a4f15ff7a

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
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const parents = await getPublicCategoryParents();
        if (!isMounted) return;
        setMainCategories(
          parents.map((parent) => ({
            id: parent.id.toString(),
            rawId: parent.id,
            label: parent.name,
            subcategories: [],
          }))
        );
      } catch (error) {
        if (isMounted) {
          console.error("Không thể tải danh mục", error);
        }
      } finally {
        // No-op
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
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

  const handleCategoryClick = (categoryId: string) => {
    console.log("Category clicked:", categoryId);
    // Navigate to category page or filter products
    // navigate(`/shop/category/${categoryId}`);
  };

  return (
<<<<<<< HEAD
    <header className="w-full bg-gradient-to-r from-[#132543] via-[#1c3b6c] to-[#132543] shadow-[0_4px_20px_rgba(9,22,45,0.25)] relative z-40 text-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3 md:flex-nowrap md:gap-4">
          <Logo onClick={() => navigate("/shop")} />
          <div
            ref={categoryButtonRef}
            className="relative flex h-[60px] flex-shrink-0 items-center gap-3 px-4 md:ml-6"
=======
    <header className="h-[83px] w-full px-4 bg-[#18345c] flex items-center gap-5 relative z-40">
      <Logo onClick={() => navigate("/shop")} />
      <div ref={categoryButtonRef} className="relative ml-6 mr-8">
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
        <SearchInput
          placeholder="Bạn muốn mua gì hôm nay?"
          className="w-full"
          styles={{
            input: {
              backgroundColor: "#f6f6f6",
              borderColor: "#454545",
            },
          }}
          onSearch={(value) => {
            // Handle search logic here
            console.log("Search:", value);
          }}
        />
      </div>
      <div className="flex items-center gap-4 min-w-[150px] pl-5">
        <button
          onClick={() => navigate("/shop/cart")}
          className="relative flex items-center hover:opacity-80 transition-opacity"
          aria-label="Giỏ hàng"
          type="button"
        >
          <ShoppingBag className="w-7 h-7 text-white cursor-pointer" />
          {cartCount !== undefined && (
            <span className="absolute top-[-7px] right-[-7px] w-5 h-5 bg-[#ffc107] text-[#18345c] rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3 ml-[43px]">
          <button
            onClick={() => navigate("/user/profile/")}
            className="hover:opacity-80 transition-opacity"
            aria-label="Xem hồ sơ"
            type="button"
>>>>>>> a9f5ca7641fcbea590212719f28c9f3a4f15ff7a
          >
            <button
              className="flex items-center gap-3 cursor-pointer"
              aria-label="Mở menu danh mục"
              onClick={() => {
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                onMenuClick?.();
              }}
              type="button"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#f9c74f]/15 text-[#f9c74f] shadow-inner shadow-[#f9c74f]/20">
                <Menu className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-white font-semibold text-[15px] leading-tight">
                  Danh mục
                </span>
              </div>
            </button>
            <CategoryDropdown
              isOpen={isCategoryDropdownOpen}
              onClose={() => setIsCategoryDropdownOpen(false)}
              mainCategories={mainCategories}
              onCategoryClick={handleCategoryClick}
            />
          </div>
          <div className="flex flex-1 items-center rounded-2xl bg-white/95 px-3 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.08)]">
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Tìm kiếm lều, balo, phụ kiện..."
              className="flex-1 bg-transparent text-sm text-[#1f2937] placeholder:text-gray-400 focus:outline-none"
            />
            <div className="h-5 w-px bg-gray-200" />
            <button
              onClick={handleSearch}
              className="ml-3 rounded-xl bg-[#f97316] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_8px_16px_rgba(249,115,22,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ea580c]"
              type="button"
            >
              Tìm kiếm
            </button>
          </div>
          <div className="flex items-center gap-4 min-w-[150px] pl-0 md:pl-2">
            <button
              onClick={() => navigate("/shop/cart")}
              className="relative flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Giỏ hàng"
              type="button"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount !== undefined && (
                <span className="absolute top-[-4px] right-[-4px] min-w-5 rounded-full bg-[#f9c74f] px-1 text-center text-[11px] font-semibold text-[#14284b]">
                  {cartCount}
                </span>
              )}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2">
                <button
                  onClick={() => navigate("/user/profile/")}
                  className="hover:opacity-80 transition-opacity"
                  aria-label="Xem hồ sơ"
                  type="button"
                >
                  <UserAvatar src={displayAvatar} />
                </button>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">
                    {displayName}
                  </span>
                  {usernameTag && (
                    <span className="text-[11px] text-white/70">
                      {usernameTag}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="ml-2 rounded-full border border-white/20 p-2 text-white hover:bg-white/20 transition"
                  aria-label="Đăng xuất"
                  type="button"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 rounded-2xl border border-white px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-white hover:text-[#1c3b6c]"
                type="button"
              >
                <LogIn size={16} />
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
