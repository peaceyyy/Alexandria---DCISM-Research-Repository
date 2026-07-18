"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: readonly { id: number; label: string }[];
  currentStep: number;
  errorSteps?: number[];
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, errorSteps = [], onStepClick }: StepperProps) {
  return (
    <nav aria-label="Submission progress" className="flex items-start justify-center py-5">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const hasError = errorSteps.includes(step.id);

        return (
          <div key={step.id} className="flex items-start">
            {/* Node + label */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                disabled={!onStepClick}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Step ${step.id}: ${step.label}${isCompleted ? " — completed" : ""}`}
                className={cn(
                  "relative flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold transition-all duration-300",
                  isCompleted && !hasError
                    ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                    : isCurrent
                      ? "border-[var(--color-brand-bright)] bg-[var(--color-brand-bright)]/10 text-[var(--color-brand-bright)]"
                      : "border-[var(--color-separator-mid)] bg-transparent text-[var(--color-text-muted)] opacity-50",
                  hasError && "border-[var(--color-danger)] bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
                  onStepClick && (isCompleted || hasError) ? "cursor-pointer hover:opacity-75" : "cursor-default",
                )}
              >
                {isCompleted && !hasError ? (
                  <Check size={11} strokeWidth={3} />
                ) : (
                  step.id
                )}
                {/* Active ring — soft, not jarring */}
                {isCurrent && (
                  <span className="absolute inset-[-3px] animate-ping rounded-full border border-[var(--color-brand-bright)]/30" />
                )}
              </button>

              {/* Label */}
              <span
                className={cn(
                  "mt-1.5 whitespace-nowrap text-[9px] font-semibold uppercase tracking-widest transition-colors duration-200",
                  isCurrent
                    ? "text-[var(--color-brand-bright)]"
                    : isCompleted
                      ? "text-[var(--color-text-muted)]"
                      : "text-[var(--color-text-muted)] opacity-30",
                  hasError && "text-[var(--color-danger)]",
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line — animated fill */}
            {index < steps.length - 1 && (
              <div className="relative mx-1 mt-3 h-px w-8 flex-shrink-0 overflow-hidden rounded-full bg-[var(--color-separator-mid)] sm:w-10">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full bg-[var(--color-brand)] transition-all duration-500",
                    step.id < currentStep ? "w-full" : "w-0",
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
