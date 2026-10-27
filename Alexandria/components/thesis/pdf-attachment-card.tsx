import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type PdfAttachmentCardProps = {
  fileName: string;
  detail: string;
  simulated?: boolean;
  className?: string;
};

export function PdfAttachmentCard({
  fileName,
  detail,
  simulated = false,
  className,
}: PdfAttachmentCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-[var(--color-separator)] bg-[var(--color-surface-alt)] p-3",
        className,
      )}
    >
      <div
        aria-hidden
        className="relative flex h-12 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-surface)]"
      >
        <FileText size={18} className="text-[var(--color-brand-bright)]" />
        {simulated && (
          <span className="absolute -bottom-1 -right-3 rotate-[-36deg] bg-[var(--color-brand-bright)] px-3 py-0.5 text-[7px] font-bold tracking-wider text-white">
            SAMPLE
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium text-[var(--color-text)]">
            {fileName}
          </p>
          {simulated && (
            <span className="rounded-full border border-[var(--color-brand-bright)]/35 bg-[var(--color-brand-bright)]/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-[var(--color-brand-bright)]">
              SAMPLE PDF
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-muted)]">
          {detail}
        </p>
        {simulated && (
          <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">
            Not stored or downloadable in presentation mode.
          </p>
        )}
      </div>
    </div>
  );
}
