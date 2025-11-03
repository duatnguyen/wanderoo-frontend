import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  adminNavSections,
  adminFooterNav,
  type AdminNavItem,
  type AdminNavSection,
} from "./adminNavData.tsx";
import ShopLogo from "@/assets/icons/ShopLogo.svg";
import {
  ProfileIcon,
  AddressIcon,
  KeyIcon,
  ShopIcon,
} from "./SettingsIcons.tsx";

interface AdminSidebarProps {
  activePath: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePath }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Check if we're in settings mode based on the path
  const isSettingsMode = activePath.startsWith("/admin/settings");

  // Auto-expand dropdowns when the current path matches any submenu item
  useEffect(() => {
    const newExpandedItems = new Set<string>();

    const checkAndExpand = (sections: AdminNavSection[]) => {
      sections.forEach((section, sectionIndex) => {
        section.items.forEach((item, itemIndex) => {
          const itemKey = `item-${section.title ?? sectionIndex}-${itemIndex}`;
          if (item.submenu && item.submenu.length > 0) {
            const hasActiveSubmenu = item.submenu.some((subItem) =>
              subItem.activeMatch
                ? activePath.startsWith(subItem.activeMatch)
                : false
            );
            if (hasActiveSubmenu) {
              newExpandedItems.add(itemKey);
            }
          }
        });
      });
    };

    checkAndExpand(adminNavSections);
    checkAndExpand([adminFooterNav]);

    setExpandedItems(newExpandedItems);
  }, [activePath]);

  const baseClasses =
    "flex items-center gap-3 rounded-xl px-4 h-8 py-0 text-sm font-medium tracking-wide transition-colors duration-200";
  const activeClasses = "bg-[#E04D30] text-white";
  const inactiveClasses = "text-white hover:text-white hover:bg-[#172b46]";
  const submenuClasses = "ml-[35px] pl-4";
  const submenuActiveClasses = "text-white underline";
  const submenuInactiveClasses = "text-white/70";

  // Settings button (footer) specific classes
  const footerBaseClasses =
    "flex items-center gap-3 rounded-xl px-4 h-8 py-0 text-sm font-medium tracking-wide transition-colors duration-200";
  const footerActiveClasses = "bg-[#E04D30] text-white";
  const footerInactiveClasses =
    "text-white hover:text-white hover:bg-[#172b46]";

  const handleMenuClick = (itemKey: string, item: AdminNavItem) => {
    // If item has submenu, navigate to first submenu item and expand
    if (item.submenu && item.submenu.length > 0) {
      const firstSubmenuItem = item.submenu[0];
      if (firstSubmenuItem.path) {
        navigate(firstSubmenuItem.path);
      }
      // Expand the submenu
      setExpandedItems((prev) => {
        const newSet = new Set(prev);
        newSet.add(itemKey);
        return newSet;
      });
    }
  };

  const renderNavItem = (
    item: AdminNavItem,
    key: React.Key,
    isSubmenu: boolean = false,
    isFooter: boolean = false
  ) => {
    const itemKey = `item-${key}`;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedItems.has(itemKey);

    // For main menu items with submenus, check if any submenu item is active
    let isActive = false;
    if (hasSubmenu) {
      isActive = item.submenu!.some((subItem) =>
        subItem.activeMatch ? activePath.startsWith(subItem.activeMatch) : false
      );
    } else {
      isActive = item.activeMatch
        ? activePath.startsWith(item.activeMatch)
        : Boolean(item.defaultActive);
    }

    const content = (
      <>
        {!isSubmenu && item.icon({ className: "h-5 w-5" })}
        <span>{item.label}</span>
      </>
    );

    let itemClasses;
    if (isSubmenu) {
      itemClasses = `${baseClasses} ${submenuClasses} ${
        isActive ? submenuActiveClasses : submenuInactiveClasses
      }`;
    } else if (isFooter) {
      // Use footer-specific classes for the Settings button
      itemClasses = `${footerBaseClasses} ${
        isActive ? `${footerActiveClasses} h-8 py-0` : footerInactiveClasses
      }`;
    } else {
      itemClasses = `${baseClasses} ${
        isActive ? `${activeClasses} h-8 py-0` : inactiveClasses
      } ${hasSubmenu ? "cursor-pointer" : ""}`;
    }

    if (hasSubmenu) {
      return (
        <div key={key} className="relative">
          <div
            className={`${itemClasses}`}
            onClick={() => handleMenuClick(itemKey, item)}
          >
            {content}
          </div>

          {/* Inline submenu */}
          {isExpanded && (
            <div className="mt-1.5 space-y-1.5">
              {item.submenu!.map((subItem, subIndex) =>
                renderNavItem(
                  subItem,
                  `${itemKey}-sub-${subIndex}`,
                  true,
                  false
                )
              )}
            </div>
          )}
        </div>
      );
    }

    if (item.path) {
      return (
        <Link key={key} to={item.path} className={itemClasses}>
          {content}
        </Link>
      );
    }

    return (
      <div key={key} className={`${itemClasses} cursor-default`}>
        {content}
      </div>
    );
  };

  // Settings sidebar navigation items
  const settingsNavItems: AdminNavItem[] = [
    {
      label: "Hồ sơ",
      path: "/admin/settings/profile",
      icon: ({ className }) => <ProfileIcon className={className} />,
      activeMatch: "/admin/settings/profile",
      defaultActive: true,
    },
    {
      label: "Địa chỉ",
      path: "/admin/settings/address",
      icon: ({ className }) => <AddressIcon className={className} />,
      activeMatch: "/admin/settings/address",
    },
    {
      label: "Đổi mật khẩu",
      path: "/admin/settings/password",
      icon: ({ className }) => <KeyIcon className={className} />,
      activeMatch: "/admin/settings/password",
    },
    {
      label: "Thiết lập shop",
      path: "/admin/settings/shop",
      icon: ({ className }) => <ShopIcon className={className} />,
      activeMatch: "/admin/settings/shop",
    },
  ];

  return (
    <aside className="w-[230px] h-screen bg-[#18345C] text-white flex flex-col admin-sidebar-font overflow-hidden">
      {/* Khung logo, tách riêng, cao 64px, border-b */}
      <div className="relative flex items-center justify-start h-[64px] border-b border-white/10 bg-[#18345C] overflow-hidden">
        <Link to="/admin/dashboard">
          <div
            className="h-[64px] w-full flex items-center justify-start overflow-hidden relative"
            style={{ paddingLeft: 2 }}
          >
            <img
              src={ShopLogo}
              alt="Shop Logo"
              style={{
                width: 3000,
                height: 920,
                objectFit: "contain",
                display: "block",
                marginTop: 4,
              }}
              className="block"
            />
          </div>
        </Link>
      </div>
      {/* Các mục nav phía dưới, không bị cách xa logo */}
      <div className="flex-1 flex flex-col px-[16px] pb-2 overflow-y-auto admin-sidebar-scroll">
        {isSettingsMode ? (
          <nav className="flex-1">
            <div className="py-2 ">
              {settingsNavItems.map((item, index) =>
                renderNavItem(item, `settings-${index}`)
              )}
            </div>
          </nav>
        ) : (
          <>
            <nav className="flex-1">
              {adminNavSections.map(
                (section: AdminNavSection, index: number) => {
                  const hasTitle = Boolean(section.title);
                  const sectionKey = section.title ?? index;
                  const wrapperClasses =
                    index === 0
                      ? "mt-[5px]"
                      : "mt-4 border-t border-white/10 pt-4";
                  const listClasses = hasTitle
                    ? "mt-3 space-y-1.5"
                    : "space-y-1.5";

                  return (
                    <div key={sectionKey} className={wrapperClasses}>
                      {hasTitle ? (
                        section.title === "Kênh bán hàng" ? (
                          <div className="rounded-xl border border-white/15 px-3 py-2.5">
                            <p className="px-3 text-[12px] font-bold uppercase tracking-[0.15em] text-white/45 whitespace-nowrap">
                              {section.title}
                            </p>
                            <div className="mt-1.5 h-px bg-white/15 -mx-3" />
                            <div className="mt-2 space-y-1.5 [&>a]:pl-3 [&>div]:pl-3">
                              {section.items.map(
                                (item: AdminNavItem, itemIndex: number) =>
                                  renderNavItem(
                                    item,
                                    `${sectionKey}-${itemIndex}`
                                  )
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="px-2 text-[12px] font-bold uppercase tracking-[0.15em] text-white/45 whitespace-nowrap">
                              {section.title}
                            </p>
                            <div className={listClasses}>
                              {section.items.map(
                                (item: AdminNavItem, itemIndex: number) =>
                                  renderNavItem(
                                    item,
                                    `${sectionKey}-${itemIndex}`
                                  )
                              )}
                            </div>
                          </>
                        )
                      ) : (
                        <div className={listClasses}>
                          {section.items.map(
                            (item: AdminNavItem, itemIndex: number) =>
                              renderNavItem(item, `${sectionKey}-${itemIndex}`)
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </nav>

            {/* Khung Cấu hình cuối sidebar với khoảng cách chuẩn */}
            <div className="mt-auto">
              <div className="h-[49px]" />
              <div className="-mx-[16px] h-px bg-white/15" />
              <div className="mt-2 space-y-1.5 [&>a]:pl-5 [&>div]:pl-5">
                {adminFooterNav.items.map((item: AdminNavItem, index: number) =>
                  renderNavItem(item, `footer-${index}`, false, true)
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
