import { AdminDataState } from "@/app/admin/_components/admin-data-state";
import { getCurrentUser } from "@/lib/services/auth-service";
import { getReviewSubmission } from "@/lib/services/review-service";
import { ReviewDetailClient } from "./review-detail-client";

function parseSubmissionId(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const submissionId = parseSubmissionId(resolvedParams.id);

  if (!submissionId) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Review Submission</h1>
        <AdminDataState
          title="Submission unavailable"
          message="A valid submission id is required."
        />
      </div>
    );
  }

  const [viewerResult, submissionResult] = await Promise.all([
    getCurrentUser(),
    getReviewSubmission(submissionId),
  ]);

  const viewer = viewerResult.data;
  const submission = submissionResult.data;
  const viewerCanReview =
    viewer?.role === "admin" || viewer?.role === "moderator";

  if (
    viewerResult.error
    || !viewer
    || submissionResult.error
    || !submission
    || !viewerCanReview
  ) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Review Submission</h1>
        <AdminDataState
          title="Submission unavailable"
          message={
            viewerResult.error?.message
            ?? submissionResult.error?.message
            ?? "The submission could not be loaded for review."
          }
        />
      </div>
    );
  }

  return (
    <ReviewDetailClient
      initialSubmission={submission}
      viewerRole={viewer.role as "admin" | "moderator"}
    />
  );
}
