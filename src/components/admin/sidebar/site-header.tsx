import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={`border-b border-gray-200 bg-white/80 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 header-wanderoo rounded-t-[10px] shadow-sm ${
        className || ""
      }`}
    >
      <div className="flex h-16 items-center gap-4 px-6 ">
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
