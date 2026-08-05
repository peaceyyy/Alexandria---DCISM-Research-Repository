"use client";

import { ImagePlus } from "lucide-react";
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
      description="Add the required thesis PDF first. A teaser is optional, but helps your work read clearly in the repository."
    >
      <section aria-labelledby="thesis-pdf-heading">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <div>
            <h3 id="thesis-pdf-heading" className="text-sm font-semibold text-[var(--color-text)]">Thesis PDF</h3>
            <p className="mt-1 text-sm leading-5 text-[var(--color-text-muted)]">One PDF is required before you can send the submission.</p>
          </div>
          <span className="flex-shrink-0 text-xs font-semibold text-[var(--color-brand)]">Required</span>
        </div>
        <PdfDropzone file={file} onChange={onChange} error={error} />
      </section>

      <section aria-labelledby="teaser-heading" className="mt-6 border-t border-[var(--color-separator)] pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h3 id="teaser-heading" className="text-sm font-semibold text-[var(--color-text)]">Repository teaser</h3>
            <p className="mt-1 text-sm leading-5 text-[var(--color-text-muted)]">A visual preview for the repository. JPEG, PNG, or WebP; maximum 5 MiB.</p>
          </div>
          <span className="flex-shrink-0 text-xs font-medium text-[var(--color-text-muted)]">Optional</span>
        </div>

        {teaser ? (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[var(--color-separator)] bg-[var(--color-surface-alt)] p-3 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--color-separator)] bg-[var(--color-surface)]">
              <ImagePlus size={17} className="text-[var(--color-text-muted)]" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--color-text)]">{teaser.name}</p>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">Thumbnail attached · {(teaser.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <button
              type="button"
              onClick={() => onTeaserChange(null)}
              className="inline-flex h-9 items-center justify-center self-start rounded-md px-3 text-xs font-medium text-[var(--color-text-muted)] transition-[background-color,color] duration-150 hover:bg-[var(--color-danger)]/8 hover:text-[var(--color-danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]/25 motion-reduce:transition-none sm:ml-auto sm:self-auto"
            >
              Remove
            </button>
          </div>
        ) : (
          <label className="mt-4 flex min-h-20 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-separator-mid)] px-4 py-4 text-sm font-medium text-[var(--color-text-muted)] outline-none transition-[border-color,background-color,color] duration-150 hover:border-[var(--color-separator-strong)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] focus-within:border-[var(--color-brand)]/60 focus-within:bg-[var(--color-surface-alt)] focus-within:ring-2 focus-within:ring-[var(--color-brand-bright)]/20 motion-reduce:transition-none">
            <ImagePlus size={16} aria-hidden />
            Add optional teaser image
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
