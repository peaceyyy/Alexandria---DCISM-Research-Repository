"use client";

import { ImagePlus, X } from "lucide-react";
import { StepWrapper } from "./_helpers";
import { PdfDropzone } from "@/app/upload/_components/pdf-dropzone";

interface StepUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  teaser: File | null;
  onTeaserChange: (file: File | null) => void;
  teaserError?: string;
}

export function StepUpload({
  file,
  onChange,
  error,
  teaser,
  onTeaserChange,
  teaserError,
}: StepUploadProps) {
  return (
    <StepWrapper
      title="Submission materials"
      description="Attach the required paper PDF and, if you have one, an optional repository teaser."
    >
      <PdfDropzone file={file} onChange={onChange} error={error} />
      <section className="mt-5 rounded-xl border border-[var(--color-separator)] bg-[var(--color-surface-alt)] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Teaser thumbnail <span className="font-normal text-[var(--color-text-muted)]">(optional)</span></h3>
            <p className="mt-1 text-sm leading-5 text-[var(--color-text-muted)]">A visual preview for the repository. JPEG, PNG, or WebP; up to 5 MiB.</p>
          </div>
          {teaser && (
            <button
              type="button"
              onClick={() => onTeaserChange(null)}
              className="rounded p-1 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
              aria-label={`Remove teaser thumbnail ${teaser.name}`}
            >
              <X size={16} aria-hidden />
            </button>
          )}
        </div>
        {teaser ? (
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-[var(--color-separator-mid)] bg-[var(--color-surface)] p-3">
            <ImagePlus size={17} className="text-[var(--color-brand-bright)]" aria-hidden />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--color-text)]">{teaser.name}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{(teaser.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
        ) : (
          <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-separator-mid)] px-3 py-5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-brand-bright)]/50 hover:text-[var(--color-text)]">
            <ImagePlus size={16} aria-hidden />
            Choose teaser image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => onTeaserChange(event.target.files?.[0] ?? null)}
            />
          </label>
        )}
        {teaserError && <p className="mt-2 text-sm text-[var(--color-danger)]" role="alert">{teaserError}</p>}
      </section>
    </StepWrapper>
  );
}
