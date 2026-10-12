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

export function DemoExitWarningDialog({
  open,
  onStay,
  onLeave,
}: {
  open: boolean;
  onStay: () => void;
  onLeave: () => void;
}) {
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
              Leave presentation demo
            </span>
          </div>
          <DialogTitle className="text-base font-semibold text-[var(--color-text)]">
            Discard this walkthrough?
          </DialogTitle>
          <DialogDescription className="text-[var(--color-text-muted)]">
            Your changes exist only in this browser. Leaving the demo discards them and does not affect Alexandria records.
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
            Exit demo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
