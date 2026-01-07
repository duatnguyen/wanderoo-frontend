import React, { forwardRef } from "react";
import { Button as UiButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "link"
  | "secondary"
  | "ghost"
  | "icon";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonShape = "rounded" | "pill";

// Infer props from UiButton
type UiButtonProps = React.ComponentProps<typeof UiButton>;

export type ButtonProps = Omit<UiButtonProps, "variant" | "size"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      shape = "rounded",
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Map shop variant to ui variant
    const getUiVariant = (v: ButtonVariant): UiButtonProps["variant"] => {
      switch (v) {
        case "primary": return "default";
        case "secondary": return "secondary";
        case "outline": return "outline";
        case "ghost": return "ghost";
        case "link": return "link";
        case "icon": return "ghost"; // Icon variant maps to ghost in UI button usually, or just default with icon size
        default: return "default";
      }
    };

    // Map shop size to ui size
    const getUiSize = (s: ButtonSize): UiButtonProps["size"] => {
      switch (s) {
        case "sm": return "sm";
        case "md": return "default";
        case "lg": return "lg";
        default: return "default";
      }
    };

    const uiVariant = getUiVariant(variant);
    
    // Special handling for 'icon' variant which affects size in standard button usually, 
    // but here it acts as a variant. In UI button, size='icon' is a thing.
    // If variant is 'icon', let's use size='icon' if size is 'md' (default), 
    // or keep 'sm'/'lg' if specified but 'icon' usually implies square.
    // However, existing usage of variant='icon' might expect specific styling.
    // Old implementation: !bg-transparent !border-[#454545] !text-[#454545] hover:!bg-white !p-0 !w-10 !h-10
    
    let uiSize = getUiSize(size);
    if (variant === "icon") {
        uiSize = "icon";
    }

    const shapeClass = shape === "pill" ? "rounded-full" : "rounded-md";
    
    // Icon variant custom styles to match old behavior if needed, or rely on UI button
    // Old icon: border-[#454545] text-[#454545] bg-transparent. 
    // UI ghost: hover:bg-accent hover:text-accent-foreground.
    // We might need to override if strictly emulating. 
    // But let's try to stick to standard UI button styles for consistency, ONLY adding shape.
    
    return (
      <UiButton
        ref={ref}
        variant={uiVariant}
        size={uiSize}
        disabled={disabled || loading}
        className={cn(
          shapeClass,
          variant === "icon" && "border border-input", // Optional: Add border to icon if it used to have it
          loading && "opacity-70 cursor-wait",
          className
        )}
        {...props}
      >
        {loading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </UiButton>
    );
  }
);

Button.displayName = "Button";

export default Button;
