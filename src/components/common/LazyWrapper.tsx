import React, { Suspense } from "react";
import Loading from "./Loading";

interface LazyWrapperProps {
  children: React.ReactElement;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ children }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
);
