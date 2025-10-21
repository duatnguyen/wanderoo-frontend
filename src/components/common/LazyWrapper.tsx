import { Suspense } from "react";
import Loading from "../../components/common/Loading";

export const LazyWrapper = ({ children }: { children: React.ReactElement }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
);
