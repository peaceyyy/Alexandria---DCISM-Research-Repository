"use client";

import { useState, useEffect } from "react";
import type React from "react";
import Image from "next/image";
import { PanelLeftOpen } from "lucide-react";
import FaqRail from "@/components/layout/faq";
import FilterSidebar from "@/components/layout/filter-sidebar";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReviewStatus, ThesisCard } from "@/lib/services/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getResearchAreaLabel } from "@/lib/domain/research-areas";

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
    className: "border-[var(--color-chip-cyan-bd)] bg-[var(--color-chip-cyan-bg)] text-[var(--color-chip-cyan-text)]",
  },
  flagged: {
    label: "Needs revision",
    className: "border-[var(--color-chip-red-bd)] bg-[var(--color-chip-red-bg)] text-[var(--color-chip-red-text)]",
  },
  accepted: {
    label: "Published",
    className: "border-[var(--color-chip-green-bd)] bg-[var(--color-chip-green-bg)] text-[var(--color-chip-green-text)]",
  },
  trashed: {
    label: "Archived",
    className: "border-[var(--color-separator)] bg-[var(--color-text)]/[0.04] text-[var(--color-text-muted)]",
  },
};

const FILTER_STORAGE_KEY = "alex:thesis-browser-filters";

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
  const [selectedStudyTypes, setSelectedStudyTypes] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filtersHydrated, setFiltersHydrated] = useState(false);

  // Hydrate collapse preference from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem("alex:filter-sidebar-collapsed");
    if (stored === "1") setIsSidebarCollapsed(true);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FILTER_STORAGE_KEY);
      if (!stored) return;

      const parsed: unknown = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object") return;

      const filters = parsed as {
        fromYear?: unknown;
        toYear?: unknown;
        researchAreas?: unknown;
        departments?: unknown;
        studyTypes?: unknown;
      };
      if (typeof filters.fromYear === "string") setFromYear(filters.fromYear);
      if (typeof filters.toYear === "string") setToYear(filters.toYear);
      if (Array.isArray(filters.researchAreas)) {
        setSelectedResearchAreas(filters.researchAreas.filter(
          (value): value is string => typeof value === "string",
        ));
      }
      if (Array.isArray(filters.departments)) {
        setSelectedDepartments(filters.departments.filter(
          (value): value is string => typeof value === "string",
        ));
      }
      if (Array.isArray(filters.studyTypes)) {
        setSelectedStudyTypes(filters.studyTypes.filter(
          (value): value is string => value === "thesis" || value === "capstone",
        ));
      }
    } catch {
      localStorage.removeItem(FILTER_STORAGE_KEY);
    } finally {
      setFiltersHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!filtersHydrated) return;

    localStorage.setItem(
      FILTER_STORAGE_KEY,
      JSON.stringify({
        fromYear,
        toYear,
        researchAreas: selectedResearchAreas,
        departments: selectedDepartments,
        studyTypes: selectedStudyTypes,
      }),
    );
  }, [
    filtersHydrated,
    fromYear,
    selectedDepartments,
    selectedResearchAreas,
    selectedStudyTypes,
    toYear,
  ]);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("alex:filter-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  };

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

    const studyTypeMatch =
      selectedStudyTypes.length === 0 ||
      (item.study_type !== undefined && selectedStudyTypes.includes(item.study_type));

    return yearMatch && researchAreaMatch && departmentMatch && studyTypeMatch;
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
    selectedStudyTypes,
    onToggleResearchArea: (value: string) =>
      toggleValue(value, setSelectedResearchAreas),
    onToggleDepartment: (value: string) =>
      toggleValue(value, setSelectedDepartments),
    onToggleStudyType: (value: string) =>
      toggleValue(value, setSelectedStudyTypes),
    showMySubmissions,
    mySubmissionsActive: isMySubmissions,
    flaggedSubmissionCount,
    onToggleMySubmissions: toggleMySubmissions,
  };

  return (
    <div
      className={`grid min-h-[calc(100vh-4rem)] grid-cols-1 xl:h-[calc(100vh-4rem)] motion-safe:xl:transition-[grid-template-columns] motion-safe:xl:duration-200 ${
        isSidebarCollapsed
          ? "xl:grid-cols-[72px_minmax(0,1fr)_320px]"
          : "xl:grid-cols-[220px_minmax(0,1fr)_320px]"
      }`}
    >
      <FilterSidebar
        className="hidden xl:flex xl:flex-col"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        {...filterSidebarProps}
      />

      <section className="px-4 py-5 sm:px-6 xl:overflow-y-auto xl:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mb-5 flex items-center border-b border-[var(--color-separator)] pb-4 xl:hidden">
          <p className="text-xs font-medium text-[var(--color-text-muted)]">
            {filteredItems.length} {filteredItems.length === 1 ? "study" : "studies"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const statusMeta = item.reviewStatus
              ? REVIEW_STATUS_META[item.reviewStatus]
              : null;
            const card = (
              <article
                className="group flex h-[480px] flex-col overflow-hidden rounded-xl border border-[var(--color-separator)] bg-[var(--color-text)]/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-text)]/20 hover:bg-[var(--color-text)]/[0.04]"
              >
                {/* Thumbnail — fixed height, never shrinks */}
                <div className="mb-4 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--color-separator)] bg-[var(--color-text)]/5">
                  <Image
                    src="/placeholder.svg"
                    alt="Article preview"
                    width={640}
                    height={360}
                    className="h-36 w-full object-cover"
                  />
                </div>

                {/* Keep the year readable even when author names are long. */}
                <div className="mb-4 flex min-h-10 items-start gap-2">
                  <div className="min-w-0 flex-1 text-[11px] uppercase tracking-wide text-[var(--color-text-muted)]">
                    <p className="truncate">
                      {item.authors.map((a) => a.display_name).join(" • ")}
                    </p>
                    <p className="mt-1 font-semibold text-[var(--color-text)]">
                      {item.year}
                    </p>
                  </div>
                  {statusMeta && (
                    <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusMeta.className}`}>
                      {statusMeta.label}
                    </span>
                  )}
                </div>

                {/* Title — 2-line max */}
                <h2 className="mb-3 flex-shrink-0 line-clamp-2 text-[17px] font-extrabold leading-tight text-[var(--color-text)]">
                  {item.title}
                </h2>

                {/* Abstract stays within its own shrinkable region before the chip strip. */}
                <p className="min-h-0 flex-1 overflow-hidden text-justify line-clamp-6 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {item.abstract_preview}
                </p>

                {item.reviewStatus === "flagged" && item.flaggedCommentCount ? (
                  <p className="mt-3 text-[11px] font-medium text-[var(--color-danger)]">
                    {item.flaggedCommentCount} feedback item{item.flaggedCommentCount === 1 ? "" : "s"} need revision
                  </p>
                ) : null}

                {/* Tags — always at the bottom in one stable row. */}
                {(() => {
                  const researchAreas = splitResearchAreas(item.research_area);
                  const visibleTags = item.tags.slice(0, 3);
                  const remainingResearchAreas = researchAreas.length - 1;
                  const remainingTags = item.tags.length - visibleTags.length;

                  return (
                    <div className="mt-auto flex flex-shrink-0 flex-nowrap items-center gap-2 overflow-hidden pt-4">
                      {researchAreas[0] && (
                        <span
                          title={getResearchAreaLabel(researchAreas[0])}
                          className="flex-shrink-0 max-w-[9rem] truncate rounded-full border border-[var(--color-chip-cyan-bd)] bg-[var(--color-chip-cyan-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-chip-cyan-text)]"
                        >
                          {getResearchAreaLabel(researchAreas[0])}
                        </span>
                      )}
                      {remainingResearchAreas > 0 && (
                        <span
                          title={`${remainingResearchAreas} more research area${remainingResearchAreas === 1 ? "" : "s"}`}
                          aria-label={`${remainingResearchAreas} more research area${remainingResearchAreas === 1 ? "" : "s"}`}
                          className="flex-shrink-0 inline-flex size-5 items-center justify-center rounded-full border border-[var(--color-chip-cyan-bd)] bg-[var(--color-chip-cyan-bg)] text-[10px] font-semibold text-[var(--color-chip-cyan-text)]"
                        >
                          +{remainingResearchAreas}
                        </span>
                      )}
                      {visibleTags.map((tag) => (
                        <span
                          key={tag}
                          title={tag}
                          className="flex-shrink-0 max-w-[6rem] truncate rounded-full border border-[var(--color-separator)] bg-[var(--color-text)]/[0.04] px-2 py-0.5 text-[11px] font-medium text-[var(--color-text-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                      {remainingTags > 0 && (
                        <span
                          title={`${remainingTags} more tag${remainingTags === 1 ? "" : "s"}`}
                          aria-label={`${remainingTags} more tag${remainingTags === 1 ? "" : "s"}`}
                          className="flex-shrink-0 inline-flex size-5 items-center justify-center rounded-full border border-[var(--color-separator)] bg-[var(--color-text)]/[0.04] text-[10px] font-semibold text-[var(--color-text-muted)]"
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
            ) : (
              <Link
                key={item.id}
                href={isMySubmissions ? `/theses/${item.id}?mine=1` : `/theses/${item.id}`}
                className="block"
              >
                {card}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 border-t border-[var(--color-separator)] pt-2 xl:hidden">
          <FaqRail />
        </div>
      </section>

      <div className="hidden xl:block">
        <FaqRail />
      </div>

      {/* Mobile filter drawer — no header, content starts immediately */}
      <Dialog open={filtersOpen} onOpenChange={(open) => setFiltersOpen(open)}>
        <DialogContent
          className="!left-0 !top-0 h-dvh w-[min(22rem,calc(100%-2rem))] !max-w-none !translate-x-0 !translate-y-0 gap-0 overflow-y-auto rounded-none border-r border-[var(--color-separator)] bg-[var(--color-bg)] p-0 text-[var(--color-text)]"
        >
          <FilterSidebar className="border-0 px-5 pt-3 pb-5" {...filterSidebarProps} />
        </DialogContent>
      </Dialog>

      {/* Floating filter tab — left-edge drawer pull, below-xl only.
           Uses same icon + style as the collapsed sidebar toggle. */}
      <button
        type="button"
        onClick={() => setFiltersOpen(true)}
        className="fixed left-0 top-[72px] z-30 xl:hidden inline-flex h-7 w-7 items-center justify-center rounded-r-full border border-l-0 border-[var(--color-separator-mid)] bg-[var(--color-surface)] text-[var(--color-text-muted)] shadow-[2px_2px_8px_rgba(0,0,0,0.18)] transition-[background,color,transform,border-color] duration-150 hover:scale-105 hover:border-[var(--color-separator-mid)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/50"
        aria-label="Open filters"
        title="Open filters"
      >
        <PanelLeftOpen size={14} aria-hidden />
      </button>
    </div>
  );
}
