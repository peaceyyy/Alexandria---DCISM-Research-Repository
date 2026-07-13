import Link from "next/link";
import type { ThesisDetail } from "@/lib/services/types";

type DetailsSidebarProps = {
  thesis: ThesisDetail;
};

export default function DetailsSidebar({ thesis }: DetailsSidebarProps) {
  const lessons = thesis.lessons_learned
    ? thesis.lessons_learned.split(/\n+/).filter(Boolean)
    : [];

  return (
    <aside className="border-l border-white/15 px-4 py-6 lg:px-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="rounded-xl border border-[#416790] bg-[linear-gradient(315deg,#2B435E_0%,#131E2A_100%)] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <h3 className="text-lg font-extrabold text-white">Lessons Learned</h3>

        {lessons.length > 0 ? (
          <ul className="mt-3 space-y-3 text-sm leading-5 text-white/75">
            {lessons.map((lesson, index) => (
              <li key={index}>{lesson}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-white/40">No lessons recorded.</p>
        )}

        {thesis.research_area && (
          <div className="mt-5">
            <h4 className="text-base font-semibold text-white">Research Area</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {thesis.research_area
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean)
                .map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center rounded-full border border-white/30 bg-transparent px-3 py-1 text-[11px] text-white/80"
                  >
                    {area}
                  </span>
                ))}
            </div>
          </div>
        )}
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
                    {item.authors.map((a) => a.display_name).join(" • ")}
                  </p>
                </article>
              </Link>
            ))
          ) : (
            <p className="text-sm text-white/40">No related articles found.</p>
          )}
        </div>
      </div>
    </aside>
  );
}
