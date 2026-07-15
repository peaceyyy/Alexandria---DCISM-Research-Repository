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
    <aside className="border-t border-white/15 px-4 py-6 sm:px-6 xl:overflow-y-auto xl:border-l xl:border-t-0 xl:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="rounded-xl border border-[#416790] bg-[linear-gradient(315deg,#2B435E_0%,#131E2A_100%)] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <h3 className="text-lg font-extrabold text-white">Lessons Learned</h3>

        {lessons.length > 0 ? (
          <ul className="mt-3 space-y-3 text-sm leading-5 text-white/75">
            {lessons.map((lesson, index) => (
              <li key={index}>{lesson}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-white/50">No lessons recorded</p>
        )}

        <div className="mt-5">
          <h4 className="text-base font-semibold text-white">Research Area</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {researchAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center rounded-full border border-white/30 bg-transparent px-3 py-1 text-[11px] text-white/80"
              >
                {getResearchAreaLabel(area)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h4 className="text-base font-semibold text-white">Conference</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-[11px] text-white/70">
              {thesis.conference ?? "Not provided"}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <h4 className="text-base font-semibold text-white">Publication Link</h4>
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
                className="inline-flex items-center break-all text-[11px] text-[#2f8dff] underline underline-offset-4 hover:text-[#66a6ff]"
              >
                {thesis.publication_link}
              </a>
            ) : (
              <span className="text-[11px] text-white/50">No publication link</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-white">Recommended Articles</h3>

        <div className="mt-4 space-y-4">
          {thesis.related_theses.length > 0 ? (
            thesis.related_theses.map((item) => (
              <Link key={item.id} href={`/theses/${item.id}`} className="block">
                <article className="border-b border-white/20 pb-4 transition hover:opacity-80">
                  <h4 className="text-base font-semibold text-[#2f8dff]">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-sm text-white/60">
                    {item.authors.map((author) => author.display_name).join(" • ")}
                  </p>
                </article>
              </Link>
            ))
          ) : (
            <p className="text-sm text-white/50">No related articles found</p>
          )}
        </div>
      </div>
    </aside>
  );
}
