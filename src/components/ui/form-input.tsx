import * as React from "react";
import { cn } from "@/lib/utils";

export type FormInputProps = React.ComponentProps<"input"> & {
  containerClassName?: string;
  right?: React.ReactNode;
};

export function FormInput({
  className,
  containerClassName,
  right,
  ...props
}: FormInputProps) {
  return (
    <div
      className={cn(
        "bg-white border-2 border-[#e04d30] flex items-center p-[16px] h-[50px] rounded-[12px] w-full",
        containerClassName
      )}
    >
      <input
        {...props}
        className={cn(
          "border-0 outline-none bg-transparent text-[12px] font-semibold placeholder:text-[#888888] text-[#888888] flex-1",
          className
        )}
      />
      {right ? <div className="ml-2 flex items-center">{right}</div> : null}
    </div>
  );
}

export default FormInput;
