"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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
    <ConfirmDialog
      open={open}
      title="Replace current fields?"
      description="This staff tool replaces the current metadata with sample fields. It does not add a PDF or bypass submission checks."
      cancelLabel="Keep editing"
      confirmLabel="Load sample fields"
      confirmIntent="default"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
