import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  adminNavSections,
  adminFooterNav,
  type AdminNavItem,
  type AdminNavSection,
} from "./adminNavData.tsx";
import ShopLogo from "../../assets/icons/ShopLogo.png";
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
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium tracking-wide transition-colors duration-200";
  const activeClasses = "bg-[#E04D30] text-white";
  const inactiveClasses = "text-white hover:text-white hover:bg-[#172b46]";
  const submenuClasses = "ml-[35px] pl-4";
  const submenuActiveClasses = "text-white underline";
  const submenuInactiveClasses = "text-white/70";

  const toggleDropdown = (itemKey: string, item: AdminNavItem) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
        // If the item has submenus and we're expanding it, navigate to the first submenu item
        if (item.submenu && item.submenu.length > 0 && item.submenu[0].path) {
          navigate(item.submenu[0].path);
        }
      }
      return newSet;
    });
  };

  const renderNavItem = (
    item: AdminNavItem,
    key: React.Key,
    isSubmenu: boolean = false
  ) => {
    const itemKey = `item-${key}`;
    const hasSubmenu = item.submenu && item.submenu.length > 0;

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

    const isExpanded = expandedItems.has(itemKey);

    const content = (
      <>
        {!isSubmenu && item.icon({ className: "h-5 w-5" })}
        <span>{item.label}</span>
        {hasSubmenu && (
          <svg
            className={`ml-auto h-4 w-4 transition-transform duration-200 ${
              isExpanded ? "rotate-90" : ""
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        )}
      </>
    );

    let itemClasses;
    if (isSubmenu) {
      itemClasses = `${baseClasses} ${submenuClasses} ${
        isActive ? submenuActiveClasses : submenuInactiveClasses
      }`;
    } else {
      itemClasses = `${baseClasses} ${
        isActive ? activeClasses : inactiveClasses
      } ${hasSubmenu ? "cursor-pointer" : ""}`;
    }

    if (hasSubmenu) {
      return (
        <div key={key}>
          <div
            className={itemClasses}
            onClick={() => toggleDropdown(itemKey, item)}
          >
            {content}
          </div>
          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.submenu!.map((subItem, subIndex) =>
                renderNavItem(subItem, `${itemKey}-sub-${subIndex}`, true)
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
    <aside className="w-[225px] bg-[#18345C] text-white h-full">
      <div className="flex h-full flex-col px-[16px] pb-4">
        <Link to="/admin/dashboard">
          <div className="flex flex-col items-center text-center cursor-pointer">
            <img
              src={ShopLogo}
              alt="Shop Logo"
              className="h-[160px] w-[160px] object-contain"
            />
          </div>
        </Link>

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
                    index === 0 ? "" : "mt-4 border-t border-white/10 pt-4";
                  const listClasses = hasTitle
                    ? "mt-3 space-y-1.5"
                    : "space-y-1.5";

                  return (
                    <div key={sectionKey} className={wrapperClasses}>
                      {hasTitle ? (
                        <p className="px-2 text-[12px] font-bold uppercase tracking-[0.3em] text-white/45">
                          {section.title}
                        </p>
                      ) : null}
                      <div className={listClasses}>
                        {section.items.map(
                          (item: AdminNavItem, itemIndex: number) =>
                            renderNavItem(item, `${sectionKey}-${itemIndex}`)
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </nav>

            <div className="mt-auto border-t border-white/10 pt-4">
              <div className="space-y-1.5">
                {adminFooterNav.items.map((item: AdminNavItem, index: number) =>
                  renderNavItem(item, `footer-${index}`)
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
