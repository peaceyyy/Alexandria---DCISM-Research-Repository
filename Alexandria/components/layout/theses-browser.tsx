"use client";

import { useState } from "react";
import type React from "react";
import Image from "next/image";
import { SlidersHorizontal } from "lucide-react";
import FaqRail from "@/components/layout/faq";
import FilterSidebar from "@/components/layout/filter-sidebar";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReviewStatus, ThesisCard } from "@/lib/services/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export type BrowseThesisItem = ThesisCard & {
  reviewStatus?: ReviewStatus;
  flaggedCommentCount?: number;
};

type ThesesBrowserProps = {
  items: BrowseThesisItem[];
  showMySubmissions: boolean;
  isMySubmissions: boolean;
  flaggedSubmissionCount: number;
};

const REVIEW_STATUS_META: Record<ReviewStatus, { label: string; className: string }> = {
  for_review: {
    label: "Under review",
    className: "border-[#1da0c9]/40 bg-[#1da0c9]/10 text-[#9ddff2]",
  },
  flagged: {
    label: "Needs revision",
    className: "border-[#ff6b6b]/35 bg-[#ff6b6b]/10 text-[#ff9b9b]",
  },
  accepted: {
    label: "Published",
    className: "border-[#59c987]/35 bg-[#59c987]/10 text-[#8ee1ae]",
  },
  trashed: {
    label: "Archived",
    className: "border-white/15 bg-white/[0.04] text-white/45",
  },
};

function splitResearchAreas(value: string | null) {
  return value
    ? value
        .split(",")
        .map((area) => area.trim())
        .filter(Boolean)
    : [];
}

export default function ThesesBrowser({
  items,
  showMySubmissions,
  isMySubmissions,
  flaggedSubmissionCount,
}: ThesesBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [selectedResearchAreas, setSelectedResearchAreas] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredItems = items.filter((item) => {
    const yearMatch =
      (!fromYear || item.year >= Number(fromYear)) &&
      (!toYear || item.year <= Number(toYear));

    const researchAreaMatch =
      selectedResearchAreas.length === 0 ||
      selectedResearchAreas.some((area) =>
        splitResearchAreas(item.research_area).includes(area)
      );

    const departmentMatch =
      selectedDepartments.length === 0 ||
      selectedDepartments.includes(item.department);

    return yearMatch && researchAreaMatch && departmentMatch;
  });

  const toggleValue = (
    value: string,
    setValues: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setValues((current) =>
      current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value]
    );
  };

  const toggleMySubmissions = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (isMySubmissions) {
      nextParams.delete("mine");
    } else {
      nextParams.set("mine", "1");
    }

    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const filterSidebarProps = {
    fromYear,
    toYear,
    setFromYear,
    setToYear,
    selectedResearchAreas,
    selectedDepartments,
    onToggleResearchArea: (value: string) =>
      toggleValue(value, setSelectedResearchAreas),
    onToggleDepartment: (value: string) =>
      toggleValue(value, setSelectedDepartments),
    showMySubmissions,
    mySubmissionsActive: isMySubmissions,
    flaggedSubmissionCount,
    onToggleMySubmissions: toggleMySubmissions,
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 xl:h-[calc(100vh-4rem)] xl:grid-cols-[220px_minmax(0,1fr)_320px]">
      <FilterSidebar className="hidden xl:block" {...filterSidebarProps} />

      <section className="px-4 py-5 sm:px-6 xl:overflow-y-auto xl:border-r xl:border-white/15 xl:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4 xl:hidden">
          <p className="text-xs font-medium text-white/55">
            {filteredItems.length} {filteredItems.length === 1 ? "study" : "studies"}
          </p>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex min-h-10 items-center gap-2 border border-white/20 px-3 text-sm font-semibold text-white transition-colors hover:border-[#368bfe]/70 hover:bg-white/[0.04]"
          >
            <SlidersHorizontal size={16} aria-hidden />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const statusMeta = item.reviewStatus
              ? REVIEW_STATUS_META[item.reviewStatus]
              : null;
            const card = (
              <article
                className="group flex h-[380px] flex-col overflow-hidden rounded-xl border border-white/15 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.06]"
              >
                {/* Thumbnail — fixed height, never shrinks */}
                <div className="mb-3 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                  <Image
                    src="/placeholder.svg"
                    alt="Article preview"
                    width={640}
                    height={360}
                    className="h-36 w-full object-cover"
                  />
                </div>

                {/* Authors — single line, never wraps */}
                <div className="mb-2 flex min-h-5 items-center gap-2">
                  <div className="min-w-0 flex-1 truncate text-[11px] uppercase tracking-wide text-white/50">
                    {item.authors.map((a) => a.display_name).join(" • ")} | {item.year}
                  </div>
                  {statusMeta && (
                    <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusMeta.className}`}>
                      {statusMeta.label}
                    </span>
                  )}
                </div>

                {/* Title — 2-line max */}
                <h2 className="flex-shrink-0 line-clamp-2 text-base font-extrabold leading-tight text-white">
                  {item.title}
                </h2>

                {/* Abstract — 3-line max, capped so tags are never pushed out */}
                <p className="mt-2 max-h-[3.75rem] overflow-hidden line-clamp-3 text-sm leading-5 text-white/70">
                  {item.abstract_preview}
                </p>

                {item.reviewStatus === "flagged" && item.flaggedCommentCount ? (
                  <p className="mt-2 text-[11px] font-medium text-[#ff9b9b]">
                    {item.flaggedCommentCount} moderator comment{item.flaggedCommentCount === 1 ? "" : "s"}
                  </p>
                ) : null}

                {/* Tags — always at the bottom, single-row, overflow-hidden */}
                {(() => {
                  const researchAreas = splitResearchAreas(item.research_area);
                  const visibleTags = item.tags.slice(0, 3);
                  const remainingResearchAreas = researchAreas.length - 1;
                  const remainingTags = item.tags.length - visibleTags.length;

                  return (
                    <div className="mt-3 flex-shrink-0 flex flex-wrap items-center gap-2">
                      {researchAreas[0] && (
                        <span
                          title={researchAreas[0]}
                          className="flex-shrink-0 max-w-[9rem] truncate rounded-full border border-[#1da0c9]/50 bg-[#1da0c9]/10 px-2 py-0.5 text-[11px] font-medium text-[#9ddff2]"
                        >
                          {researchAreas[0]}
                        </span>
                      )}
                      {remainingResearchAreas > 0 && (
                        <span
                          title={`${remainingResearchAreas} more research area${remainingResearchAreas === 1 ? "" : "s"}`}
                          aria-label={`${remainingResearchAreas} more research area${remainingResearchAreas === 1 ? "" : "s"}`}
                          className="flex-shrink-0 inline-flex size-5 items-center justify-center rounded-full border border-[#1da0c9]/50 bg-[#1da0c9]/10 text-[10px] font-semibold text-[#9ddff2]"
                        >
                          +{remainingResearchAreas}
                        </span>
                      )}
                      {visibleTags.map((tag) => (
                        <span
                          key={tag}
                          title={tag}
                          className="flex-shrink-0 max-w-[6rem] truncate rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-white/40"
                        >
                          {tag}
                        </span>
                      ))}
                      {remainingTags > 0 && (
                        <span
                          title={`${remainingTags} more tag${remainingTags === 1 ? "" : "s"}`}
                          aria-label={`${remainingTags} more tag${remainingTags === 1 ? "" : "s"}`}
                          className="flex-shrink-0 inline-flex size-5 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-semibold text-white/60"
                        >
                          +{remainingTags}
                        </span>
                      )}
                    </div>
                  );
                })()}
              </article>
            );

            return item.reviewStatus === "flagged" ? (
              <Link
                key={item.id}
                href={`/submissions/${item.id}/corrections`}
                className="block"
                aria-label={`Correct flagged submission: ${item.title}`}
              >
                {card}
              </Link>
            ) : item.reviewStatus && item.reviewStatus !== "accepted" ? (
              <div key={item.id}>{card}</div>
            ) : (
              <Link key={item.id} href={`/theses/${item.id}`} className="block">
                {card}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 border-t border-white/10 pt-2 xl:hidden">
          <FaqRail />
        </div>
      </section>

      <div className="hidden xl:block">
        <FaqRail />
      </div>

      <Dialog open={filtersOpen} onOpenChange={(open) => setFiltersOpen(open)}>
        <DialogContent
          className="!left-0 !top-0 h-dvh w-[min(22rem,calc(100%-2rem))] !max-w-none !translate-x-0 !translate-y-0 gap-0 overflow-y-auto rounded-none border-r border-white/15 bg-[#14181c] p-0 text-white"
        >
          <div className="border-b border-white/10 px-5 py-5">
            <DialogTitle className="font-semibold text-white">Filter studies</DialogTitle>
          </div>
          <FilterSidebar className="border-0 px-5 py-5" {...filterSidebarProps} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
