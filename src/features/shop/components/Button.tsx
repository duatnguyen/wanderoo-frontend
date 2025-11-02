import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "link"
  | "secondary"
  | "ghost"
  | "icon";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonShape = "rounded" | "pill";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const VARIANT_BASE: Record<ButtonVariant, string> = {
  primary:
    "bg-[#ea5b0c] text-white border border-[#ea5b0c] hover:bg-[#d5510b] focus:ring-2 focus:ring-orange-200",
  outline:
    "bg-[#f7f7f7] text-[#454545] border border-[#454545] hover:bg-white focus:ring-2 focus:ring-gray-200",
  link: "bg-transparent text-[#1076ec] border-0 hover:underline",
  secondary:
    "bg-[#18345c] text-white border border-[#18345c] hover:brightness-110 focus:ring-2 focus:ring-blue-200",
  ghost:
    "bg-transparent text-[#454545] border border-transparent hover:bg-gray-100 focus:ring-2 focus:ring-gray-200",
  icon: "bg-transparent text-[#454545] border border-[#454545] hover:bg-white focus:ring-2 focus:ring-gray-200",
};

const SIZE_BASE: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[14px]",
  md: "h-9 px-4 text-[16px]",
  lg: "h-10 px-5 text-[18px]",
};

const RADIUS_BY_SHAPE: Record<ButtonShape, string> = {
  rounded: "rounded-[5px]",
  pill: "rounded-full",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      shape = "rounded",
      disabled,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const paddingForIcon = variant === "icon" ? "px-0 w-10 h-10" : "";

    return (
      <button
        ref={ref}
        className={cx(
          "inline-flex items-center justify-center select-none transition-colors cursor-pointer",
          VARIANT_BASE[variant],
          SIZE_BASE[size],
          RADIUS_BY_SHAPE[shape],
          paddingForIcon,
          isDisabled && "opacity-60 cursor-not-allowed",
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 size-4 animate-spin text-current"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
