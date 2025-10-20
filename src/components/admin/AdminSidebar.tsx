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
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 5.5a1.5 1.5 0 0 1 1.5-1.5H9a1.5 1.5 0 0 1 1.5 1.5V19a1 1 0 0 1-1 1H5.5A1.5 1.5 0 0 1 4 18.5Z" />
            <path d="M13.5 9A1.5 1.5 0 0 1 15 7.5h3.5A1.5 1.5 0 0 1 20 9v9.5a1.5 1.5 0 0 1-1.5 1.5H15a1 1 0 0 1-1-1Z" />
            <path d="M12 8.5v10" />
        </svg>
    ),
    orders: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4.75 6.75h14.5" />
            <path d="M4.75 10.75h9.5" />
            <path d="M4.75 14.75h14.5" />
            <path d="M4.75 18.75H12" />
        </svg>
    ),
    shipping: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3.5 6.5h11v9.25H3.5Z" />
            <path d="M14.5 9h3.91A1.6 1.6 0 0 1 19.91 9.9l1.34 3.35v2.5H14.5" />
            <circle cx="6.5" cy="17.5" r="1.75" />
            <circle cx="16.75" cy="17.5" r="1.75" />
        </svg>
    ),
    products: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="m3.5 7 8.5-4 8.5 4-8.5 4Z" />
            <path d="m3.5 7 8.5 4v9.5l-8.5-4Z" />
            <path d="m20.5 7-8.5 4v9.5l8.5-4Z" />
        </svg>
    ),
    warehouse: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4.5 20.5V6l7.5-3 7.5 3v14.5" />
            <path d="M9 20.5v-6.5h6V20.5" />
            <path d="M9 9.5h6" />
        </svg>
    ),
    customers: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="3" />
            <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
        </svg>
    ),
    accounting: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 4.5h12v15H6z" />
            <path d="M9.5 8.5h5" />
            <path d="M9.5 11.5h5" />
            <path d="M9.5 14.5h3" />
        </svg>
    ),
    staff: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="7.5" r="2.75" />
            <path d="M6.5 19.5c0-2.761 2.686-5 5.5-5s5.5 2.239 5.5 5" />
        </svg>
    ),
    reports: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4.5 6.5h15v13h-15z" />
            <path d="M8 13.5 10.5 16l5.5-5.5" />
        </svg>
    ),
    discounts: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 5.5h12L18.5 12 18 18.5H6L5.5 12Z" />
            <path d="M9 10.5h.01" />
            <path d="M15 13.5h.01" />
            <path d="M9 15.5l6-6" />
        </svg>
    ),
    website: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M3.5 12h17" />
            <path d="M12 3.5c2.35 2.31 3.75 5.47 3.75 8.5s-1.4 6.19-3.75 8.5c-2.35-2.31-3.75-5.47-3.75-8.5s1.4-6.19 3.75-8.5Z" />
        </svg>
    ),
    pos: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="7" width="16" height="11" rx="1.5" />
            <path d="M8 4h8" />
            <path d="M10.5 11.5h3" />
        </svg>
    ),
    settings: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="m4.75 12.5.5 2 1.75.75 1-.75" />
            <path d="m19.25 11.5-.5-2-1.75-.75-1 .75" />
            <path d="m8.5 5.75 2-.5 1.5-1.5 1.5 1.5 2 .5" />
            <path d="m15.5 18.25-2 .5-1.5 1.5-1.5-1.5-2-.5" />
        </svg>
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
        <aside className="w-64 shrink-0 bg-[#18345C] text-white">
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
