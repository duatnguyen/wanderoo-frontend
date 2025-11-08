import React from "react";
import { adminFooterNav, type AdminNavItem } from "../adminNavData";
import NavItem from "./NavItem";

// Footer Component
interface SidebarFooterProps {
  activePath: string;
  expandedItems: Set<string>;
  onToggleExpand: (key: string) => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  activePath,
  expandedItems,
  onToggleExpand,
}) => {
  return (
    <div className="mt-auto">
      <div className="h-[49px]" />
      <div className="-mx-[16px] h-px bg-white/15" />
      <div className="mt-2 space-y-1.5 [&>a]:pl-5 [&>div]:pl-5">
        {adminFooterNav.items.map((item: AdminNavItem, index: number) => (
          <NavItem
            key={`footer-${index}`}
            item={item}
            itemKey={`footer-${index}`}
            activePath={activePath}
            expandedItems={expandedItems}
            onToggleExpand={onToggleExpand}
            isFooter={true}
          />
        ))}
      </div>
    </div>
  );
};

export default SidebarFooter;