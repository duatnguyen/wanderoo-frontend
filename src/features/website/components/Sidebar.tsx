import React, { type FC } from "react";

export type SidebarItem = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type SidebarSection = {
  label?: string;
  items: SidebarItem[];
};

export type SidebarProps = {
  sections: SidebarSection[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
};

function clsx(...a: Array<string | undefined | false>) {
  return a.filter(Boolean).join(" ");
}

const Sidebar: FC<SidebarProps> = ({
  sections,
  value,
  onChange,
  className = "",
  logo,
  footer,
}) => {
  return (
    <aside
      className={clsx(
        "min-h-screen bg-white border-r border-gray-200 py-6 px-4 w-64 flex flex-col gap-6",
        className
      )}
    >
      {logo && <div className="mb-8 flex items-center justify-center">{logo}</div>}
      <nav className="flex-1 flex flex-col gap-8">
        {sections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <div className="px-2 mb-2 text-xs font-bold uppercase text-gray-500 tracking-wide">
                {section.label}
              </div>
            )}
            <ul className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = value === item.value;
                return (
                  <li key={item.value}>
                    <button
                      type="button"
                      className={clsx(
                        "group w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition",
                        isActive
                          ? "bg-[#18345c] text-white font-bold"
                          : "text-gray-800 hover:bg-gray-100 hover:text-[#18345c]",
                        item.disabled && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={item.disabled}
                      onClick={() => !item.disabled && onChange?.(item.value)}
                    >
                      {item.icon && <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>}
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      {footer && <div className="mt-8">{footer}</div>}
    </aside>
  );
};

export default Sidebar;
