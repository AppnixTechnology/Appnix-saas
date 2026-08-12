"use client";

import { ReactNode } from "react";
import { QueryProvider } from "@/lib/query/provider";
import { ThemeProvider } from "@/lib/theme/provider";
import { AuthProvider } from "@/lib/auth/auth-context";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}