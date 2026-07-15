"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEPARTMENTS } from "@/lib/domain/departments";
import {
  parseResearchAreaIds,
  serializeResearchAreaIds,
  type ResearchAreaId,
} from "@/lib/domain/research-areas";
import { ResearchAreaMultiSelect } from "@/components/research/research-area-multi-select";
import type {
  ReviewSubmission,
  StudyType,
  SubmitThesisInput,
} from "@/lib/services/types";

type MetadataDraft = {
  title: string;
  abstract: string;
  department: string;
  studyType: StudyType;
  publicationDate: string;
  publicationLink: string;
  conference: string;
  researchAreaIds: ResearchAreaId[];
  tags: string;
  recommendations: string;
  lessonsLearned: string;
  correctionReason: string;
};

function createDraft(submission: ReviewSubmission): MetadataDraft {
  return {
    title: submission.title,
    abstract: submission.abstract,
    department: submission.department,
    studyType: submission.studyType,
    publicationDate: submission.publicationDate,
    publicationLink: submission.publicationLink ?? "",
    conference: submission.conference ?? "",
    researchAreaIds: parseResearchAreaIds(submission.researchArea),
    tags: submission.tags.join(", "),
    recommendations: submission.recommendations ?? "",
    lessonsLearned: submission.lessonsLearned ?? "",
    correctionReason: "",
  };
}

function toValues(draft: MetadataDraft): Partial<SubmitThesisInput> {
  return {
    title: draft.title.trim(),
    abstract: draft.abstract.trim(),
    department: draft.department.trim(),
    study_type: draft.studyType,
    publication_date: draft.publicationDate,
    publication_link: draft.publicationLink.trim(),
    conference: draft.conference.trim(),
    research_area: serializeResearchAreaIds(draft.researchAreaIds),
    tags: draft.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    recommendations: draft.recommendations.trim(),
    lessons_learned: draft.lessonsLearned.trim(),
  };
}

export function AdminMetadataEditorDialog({
  submission,
  open,
  onOpenChange,
  onSave,
}: {
  submission: ReviewSubmission;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (input: {
    values: Partial<SubmitThesisInput>;
    correctionReason: string;
  }) => Promise<string | null>;
}) {
  const [draft, setDraft] = useState(() => createDraft(submission));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setDraft(createDraft(submission));
      setError(null);
    }
  }, [open, submission]);

  const update = <Key extends keyof MetadataDraft>(
    key: Key,
    value: MetadataDraft[Key],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = toValues(draft);

    if (values.tags?.length === 0) {
      setError("Add at least one tag before saving.");
      return;
    }

    if (!draft.correctionReason.trim()) {
      setError("Add a correction reason for the audit trail.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const saveError = await onSave({
      values,
      correctionReason: draft.correctionReason,
    });
    setIsSubmitting(false);

    if (saveError) {
      setError(saveError);
      return;
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-5xl gap-0 overflow-y-auto border-[var(--color-separator-mid)] bg-[var(--color-surface)] p-0 text-[var(--color-text)] shadow-xl">
        <DialogHeader className="gap-2 border-b border-[var(--color-separator)] px-5 py-5 sm:px-7">
          <DialogTitle className="text-lg font-semibold tracking-tight">Correct Study Metadata</DialogTitle>
          <DialogDescription className="max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
            This correction keeps the study&apos;s current review status. A reason and full before-and-after audit record are required.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-6 px-5 py-6 sm:px-7" onSubmit={handleSubmit}>
          <div className="grid gap-x-6 gap-y-5 lg:grid-cols-6">
            <InputField
              label="Title"
              value={draft.title}
              onChange={(value) => update("title", value)}
              required
              className="lg:col-span-6"
            />
            <label className="grid gap-2 text-sm font-medium text-[var(--color-text)] lg:col-span-2">
              Department
              <select
                value={draft.department}
                onChange={(event) => update("department", event.target.value)}
                className="min-h-11 w-full rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-surface-alt)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors hover:border-[var(--color-separator-mid)] focus:border-[var(--color-brand-bright)]/60"
              >
                {DEPARTMENTS.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-[var(--color-text)] lg:col-span-2">
              Study Type
              <select
                value={draft.studyType}
                onChange={(event) => update("studyType", event.target.value as StudyType)}
                className="min-h-11 w-full rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-surface-alt)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors hover:border-[var(--color-separator-mid)] focus:border-[var(--color-brand-bright)]/60"
              >
                <option value="thesis">Thesis</option>
                <option value="capstone">Capstone</option>
              </select>
            </label>
            <InputField
              label="Publication Date"
              value={draft.publicationDate}
              type="date"
              onChange={(value) => update("publicationDate", value)}
              required
              className="lg:col-span-2"
            />
            <InputField
              label="Conference"
              value={draft.conference}
              onChange={(value) => update("conference", value)}
              className="lg:col-span-3"
            />
            <label className="grid gap-2 text-sm font-medium text-[var(--color-text)] lg:col-span-3">
              Research Area
              <ResearchAreaMultiSelect
                value={draft.researchAreaIds}
                onChange={(researchAreaIds) => update("researchAreaIds", researchAreaIds)}
              />
            </label>
            <InputField
              label="Tags"
              value={draft.tags}
              onChange={(value) => update("tags", value)}
              hint="Separate tags with commas."
              required
              className="lg:col-span-3"
            />
            <InputField
              label="Publication Link"
              value={draft.publicationLink}
              type="url"
              onChange={(value) => update("publicationLink", value)}
              className="lg:col-span-3"
            />
            <TextAreaField
              label="Abstract"
              value={draft.abstract}
              onChange={(value) => update("abstract", value)}
              rows={8}
              required
              className="lg:col-span-6"
            />
            <TextAreaField
              label="Recommendations"
              value={draft.recommendations}
              onChange={(value) => update("recommendations", value)}
              rows={5}
              className="lg:col-span-3"
            />
            <TextAreaField
              label="Lessons Learned"
              value={draft.lessonsLearned}
              onChange={(value) => update("lessonsLearned", value)}
              rows={5}
              className="lg:col-span-3"
            />
          </div>
          <div className="grid gap-5 border-t border-[var(--color-separator)] pt-6">
            <TextAreaField
              label="Correction Reason"
              value={draft.correctionReason}
              onChange={(value) => update("correctionReason", value)}
              rows={3}
              maxLength={500}
              hint="This appears in the activity history."
              required
            />
          </div>

          {error && (
            <p className="rounded-md border border-[var(--color-danger)]/35 bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger)]" role="alert">
              {error}
            </p>
          )}

          <DialogFooter className="-mx-5 -mb-6 border-[var(--color-separator)] bg-[var(--color-surface-alt)] px-5 py-4 sm:-mx-7 sm:px-7">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="min-h-10 rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-surface)] px-4 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[var(--color-brand)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-bright)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? <LoaderCircle className="animate-spin" size={14} aria-hidden /> : <Save size={14} aria-hidden />}
              Save Correction
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  hint,
  required = false,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "url";
  hint?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 text-sm font-medium text-[var(--color-text)] ${className ?? ""}`}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="min-h-11 w-full rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-surface-alt)] px-3 text-sm text-[var(--color-text)] outline-none transition-colors hover:border-[var(--color-separator-mid)] focus:border-[var(--color-brand-bright)]/60"
      />
      {hint && <span className="text-xs font-normal text-[var(--color-text-muted)]">{hint}</span>}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
  hint,
  required = false,
  maxLength,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
}) {
  return (
    <label className={`grid gap-2 text-sm font-medium text-[var(--color-text)] ${className ?? ""}`}>
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        required={required}
        maxLength={maxLength}
        className="w-full resize-y rounded-md border border-[var(--color-separator-mid)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm leading-6 text-[var(--color-text)] outline-none transition-colors hover:border-[var(--color-separator-mid)] focus:border-[var(--color-brand-bright)]/60"
      />
      {hint && <span className="text-xs font-normal text-[var(--color-text-muted)]">{hint}</span>}
    </label>
  );
}
