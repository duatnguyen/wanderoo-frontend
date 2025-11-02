import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  actions,
  className = "flex items-center justify-between w-full mb-[5px] flex-nowrap gap-2",
  titleClassName = "font-bold text-[#272424] text-[24px] leading-normal whitespace-nowrap min-w-0 overflow-hidden text-ellipsis",
}: PageHeaderProps) => {
  return (
    <div className={className}>
      <div className="flex flex-col gap-1">
        <h2 className={titleClassName}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-[#737373] text-[14px] leading-normal">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};