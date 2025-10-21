import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface SiteHeaderProps {
    className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
    return (
        <header className={`border-b border-gray-200 bg-white/80 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 header-wanderoo rounded-t-[10px] shadow-sm ${className || ''}`}>
            <div className="flex h-16 items-center gap-4 px-6">
                {/* Left spacer to align with design */}
                <div className="w-0" />
                <Separator orientation="vertical" className="h-6" />

                {/* Page Title & Greeting */}
                <div className="flex flex-1 items-center gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-500">Chào mừng trở lại!</p>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative ml-auto hidden max-w-sm flex-1 lg:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm..."
                            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-300"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-gray-100 relative text-gray-600 hover:text-gray-900"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        <span className="sr-only">Thông báo</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
