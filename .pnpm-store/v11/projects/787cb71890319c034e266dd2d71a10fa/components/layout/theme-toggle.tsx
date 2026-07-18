"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("alexandria-theme");
    if (stored === "light") {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme, mounted]);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("alexandria-theme", next);
  }

  // Prevent hydration mismatch by returning a placeholder or null until mounted
  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-separator-mid)] bg-[var(--color-text)]/5 text-[var(--color-text)] transition-colors hover:bg-[var(--color-text)]/10"
    >
      {theme === "dark" ? (
        <Sun aria-hidden size={16} className="text-amber-400" />
      ) : (
        <Moon aria-hidden size={16} className="text-slate-500" />
      )}
    </button>
  );
}
