"use client";

import { useTransition } from "react";
import { Popover } from "@base-ui/react/popover";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type SubmissionStatusFilterValue = "all" | "for_review" | "flagged" | "accepted";

export const SUBMISSION_STATUS_OPTIONS: ReadonlyArray<{
  value: SubmissionStatusFilterValue;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "for_review", label: "Under review" },
  { value: "flagged", label: "Needs revision" },
  { value: "accepted", label: "Published" },
];

export function getSubmissionStatusValue(value: string | null): SubmissionStatusFilterValue {
  return SUBMISSION_STATUS_OPTIONS.some((option) => option.value === value)
    ? value as SubmissionStatusFilterValue
    : "all";
}

export function getSubmissionStatusLabel(value: string | null) {
  const status = getSubmissionStatusValue(value);
  return SUBMISSION_STATUS_OPTIONS.find((option) => option.value === status)!.label;
}

/** URL-backed owner workflow filter. It intentionally excludes the admin-only trashed state. */
export function SubmissionStatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const selectedStatus = getSubmissionStatusValue(searchParams.get("status"));

  const updateStatus = (status: SubmissionStatusFilterValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") params.delete("status");
    else params.set("status", status);
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  return (
    <Popover.Root>
      <Popover.Trigger className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-[var(--color-separator)] bg-[var(--color-surface)] px-3 text-[13px] transition-colors hover:border-[var(--color-separator-mid)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/40 sm:min-h-9">
        <span className="font-medium text-[var(--color-text-muted)]">Status</span>
        <span className="font-semibold text-[var(--color-text)]">{getSubmissionStatusLabel(selectedStatus)}</span>
        <ChevronDown size={14} className="text-[var(--color-text-muted)]" aria-hidden />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} collisionAvoidance={{ side: "flip", align: "shift", fallbackAxisSide: "none" }}>
          <Popover.Popup className="z-[60] w-[min(16rem,calc(100vw-2rem))] rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-surface)] p-2 text-[var(--color-text)] shadow-lg outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95">
            <div role="radiogroup" aria-label="Submission status" className="grid gap-1">
              {SUBMISSION_STATUS_OPTIONS.map((option) => {
                const selected = option.value === selectedStatus;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => updateStatus(option.value)}
                    className={`flex min-h-11 cursor-pointer items-center justify-between rounded px-2 text-left text-[13px] transition-colors hover:bg-[var(--color-text)]/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/40 sm:min-h-9 ${
                      selected ? "bg-[var(--color-text)]/[0.05] font-medium text-[var(--color-text)]" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {option.label}
                    {selected && <Check size={14} aria-hidden />}
                  </button>
                );
              })}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
      <span aria-live="polite" className="sr-only">{isPending ? "Updating submissions…" : ""}</span>
      {isPending && <Loader2 className="ml-2 inline size-4 animate-spin text-[var(--color-text-muted)]" aria-hidden />}
    </Popover.Root>
  );
}
