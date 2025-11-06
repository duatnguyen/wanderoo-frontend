import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Menu } from "lucide-react";
import { Input } from "antd";
import CategoryDropdown from "./CategoryDropdown";
import shopLogo from "../../assets/icons/ShopLogo.png";

const { Search: SearchInput } = Input;

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
        className="h-28 w-auto max-h-[112px] object-contain"
      />
    </button>
  );
}

function UserAvatar({ src }: { src?: string }) {
  return (
    <img
      src={src ?? "https://randomuser.me/api/portraits/men/32.jpg"}
      className="size-9 rounded-md object-cover border-2 border-white"
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
  userName = "Thanh",
  avatarUrl,
  cartCount = 0,
  onMenuClick,
}) => {
  const navigate = useNavigate();
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryButtonRef = useRef<HTMLDivElement>(null);

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

  const handleCategoryClick = (categoryId: string) => {
    console.log("Category clicked:", categoryId);
    // Navigate to category page or filter products
    // navigate(`/shop/category/${categoryId}`);
  };

  return (
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
        <span className="text-white text-[16px] font-semibold min-w-[60px] mx-2">
          {userName}
        </span>
        <button
          onClick={() => navigate("/user/profile/")}
          className="hover:opacity-80 transition-opacity"
          aria-label="Xem hồ sơ"
          type="button"
        >
          <UserAvatar src={avatarUrl} />
        </button>
      </div>
    </header>
  );
};

export default Header;
