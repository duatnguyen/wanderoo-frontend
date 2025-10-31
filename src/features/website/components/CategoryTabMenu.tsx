import React, { useState, useRef, useEffect, type FC } from "react";

export type SubCategory = {
  id: string;
  label: string;
  disabled?: boolean;
};
export type MainCategory = {
  id: string;
  label: string;
  subcategories?: SubCategory[];
  disabled?: boolean;
};
export type CategoryTabMenuProps = {
  categories: MainCategory[];
  mainValue?: string;
  subValue?: string;
  onMainChange?: (id: string) => void;
  onSubChange?: (id: string, mainId: string) => void;
  className?: string;
};

function clsx(...a: Array<string | false | undefined>) {
  return a.filter(Boolean).join(" ");
}

const CategoryTabMenu: FC<CategoryTabMenuProps> = ({
  categories,
  mainValue,
  subValue,
  onMainChange,
  onSubChange,
  className = "",
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Outside click closes submenu
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpenIdx(null);
    }
    if (openIdx !== null) {
      window.addEventListener("mousedown", handle);
      return () => window.removeEventListener("mousedown", handle);
    }
  }, [openIdx]);

  return (
    <div className={clsx("flex gap-4 relative", className)} ref={menuRef}>
      {categories.map((cat, idx) => {
        const isActive = (mainValue ? cat.id === mainValue : openIdx === idx);
        const hasSub = Array.isArray(cat.subcategories) && cat.subcategories.length > 0;
        return (
          <div
            key={cat.id}
            className={clsx("relative")}
          >
            <button
              type="button"
              className={clsx(
                "px-5 py-2 text-[15px] font-semibold rounded-[8px] border border-[#454545] bg-white min-w-[120px] focus:z-10 transition",
                isActive ? "bg-[#18345c] border-[#18345c] text-white" : "text-[#454545] hover:bg-gray-50",
                cat.disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={cat.disabled}
              aria-expanded={hasSub ? isActive : undefined}
              onClick={() => {
                if (cat.disabled) return;
                setOpenIdx(idx === openIdx ? null : idx);
                onMainChange?.(cat.id);
              }}
            >
              {cat.label}
            </button>
            {hasSub && openIdx === idx && (
              <div className="absolute left-0 mt-2 w-auto min-w-[150px] bg-white border border-gray-200 rounded-[6px] shadow-xl z-30">
                <ul className="py-1">
                  {cat.subcategories?.map((sub) => (
                    <li key={sub.id}>
                      <button
                        className={clsx(
                          "block w-full px-4 py-2 text-left text-[15px] font-medium rounded-[6px] transition",
                          subValue === sub.id
                            ? "bg-[#f7f7f7] text-[#18345c]"
                            : "text-[#454545] hover:bg-gray-100",
                          sub.disabled && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={sub.disabled}
                        onClick={() => onSubChange?.(sub.id, cat.id)}
                      >
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryTabMenu;
