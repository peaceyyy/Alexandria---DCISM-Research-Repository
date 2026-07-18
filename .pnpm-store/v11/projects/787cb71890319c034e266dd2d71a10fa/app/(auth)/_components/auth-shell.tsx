import { GitFork } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { ReactNode } from "react";
import styles from "./auth-shell.module.css";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className={styles.shell}>
      <div className={styles.orbits} aria-hidden>
        <span className={`${styles.orbit} ${styles.orbitOuter}`} />
        <span className={`${styles.orbit} ${styles.orbitMiddle}`} />
        <span className={`${styles.orbit} ${styles.orbitInner}`} />
      </div>

      <div className="absolute top-12 right-11 z-10 flex items-center gap-4 max-sm:top-5 max-sm:right-5">
        <ThemeToggle />
        <a
          href="https://github.com/peaceyyy/Alexandria---DCISM-Thesis-Repository"
          target="_blank"
          rel="noreferrer"
          aria-label="Open Alexandria on GitHub"
          className="grid size-12 place-items-center rounded-full bg-[var(--color-text)] text-[var(--color-bg)] transition-transform hover:scale-105"
        >
          <GitFork aria-hidden size={26} />
        </a>
      </div>

      <section className={styles.content}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--color-text)]"
        >
          <Image
            src="/brand/alexandria-mark.svg"
            width={56}
            height={56}
            alt=""
            className="theme-invert"
            priority
          />
          <span className="text-[25px] font-black max-sm:hidden">
            ALEXANDRIA
          </span>
        </Link>

        <header className="mt-6 max-w-[854px]">
          <div className="flex items-baseline gap-3">
            <h1 className="font-[var(--font-display)] text-[clamp(3.5rem,6vw,5rem)] leading-none font-extrabold text-[var(--color-brand-bright)] tracking-tight">
              ALEXANDRIA
            </h1>
            <span className="text-base font-medium text-[var(--color-pronunciation)] max-md:hidden">
              (al-ig-ZAN-dree-uh)
            </span>
          </div>
          <p className="mt-2 text-[clamp(1.5rem,2.2vw,1.8rem)] leading-tight font-black text-[var(--color-text)]">
            Thesis and Capstone Hub
          </p>
          <p className="mt-2 text-lg font-semibold text-[var(--color-text-muted)]">
            by DCISM Students, for DCISM Students
          </p>
        </header>

        <div className={styles.formSlot}>{children}</div>
      </section>
    </main>
  );
}
