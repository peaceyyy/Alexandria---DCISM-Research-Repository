"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reads ?submitted=1 from the URL and shows a premium floating toast.
 * Auto-dismisses after 5 seconds with a smooth animation.
 */
export function SubmissionBanner() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const kind =
    params.get("published") === "1"
      ? "published"
      : params.get("resubmitted") === "1"
        ? "resubmitted"
        : params.get("submitted") === "1"
          ? "submitted"
          : null;

  const dismiss = useCallback(() => {
    const nextParams = new URLSearchParams(params.toString());
    nextParams.delete("submitted");
    nextParams.delete("resubmitted");
    nextParams.delete("published");
    router.replace(
      nextParams.size ? `${pathname}?${nextParams.toString()}` : pathname,
      { scroll: false },
    );
  }, [params, pathname, router]);

  if (!kind) return null;

  return <SubmissionToast key={kind} kind={kind} onDismiss={dismiss} />;
}

function SubmissionToast({
  kind,
  onDismiss,
}: {
  kind: "submitted" | "resubmitted" | "published";
  onDismiss: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsExiting(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isExiting) return;
    const timer = setTimeout(onDismiss, 300);
    return () => clearTimeout(timer);
  }, [isExiting, onDismiss]);

  const isResubmitted = kind === "resubmitted";
  const isPublished = kind === "published";

  return (
    <div
      className={cn(
        "fixed z-50 flex pointer-events-none px-4",
        isResubmitted
          ? "bottom-5 right-0 justify-end"
          : "left-0 right-0 top-24 justify-center",
      )}
    >
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-auto flex items-center gap-3 overflow-hidden border border-[var(--color-success)]/25 bg-[var(--color-surface-alt)] py-2.5 pl-3 pr-4 text-sm shadow-2xl shadow-[var(--color-success)]/10 transition-all",
          isResubmitted ? "w-full max-w-sm rounded-md" : "rounded-full",
          isExiting
            ? "animate-out fade-out duration-300 fill-mode-forwards"
            : "animate-in fade-in zoom-in-95 duration-500 ease-out",
          isResubmitted &&
            (isExiting ? "slide-out-to-right-4" : "slide-in-from-right-4"),
          !isResubmitted &&
            (isExiting ? "slide-out-to-top-4" : "slide-in-from-top-4"),
        )}
      >
        {/* Icon wrapper */}
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-success)]/10">
          <CheckCircle2
            size={16}
            className="text-[var(--color-success)]"
            aria-hidden
          />
        </div>

        {/* Messaging */}
        <p className="text-[var(--color-text)] opacity-90">
          <span className="font-semibold text-[var(--color-text)]">
            {isPublished
              ? "Thesis published!"
              : isResubmitted
                ? "Submitted for review."
                : "Thesis submitted!"}
          </span>{" "}
          <span className="text-[var(--color-text-muted)] opacity-80">
            {isPublished
              ? "This staff record is now visible in the repository."
              : isResubmitted
                ? "Editing is locked until it is flagged again."
                : "Pending moderator review."}
          </span>
        </p>

        {/* Divider */}
        <div className="ml-2 h-4 w-px bg-[var(--color-separator-mid)]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsExiting(true)}
          aria-label="Dismiss"
          className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-text-muted)] opacity-80 transition-colors hover:bg-[var(--color-text)]/10 hover:text-[var(--color-text)]"
        >
          <X size={14} aria-hidden />
        </button>
      </div>
    </div>
  );
}
