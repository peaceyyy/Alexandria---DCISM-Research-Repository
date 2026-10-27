"use client";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AlexandriaBrandLockup } from "@/components/ui/alexandria-brand-lockup";

interface UploadHeaderProps {
  onLogoClick?: () => void;
  showBrand?: boolean;
}

export function UploadHeader({
  onLogoClick,
  showBrand = true,
}: UploadHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--color-separator)] bg-[var(--color-bg)]/95 px-6 backdrop-blur-md sm:px-10">
      {showBrand ? (
        <button
          type="button"
          onClick={onLogoClick}
          className="flex h-10 items-center gap-2.5 text-[var(--color-text)] transition-opacity hover:opacity-75"
          aria-label="Return to Alexandria repository"
        >
          <AlexandriaBrandLockup
            markSize={28}
            wordmarkClassName="text-[20px] font-black"
            priority
          />
        </button>
      ) : (
        <span aria-hidden="true" />
      )}

      {/* Theme */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
