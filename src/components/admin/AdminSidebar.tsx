import React, { useState, useEffect } from "react";
import {
  adminNavSections,
  adminFooterNav,
  type AdminNavSection,
} from "./adminNavData";
import { SidebarHeader, NavContent, SidebarFooter } from "./sidebar";

interface AdminSidebarProps {
  activePath: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePath }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
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

  const handleToggleExpand = (key: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <aside className="w-[230px] h-screen bg-[#18345C] text-white flex flex-col admin-sidebar-font overflow-hidden">
      {/* Header Component */}
      <SidebarHeader />
      
      {/* Content Area */}
      <div className="flex-1 flex flex-col px-[16px] overflow-hidden">
        {isSettingsMode ? (
          <div className="flex-1 overflow-y-auto admin-sidebar-scroll pb-2">
            <NavContent
              activePath={activePath}
              expandedItems={expandedItems}
              onToggleExpand={handleToggleExpand}
              isSettingsMode={true}
            />
          </div>
        ) : (
          <>
            {/* Scrollable Navigation Content */}
            <div className="flex-1 overflow-y-auto admin-sidebar-scroll pb-2">
              <NavContent
                activePath={activePath}
                expandedItems={expandedItems}
                onToggleExpand={handleToggleExpand}
                isSettingsMode={false}
              />
            </div>
            
            {/* Fixed Footer Component */}
            <div className="flex-shrink-0">
              <SidebarFooter
                activePath={activePath}
                expandedItems={expandedItems}
                onToggleExpand={handleToggleExpand}
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
