"use client";

import { cn } from "@/lib/utils";

type DemoBannerProps = {
  className?: string;
};

export function DemoBanner({ className }: DemoBannerProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed right-3 top-3 z-50 flex items-center gap-1.5 select-none text-xs text-[var(--color-text-muted)] sm:right-5 sm:top-5",
        className
      )}
      role="status"
    >
      <span aria-hidden="true" className="text-[var(--color-brand-text)]">◉</span>
      <span className="font-medium text-[var(--color-text)]">Presentation demo</span>
      <span className="opacity-40">·</span>
      <span>Nothing is saved</span>
    </div>
  );
}
