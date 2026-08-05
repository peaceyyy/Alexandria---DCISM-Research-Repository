"use client";

import { useState } from "react";
import { Edit3, FileText, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
 * A focused, draft-based editor for long-form thesis fields. The dialog shell
 * owns modal semantics, focus containment, Escape, and backdrop behavior;
 * this component owns the draft and save/discard consequences.
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
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "group relative w-full rounded-lg border bg-[var(--color-surface)] px-4 py-3.5 text-left transition-[border-color,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
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
        <span className="absolute right-3.5 top-3.5 opacity-0 transition-opacity group-hover:opacity-50 group-focus-visible:opacity-50">
          <Edit3 size={13} className="text-[var(--color-text-muted)]" aria-hidden />
        </span>
      </button>

      {error && !open && (
        <p role="alert" className="mt-1 text-xs text-[var(--color-danger)]">
          {error}
        </p>
      )}

      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleDiscard()}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[calc(100dvh-2rem)] gap-0 overflow-hidden border-[var(--color-separator)] bg-[var(--color-surface)] p-0 text-[var(--color-text)] sm:max-w-2xl"
        >
          <DialogHeader className="border-b border-[var(--color-separator)] px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[var(--color-brand-bright)]" aria-hidden />
                <DialogTitle className="text-sm font-semibold text-[var(--color-text)]">
                  {label}
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2">
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleDiscard}
                  aria-label="Discard and close editor"
                  className="text-[var(--color-placeholder)] hover:text-[var(--color-text)]"
                >
                  <X aria-hidden />
                </Button>
              </div>
            </div>
            <DialogDescription className="sr-only">
              Edit the {label.toLowerCase()} before saving it to the submission form.
            </DialogDescription>
          </DialogHeader>

          {hint && (
            <div className="border-b border-[var(--color-separator)] bg-[var(--color-brand)]/5 px-5 py-2.5">
              <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">{hint}</p>
            </div>
          )}

          <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
            <textarea
              autoFocus
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={placeholder}
              rows={16}
              aria-invalid={Boolean(error)}
              className="min-h-72 w-full resize-y rounded-lg border border-[var(--color-separator-mid)] bg-[var(--color-surface-alt)] px-4 py-3 text-[15px] leading-7 text-[var(--color-text)] outline-none transition-[border-color,box-shadow,background-color] duration-150 placeholder-[var(--color-placeholder)] focus:border-[var(--color-brand)]/60 focus:bg-[var(--color-surface)] focus:ring-2 focus:ring-[var(--color-brand-bright)]/20 motion-reduce:transition-none"
            />
          </div>

          <DialogFooter className="mx-0 mb-0 border-[var(--color-separator)] bg-transparent">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDiscard}
              className="border border-[var(--color-separator)] text-[var(--color-text-muted)] hover:border-[var(--color-separator-mid)] hover:text-[var(--color-text)]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!meetsMin}
              className="bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-bright)]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
