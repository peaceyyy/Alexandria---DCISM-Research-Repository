export const PROJECT_PROGRESS_VALUES = ["in_progress", "completed"] as const;

export type ProjectProgress = (typeof PROJECT_PROGRESS_VALUES)[number];

export type ProgressRequirementInput = {
  progress: ProjectProgress;
  proposalApprovedOn: string | null | undefined;
  publicationDate: string | null | undefined;
  publicationLink: string | null | undefined;
  conference: string | null | undefined;
  hasPrimaryPdf: boolean;
};

export function isProjectProgress(value: unknown): value is ProjectProgress {
  return typeof value === "string" && PROJECT_PROGRESS_VALUES.includes(value as ProjectProgress);
}

export function isCompletedProgress(progress: ProjectProgress) {
  return progress === "completed";
}

export function getProgressRequirementErrors({
  progress,
  proposalApprovedOn,
  publicationDate,
  publicationLink,
  conference,
  hasPrimaryPdf,
}: ProgressRequirementInput): string[] {
  const errors: string[] = [];

  if (!proposalApprovedOn?.trim()) {
    errors.push("Proposal approval date is required for work in progress.");
  }

  if (!isCompletedProgress(progress)) {
    return errors;
  }

  if (!hasPrimaryPdf) {
    errors.push("A final PDF is required for completed work.");
  }
  if (!publicationDate?.trim()) {
    errors.push("Publication or presentation date is required for completed work.");
  }
  if (!publicationLink?.trim()) {
    errors.push("Publication link is required for completed work.");
  }
  if (!conference?.trim()) {
    errors.push("Conference or venue is required for completed work.");
  }

  return errors;
}
