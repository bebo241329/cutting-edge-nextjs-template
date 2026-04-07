"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

export default function TanStackQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        closeButton
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "alert shadow-lg border border-base-content/10 bg-base-100 text-base-content rounded-box px-4 py-3",
            title: "font-medium",
            description: "text-sm opacity-80",
            success: "alert-success",
            error: "alert-error",
            warning: "alert-warning",
            info: "alert-info",
            closeButton:
              "btn btn-ghost btn-xs border-none bg-transparent text-base-content/70 hover:text-base-content",
          },
        }}
      />
    </QueryClientProvider>
  );
}
