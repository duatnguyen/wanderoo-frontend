import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SiteHeaderProps {
  className?: string;
  onOpenSidebar?: () => void;
}

export function SiteHeader({ className, onOpenSidebar }: SiteHeaderProps) {
  return (
    <header
      className={`border-b border-gray-200 bg-white/80 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 header-wanderoo rounded-t-[10px] shadow-sm ${
        className || ""
      }`}
    >
      <div className="flex h-16 items-center gap-3 pl-2 pr-6 lg:pl-6 ">
        {/* Hamburger on small screens */}
        <button
          className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-400 hover:text-gray-800 hover:bg-gray-100"
          aria-label="Mở menu"
          onClick={onOpenSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
          </svg>
        </button>
        <div className="flex flex-1"></div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* User Avatar */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 hover:bg-gray-100 relative text-gray-600 hover:text-gray-900"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/api/placeholder/32/32" alt="User Avatar" />
              <AvatarFallback className="text-xs font-medium">
                AD
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Tài khoản người dùng</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
