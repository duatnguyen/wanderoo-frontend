import { useState, useRef, useEffect, type FC } from "react";

export type SubCategory = {
  id: string;
  label: string;
  disabled?: boolean;
};
export type MainCategory = {
  id: string;
  label: string;
  image?: string;
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
        const isActive = mainValue ? cat.id === mainValue : openIdx === idx;
        const hasSub =
          Array.isArray(cat.subcategories) && cat.subcategories.length > 0;
        return (
          <div key={cat.id} className={clsx("relative flex-1")}>
            <button
              type="button"
              className={clsx(
                "flex flex-col items-center gap-2 px-2 py-2 text-[14px] font-medium bg-transparent focus:z-10 transition-opacity hover:opacity-80 w-full",
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
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <span className="text-[#454545] text-center">{cat.label}</span>
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
