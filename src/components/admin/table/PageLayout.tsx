import type { ReactNode } from "react";

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({
  children,
  className = "flex flex-col gap-0 items-center w-full max-w-full overflow-hidden",
}: PageContainerProps) => {
  return <div className={className}>{children}</div>;
};

export interface ContentCardProps {
  children: ReactNode;
  className?: string;
}

export const ContentCard = ({
  children,
  className = "bg-white border border-[#b0b0b0] flex flex-col gap-[12px] items-start px-[16px] py-[16px] rounded-[16px] w-full",
}: ContentCardProps) => {
  return <div className={className}>{children}</div>;
};
