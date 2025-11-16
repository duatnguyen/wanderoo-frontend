// src/App.tsx
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";

import { router } from "./app/router"; // createBrowserRouter(...)
import { AuthProvider } from "./context/AuthContext";
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
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ea5b0c",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <RouterProvider router={router} />
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}
