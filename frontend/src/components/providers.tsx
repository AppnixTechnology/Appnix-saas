"use client";

import { ReactNode } from "react";
import { QueryProvider } from "@/lib/query/provider";
import { ThemeProvider } from "@/lib/theme/provider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { LanguageProvider } from "@/lib/i18n/context";

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
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}