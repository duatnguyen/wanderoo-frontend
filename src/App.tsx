// src/App.tsx
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider, App as AntdApp, theme } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { router } from "./app/router";             // createBrowserRouter(...)
import { AuthProvider } from "./app/providers/AuthProvider";
import Loading from "./components/common/Loading";

// (tuỳ chọn) cấu hình React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, staleTime: 30_000 },
    mutations: { retry: 0 },
  },
});

// ErrorBoundary đơn giản
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
  // Bạn có thể dùng lib như `react-error-boundary` để handle đẹp hơn:
  // return (
  //   <RBErrorBoundary FallbackComponent={Fallback}>
  //     {children}
  //   </RBErrorBoundary>
  // );
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 8,
        },
      }}
    >
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ErrorBoundary>
              <Suspense fallback={<Loading />}>
                <RouterProvider router={router} />
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
