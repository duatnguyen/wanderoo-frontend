"use client";

import * as React from "react";

type SheetProps = React.ComponentProps<"div"> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Sheet: React.FC<SheetProps> = ({ open = true, onOpenChange, children, ...props }) => {
  React.useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onOpenChange) onOpenChange(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onOpenChange]);

  if (!open) return null;

  return (
    <div
      {...props}
      className="fixed inset-0 z-50 flex items-center justify-end"
      onClick={() => onOpenChange?.(false)}
    >
      <div className="absolute inset-0 bg-black/50" />
      {/* Prevent click bubbling to backdrop */}
      <div className="relative z-10 h-full" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

type SheetContentProps = React.ComponentProps<"div"> & {
  side?: "left" | "right" | "top" | "bottom";
};

export const SheetContent: React.FC<SheetContentProps> = ({ side = "right", className = "", ...props }) => {
  const sideClasses =
    side === "left"
      ? "left-0"
      : side === "right"
      ? "right-0"
      : side === "top"
      ? "top-0"
      : "bottom-0";

  const axisClasses = side === "left" || side === "right" ? "h-full" : "w-full";

  return (
    <div
      {...props}
      className={`bg-white shadow-xl ${axisClasses} w-[400px] max-w-full fixed ${sideClasses} ${className}`}
    />
  );
};

export const SheetHeader: React.FC<React.ComponentProps<"div">> = ({ className = "", ...props }) => (
  <div {...props} className={`flex flex-col gap-1 p-4 ${className}`} />
);

export const SheetTitle: React.FC<React.ComponentProps<"h2">> = ({ className = "", ...props }) => (
  <h2 {...props} className={`text-lg font-semibold leading-none tracking-tight ${className}`} />
);

export const SheetDescription: React.FC<React.ComponentProps<"p">> = ({ className = "", ...props }) => (
  <p {...props} className={`text-sm text-muted-foreground ${className}`} />
);

export default Sheet;


