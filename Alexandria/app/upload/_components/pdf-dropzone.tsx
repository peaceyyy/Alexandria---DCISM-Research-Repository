"use client";

import { useRef, useState, type DragEvent } from "react";
import { Upload, FileText, X, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfDropzoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function PdfDropzone({ file, onChange, error }: PdfDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(f: File | null) {
    if (!f) return;
    onChange(f);
  }

  function onDragOver(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function onDrop(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0] ?? null;
    handleFile(dropped);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    handleFile(picked);
    e.target.value = "";
  }

  if (file) {
    return (
      /* ── File selected ── */
      <div className="flex items-center gap-4 rounded-xl border border-[var(--color-success)]/20 bg-[var(--color-success)]/5 px-5 py-4">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--color-success)]/15 bg-[var(--color-success)]/8">
          <FileText size={18} className="text-[var(--color-success)]" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[var(--color-text)]">{file.name}</p>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{formatBytes(file.size)}</p>
        </div>

        <div className="flex items-center gap-3">
          <CircleCheck size={16} className="text-[var(--color-success)]" aria-hidden />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-danger)]"
            aria-label="Remove file"
          >
            <X size={16} aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Drop zone ── */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 transition-all duration-200",
          isDragging
            ? "border-[var(--color-brand-bright)]/50 bg-[var(--color-brand-bright)]/4"
            : error
              ? "border-[var(--color-danger)]/30 bg-[var(--color-danger)]/3"
              : "border-[var(--color-separator)] bg-transparent hover:border-[var(--color-separator-mid)] hover:bg-[var(--color-surface-alt)]",
        )}
      >
        {/* Upload icon circle */}
        <div
          className={cn(
            "mb-5 flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-200",
            isDragging
              ? "border-[var(--color-brand-bright)]/35 bg-[var(--color-brand-bright)]/8"
              : error
                ? "border-[var(--color-danger)]/25 bg-[var(--color-danger)]/5"
                : "border-[var(--color-separator)] bg-transparent group-hover:border-[var(--color-separator-mid)]",
          )}
        >
          <Upload
            size={20}
            aria-hidden
            className={cn(
              "transition-colors duration-200",
              isDragging
                ? "text-[var(--color-brand-bright)]"
                : error
                  ? "text-[var(--color-danger)]/50"
                  : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]",
            )}
          />
        </div>

        <p
          className={cn(
            "text-sm font-medium",
            isDragging ? "text-[var(--color-brand-bright)]" : "text-[var(--color-text)]",
          )}
        >
          {isDragging ? "Drop to upload" : "Drop your PDF here"}
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">or click to browse</p>
        <p className="mt-4 text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] opacity-75">
          PDF only · Max 10 MiB
        </p>
      </button>

      {error && (
        <p role="alert" className="text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={onInputChange}
        aria-label="Upload PDF file"
      />
    </>
  );
}
