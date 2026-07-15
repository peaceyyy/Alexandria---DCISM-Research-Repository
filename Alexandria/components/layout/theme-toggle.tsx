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
      className="fixed bottom-6 right-6 z-[9999] inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 text-[var(--color-text)] shadow-lg backdrop-blur-md transition-transform hover:scale-105 active:scale-95 sm:bottom-8 sm:right-8"
    >
      {theme === "dark" ? (
        <Sun aria-hidden size={22} className="text-amber-400" />
      ) : (
        <Moon aria-hidden size={22} className="text-slate-600" />
      )}
    </button>
  );
}
