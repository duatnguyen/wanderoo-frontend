import React, { useId, useMemo, useState, type FC } from "react";

export type TabItem = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type TabMenuProps = {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  className?: string;
  variant?: "underline" | "pill";
};

function clsx(...vals: Array<string | false | undefined>) {
  return vals.filter(Boolean).join(" ");
}

const TabMenu: FC<TabMenuProps> = ({
  items,
  value,
  defaultValue,
  onChange,
  className = "",
  variant = "underline",
}) => {
  const generatedId = useId();
  const firstEnabled = useMemo(
    () => items.find((t) => !t.disabled)?.id,
    [items]
  );
  const [internal, setInternal] = useState<string>(
    defaultValue ?? value ?? firstEnabled ?? ""
  );
  const active = value ?? internal;

  const setActive = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const enabled = items.filter((t) => !t.disabled);
    const currentIdx = Math.max(
      0,
      enabled.findIndex((t) => t.id === active)
    );
    let next = currentIdx;
    if (e.key === "ArrowRight") next = (currentIdx + 1) % enabled.length;
    if (e.key === "ArrowLeft")
      next = (currentIdx - 1 + enabled.length) % enabled.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = enabled.length - 1;
    setActive(enabled[next]?.id ?? active);
  };

  return (
    <div className={clsx("w-full", className)}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="flex items-center gap-4"
        onKeyDown={onKeyDown}
      >
        {items.map((item, idx) => {
          const isActive = item.id === active;
          const base =
            "px-4 py-2 text-[16px] font-semibold whitespace-nowrap select-none";
          const disabled = item.disabled;
          const styles =
            variant === "underline"
              ? clsx(
                  "border-b-2",
                  isActive
                    ? "text-[#454545] border-[#1076ec]"
                    : "text-gray-500 border-transparent hover:text-[#1076ec]"
                )
              : clsx(
                  "rounded-[20px] border",
                  isActive
                    ? "bg-[#18345c] text-white border-[#18345c]"
                    : "bg-[#f7f7f7] text-[#454545] border-[#454545] hover:bg-white"
                );

          return (
            <button
              key={item.id}
              id={`${generatedId}-tab-${idx}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${generatedId}-panel-${idx}`}
              tabIndex={isActive ? 0 : -1}
              disabled={disabled}
              className={clsx(
                base,
                styles,
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !disabled && setActive(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabMenu;
