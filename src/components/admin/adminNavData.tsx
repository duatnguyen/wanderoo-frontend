import React from "react";

type IconRenderer = (props: { className?: string }) => React.ReactNode;

export type AdminNavItem = {
  label: string;
  path?: string;
  icon: IconRenderer;
  activeMatch?: string;
  defaultActive?: boolean;
  submenu?: AdminNavItem[];
};

export type AdminNavSection = {
  title?: string;
  items: AdminNavItem[];
};

const icons: Record<string, IconRenderer> = {
  overview: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 5.5a1.5 1.5 0 0 1 1.5-1.5H9a1.5 1.5 0 0 1 1.5 1.5V19a1 1 0 0 1-1 1H5.5A1.5 1.5 0 0 1 4 18.5Z" />
      <path d="M13.5 9A1.5 1.5 0 0 1 15 7.5h3.5A1.5 1.5 0 0 1 20 9v9.5a1.5 1.5 0 0 1-1.5 1.5H15a1 1 0 0 1-1-1Z" />
      <path d="M12 8.5v10" />
    </svg>
  ),
  orders: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4.75 6.75h14.5" />
      <path d="M4.75 10.75h9.5" />
      <path d="M4.75 14.75h14.5" />
      <path d="M4.75 18.75H12" />
    </svg>
  ),
  shipping: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3.5 6.5h11v9.25H3.5Z" />
      <path d="M14.5 9h3.91A1.6 1.6 0 0 1 19.91 9.9l1.34 3.35v2.5H14.5" />
      <circle cx="6.5" cy="17.5" r="1.75" />
      <circle cx="16.75" cy="17.5" r="1.75" />
    </svg>
  ),
  products: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="m3.5 7 8.5-4 8.5 4-8.5 4Z" />
      <path d="m3.5 7 8.5 4v9.5l-8.5-4Z" />
      <path d="m20.5 7-8.5 4v9.5l8.5-4Z" />
    </svg>
  ),
  warehouse: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4.5 20.5V6l7.5-3 7.5 3v14.5" />
      <path d="M9 20.5v-6.5h6V20.5" />
      <path d="M9 9.5h6" />
    </svg>
  ),
  customers: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="8" r="3" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </svg>
  ),
  accounting: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 4.5h12v15H6z" />
      <path d="M9.5 8.5h5" />
      <path d="M9.5 11.5h5" />
      <path d="M9.5 14.5h3" />
    </svg>
  ),
  staff: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="7.5" r="2.75" />
      <path d="M6.5 19.5c0-2.761 2.686-5 5.5-5s5.5 2.239 5.5 5" />
    </svg>
  ),
  reports: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4.5 6.5h15v13h-15z" />
      <path d="M8 13.5 10.5 16l5.5-5.5" />
    </svg>
  ),
  discounts: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 5.5h12L18.5 12 18 18.5H6L5.5 12Z" />
      <path d="M9 10.5h.01" />
      <path d="M15 13.5h.01" />
      <path d="M9 15.5l6-6" />
    </svg>
  ),
  website: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.35 2.31 3.75 5.47 3.75 8.5s-1.4 6.19-3.75 8.5c-2.35-2.31-3.75-5.47-3.75-8.5s1.4-6.19 3.75-8.5Z" />
    </svg>
  ),
  pos: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="4" y="7" width="16" height="11" rx="1.5" />
      <path d="M8 4h8" />
      <path d="M10.5 11.5h3" />
    </svg>
  ),
  settings: ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
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
        label: "Tổng quan",
        path: "/admin/dashboard",
        icon: icons.overview,
        activeMatch: "/admin/dashboard",
      },
      {
        label: "Đơn hàng",
        icon: icons.orders,
        activeMatch: "/admin/orders/all",
        submenu: [
          {
            label: "Tất cả đơn hàng",
            path: "/admin/orders/all",
            icon: icons.orders,
            activeMatch: "/admin/orders/all",
          },
          {
            label: "Trả hàng/Hoàn tiền/Hủy",
            path: "/admin/orders/otherstatus",
            icon: icons.orders,
            activeMatch: "/admin/orders/otherstatus",
          },
        ],
      },
      {
        label: "Vận chuyển",
        path: "/admin/shipping",
        icon: icons.shipping,
        activeMatch: "/admin/shipping",
      },
      {
        label: "Sản phẩm",
        icon: icons.products,
        activeMatch: "/admin/products/all",
        submenu: [
          {
            label: "Danh sách sản phẩm",
            path: "/admin/products/all",
            icon: icons.products,
            activeMatch: "/admin/products/all",
          },
          {
            label: "Thêm sản phẩm",
            path: "/admin/products/new",
            icon: icons.products,
            activeMatch: "/admin/products/new",
          },
          {
            label: "Danh mục sản phẩm",
            path: "/admin/products/categories",
            icon: icons.products,
            activeMatch: "/admin/products/categories",
          },
        ],
      },
      {
        label: "Quản lý kho",
        icon: icons.warehouse,
        activeMatch: "/admin/warehouse/imports",
        submenu: [
          {
            label: "Nhập hàng",
            path: "/admin/warehouse/imports",
            icon: icons.warehouse,
            activeMatch: "/admin/warehouse/imports",
          },
          {
            label: "Trả hàng nhập",
            path: "/admin/warehouse/returnsimport",
            icon: icons.warehouse,
            activeMatch: "/admin/warehouse/returnsimport",
          },
          {
            label: "Nhà cung cấp",
            path: "/admin/warehouse/supplier",
            icon: icons.warehouse,
            activeMatch: "/admin/warehouse/supplier",
          },
        ],
      },
      {
        label: "Khách hàng",
        icon: icons.customers,
        activeMatch: "/admin/customers/allcustomers",
        submenu: [
          {
            label: "Danh sách khách hàng",
            path: "/admin/customers/allcustomers",
            icon: icons.customers,
            activeMatch: "/admin/customers/allcustomers",
          },
          {
            label: "Đánh giá",
            path: "/admin/customers/reviews",
            icon: icons.customers,
            activeMatch: "/admin/customers/reviews",
          },
        ],
      },
      {
        label: "Sổ quỹ",
        path: "/admin/accounting",
        icon: icons.accounting,
        activeMatch: "/admin/accounting",
      },
      {
        label: "Nhân viên",
        path: "/admin/staff",
        icon: icons.staff,
        activeMatch: "/admin/staff",
      },
      {
        label: "Báo cáo",
        path: "/admin/reports",
        icon: icons.reports,
        activeMatch: "/admin/reports",
      },
      {
        label: "Mã giảm giá",
        path: "/admin/discounts",
        activeMatch: "/admin/discounts",
        icon: icons.discounts,
      },
    ],
  },
  {
    title: "Kênh bán hàng",
    items: [
      {
        label: "Website",
        path: "/admin/channels/website",
        icon: icons.website,
        activeMatch: "/admin/channels/website",
      },
      {
        label: "POS",
        path: "/admin/channels/pos",
        icon: icons.pos,
        activeMatch: "/admin/channels/pos",
      },
    ],
  },
];

export const adminFooterNav: AdminNavSection = {
  items: [
    {
      label: "Cấu hình",
      path: "/admin/settings",
      icon: icons.settings,
      activeMatch: "/admin/settings",
    },
  ],
};

export const adminNavItems = adminNavSections.flatMap(
  (section) => section.items,
);
