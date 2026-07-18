import { AppHeader } from "@/components/layout/app-header";
import { getCurrentUser } from "@/lib/services/auth-service";
import { getThesisById } from "@/lib/services/thesis-service";
import Link from "next/link";
import DetailsSidebar from "@/components/layout/details-sidebar";
import { RecommendationsPreview } from "@/components/layout/recommendations-preview";
import { ExternalLink } from "lucide-react";

export default async function ThesisDetails({
  params,
}: {
  params: Promise<{ thesisId: string }>;
}) {
  const { thesisId } = await params;
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

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] xl:h-screen xl:overflow-hidden">
      <AppHeader role={role} />
      <div className="grid grid-cols-1 xl:h-[calc(100vh-4rem)] xl:grid-cols-[minmax(0,1fr)_320px]">

        <section className="px-4 py-5 sm:px-6 xl:overflow-y-auto xl:border-r xl:border-white/15 xl:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* this section contains the back button, title, authors, abstract, keywords/tags, pdf viewer */}

          <Link
            href="/home"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
          >
            ← Back
          </Link>

          <h1 className="max-w-7xl text-2xl font-extrabold leading-tight text-[var(--color-text)]">
            {thesis.title}
          </h1>

          <div className="mt-2 text-sm text-[var(--color-text-muted)]">
            {thesis.authors
              .filter((author) => author.contribution_role === "author")
              .map((author) => author.display_name)
              .join(" • ")}{" "}
            | {thesis.year}
          </div>

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
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Recommendations
              </h2>
              <RecommendationsPreview
                recommendations={thesis.recommendations}
              />
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Keywords
            </h2>
            <p className="mt-2 max-w-7xl text-sm leading-6 text-[var(--color-text-muted)]">
              {/* Tags are here */}
              {thesis.tags.join(", ")}
            </p>
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
