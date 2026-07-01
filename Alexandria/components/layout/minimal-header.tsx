/**
 * MinimalHeader — used only on the landing page (/).
 *
 * Shows: brand mark + wordmark (left), GitHub repo link (right).
 * No auth chrome, no role indicator, no CTA. The landing page's
 * sole job is to introduce Alexandria and point to /theses.
 */
import Image from "next/image";
import { GitFork } from "lucide-react";

export function MinimalHeader() {
  return (
    <header className="relative z-10 flex h-16 items-center justify-between px-6 sm:px-10">
      {/* Brand */}
      <a
        href="/theses"
        className="flex items-center gap-2.5 text-white no-underline"
        aria-label="Alexandria — go to repository"
      >
        <Image
          src="/brand/alexandria-mark.svg"
          width={32}
          height={32}
          alt=""
          priority
        />
        <span className="font-[var(--font-khula)] text-[20px] font-black tracking-tight">
          ALEXANDRIA
        </span>
      </a>

      {/* GitHub repo link — the only chrome on a landing page */}
      <a
        href="https://github.com/peaceyyy/Alexandria---DCISM-Thesis-Repository"
        target="_blank"
        rel="noreferrer"
        aria-label="View Alexandria source on GitHub"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/30 hover:text-white"
      >
        <GitFork size={18} aria-hidden />
      </a>
    </header>
  );
}
