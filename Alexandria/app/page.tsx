import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MinimalHeader } from "@/components/layout/minimal-header";

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <MinimalHeader />

      {/* Hero section */}
      <section className="relative z-10 flex min-h-[calc(100vh-64px)] max-w-7xl flex-col px-5 pb-28 pt-12 sm:px-10 sm:pt-16 lg:px-16">
        <div className="max-w-4xl">
          {/* Wordmark */}
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1 sm:flex-nowrap sm:gap-x-4 sm:gap-y-2">
            <h1 className="shrink-0 whitespace-nowrap font-[var(--font-khula)] text-[clamp(2.75rem,15vw,7.5rem)] font-extrabold leading-none tracking-[-0.06em] bg-[conic-gradient(from_180deg_at_50%_50%,#368bfe_0deg,#1752f0_180deg,#368bfe_360deg)] bg-clip-text text-transparent sm:text-[clamp(4rem,8vw,7.5rem)]">
              ALEXANDRIA
            </h1>
            <span className="pb-1 text-sm font-medium whitespace-nowrap text-[var(--color-pronunciation)] sm:pb-3 sm:text-base">
              Vivlio!
            </span>
          </div>

          <h2 className="max-w-[18ch] text-[clamp(2rem,10vw,3.45rem)] font-black leading-[0.98] tracking-[-0.04em] text-[var(--color-text)] sm:max-w-none sm:whitespace-nowrap sm:text-[clamp(2.25rem,4vw,3.45rem)] sm:leading-[0.95]">
            Research and Capstone Hub
          </h2>

          <p className="mt-6 text-lg font-semibold text-[var(--color-text-muted)] sm:text-[28px]">
            by DCISM Students, for DCISM Students
          </p>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/home"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--color-brand)] px-8 text-base font-semibold text-white transition-colors hover:bg-[color-mix(in_oklch,var(--color-brand),black_12%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              Browse
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Wave decoration */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[32vh]">
        <Image
          src="/landing-waves.svg"
          alt=""
          fill
          priority
          className="object-cover object-bottom"
        />
      </div>
    </main>
  );
}
