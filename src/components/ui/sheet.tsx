import * as React from "react";
import { cn } from "@/lib/utils";

interface SheetProps extends React.ComponentProps<"div"> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Sheet: React.FC<SheetProps> = ({
  open = true,
  onOpenChange,
  children,
  ...props
}) => {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onOpenChange) {
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
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
      <div
        className="relative z-10 h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

interface SheetContentProps extends React.ComponentProps<"div"> {
  side?: "left" | "right" | "top" | "bottom";
}

export const SheetContent: React.FC<SheetContentProps> = ({
  side = "right",
  className,
  ...props
}) => {
  const sideClasses = {
    left: "left-0",
    right: "right-0",
    top: "top-0",
    bottom: "bottom-0",
  }[side];

  const axisClasses = side === "left" || side === "right" ? "h-full" : "w-full";

  return (
    <div
      {...props}
      className={cn(
        "bg-white shadow-xl fixed max-w-full",
        axisClasses,
        "w-[400px]",
        sideClasses,
        className
      )}
    />
  );
};

export const SheetHeader: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => <div {...props} className={cn("flex flex-col gap-1 p-4", className)} />;

export const SheetTitle: React.FC<React.ComponentProps<"h2">> = ({
  className,
  ...props
}) => (
  <h2
    {...props}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
  />
);

export const SheetDescription: React.FC<React.ComponentProps<"p">> = ({
  className,
  ...props
}) => (
  <p {...props} className={cn("text-sm text-muted-foreground", className)} />
);

export default Sheet;
