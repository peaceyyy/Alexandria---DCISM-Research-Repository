import { Suspense } from "react";
import { AppHeader } from "@/components/layout/app-header";
import ThesesBrowser, {
  type BrowseThesisItem,
} from "@/components/layout/theses-browser";
import { getCurrentUser } from "@/lib/services/auth-service";
import { listOwnSubmissions } from "@/lib/services/review-service";
import { getTheses } from "@/lib/services/thesis-service";
import type { MySubmissionListItem } from "@/lib/services/types";
import { SubmissionBanner } from "./_components/submission-banner";

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function mapOwnSubmission(item: MySubmissionListItem): BrowseThesisItem {
  return {
    id: item.id,
    title: item.title,
    year: item.year,
    abstract_preview: item.abstractPreview.slice(0, 200),
    research_area: item.researchArea,
    department: item.department,
    authors: item.authors.map((display_name, index) => ({
      id: index + 1,
      user_id: null,
      display_name,
      contribution_role: "author",
      sort_order: index,
    })),
    tags: [],
    reviewStatus: item.reviewStatus,
    flaggedCommentCount: item.flaggedCommentCount,
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ mine?: string | string[] }>;
}) {
  const params = await searchParams;
  const userResult = await getCurrentUser();
  const user = userResult.data;
  const requestedOwnSubmissions = firstValue(params.mine) === "1";
  const showOwnSubmissions = requestedOwnSubmissions && Boolean(user);

  const [publicThesesResult, ownSubmissionsResult, flaggedSubmissionsResult] =
    await Promise.all([
      showOwnSubmissions ? Promise.resolve(null) : getTheses({ limit: 100 }),
      showOwnSubmissions ? listOwnSubmissions() : Promise.resolve(null),
      user ? listOwnSubmissions({ status: "flagged" }) : Promise.resolve(null),
    ]);

  const role = user?.role ?? null;
  const items: BrowseThesisItem[] = showOwnSubmissions
    ? (ownSubmissionsResult?.data ?? []).map(mapOwnSubmission)
    : publicThesesResult?.data ?? [];
  const flaggedSubmissionCount = flaggedSubmissionsResult?.data?.length ?? 0;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] xl:h-screen xl:overflow-hidden">
      <AppHeader role={role} />
      <Suspense fallback={null}>
        <SubmissionBanner />
      </Suspense>
      <ThesesBrowser
        items={items}
        showMySubmissions={Boolean(user)}
        isMySubmissions={showOwnSubmissions}
        flaggedSubmissionCount={flaggedSubmissionCount}
      />
    </main>
  );
}
