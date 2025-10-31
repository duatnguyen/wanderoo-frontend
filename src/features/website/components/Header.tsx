import React from "react";
import SearchForm from "./SearchForm";

// Minimal logo/svg placeholder; replace with your image asset or imported SVG component.
function Logo() {
  return (
    <div className="flex flex-col items-center">
      <svg width="45" height="27" viewBox="0 0 45 27" fill="none"><circle cx="10" cy="15" r="8" fill="#EA4630" /><path d="M17 21L22.5 12L32.5 25L39.5 8L45 27H0L4.5 20L10 21L17 21Z" fill="#fff" /></svg>
      <span className="text-xs text-white font-bold leading-tight mt-[-2px]">WANDEROO</span>
    </div>
  );
}

function MenuIcon() {
  return (<svg width="24" height="24" fill="none" className="text-white"><rect x="4" y="7" width="16" height="2" fill="currentColor"/><rect x="4" y="11" width="16" height="2" fill="currentColor"/><rect x="4" y="15" width="16" height="2" fill="currentColor"/></svg>);
}

function ShoppingBagIcon() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" fill="none" className="text-white"><rect x="8" y="12" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M20 16v0a4 4 0 1 1-8 0v0" stroke="#ffc107" strokeWidth="2"/></svg>
  );
}

function UserAvatar({ src }: { src?: string }) {
  return <img src={src ?? "https://randomuser.me/api/portraits/men/32.jpg"} className="size-9 rounded-md object-cover border-2 border-white" alt="avatar" />;
}

export type HeaderProps = {
  userName?: string;
  avatarUrl?: string;
  cartCount?: number;
  onMenuClick?: () => void;
};

const Header: React.FC<HeaderProps> = ({ userName = "Thanh", avatarUrl, cartCount = 0, onMenuClick }) => (
  <header className="h-[83px] w-full px-4 bg-[#18345c] flex items-center gap-5 relative z-40">
    <Logo />
    <button
      className="ml-6 mr-1 flex items-center"
      aria-label="Mở menu danh mục"
      onClick={onMenuClick}
      type="button"
    >
      <MenuIcon />
    </button>
    <span className="text-white font-semibold text-[16px] mr-8 select-none">Danh mục</span>
    <div className="flex-1 max-w-[800px]">
      <SearchForm
        placeholder="Bạn muốn mua gì hôm nay?"
        variant="secondary"
      />
    </div>
    <div className="flex items-center gap-4 min-w-[150px] pl-5">
      <div className="relative flex items-center">
        <ShoppingBagIcon />
        {cartCount !== undefined && (
          <span className="absolute top-[-7px] right-[-7px] w-5 h-5 bg-[#ffc107] text-[#18345c] rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">{cartCount}</span>
        )}
      </div>
      <span className="text-white text-[16px] font-semibold min-w-[60px] mx-2">{userName}</span>
      <UserAvatar src={avatarUrl} />
    </div>
  </header>
);

export default Header;
