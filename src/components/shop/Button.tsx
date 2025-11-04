import { forwardRef } from "react";
import { Button as AntdButton } from "antd";
import type { ButtonProps as AntdButtonProps } from "antd/es/button";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "link"
  | "secondary"
  | "ghost"
  | "icon";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonShape = "rounded" | "pill";

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "size"
> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
};

// Map custom variants to antd button types
const getAntdButtonType = (variant: ButtonVariant): AntdButtonProps["type"] => {
  switch (variant) {
    case "primary":
      return "primary";
    case "secondary":
      return "default";
    case "outline":
      return "default";
    case "ghost":
      return "text";
    case "link":
      return "link";
    case "icon":
      return "default";
    default:
      return "primary";
  }
};

// Map custom sizes to antd sizes
const getAntdSize = (size: ButtonSize): AntdButtonProps["size"] => {
  switch (size) {
    case "sm":
      return "small";
    case "md":
      return "middle";
    case "lg":
      return "large";
    default:
      return "middle";
  }
};

// Get custom className based on variant
const getCustomClassName = (
  variant: ButtonVariant,
  shape: ButtonShape
): string => {
  const baseClasses = shape === "pill" ? "!rounded-full" : "!rounded-[5px]";

  switch (variant) {
    case "secondary":
      return `${baseClasses} !bg-[#18345c] !border-[#18345c] !text-white hover:!brightness-110`;
    case "outline":
      return `${baseClasses} !bg-[#f7f7f7] !border-[#454545] !text-[#454545] hover:!bg-white`;
    case "ghost":
      return `${baseClasses} !bg-transparent !border-transparent !text-[#454545] hover:!bg-gray-100`;
    case "link":
      return `${baseClasses} !bg-transparent !border-0 !text-[#1076ec] hover:!underline !p-0 !h-auto`;
    case "icon":
      return `${baseClasses} !bg-transparent !border-[#454545] !text-[#454545] hover:!bg-white !p-0 !w-10 !h-10`;
    default:
      return baseClasses;
  }
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
      style,
      ...props
    },
    ref
  ) => {
    const antdType = getAntdButtonType(variant);
    const antdSize = getAntdSize(size);
    const customClassName = getCustomClassName(variant, shape);

    // Extract props that might conflict with AntdButton
    const { color: _color, ...restProps } = props;

    return (
      <AntdButton
        ref={ref}
        type={antdType}
        size={antdSize}
        loading={loading}
        disabled={disabled}
        className={`${customClassName} ${className || ""}`}
        style={style}
        {...restProps}
      >
        {children}
      </AntdButton>
    );
  }
);

Button.displayName = "Button";

export default Button;
