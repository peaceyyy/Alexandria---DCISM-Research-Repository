"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: readonly { id: number; label: string }[];
  currentStep: number;
  errorSteps?: number[];
  onStepClick?: (step: number) => void;
}

export function Stepper({
  steps,
  currentStep,
  errorSteps = [],
  onStepClick,
}: StepperProps) {
  const activeLabel = steps.find((step) => step.id === currentStep)?.label;

  return (
    <div className="py-5">
      {/*
        Every node is reachable at any time, so none of them may be styled as
        "inactive" with an opacity multiplier: opacity is applied to a live
        control, and the result (1.5:1) is unreadable. State is carried by
        fill and hue instead, and every value here clears WCAG AA in both
        themes. See --color-border-interactive in globals.css.

        Below `sm` the labels are dropped and the connectors shrink to 8px so
        all seven nodes measure ~272px and fit a 320px viewport without
        widening the page (SC 1.4.10 Reflow); the active step is named once
        beneath the row instead. The scroll container is the fallback for
        large text-zoom, where its scrollbar is the visible affordance.

        `w-max mx-auto` on the inner row rather than `justify-center` on the
        scroller: a centred flex row cannot be scrolled back to its first
        item once it overflows.
      */}
      <nav
        aria-label="Submission progress"
        className="overflow-x-auto px-1"
      >
        <div className="mx-auto flex w-max items-start">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const hasError = errorSteps.includes(step.id);
          const canNavigate = Boolean(onStepClick);

          return (
            <div key={step.id} className="flex items-start">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => canNavigate && onStepClick?.(step.id)}
                  disabled={!canNavigate}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Step ${step.id} of ${steps.length}: ${step.label}${
                    hasError
                      ? " — needs attention"
                      : isCompleted
                        ? " — completed"
                        : ""
                  }`}
                  className={cn(
                    "relative flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold transition-[color,border-color,background-color,box-shadow] duration-200 motion-reduce:transition-none",
                    isCompleted && !hasError
                      ? "border-[var(--color-brand-bright)] bg-[var(--color-brand)] text-white"
                      : isCurrent
                        ? // No tint behind the current number: a 10% brand wash
                          // lifted the node's background just enough to drop the
                          // glyph to 4.28:1. Border + ring + label already mark
                          // this step, so the fill is the cheapest thing to cut.
                          "border-[var(--color-brand-text)] bg-transparent text-[var(--color-brand-text)]"
                        : "border-[var(--color-border-interactive)] bg-transparent text-[var(--color-text-muted)]",
                    hasError &&
                      "border-[var(--color-danger-text)] bg-[var(--color-danger)]/10 text-[var(--color-danger-text)]",
                    canNavigate
                      ? "cursor-pointer hover:border-[var(--color-brand-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
                      : "cursor-default",
                  )}
                >
                  {/*
                    Hit area only. Grows the 24px node to 24x44 without
                    touching layout. Vertical is the only free direction —
                    widening horizontally would overlap the neighbouring node
                    at 320px. 24x24 already satisfies SC 2.5.8 (AA); this is
                    headroom toward the house 44px rule in DESIGN.md.
                  */}
                  <span
                    aria-hidden
                    className="absolute -inset-y-[11px] inset-x-0"
                  />
                  {isCompleted && !hasError ? (
                    <Check size={11} strokeWidth={3} />
                  ) : (
                    step.id
                  )}
                  {/* A soft motion cue keeps the active step easy to locate without competing with the form. */}
                  {isCurrent && (
                    <span className="pointer-events-none absolute inset-[-3px] rounded-full border border-[var(--color-brand-bright)]/30 motion-safe:animate-ping motion-reduce:hidden" />
                  )}
                </button>

                {/* Label — desktop only; the mobile row names its active step below. */}
                <span
                  className={cn(
                    "mt-1.5 hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest transition-colors duration-200 motion-reduce:transition-none sm:block",
                    isCurrent
                      ? "text-[var(--color-brand-text)]"
                      : "text-[var(--color-text-muted)]",
                    hasError && "text-[var(--color-danger-text)]",
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector — decorative; the nodes already carry completion state. */}
              {index < steps.length - 1 && (
                <div className="relative mx-1 mt-3 h-px w-2 flex-shrink-0 overflow-hidden rounded-full bg-[var(--color-separator-mid)] sm:w-10">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full bg-[var(--color-brand)] transition-[width] duration-300 motion-reduce:transition-none",
                      step.id < currentStep ? "w-full" : "w-0",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
        </div>
      </nav>

      {/* Mobile-only counterpart to the hidden labels. */}
      <p
        aria-hidden
        className="mt-2 text-center text-[11px] font-semibold uppercase tracking-widest text-[var(--color-brand-text)] sm:hidden"
      >
        {activeLabel}
      </p>
    </div>
  );
}
