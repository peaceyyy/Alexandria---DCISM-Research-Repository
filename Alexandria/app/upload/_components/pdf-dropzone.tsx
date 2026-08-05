"use client";

import { useRef, useState, type DragEvent } from "react";
import { Upload, FileText, CircleCheck } from "lucide-react";
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

  function handleFile(nextFile: File | null) {
    if (!nextFile) return;
    onChange(nextFile);
  }

  function onDragOver(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0] ?? null);
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0] ?? null);
    event.target.value = "";
  }

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept=".pdf,application/pdf"
      className="sr-only"
      onChange={onInputChange}
      aria-label="Choose thesis PDF"
    />
  );

  if (file) {
    return (
      <>
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-success)]/20 bg-[var(--color-success)]/5 p-4 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--color-success)]/15 bg-[var(--color-success)]/8">
            <FileText size={18} className="text-[var(--color-success)]" aria-hidden />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CircleCheck size={16} className="flex-shrink-0 text-[var(--color-success)]" aria-hidden />
              <p className="truncate text-sm font-medium text-[var(--color-text)]">{file.name}</p>
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">PDF attached · {formatBytes(file.size)}</p>
          </div>

          <div className="flex items-center gap-2 sm:flex-shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-9 items-center rounded-md border border-[var(--color-separator-mid)] px-3 text-xs font-medium text-[var(--color-text-muted)] transition-[border-color,background-color,color] duration-150 hover:border-[var(--color-separator-strong)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/35 motion-reduce:transition-none"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex h-9 items-center rounded-md px-3 text-xs font-medium text-[var(--color-text-muted)] transition-[background-color,color] duration-150 hover:bg-[var(--color-danger)]/8 hover:text-[var(--color-danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]/25 motion-reduce:transition-none"
            >
              Remove
            </button>
          </div>
        </div>
        {fileInput}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        aria-describedby="pdf-upload-requirements"
        aria-invalid={Boolean(error)}
        className={cn(
          "group flex min-h-52 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-10 text-center outline-none transition-[border-color,background-color,box-shadow] duration-150 focus-visible:border-[var(--color-brand)]/60 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/25 motion-reduce:transition-none",
          isDragging
            ? "border-[var(--color-brand-bright)]/50 bg-[var(--color-brand-bright)]/4"
            : error
              ? "border-[var(--color-danger)]/30 bg-[var(--color-danger)]/3"
              : "border-[var(--color-separator)] bg-transparent hover:border-[var(--color-separator-mid)] hover:bg-[var(--color-surface-alt)]",
        )}
      >
        <div
          className={cn(
            "mb-4 flex h-12 w-12 items-center justify-center rounded-full border transition-[border-color,background-color] duration-150 motion-reduce:transition-none",
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
              "transition-colors duration-150 motion-reduce:transition-none",
              isDragging
                ? "text-[var(--color-brand-bright)]"
                : error
                  ? "text-[var(--color-danger)]/50"
                  : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]",
            )}
          />
        </div>

        <p className={cn("text-sm font-medium", isDragging ? "text-[var(--color-brand-bright)]" : "text-[var(--color-text)]")}>
          {isDragging ? "Drop to upload" : "Drop your PDF here"}
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">Drag a file here, or browse from your device.</p>
        <p id="pdf-upload-requirements" className="mt-4 text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] opacity-75">
          PDF only · Maximum 10 MiB
        </p>
      </button>

      {error && (
        <p role="alert" className="mt-2 text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}

      {fileInput}
    </>
  );
}
