import * as React from "react";
import { cn } from "@/lib/utils";

export type FormInputProps = React.ComponentProps<"input"> & {
  containerClassName?: string;
  right?: React.ReactNode;
  label?: string;
};

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, containerClassName, right, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div
          className={cn(
            "bg-white border-2 border-[#e04d30] flex items-center h-[40px] px-[16px] rounded-[12px] w-full",
            containerClassName
          )}
        >
          <input
            ref={ref}
            {...props}
            className={cn(
              "border-0 outline-none bg-transparent text-[14px] font-semibold placeholder:text-[#888888] text-black flex-1 text-left",
              className
            )}
          />
          {right ? <div className="ml-2 flex items-center">{right}</div> : null}
        </div>
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
