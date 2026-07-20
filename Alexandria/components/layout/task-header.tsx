import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/** A deliberately narrow header for task flows that should not expose browse controls. */
export function TaskHeader({
  backHref,
  backLabel,
}: {
  backHref: string;
  backLabel: string;
}) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--color-separator)] bg-[var(--color-bg)]/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link
          href="/home"
          className="flex shrink-0 items-center gap-2 text-[var(--color-text)]"
          aria-label="Alexandria repository home"
        >
          <Image src="/brand/alexandria-mark.svg" width={26} height={26} alt="" className="theme-invert" />
          <span className="hidden font-[var(--font-khula)] text-[18px] font-black tracking-tight sm:inline">
            ALEXANDRIA
          </span>
        </Link>
        <Link
          href={backHref}
          className="inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
        >
          <ArrowLeft size={15} aria-hidden />
          <span className="truncate">{backLabel}</span>
        </Link>
      </div>
      <ThemeToggle />
    </header>
  );
}
