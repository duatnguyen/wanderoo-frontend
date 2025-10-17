import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, User, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "../../mode-toggle";

interface SiteHeaderProps {
    className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
    return (
        <header className={`border-b backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60 header-wanderoo dark:border-gray-800 rounded-t-[10px] ${className || ''}`}>
            <div className="flex h-16 items-center gap-4 px-6">
                {/* Sidebar Trigger */}
                <SidebarTrigger className="-ml-1 text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/10" />
                <Separator orientation="vertical" className="h-6 dark:bg-gray-700" />

                {/* Page Title & Greeting */}
                <div className="flex flex-1 items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative ml-auto hidden max-w-sm flex-1 lg:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm..."
                            className="pl-9 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-accent/50 dark:hover:bg-gray-700/50 dark:text-gray-300 relative"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        <span className="sr-only">Thông báo</span>
                    </Button>
                    {/* Theme Toggle */}
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
