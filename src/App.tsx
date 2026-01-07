// src/App.tsx
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { Toaster } from "sonner";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

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
      locale={viVN}
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
        <Toaster 
          richColors
          position="top-right"
          closeButton
          duration={3000}
        />
      </QueryClientProvider>
    </ConfigProvider>
  );
}
