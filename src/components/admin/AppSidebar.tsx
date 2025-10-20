import { useLocation, useNavigate } from 'react-router-dom';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    LogOut,
    Settings,
    User,
    Bell,
    MoreHorizontal,
} from "lucide-react";
import { useAuthCtx } from '../../app/providers/AuthProvider';
import { adminNavSections } from './AdminSidebar';

export function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { state, logout } = useAuthCtx();
    const { user } = state;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name?: string | null) => {
        if (!name) return 'AD';
        const letters = name
            .split(' ')
            .map(part => part.trim()[0])
            .filter(Boolean)
            .slice(0, 2)
            .join('')
            .toUpperCase();
        return letters || 'AD';
    };

    // Transform admin nav data to match NavMain structure
    const mainNavItems = adminNavSections[0]?.items.map(item => ({
        title: item.label,
        url: item.path || '#',
        icon: (props: { className?: string }) => item.icon(props),
        isActive: item.activeMatch
            ? location.pathname.startsWith(item.activeMatch)
            : item.defaultActive
    })) || [];

    const channelNavItems = adminNavSections[1]?.items.map(item => ({
        title: item.label,
        url: item.path || '#',
        icon: (props: { className?: string }) => item.icon(props),
        isActive: item.activeMatch
            ? location.pathname.startsWith(item.activeMatch)
            : item.defaultActive
    })) || [];

    const userData = {
        name: user?.name || 'Admin',
        email: user?.email || 'admin@wanderoo.com',
        avatar: user?.avatar || '/placeholder.svg'
    };

    return (
        <Sidebar variant="inset" className="bg-sidebar sidebar-wanderoo">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <svg
                                    className="size-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="17.5" cy="6.5" r="2.5" fill="currentColor" />
                                    <path
                                        d="M3 17l5.5-9 3.5 5 3-4.5L21 17"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Wanderoo</span>
                                <span className="truncate text-xs">Admin Panel</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel>Quản lý chung</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={item.isActive}
                                        onClick={() => navigate(item.url)}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                    {item.title === 'Đơn hàng' && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <SidebarMenuAction showOnHover>
                                                    <MoreHorizontal />
                                                    <span className="sr-only">Thêm</span>
                                                </SidebarMenuAction>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                className="w-48 rounded-lg"
                                                side="right"
                                                align="start"
                                            >
                                                <DropdownMenuItem>
                                                    <span>Tạo đơn hàng mới</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <span>Import đơn hàng</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Channel Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel>Kênh bán hàng</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {channelNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={item.isActive}
                                        onClick={() => navigate(item.url)}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={userData.avatar} alt={userData.name} />
                                        <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                                            {getInitials(userData.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{userData.name}</span>
                                        <span className="truncate text-xs">{userData.email}</span>
                                    </div>
                                    <Settings className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="right"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                                    <User />
                                    Hồ sơ cá nhân
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                                    <Settings />
                                    Cài đặt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/admin/notifications')}>
                                    <Bell />
                                    Thông báo
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <LogOut />
                                    Đăng xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}