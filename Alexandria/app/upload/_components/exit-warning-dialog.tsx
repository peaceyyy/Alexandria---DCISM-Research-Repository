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
import { TriangleAlert } from "lucide-react";

interface ExitWarningDialogProps {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export function ExitWarningDialog({ open, onStay, onLeave }: ExitWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onStay(); }}>
      <DialogContent
        showCloseButton={false}
        className="border-[var(--color-separator)] bg-[var(--color-surface)] text-[var(--color-text)] sm:max-w-sm"
      >
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2 text-[var(--color-danger)]">
            <TriangleAlert size={15} aria-hidden />
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              Unsaved Changes
            </span>
          </div>
          <DialogTitle className="text-base font-semibold text-[var(--color-text)]">
            Leave the submission form?
          </DialogTitle>
          <DialogDescription className="text-[var(--color-text-muted)]">
            Your progress will be lost. This action cannot be undone — you will need to start
            the form again from scratch.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="border-t border-[var(--color-separator)] bg-transparent">
          <Button
            variant="ghost"
            onClick={onStay}
            className="border border-[var(--color-separator)] text-[var(--color-text-muted)] hover:border-[var(--color-separator-mid)] hover:text-[var(--color-text)]"
          >
            Stay on page
          </Button>
          <Button
            onClick={onLeave}
            className="bg-[var(--color-danger)]/15 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/25"
          >
            Leave anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
