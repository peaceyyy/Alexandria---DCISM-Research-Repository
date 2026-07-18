import Link from "next/link";
import type { ThesisDetail } from "@/lib/services/types";
import { parseLessonEntries } from "@/lib/domain/lessons";

type SelectedRightRailProps = {
  thesis: ThesisDetail;
};

export default function DetailsSidebar({ thesis }: SelectedRightRailProps) {
  const lessons = parseLessonEntries(thesis.lessons_learned);

  return (
    <aside className="border-t border-[var(--color-separator)] px-4 py-6 sm:px-6 xl:overflow-y-auto xl:border-l xl:border-t-0 xl:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="rounded-xl border border-[var(--color-separator-mid)] bg-[var(--color-surface-alt)] p-4">
        <h3 className="text-lg font-extrabold text-[var(--color-text)]">Lessons Learned</h3>

        {lessons.length > 0 ? (
          <ul className="mt-3 space-y-3 text-sm leading-5 text-[var(--color-text-muted)]">
            {lessons.map((lesson, index) => (
              <li key={index} className="break-words">{lesson}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">No lessons recorded</p>
        )}
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
