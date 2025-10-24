import React from 'react';
import { Link } from 'react-router-dom';

type IconRenderer = (props: { className?: string }) => React.ReactNode;

export type AdminNavItem = {
    label: string;
    path?: string;
    icon: IconRenderer;
    activeMatch?: string;
    defaultActive?: boolean;
};

export type AdminNavSection = {
    title?: string;
    items: AdminNavItem[];
};

const icons: Record<string, IconRenderer> = {
    overview: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/b0dc912d-1514-4ebc-ba25-beefa90346f1" alt="Tổng quan" />
    ),
    orders: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/6c4c5b8b-a492-4e06-8d61-1c7b0fe33aba" alt="Đơn hàng" />
    ),
    shipping: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/08c5ecc9-58be-4904-9d4f-cbb661ef96d7" alt="Vận chuyển" />
    ),
    products: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/9b3a8092-6523-4bcb-b7eb-775cfd65d829" alt="Sản phẩm" />
    ),
    warehouse: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/f2f197b3-3b06-4473-9a56-11d3c9365ceb" alt="Quản lý kho" />
    ),
    customers: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/1cf953d5-3b39-4763-a817-97118208680b" alt="Khách hàng" />
    ),
    accounting: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/f040680c-6ab1-4ee2-9ac9-33281ec5da46" alt="Sổ quỹ" />
    ),
    staff: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/311de5e4-01bd-4063-b3bb-7129d822b2b6" alt="Nhân viên" />
    ),
    reports: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/ece67f6c-19af-41aa-97de-0d29b08eea14" alt="Báo cáo" />
    ),
    discounts: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/64c0a84c-5ab6-487e-925d-08f458630c60" alt="Mã giảm giá" />
    ),
    website: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/90cf9939-1116-4a88-9356-5f0c5168f924" alt="Website" />
    ),
    pos: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/55cd6b97-8723-48fd-b9d7-bd5915bd1e06" alt="POS" />
    ),
    settings: ({ className }) => (
        <img className={className} src="https://www.figma.com/api/mcp/asset/746404dd-f555-4d44-ba3e-eed5630c5442" alt="Cấu hình" />
    ),
};

export const adminNavSections: AdminNavSection[] = [
    {
        items: [
            {
                label: 'Tổng quan',
                path: '/admin/dashboard',
                icon: icons.overview,
                activeMatch: '/admin/dashboard',
            },
            {
                label: 'Đơn hàng',
                path: '/admin/orders',
                icon: icons.orders,
                activeMatch: '/admin/orders',
            },
            {
                label: 'Vận chuyển',
                path: '/admin/shipping',
                icon: icons.shipping,
                activeMatch: '/admin/shipping',
            },
            {
                label: 'Sản phẩm',
                path: '/admin/products',
                icon: icons.products,
                activeMatch: '/admin/products',
            },
            {
                label: 'Quản lý kho',
                path: '/admin/warehouse',
                icon: icons.warehouse,
                activeMatch: '/admin/warehouse',
            },
            {
                label: 'Khách hàng',
                path: '/admin/customers',
                icon: icons.customers,
                activeMatch: '/admin/customers',
            },
            {
                label: 'Sổ quỹ',
                path: '/admin/accounting',
                icon: icons.accounting,
                activeMatch: '/admin/accounting',
            },
            {
                label: 'Nhân viên',
                path: '/admin/staff',
                icon: icons.staff,
                activeMatch: '/admin/staff',
            },
            {
                label: 'Báo cáo',
                path: '/admin/reports',
                icon: icons.reports,
                activeMatch: '/admin/reports',
            },
            {
                label: 'Mã giảm giá',
                path: '/admin/discounts',
                activeMatch: '/admin/discounts',
                icon: icons.discounts,
            },
        ],
    },
    {
        title: 'Kênh bán hàng',
        items: [
            {
                label: 'Website',
                path: '/admin/channels/website',
                icon: icons.website,
                activeMatch: '/admin/channels/website',
            },
            {
                label: 'POS',
                path: '/admin/channels/pos',
                icon: icons.pos,
                activeMatch: '/admin/channels/pos',
            },
        ],
    },
];

export const adminFooterNav: AdminNavSection = {
    items: [
        {
            label: 'Cấu hình',
            path: '/admin/settings',
            icon: icons.settings,
            activeMatch: '/admin/settings',
        },
    ],
};

export const adminNavItems = adminNavSections.flatMap(section => section.items);

interface AdminSidebarProps {
    activePath: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePath }) => {
    const baseClasses =
        'flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium tracking-wide transition-all duration-200';
    const activeClasses = 'bg-[#FF6F3C] text-white shadow-[0_12px_28px_rgba(255,111,60,0.35)]';
    const inactiveClasses = 'text-white/70 hover:text-white hover:bg-white/10';

    const renderNavItem = (item: AdminNavItem, key: React.Key) => {
        const isActive = item.activeMatch ? activePath.startsWith(item.activeMatch) : Boolean(item.defaultActive);

        const content = (
            <>
                {item.icon({ className: 'h-5 w-5' })}
                <span>{item.label}</span>
            </>
        );

        if (item.path) {
            return (
                <Link key={key} to={item.path} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                    {content}
                </Link>
            );
        }

        return (
            <div key={key} className={`${baseClasses} ${inactiveClasses} cursor-default`}>
                {content}
            </div>
        );
    };

    return (
        <aside className="w-64 shrink-0 bg-[#0F2D52] text-white">
            <div className="flex h-full flex-col px-6 pb-8 pt-10">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="17.5" cy="6.5" r="2.5" fill="#FF6F3C" />
                            <path
                                d="M3 17l5.5-9 3.5 5 3-4.5L21 17"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-base font-semibold uppercase tracking-[0.4em]">WANDEROO</p>
                        <p className="mt-1 text-xs text-white/60">Thế giới đồ leo núi</p>
                    </div>
                </div>

                <nav className="mt-10 flex-1 overflow-y-auto">
                    {adminNavSections.map((section, index) => {
                        const hasTitle = Boolean(section.title);
                        const sectionKey = section.title ?? index;
                        const wrapperClasses = index === 0 ? '' : 'mt-8 border-t border-white/10 pt-6';
                        const listClasses = hasTitle ? 'mt-4 space-y-1.5' : 'space-y-1.5';

                        return (
                            <div key={sectionKey} className={wrapperClasses}>
                                {hasTitle ? (
                                    <p className="px-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                                        {section.title}
                                    </p>
                                ) : null}
                                <div className={listClasses}>
                                    {section.items.map((item, itemIndex) => renderNavItem(item, `${sectionKey}-${itemIndex}`))}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="mt-8 border-t border-white/10 pt-6">
                    <div className="space-y-1.5">
                        {adminFooterNav.items.map((item, index) => renderNavItem(item, `footer-${index}`))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
