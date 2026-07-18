import Link from "next/link";
import type { ThesisDetail } from "@/lib/services/types";
import { getResearchAreaLabel } from "@/lib/domain/research-areas";

type SelectedRightRailProps = {
  thesis: ThesisDetail;
};

function splitList(value: string | null) {
  return value
    ? value
        .split(/\n|,/)
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];
}

export default function DetailsSidebar({ thesis }: SelectedRightRailProps) {
  const lessons = splitList(thesis.lessons_learned);
  const researchAreas = splitList(thesis.research_area);

  return (
    <aside className="border-t border-[var(--color-separator)] px-4 py-6 sm:px-6 xl:overflow-y-auto xl:border-l xl:border-t-0 xl:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="rounded-xl border border-[var(--color-separator-mid)] bg-[var(--color-surface-alt)] p-4">
        <h3 className="text-lg font-extrabold text-[var(--color-text)]">Lessons Learned</h3>

        {lessons.length > 0 ? (
          <ul className="mt-3 space-y-3 text-sm leading-5 text-[var(--color-text-muted)]">
            {lessons.map((lesson, index) => (
              <li key={index}>{lesson}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">No lessons recorded</p>
        )}

        <div className="mt-5">
          <h4 className="text-base font-semibold text-[var(--color-text)]">Research Area</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {researchAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center rounded-full border border-[var(--color-chip-cyan-bd)] bg-[var(--color-chip-cyan-bg)] px-3 py-1 text-[11px] text-[var(--color-chip-cyan-text)]"
              >
                {getResearchAreaLabel(area)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h4 className="text-base font-semibold text-[var(--color-text)]">Conference</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-[11px] text-[var(--color-text-muted)]">
              {thesis.conference ?? "Not provided"}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <h4 className="text-base font-semibold text-[var(--color-text)]">Publication Link</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {thesis.publication_link ? (
              <a
                href={
                  thesis.publication_link.startsWith("http")
                    ? thesis.publication_link
                    : `https://${thesis.publication_link}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center break-all text-[11px] text-[var(--color-text-muted)] underline underline-offset-4 transition-colors hover:text-[var(--color-text)]"
              >
                {thesis.publication_link}
              </a>
            ) : (
              <span className="text-[11px] text-[var(--color-text-muted)]">No publication link</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-[var(--color-text)]">Recommended Articles</h3>

        <div className="mt-4 space-y-4">
          {thesis.related_theses.length > 0 ? (
            thesis.related_theses.map((item) => (
              <Link key={item.id} href={`/theses/${item.id}`} className="block">
                <article className="border-b border-[var(--color-separator)] pb-4 transition-opacity hover:opacity-75">
                  <h4 className="text-base font-semibold text-[var(--color-text)]">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {item.authors.map((author) => author.display_name).join(" • ")}
                  </p>
                </article>
              </Link>
            ))
          ) : (
            <p className="text-sm text-[var(--color-text-muted)]">No related articles found</p>
          )}
        </div>
      </div>
    </aside>
  );
}
