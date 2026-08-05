/**
 * MinimalHeader — used only on the landing page (/).
 *
 * Shows: brand mark + wordmark (left), GitHub repo link (right).
 * No auth chrome, no role indicator, no CTA. The landing page's
 * sole job is to introduce Alexandria and point to /home.
 */
import { GitFork } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AlexandriaBrandLockup } from "@/components/ui/alexandria-brand-lockup";

export function MinimalHeader() {
  return (
    <header className="relative z-10 flex h-16 items-center justify-between px-6 sm:px-10">
      {/* Brand */}
      <a
        href="/home"
        className="inline-flex min-h-11 items-center text-[var(--color-text)] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        aria-label="Alexandria — go to repository"
      >
        <AlexandriaBrandLockup
          wordmarkClassName="text-[20px] font-black"
          priority
        />
      </a>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="h-11 w-11">
          <ThemeToggle className="!h-11 !w-11" />
        </div>
        <a
          href="https://github.com/peaceyyy/Alexandria---DCISM-Thesis-Repository"
          target="_blank"
          rel="noreferrer"
          aria-label="View Alexandria source on GitHub"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-separator-mid)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-separator-mid)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
        >
          <GitFork size={18} aria-hidden />
        </a>
      </div>
    </header>
  );
}
