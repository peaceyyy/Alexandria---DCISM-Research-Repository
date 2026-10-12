import Link from "next/link";
import { ArrowRight, BookOpen, Layers } from "lucide-react";

const templates = [
  {
    href: "/admin/demo/thesis",
    eyebrow: "Thesis",
    icon: BookOpen,
    title: "Walk through a sample thesis",
    description:
      "Explore fictional research metadata, people, insights, and a simulated PDF attachment.",
  },
  {
    href: "/admin/demo/capstone",
    eyebrow: "Capstone",
    icon: Layers,
    title: "Walk through a sample capstone",
    description:
      "Explore fictional project metadata, a deployment example, and a simulated PDF attachment.",
  },
];

export default function PresentationDemoPage() {
  return (
    <main className="flex min-h-full flex-1 items-center px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-4xl space-y-10 sm:space-y-12">
        <header className="max-w-2xl space-y-3">
          <h1 className="text-2xl font-semibold tracking-normal text-[var(--color-text)] sm:text-3xl">
            Choose a walkthrough
          </h1>
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
            Present Alexandria with a complete, fictional submission flow. Changes stay
            in this browser and are never saved, submitted, or published.
          </p>
        </header>

        <section aria-labelledby="walkthrough-options">
          <h2 id="walkthrough-options" className="sr-only">
            Available walkthroughs
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {templates.map((template) => {
              const Icon = template.icon;
              return (
                <Link
                  key={template.href}
                  href={template.href}
                  className="group flex min-h-[230px] flex-col justify-between rounded-xl border border-[var(--color-border-interactive)]/40 bg-[var(--color-surface)] p-7 transition-all duration-150 hover:border-[var(--color-brand)]/70 hover:bg-[var(--color-surface-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] motion-reduce:transition-none sm:p-8"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-bg)] text-[var(--color-text-muted)] transition-colors group-hover:border-[var(--color-brand)]/40 group-hover:text-[var(--color-brand-text)]">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-medium tracking-wide text-[var(--color-text-muted)]">
                        {template.eyebrow}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-[var(--color-text)] sm:text-xl">
                      {template.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {template.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-2 pt-1 text-sm font-medium text-[var(--color-brand-text)] transition-colors group-hover:text-[var(--color-brand-bright)]">
                    <span>Start walkthrough</span>
                    <ArrowRight
                      className="size-4 transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transform-none"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
