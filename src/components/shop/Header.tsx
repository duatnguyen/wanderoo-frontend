import React from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "./SearchForm";
import shopLogo from "../../assets/icons/ShopLogo.png";

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center hover:opacity-80 transition-opacity"
      aria-label="Về trang chủ"
      type="button"
    >
      <img
        src={shopLogo}
        alt="Wanderoo Logo"
        className="h-auto w-auto max-h-[70px] object-contain"
      />
    </button>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" fill="none" className="text-white">
      <rect x="4" y="7" width="16" height="2" fill="currentColor" />
      <rect x="4" y="11" width="16" height="2" fill="currentColor" />
      <rect x="4" y="15" width="16" height="2" fill="currentColor" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="28"
      height="28"
      fill="none"
      className="text-white"
    >
      <rect
        x="8"
        y="12"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M20 16v0a4 4 0 1 1-8 0v0" stroke="#ffc107" strokeWidth="2" />
    </svg>
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

  return (
    <header className="h-[83px] w-full px-4 bg-[#18345c] flex items-center gap-5 relative z-40">
      <Logo onClick={() => navigate("/shop")} />
      <button
        className="ml-6 mr-1 flex items-center"
        aria-label="Mở menu danh mục"
        onClick={onMenuClick}
        type="button"
      >
        <MenuIcon />
      </button>
      <span className="text-white font-semibold text-[16px] mr-8 select-none">
        Danh mục
      </span>
      <div className="flex-1 max-w-[800px]">
        <SearchForm
          placeholder="Bạn muốn mua gì hôm nay?"
          variant="secondary"
        />
      </div>
      <div className="flex items-center gap-4 min-w-[150px] pl-5">
        <button
          onClick={() => navigate("/shop/cart")}
          className="relative flex items-center hover:opacity-80 transition-opacity"
          aria-label="Giỏ hàng"
          type="button"
        >
          <ShoppingBagIcon />
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
