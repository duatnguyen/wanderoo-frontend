import React from "react";
import {
  adminNavSections,
  type AdminNavItem,
  type AdminNavSection,
} from "../adminNavData";
import { ProfileIcon, KeyIcon, ShopIcon } from "../SettingsIcons";
import NavItem from "./NavItem";

// Navigation Content Component
interface NavContentProps {
  activePath: string;
  expandedItems: Set<string>;
  onToggleExpand: (key: string) => void;
  isSettingsMode: boolean;
}

const NavContent: React.FC<NavContentProps> = ({
  activePath,
  expandedItems,
  onToggleExpand,
  isSettingsMode,
}) => {
  // Settings navigation items
  const settingsNavItems: AdminNavItem[] = [
    {
      label: "Hồ sơ",
      path: "/admin/settings/profile",
      icon: ({ className }) => <ProfileIcon className={className} />,
      activeMatch: "/admin/settings/profile",
      defaultActive: true,
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

  if (isSettingsMode) {
    return (
      <nav className="flex-1">
        <div className="py-2 space-y-[5px]">
          {settingsNavItems.map((item, index) => (
            <NavItem
              key={`settings-${index}`}
              item={item}
              itemKey={`settings-${index}`}
              activePath={activePath}
              expandedItems={expandedItems}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex-1">
      {adminNavSections.map((section: AdminNavSection, index: number) => {
        const hasTitle = Boolean(section.title);
        const sectionKey = section.title ?? index;
        const wrapperClasses =
          index === 0 ? "mt-[5px]" : "mt-4 border-t border-white/10 pt-4";
        const listClasses = hasTitle ? "mt-3 space-y-1.5" : "space-y-1.5";

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
                      (item: AdminNavItem, itemIndex: number) => (
                        <NavItem
                          key={`${sectionKey}-${itemIndex}`}
                          item={item}
                          itemKey={`item-${sectionKey}-${itemIndex}`}
                          activePath={activePath}
                          expandedItems={expandedItems}
                          onToggleExpand={onToggleExpand}
                        />
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
                      (item: AdminNavItem, itemIndex: number) => (
                        <NavItem
                          key={`${sectionKey}-${itemIndex}`}
                          item={item}
                          itemKey={`item-${sectionKey}-${itemIndex}`}
                          activePath={activePath}
                          expandedItems={expandedItems}
                          onToggleExpand={onToggleExpand}
                        />
                      )
                    )}
                  </div>
                </>
              )
            ) : (
              <div className={listClasses}>
                {section.items.map((item: AdminNavItem, itemIndex: number) => (
                  <NavItem
                    key={`${sectionKey}-${itemIndex}`}
                    item={item}
                    itemKey={`item-${sectionKey}-${itemIndex}`}
                    activePath={activePath}
                    expandedItems={expandedItems}
                    onToggleExpand={onToggleExpand}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default NavContent;
