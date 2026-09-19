import { getCurrentUser } from "@/lib/services/auth-service";
import { getThesisById } from "@/lib/services/thesis-service";
import Link from "next/link";
import DetailsSidebar from "@/components/layout/details-sidebar";
import { RecommendationsPreview } from "@/components/layout/recommendations-preview";
import { ExternalLink } from "lucide-react";
import { BackLink } from "@/components/ui/back-link";
import { ResearchAreaChip } from "@/components/ui/research-area-chip";
import { WorkspaceSidebar } from "@/components/layout/workspace-sidebar";

function splitList(value: string | null) {
  return value
    ? value
        .split(/\n|,/)
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];
}

function getSafeReturnHref(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) return null;

  const parsed = new URL(candidate, "https://alexandria.local");
  return parsed.pathname === "/home" ? `${parsed.pathname}${parsed.search}` : null;
}

export default async function ThesisDetails({
  params,
  searchParams,
}: {
  params: Promise<{ thesisId: string }>;
  searchParams: Promise<{ mine?: string | string[]; returnTo?: string | string[] }>;
}) {
  const { thesisId } = await params;
  const query = await searchParams;
  const id = Number(thesisId);

  if (!Number.isInteger(id) || id <= 0) {
    return (
      <main className="h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
        Thesis not found
      </main>
    );
  }

  const userResult = await getCurrentUser();
  const thesisResult = await getThesisById(id, userResult.data?.id);

  const role = userResult.data?.role ?? null;

  if (thesisResult.error || !thesisResult.data) {
    return (
      <main className="h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center">
        Thesis not found
      </main>
    );
  }

  const thesis = thesisResult.data;
  const researchAreas = splitList(thesis.research_area);
  const legacyMineView = (Array.isArray(query.mine) ? query.mine[0] : query.mine) === "1";
  const returnHref = getSafeReturnHref(query.returnTo) ?? (legacyMineView ? "/home?mine=1" : "/home");
  const isMySubmissionView = new URL(returnHref, "https://alexandria.local").searchParams.get("mine") === "1";
  const isOwnSubmission = thesis.submittedByUserId === userResult.data?.id;
  const ownerStatus =
    isMySubmissionView &&
    isOwnSubmission &&
    (thesis.reviewStatus === "for_review" || thesis.reviewStatus === "accepted")
      ? thesis.reviewStatus
      : null;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] xl:h-screen xl:overflow-hidden">
      <div className="grid grid-cols-1 xl:h-screen xl:grid-cols-[auto_minmax(0,1fr)_320px] motion-safe:xl:transition-[grid-template-columns] motion-safe:xl:duration-200">
        <WorkspaceSidebar role={role} profileName={userResult.data?.profile_name} />

        <section className="px-4 py-5 sm:px-6 xl:overflow-y-auto xl:border-r xl:border-white/15 xl:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* this section contains the back button, title, authors, abstract, keywords/tags, pdf viewer */}

          <BackLink
            href={returnHref}
            label="Back"
            className="mb-6 h-9 rounded-full border border-[var(--color-separator-mid)] px-3 hover:border-[var(--color-brand-bright)]/35"
          />

          <div className="flex items-start gap-3">
            <h1 className="max-w-7xl text-2xl font-extrabold leading-tight text-[var(--color-text)]">
              {thesis.title}
            </h1>
            {thesis.publication_link && (
              <a
                href={
                  thesis.publication_link.startsWith("http")
                    ? thesis.publication_link
                    : `https://${thesis.publication_link}`
                }
                target="_blank"
                rel="noopener noreferrer"
                title="View original publication"
                className="mt-1 inline-flex items-center rounded p-1 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]"
              >
                <ExternalLink size={20} aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="mt-2 text-sm text-[var(--color-text-muted)]">
            {thesis.authors
              .filter((author) => author.contribution_role === "author")
              .map((author) => author.display_name)
              .join(" • ")}{" "}
            | {thesis.year}
            {thesis.conference && ` | ${thesis.conference}`}
          </div>

          {(thesis.teaser_thumbnail || (thesis.study_type === "capstone" && thesis.deployment_link)) && (
            <section className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start">
              {thesis.teaser_thumbnail && (
                <img
                  src={thesis.teaser_thumbnail.public_url}
                  alt={thesis.teaser_thumbnail.alt}
                  className="aspect-video w-full max-w-xl rounded-xl border border-[var(--color-separator-mid)] object-cover sm:w-80"
                />
              )}
              {thesis.study_type === "capstone" && thesis.deployment_link && (
                <a
                  href={thesis.deployment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--color-brand)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-bright)]"
                >
                  Open deployed system
                  <ExternalLink size={15} aria-hidden />
                </a>
              )}
            </section>
          )}

          {ownerStatus && (
            <p
              className={
                ownerStatus === "for_review"
                  ? "mt-3 inline-flex rounded-full border border-[var(--color-chip-cyan-bd)] bg-[var(--color-chip-cyan-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--color-chip-cyan-text)]"
                  : "mt-3 inline-flex rounded-full border border-[var(--color-chip-green-bd)] bg-[var(--color-chip-green-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--color-chip-green-text)]"
              }
            >
              {ownerStatus === "for_review" ? "Under review" : "Published"}
            </p>
          )}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Abstract
            </h2>
            <p className="mt-2 max-w-7xl text-sm leading-6 text-[var(--color-text-muted)]">
              {thesis.abstract}
            </p>
          </div>

          {thesis.recommendations && (
            <div className="mt-6">
              <RecommendationsPreview
                recommendations={thesis.recommendations}
              />
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Research Area & Keywords
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {researchAreas.map((area) => (
                <ResearchAreaChip key={area} area={area} />
              ))}
              {thesis.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-[var(--color-separator-mid)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs text-[var(--color-text-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Preview
              </h2>
              {thesis.file_access.preview_path && (
                <a
                  href={thesis.file_access.preview_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open PDF in new tab"
                  title="Open in new tab"
                  className="rounded p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]"
                >
                  <ExternalLink size={16} aria-hidden />
                </a>
              )}
            </div>

            {thesis.file_access.has_primary_file &&
            thesis.file_access.preview_path ? (
              <iframe
                title={`PDF preview: ${thesis.title}`}
                src={thesis.file_access.preview_path}
                className="mt-3 h-[72vh] min-h-[32rem] w-full rounded-lg border border-[var(--color-separator-mid)] bg-[var(--color-surface)]"
              />
            ) : (
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                A PDF preview is not available for this thesis.
              </p>
            )}
          </section>
        </section>

        <DetailsSidebar thesis={thesis} />
      </div>
    </main>
  );
}
