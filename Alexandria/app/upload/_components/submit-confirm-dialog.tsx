"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Send } from "lucide-react";

interface SubmitConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  error?: string | null;
}

export function SubmitConfirmDialog({
  open,
  onCancel,
  onConfirm,
  isSubmitting,
  error,
}: SubmitConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen && !isSubmitting) onCancel(); }}>
      <DialogContent
        showCloseButton={false}
        className="border-[var(--color-separator)] bg-[var(--color-surface)] text-[var(--color-text)] sm:max-w-sm"
      >
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2 text-[var(--color-brand-bright)]">
            <Send size={14} aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              Ready to Submit
            </span>
          </div>
          <DialogTitle className="text-base font-semibold text-[var(--color-text)]">
            Submit your thesis for review?
          </DialogTitle>
          <DialogDescription className="text-[var(--color-text-muted)]">
            Your submission will be sent to the Alexandria team. You will be notified once it has
            been reviewed — either approved or flagged with feedback.
          </DialogDescription>
        </DialogHeader>

        {/* Submission error */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/5 px-3 py-2.5">
            <AlertCircle size={13} className="mt-0.5 flex-shrink-0 text-[var(--color-danger)]" aria-hidden />
            <p className="text-xs leading-relaxed text-[var(--color-danger)]">{error}</p>
          </div>
        )}

        {isSubmitting && (
          <div
            className="grid gap-2 rounded-lg border border-[var(--color-brand-bright)]/20 bg-[var(--color-brand-bright)]/5 px-3 py-2.5"
            role="progressbar"
            aria-label="Submitting thesis PDF"
            aria-valuetext="Uploading the PDF and submitting the thesis for review"
          >
            <div className="h-1 overflow-hidden rounded-full bg-[var(--color-brand-bright)]/15">
              <div className="h-full w-2/5 animate-pulse rounded-full bg-[var(--color-brand-bright)]" />
            </div>
            <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
              Uploading your PDF and creating the submission. Keep this window open.
            </p>
          </div>
        )}

        <DialogFooter className="border-t border-[var(--color-separator)] bg-transparent">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
            className="border border-[var(--color-separator)] text-[var(--color-text-muted)] hover:border-[var(--color-separator-mid)] hover:text-[var(--color-text)]"
          >
            Review again
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-bright)]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Submitting…
              </span>
            ) : (
              "Submit Thesis"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
