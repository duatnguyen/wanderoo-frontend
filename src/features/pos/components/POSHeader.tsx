import React from "react";
import { cn } from "@/lib/utils";
import ShopLogo from "@/assets/icons/ShopLogo.svg";
import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { POSOrderTabs, type OrderTab } from "./POSOrderTabs";

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
  pageTitle,
  pageSubtitle,
  user = { name: "Admin", role: "Admin" },
  className,
}) => {
  const isSalesPage = !pageTitle && searchValue !== undefined;

  return (
    <header
      className={cn(
        "bg-[#18345C] flex items-center gap-3 sm:gap-4 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 h-14 sm:h-16",
        className
      )}
    >
      {isSalesPage ? (
        <>
          {/* Logo */}
          <div className="flex items-center min-w-[120px] sm:min-w-[140px] max-w-[200px] flex-shrink-0">
            <img
              src={ShopLogo}
              alt="Wanderoo Logo"
              className="h-10 sm:h-12 w-auto object-contain max-h-full"
            />
          </div>

          {/* Search Bar - Next to Logo */}
          <div className="flex items-center min-w-0 flex-shrink-0">
            <div className="w-[300px] sm:w-[400px] lg:w-[500px] relative">
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
              />
            </div>
          </div>

          {/* Order Tabs - Next to Search Bar */}
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
      ) : (
        <>
          {/* Page Title and Logo */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mt-1">
                <img
                  src={ShopLogo}
                  alt="Wanderoo Logo"
                  className="h-6 w-auto object-contain"
                />
                {pageSubtitle && (
                  <span className="text-white text-sm">{pageSubtitle}</span>
                )}
              </div>
            </div>
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
