import React from "react";
import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackageSearchSidebarIconProps {
  className?: string;
  isActive?: boolean;
}

export const PackageSearchSidebarIcon: React.FC<
  PackageSearchSidebarIconProps
> = ({ className, isActive = false }) => {
  return (
    <PackageSearch
      className={cn(
        "size-[28.125px]",
        isActive ? "text-white" : "text-[#454545]",
        className
      )}
    />
  );
};

export default PackageSearchSidebarIcon;

