"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type RecommendationsPreviewProps = {
  recommendations: string;
};

export function RecommendationsPreview({
  recommendations,
}: RecommendationsPreviewProps) {
  return (
    <div className="mt-2 max-w-7xl">
      <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-[var(--color-text-muted)]">
        {recommendations}
      </p>

      <Dialog>
        <DialogTrigger className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)]">
          View full recommendations
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4">
            <path
              d="m4 6 4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </DialogTrigger>

        <DialogContent className="max-h-[82vh] max-w-3xl border border-[var(--color-separator)] bg-[var(--color-surface)] text-[var(--color-text)] sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-[var(--color-text)]">
              Recommendations
            </DialogTitle>
            <DialogDescription className="sr-only">
              Full thesis recommendations
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[calc(82vh-6rem)] overflow-y-auto pr-2">
            <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--color-text-muted)]">
              {recommendations}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
