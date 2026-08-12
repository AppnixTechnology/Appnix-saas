"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useTheme() {
  const { theme, setTheme, resolvedTheme, themes } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return {
      theme: "system",
      setTheme: () => {},
      resolvedTheme: "light",
      themes: ["light", "dark", "system"],
      mounted: false,
    };
  }

  return {
    theme,
    setTheme,
    resolvedTheme,
    themes,
    mounted,
  };
}