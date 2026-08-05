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

type StaffSampleConfirmDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function StaffSampleConfirmDialog({
  open,
  onCancel,
  onConfirm,
}: StaffSampleConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="border-[var(--color-separator)] bg-[var(--color-surface)] text-[var(--color-text)] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Replace current fields?</DialogTitle>
          <DialogDescription className="text-[var(--color-text-muted)]">
            This staff tool replaces the current metadata with sample fields. It does not add a PDF or bypass submission checks.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="border-t border-[var(--color-separator)] bg-transparent">
          <Button variant="ghost" onClick={onCancel} className="border border-[var(--color-separator)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
            Keep editing
          </Button>
          <Button onClick={onConfirm}>Load sample fields</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
