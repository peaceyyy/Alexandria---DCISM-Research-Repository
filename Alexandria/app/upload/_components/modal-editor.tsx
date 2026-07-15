"use client";

import { useState, useRef, useEffect } from "react";
import { X, Edit3, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minLength?: number;
  hint?: string;
  error?: string;
}

/**
 * Displays a clickable text preview. On click, opens a full-screen blurred
 * modal with a large textarea for unobstructed editing.
 * Used for Abstract and Recommendations.
 */
export function ModalEditor({
  label,
  value,
  onChange,
  placeholder,
  minLength,
  hint,
  error,
}: ModalEditorProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep draft in sync when the modal is closed
  useEffect(() => {
    if (!open) setDraft(value);
  }, [value, open]);

  // Focus the textarea after the modal animates in
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => textareaRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape key closes and discards
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleDiscard();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleOpen() {
    setDraft(value);
    setOpen(true);
  }

  function handleSave() {
    onChange(draft.trim());
    setOpen(false);
  }

  function handleDiscard() {
    setDraft(value);
    setOpen(false);
  }

  const hasContent = value.trim().length > 0;
  const charCount = draft.length;
  const meetsMin = minLength ? charCount >= minLength : true;
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  return (
    <>
      {/* Preview / trigger card */}
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "group relative w-full rounded-lg border bg-[var(--color-surface)] px-4 py-3.5 text-left transition-all",
          error && !open
            ? "border-[var(--color-danger)]/50"
            : hasContent
              ? "border-[var(--color-separator)] hover:border-[var(--color-separator-mid)]"
              : "border-dashed border-[var(--color-separator)] hover:border-[var(--color-brand-bright)]/40",
        )}
        aria-label={`${hasContent ? "Edit" : "Add"} ${label}`}
      >
        {hasContent ? (
          <div className="space-y-1.5">
            <p className="text-[10px] font-medium text-[var(--color-text-muted)]">
              {wordCount} words ·{" "}
              <span className="text-[var(--color-brand-bright)]">click to edit</span>
            </p>
            <p className="line-clamp-3 text-sm leading-relaxed text-[var(--color-text)]">
              {value}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[var(--color-placeholder)]">
            <Edit3 size={13} aria-hidden />
            <span className="text-sm">Click to write {label.toLowerCase()}…</span>
          </div>
        )}
        {/* Hover edit icon */}
        <span className="absolute right-3.5 top-3.5 opacity-0 transition-opacity group-hover:opacity-50">
          <Edit3 size={13} className="text-[var(--color-text-muted)]" aria-hidden />
        </span>
      </button>

      {error && !open && (
        <p role="alert" className="text-xs text-[var(--color-danger)] mt-1">{error}</p>
      )}

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[var(--color-bg)]/80 backdrop-blur-sm"
            onClick={handleDiscard}
            aria-hidden
          />

          {/* Panel */}
          <div className="relative z-10 flex w-full max-w-2xl flex-col rounded-xl border border-[var(--color-separator)] bg-[var(--color-surface)] shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[var(--color-separator)] px-5 py-4">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[var(--color-brand-bright)]" aria-hidden />
                <span className="text-sm font-semibold text-[var(--color-text)]">{label}</span>
              </div>
              <div className="flex items-center gap-4">
                {minLength && (
                  <span
                    className={cn(
                      "text-xs tabular-nums transition-colors",
                      meetsMin ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]",
                    )}
                  >
                    {charCount} / {minLength}+ chars
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleDiscard}
                  aria-label="Discard and close editor"
                  className="text-[var(--color-placeholder)] transition-colors hover:text-[var(--color-text)]"
                >
                  <X size={15} aria-hidden />
                </button>
              </div>
            </div>

            {/* Hint strip */}
            {hint && (
              <div className="border-b border-[var(--color-separator)] bg-[var(--color-brand)]/5 px-5 py-2.5">
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{hint}</p>
              </div>
            )}

            {/* Textarea */}
            <div className="px-5 py-4" style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={placeholder}
                rows={16}
                className="w-full resize-none bg-transparent text-sm leading-relaxed text-[var(--color-text)] placeholder-[var(--color-placeholder)] outline-none"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-[var(--color-separator)] px-5 py-4">
              <button
                type="button"
                onClick={handleDiscard}
                className="rounded-lg border border-[var(--color-separator)] px-4 py-1.5 text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-separator-mid)] hover:text-[var(--color-text)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!meetsMin}
                className="rounded-lg bg-[var(--color-brand)] px-4 py-1.5 text-sm text-white transition-colors hover:bg-[var(--color-brand-bright)] disabled:cursor-not-allowed disabled:opacity-35"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
