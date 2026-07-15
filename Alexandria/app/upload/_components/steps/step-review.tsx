"use client";

import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { ArrowRight, CircleAlert, FileText, CircleCheck } from "lucide-react";
import { type FormValues, FIELD_STEP_MAP, STEPS } from "@/lib/upload/schema";
import { getResearchAreaLabel } from "@/lib/domain/research-areas";
import { cn } from "@/lib/utils";

interface StepReviewProps {
  onGoToStep: (step: number) => void;
  selectedFile: File | null;
  onOpenSubmit: () => void;
}

// ─── Small read-only summary row ──────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">{label}</p>
      <p className={cn("text-sm leading-relaxed", value ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)] opacity-50 italic")}>
        {value || "—"}
      </p>
    </div>
  );
}

function SummaryChips({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">{label}</p>
      {items.length === 0 ? (
        <p className="text-sm italic text-[var(--color-text-muted)] opacity-50">—</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[var(--color-separator)] bg-[var(--color-text)]/5 px-2.5 py-0.5 text-xs text-[var(--color-text-muted)]"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryBullets({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">{label}</p>
      {items.length === 0 ? (
        <p className="text-sm italic text-[var(--color-text-muted)] opacity-50">—</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
              <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-brand-bright)]/40" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Step section wrapper ─────────────────────────────────────────────────────

function ReviewSection({
  stepId,
  stepLabel,
  hasError,
  onFix,
  children,
}: {
  stepId: number;
  stepLabel: string;
  hasError: boolean;
  onFix: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 space-y-4 transition-colors",
        hasError
          ? "border-[var(--color-danger)]/25 bg-[var(--color-danger)]/5"
          : "border-[var(--color-separator)] bg-[var(--color-surface-alt)]",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasError ? (
            <CircleAlert size={14} className="text-[var(--color-danger)]" aria-hidden />
          ) : (
            <CircleCheck size={14} className="text-[#59c987]" aria-hidden />
          )}
          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              hasError ? "text-[var(--color-danger)]" : "text-[var(--color-text-muted)]",
            )}
          >
            Step {stepId} · {stepLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={onFix}
          className="flex items-center gap-1 text-[10px] font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand-bright)]"
        >
          {hasError ? "Fix" : "Edit"}
          <ArrowRight size={11} aria-hidden />
        </button>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// ─── Main review step ─────────────────────────────────────────────────────────

export function StepReview({
  onGoToStep,
  selectedFile,
  onOpenSubmit,
}: StepReviewProps) {
  const {
    watch,
    trigger,
    formState: { errors },
  } = useFormContext<FormValues>();

  // Run full validation when the review step mounts
  useEffect(() => {
    trigger();
  }, [trigger]);

  const values = watch();

  // Determine which wizard steps have errors
  const errorSteps = useMemo(() => {
    const stepsWithErrors = new Set<number>();
    Object.entries(errors).forEach(([field]) => {
      const step = FIELD_STEP_MAP[field];
      if (step) stepsWithErrors.add(step);
    });
    if (!selectedFile) stepsWithErrors.add(6);
    return stepsWithErrors;
  }, [errors, selectedFile]);

  const hasAnyError = errorSteps.size > 0;
  const authorsList = values.authors.filter((a) => a.contribution_role === "author");
  const advisersList = values.authors.filter((a) => a.contribution_role === "adviser");

  return (
    <div className="mx-auto w-full max-w-[540px] space-y-6 px-4 pb-0 sm:px-0">
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-[var(--color-text)]">Review & Submit</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Check everything carefully. You can click any section to edit it.
        </p>
      </div>

      {/* Error banner */}
      {hasAnyError && (
        <div className="flex items-start gap-3 rounded-xl border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/5 px-4 py-3.5">
          <CircleAlert size={15} className="mt-0.5 flex-shrink-0 text-[var(--color-danger)]" aria-hidden />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--color-danger)]">
              {errorSteps.size} section{errorSteps.size > 1 ? "s need" : " needs"} attention
            </p>
            <p className="text-xs text-[var(--color-danger)] opacity-80">
              Sections marked in red below have missing or invalid fields. Click{" "}
              <span className="font-medium">Fix</span> to go back and correct them.
            </p>
          </div>
        </div>
      )}

      {/* Step 1 — Basics */}
      <ReviewSection
        stepId={1}
        stepLabel={STEPS[0].label}
        hasError={errorSteps.has(1)}
        onFix={() => onGoToStep(1)}
      >
        <SummaryRow label="Study Title" value={values.title} />
        <div className="grid grid-cols-2 gap-4">
          <SummaryRow label="Department" value={values.department} />
          <SummaryRow label="Type of Study" value={values.type_of_study} />
        </div>
        <SummaryRow label="Publication Date" value={values.publication_date} />
      </ReviewSection>

      {/* Step 2 — Publication */}
      <ReviewSection
        stepId={2}
        stepLabel={STEPS[1].label}
        hasError={errorSteps.has(2)}
        onFix={() => onGoToStep(2)}
      >
        <SummaryRow label="Conference" value={values.conference} />
        <SummaryRow label="Publication Link" value={values.publication_link} />
      </ReviewSection>

      {/* Step 3 — People */}
      <ReviewSection
        stepId={3}
        stepLabel={STEPS[2].label}
        hasError={errorSteps.has(3)}
        onFix={() => onGoToStep(3)}
      >
        <SummaryChips
          label="Authors"
          items={authorsList.map((a) => a.display_name).filter(Boolean)}
        />
        <SummaryChips
          label="Advisers"
          items={advisersList.map((a) => a.display_name).filter(Boolean)}
        />
      </ReviewSection>

      {/* Step 4 — Content */}
      <ReviewSection
        stepId={4}
        stepLabel={STEPS[3].label}
        hasError={errorSteps.has(4)}
        onFix={() => onGoToStep(4)}
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Abstract
          </p>
          {values.abstract ? (
            <p className="line-clamp-4 text-sm leading-relaxed text-[var(--color-text)]">
              {values.abstract}
            </p>
          ) : (
            <p className="text-sm italic text-[var(--color-text-muted)] opacity-50">—</p>
          )}
        </div>
        <SummaryChips
          label="Research Areas"
          items={values.research_areas.map(getResearchAreaLabel)}
        />
        <SummaryChips
          label="Keywords"
          items={values.tags.map((t) => `#${t}`)}
        />
      </ReviewSection>

      {/* Step 5 — Insights */}
      <ReviewSection
        stepId={5}
        stepLabel={STEPS[4].label}
        hasError={errorSteps.has(5)}
        onFix={() => onGoToStep(5)}
      >
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Recommendations
          </p>
          {values.recommendations ? (
            <p className="line-clamp-4 text-sm leading-relaxed text-[var(--color-text)]">
              {values.recommendations}
            </p>
          ) : (
            <p className="text-sm italic text-[var(--color-text-muted)] opacity-50">—</p>
          )}
        </div>
        <SummaryBullets label="Lessons Learned" items={values.lessons_learned} />
      </ReviewSection>

      {/* Step 6 — Upload */}
      <ReviewSection
        stepId={6}
        stepLabel={STEPS[5].label}
        hasError={errorSteps.has(6)}
        onFix={() => onGoToStep(6)}
      >
        {selectedFile ? (
          <div className="flex items-center gap-3">
            <FileText size={15} className="text-[#59c987]" aria-hidden />
            <div>
              <p className="text-sm text-[var(--color-text)]">{selectedFile.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm italic text-[var(--color-danger)] opacity-70">No PDF uploaded yet.</p>
        )}
      </ReviewSection>
    </div>
  );
}
