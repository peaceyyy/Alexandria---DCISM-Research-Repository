import Link from "next/link";
import { getCurrentUser } from "@/lib/services/auth-service";
import { getOwnSubmissionForCorrection } from "@/lib/services/review-service";
import { MemberCorrectionClient } from "./member-correction-client";
import { TaskHeader } from "@/components/layout/task-header";

function parseThesisId(value: string) {
  const thesisId = Number(value);
  return Number.isSafeInteger(thesisId) && thesisId > 0 ? thesisId : null;
}

export default async function MemberCorrectionPage({
  params,
}: {
  params: Promise<{ thesisId: string }>;
}) {
  const { thesisId: rawThesisId } = await params;
  const thesisId = parseThesisId(rawThesisId);

  if (!thesisId) {
    return <UnavailablePage message="A valid submission id is required." />;
  }

  const [userResult, submissionResult] = await Promise.all([
    getCurrentUser(),
    getOwnSubmissionForCorrection(thesisId),
  ]);
  const user = userResult.data;
  const submission = submissionResult.data;

  if (
    userResult.error
    || !user
    || user.role !== "member"
    || submissionResult.error
    || !submission
  ) {
    return (
      <UnavailablePage
        message={
          userResult.error?.message
          ?? submissionResult.error?.message
          ?? "This correction workspace is unavailable."
        }
      />
    );
  }

  if (submission.reviewStatus !== "flagged") {
    return (
      <UnavailablePage message="This submission is no longer open for correction." />
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text)]">
      <TaskHeader backHref="/home?mine=1" backLabel="My submissions" />
      <MemberCorrectionClient initialSubmission={submission} />
    </main>
  );
}

function UnavailablePage({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#14181c] px-6 text-center text-white">
      <h1 className="text-xl font-bold">Correction workspace unavailable</h1>
      <p className="max-w-md text-sm leading-6 text-white/60">{message}</p>
      <Link
        href="/home?mine=1"
        className="text-sm font-semibold text-[#8ec5ff] hover:text-white"
      >
        Back to My Submissions
      </Link>
    </main>
  );
}
