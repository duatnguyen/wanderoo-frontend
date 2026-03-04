// src/components/common/Breadcrumb.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBreadcrumb } from "@/app/router/router.utils";

interface BreadcrumbProps {
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  className,
  separator = <ChevronRight className="h-4 w-4 text-gray-400" />,
  showHome = true,
}) => {
  const { breadcrumbs } = useBreadcrumb();
  const location = useLocation();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      {showHome && (
        <>
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          {separator}
        </>
      )}

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isCurrent = location.pathname === item.path;

        return (
          <React.Fragment key={item.path}>
            {isLast || isCurrent ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : (
              <Link
                to={item.path}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            )}

            {!isLast && <span className="flex items-center">{separator}</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// Specialized POS Breadcrumb with POS-specific styling
export const POSBreadcrumb: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <Breadcrumb
      className={cn("bg-white px-4 py-2 border-b border-gray-200", className)}
      showHome={false}
    />
  );
};

export default Breadcrumb;
