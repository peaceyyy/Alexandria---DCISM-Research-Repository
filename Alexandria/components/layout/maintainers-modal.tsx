"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const maintainers = [
  "Homer Adriel Dorin",
  "Leira Bengil",
  "Ethan Andre Dalocanog",
  "Dustin Jesse Balansag",
  "Shane Benilde Mansueto",
];

type MaintainersModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

/** A temporary home for the team list until the dedicated maintainers page exists. */
export default function MaintainersModal({ isOpen, onOpenChange }: MaintainersModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] border border-[var(--color-separator-mid)] bg-[var(--color-bg)]">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold">Maintainers</DialogTitle>
          <DialogDescription className="text-sm text-[var(--color-text-muted)]">
            The people currently maintaining Alexandria.
          </DialogDescription>
        </DialogHeader>

        <ul className="divide-y divide-[var(--color-separator)] border-y border-[var(--color-separator)] text-sm text-[var(--color-text)]">
          {maintainers.map((maintainer) => (
            <li key={maintainer} className="py-3 font-medium">
              {maintainer}
            </li>
          ))}
        </ul>

        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          Brought to you by CISCO officers and GDG USC officers.
        </p>
      </DialogContent>
    </Dialog>
  );
}
