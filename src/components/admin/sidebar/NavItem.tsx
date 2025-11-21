import React from "react";
import { Link } from "react-router-dom";
import type { AdminNavItem } from "../adminNavData";

// Navigation Item Component
interface NavItemProps {
  item: AdminNavItem;
  itemKey: string;
  activePath: string;
  expandedItems: Set<string>;
  onToggleExpand: (key: string) => void;
  isSubmenu?: boolean;
  isFooter?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  item,
  itemKey,
  activePath,
  expandedItems,
  onToggleExpand,
  isSubmenu = false,
  isFooter = false,
}) => {
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isExpanded = expandedItems.has(itemKey);

  // Base classes for styling
  const baseClasses =
    "flex items-center gap-3 rounded-xl px-4 h-8 py-0 text-sm font-medium tracking-wide transition-colors duration-200";
  const activeClasses = "bg-[#E04D30] text-white";
  const inactiveClasses = "text-white hover:text-white hover:bg-[#172b46]";
  const submenuClasses =
    "ml-[25px] pl-3 text-xs font-normal tracking-normal h-7";
  const submenuActiveClasses = "text-white font-medium";
  const submenuInactiveClasses = "text-white/60 hover:text-white/90";
  const footerBaseClasses =
    "flex items-center gap-3 rounded-xl px-4 h-8 py-0 text-sm font-medium tracking-wide transition-colors duration-200";
  const footerActiveClasses = "bg-[#E04D30] text-white";
  const footerInactiveClasses =
    "text-white hover:text-white hover:bg-[#172b46]";

  // Check if item is active
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
      {hasSubmenu && (
        <svg
          className={`ml-auto h-4 w-4 transition-transform duration-200 ${
            isExpanded ? "rotate-90" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </>
  );

  // Determine item classes based on type and state
  let itemClasses;
  if (isSubmenu) {
    itemClasses = `${baseClasses} ${submenuClasses} ${
      isActive ? submenuActiveClasses : submenuInactiveClasses
    }`;
  } else if (isFooter) {
    itemClasses = `${footerBaseClasses} ${
      isActive ? `${footerActiveClasses} h-8 py-0` : footerInactiveClasses
    }`;
  } else {
    itemClasses = `${baseClasses} ${
      isActive ? `${activeClasses} h-8 py-0` : inactiveClasses
    } ${hasSubmenu ? "cursor-pointer" : ""}`;
  }

  const handleItemClick = () => {
    if (hasSubmenu) {
      onToggleExpand(itemKey);
    }
  };

  if (hasSubmenu) {
    return (
      <div>
        <div className={itemClasses} onClick={handleItemClick}>
          {content}
        </div>

        {/* Inline submenu */}
        {isExpanded && (
          <div className="mt-1 space-y-0.5">
            {item.submenu!.map((subItem, subIndex) => (
              <Link
                key={`${itemKey}-sub-${subIndex}`}
                to={subItem.path || "#"}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors duration-200 ${submenuClasses} ${
                  subItem.activeMatch &&
                  activePath.startsWith(subItem.activeMatch)
                    ? `${submenuActiveClasses} bg-[#E04D30]/20 border-l-2 border-[#E04D30]`
                    : submenuInactiveClasses
                } hover:text-white hover:bg-white/5`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
                <span className="text-xs truncate">{subItem.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.path) {
    return (
      <Link to={item.path} className={itemClasses}>
        {content}
      </Link>
    );
  }

  return <div className={`${itemClasses} cursor-default`}>{content}</div>;
};

export default NavItem;
