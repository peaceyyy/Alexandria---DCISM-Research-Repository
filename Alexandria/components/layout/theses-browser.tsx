"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReviewStatus, ThesisCard } from "@/lib/services/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WorkflowStatus } from "@/components/ui/workflow-status";
import { ResearchAreaChip } from "@/components/ui/research-area-chip";
import type { UserRole } from "@/lib/auth/auth-contract";
import { RepositorySearchBar } from "@/components/layout/repository-search-bar";
import { FilterBar } from "@/components/layout/filter-bar";
import { getSubmissionStatusLabel, getSubmissionStatusValue, SubmissionStatusFilter } from "@/components/layout/submission-status-filter";
import { WorkspaceSidebar } from "@/components/layout/workspace-sidebar";

export type BrowseThesisItem = ThesisCard & {
  reviewStatus?: ReviewStatus;
  flaggedCommentCount?: number;
};

type ThesesBrowserProps = {
  items: BrowseThesisItem[];
  role: UserRole | null;
  profileName: string | null;
  isMySubmissions: boolean;
  flaggedSubmissionCount: number;
};

const VIEW_STORAGE_KEY = "alex:thesis-browser-view";
type BrowseView = "comfortable" | "compact";

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
  role,
  profileName,
  isMySubmissions,
  flaggedSubmissionCount,
}: ThesesBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<BrowseView>("comfortable");
  const [viewHydrated, setViewHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "comfortable" || stored === "compact") {
      setViewMode(stored);
    }
    setViewHydrated(true);
  }, []);

  useEffect(() => {
    if (viewHydrated) localStorage.setItem(VIEW_STORAGE_KEY, viewMode);
  }, [viewHydrated, viewMode]);

  const clearAllFilters = () => {
    const nextParams = new URLSearchParams();
    if (isMySubmissions) {
      nextParams.set("mine", "1");
      if (searchParams.get("status")) nextParams.set("status", searchParams.get("status")!);
    }
    if (searchParams.get("q")) nextParams.set("q", searchParams.get("q")!);
    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const clearSearch = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("q");
    nextParams.delete("page");
    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const clearSubmissionStatus = () => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("status");
    nextParams.delete("page");
    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const activeFilterCount = ["department", "area", "type", "tag"]
    .reduce((count, key) => count + searchParams.getAll(key).length, 0) +
    Number(Boolean(searchParams.get("from"))) +
    Number(Boolean(searchParams.get("to")));

  const queryText = searchParams.get("q")?.trim() ?? "";
  const hasFilters = activeFilterCount > 0;
  const submissionStatus = getSubmissionStatusValue(isMySubmissions ? searchParams.get("status") : null);
  const hasSubmissionStatusFilter = isMySubmissions && submissionStatus !== "all";
  const submissionStatusLabel = getSubmissionStatusLabel(submissionStatus);

  const currentQuery = searchParams.toString();
  const currentBrowseHref = `${pathname}${currentQuery ? `?${currentQuery}` : ""}`;

  return (
    <div className="grid min-h-screen grid-cols-1 xl:h-screen xl:grid-cols-[auto_minmax(0,1fr)] motion-safe:xl:transition-[grid-template-columns] motion-safe:xl:duration-200">
      <WorkspaceSidebar role={role} profileName={profileName} flaggedSubmissionCount={flaggedSubmissionCount} />

      <section className="px-4 pt-10 pb-8 sm:px-6 sm:pt-14 xl:overflow-y-auto xl:pl-8 xl:pr-4 xl:pt-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto w-full max-w-5xl">

          {/* ── Control zone ────────────────────────────────── */}
          <div className="pb-4">
            {/* Search bar */}
            <div className="mb-3">
              <RepositorySearchBar placeholder={isMySubmissions ? "Search your submissions…" : undefined} />
            </div>
            {isMySubmissions && (
              <div>
                <SubmissionStatusFilter />
              </div>
            )}
            {!isMySubmissions && <div className="hidden sm:block">
              <FilterBar />
            </div>}
            {!isMySubmissions && <div className="sm:hidden">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="relative inline-flex min-h-9 items-center gap-2 rounded-md border border-[var(--color-separator)] bg-[var(--color-surface)] px-3 text-[13px] font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/40"
              >
                <SlidersHorizontal size={14} aria-hidden />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-brand)] px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-[var(--color-surface)]">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="flex items-center gap-2 text-[19px] font-extrabold tracking-tight text-[var(--color-text)]">
                  <span className="block h-5 w-0.5 rounded-full bg-[var(--color-brand)]" aria-hidden />
                  {isMySubmissions ? "My Submissions" : "All Research"}
                </h1>

                {queryText && (
                  <p className="max-w-[min(18rem,60vw)] truncate text-[13px] text-[var(--color-text-muted)]" title={`Results for “${queryText}”`}>
                    Results for <span className="font-medium text-[var(--color-text)]">“{queryText}”</span>
                  </p>
                )}

                <div className="hidden h-4 w-px bg-[var(--color-separator)] sm:block" aria-hidden />
                <p className="text-[13px] font-medium text-[var(--color-text-muted)]" aria-live="polite">
                  {items.length} {items.length === 1 ? "study" : "studies"}
                  {!isMySubmissions && hasFilters && (
                    <>
                      <span className="mx-1.5 opacity-40">&middot;</span>
                      <span>{activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"}</span>
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="ml-1.5 font-semibold text-[var(--color-brand-bright)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-brand)]/60 rounded-sm"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </p>
              </div>

              {/* Right: View Toggles */}
              <div
                className="inline-flex flex-shrink-0 rounded-md border border-[var(--color-separator)] bg-[var(--color-text)]/[0.02] p-0.5 self-start sm:self-auto"
                role="group"
                aria-label="Result density"
              >
                {(["comfortable", "compact"] as const).map((mode) => {
                  const active = viewMode === mode;
                  const label = mode === "comfortable" ? "Comfortable card view" : "Compact list view";
                  const Icon = mode === "comfortable" ? LayoutGrid : List;
                  return (
                    <Button
                      key={mode}
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setViewMode(mode)}
                      aria-pressed={active}
                      aria-label={label}
                      title={label}
                      className={`rounded text-[var(--color-text-muted)] h-7 w-7 ${
                        active
                          ? "bg-[var(--color-text)]/10 text-[var(--color-text)]"
                          : "hover:text-[var(--color-text)]"
                      }`}
                    >
                      <Icon size={14} strokeWidth={2} aria-hidden />
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Separator between control zone and content */}
          <div className="mb-5 border-t border-[var(--color-separator)]" aria-hidden />

          {items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-[var(--color-separator)] bg-[var(--color-surface)]/50 p-6 text-center">
              <Search size={40} className="mb-4 text-[var(--color-text-muted)]/50" />
              <h3 className="mb-1 text-base font-semibold text-[var(--color-text)]">
                {queryText
                  ? isMySubmissions && hasSubmissionStatusFilter ? "No submissions match this search and status" : isMySubmissions ? "No submissions match this search" : "No studies match this search"
                  : hasSubmissionStatusFilter ? `No submissions are ${submissionStatusLabel.toLocaleLowerCase()}`
                  : hasFilters ? "No studies match these filters"
                  : isMySubmissions ? "No submissions yet" : "No published studies yet"}
              </h3>
              <p className="max-w-sm text-sm text-[var(--color-text-muted)]">
                {queryText
                  ? hasSubmissionStatusFilter ? `Nothing matched “${queryText}” with the ${submissionStatusLabel.toLocaleLowerCase()} status.` : `Nothing matched “${queryText}”.`
                  : hasSubmissionStatusFilter ? "Try a different status or clear the status filter."
                  : hasFilters ? "Try changing or clearing one of your filters."
                  : isMySubmissions ? "Your submitted research will appear here."
                  : "Published research will appear here once it is available."}
              </p>
              {(queryText || hasFilters || hasSubmissionStatusFilter) && (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {queryText && (
                    <Button variant="outline" size="sm" onClick={clearSearch}>
                      Clear search
                    </Button>
                  )}
                  {hasFilters && (
                    <Button variant="outline" size="sm" onClick={clearAllFilters}>
                      Clear filters
                    </Button>
                  )}
                  {hasSubmissionStatusFilter && (
                    <Button variant="outline" size="sm" onClick={clearSubmissionStatus}>
                      Clear status
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className={viewMode === "comfortable" ? "grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3" : "divide-y divide-[var(--color-separator)] border-y border-[var(--color-separator)]"}>
            {items.map((item) => {
              const workflowStatus = isMySubmissions && item.reviewStatus
                ? item.reviewStatus
                : null;
              const researchAreas = splitResearchAreas(item.research_area);
              const visibleTags = item.tags.slice(0, viewMode === "compact" ? 2 : 3);
              const remainingResearchAreas = researchAreas.length - 1;
              const remainingTags = item.tags.length - visibleTags.length;
              const tags = (
                <div className={`flex flex-nowrap items-center gap-2 overflow-hidden ${
                  viewMode === "compact" ? "mt-3" : "mt-auto pt-4"
                }`}>
                  {researchAreas[0] && (
                    <ResearchAreaChip
                      area={researchAreas[0]}
                      size="compact"
                      className="flex-shrink-0 truncate"
                    />
                  )}
                  {remainingResearchAreas > 0 && (
                    <span
                      title={`${remainingResearchAreas} more research area${remainingResearchAreas === 1 ? "" : "s"}`}
                      aria-label={`${remainingResearchAreas} more research area${remainingResearchAreas === 1 ? "" : "s"}`}
                      className="flex-shrink-0 inline-flex size-5 items-center justify-center rounded-full border border-[var(--color-separator)] bg-[var(--color-text)]/[0.04] text-[10px] font-semibold text-[var(--color-text-muted)]"
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

              const card = viewMode === "comfortable" ? (
                <article className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-separator)] bg-[var(--color-text)]/[0.03] transition hover:-translate-y-0.5 hover:border-[var(--color-text)]/20 hover:bg-[var(--color-text)]/[0.04]">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 overflow-hidden border-b border-[var(--color-separator)]">
                    {/* Branded placeholder shown until real thumbnail is available */}
                    <div className="flex aspect-[3/2] w-full items-center justify-center bg-[var(--color-surface-alt)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/brand/alexandria-mark.svg"
                        alt=""
                        aria-hidden
                        className="h-8 w-8 opacity-20 theme-invert"
                      />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex flex-col gap-2 px-4 py-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1 text-[11px] uppercase tracking-wide text-[var(--color-text-muted)]">
                        <p className="truncate">{item.authors.map((author) => author.display_name).join(" • ")}</p>
                        <p className="mt-0.5 font-semibold text-[var(--color-text)]">{item.year}</p>
                      </div>
                      {workflowStatus && (
                        <WorkflowStatus status={workflowStatus} size="compact" emphasis="quiet" />
                      )}
                    </div>
                    <h2 className="line-clamp-2 text-[17px] font-extrabold leading-snug text-[var(--color-text)]">
                      {item.title}
                    </h2>
                    <p className="line-clamp-3 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                      {item.abstract_preview}
                    </p>
                    {isMySubmissions && item.reviewStatus === "flagged" && item.flaggedCommentCount ? (
                      <p className="text-[11px] font-medium text-[var(--color-danger)]">
                        {item.flaggedCommentCount} feedback item{item.flaggedCommentCount === 1 ? "" : "s"} need revision
                      </p>
                    ) : null}
                    {tags}
                  </div>
                </article>
              ) : (
                <article className="group px-3 py-4 transition-colors hover:bg-[var(--color-text)]/[0.025]">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1 text-[11px] uppercase tracking-wide text-[var(--color-text-muted)]">
                          <p className="truncate">
                            {item.authors.map((a) => a.display_name).join(" • ")}
                          </p>
                          <p className="mt-0.5 font-semibold text-[var(--color-text)]">
                            {item.year}
                          </p>
                        </div>
                        {workflowStatus && (
                          <WorkflowStatus status={workflowStatus} size="compact" emphasis="quiet" />
                        )}
                      </div>

                      <h2 className="mt-1.5 line-clamp-2 text-[15px] font-extrabold leading-snug text-[var(--color-text)]">
                        {item.title}
                      </h2>

                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                        {item.abstract_preview}
                      </p>

                      {isMySubmissions && item.reviewStatus === "flagged" && item.flaggedCommentCount ? (
                        <p className="mt-2 text-[11px] font-medium text-[var(--color-danger)]">
                          {item.flaggedCommentCount} feedback item{item.flaggedCommentCount === 1 ? "" : "s"} need revision
                        </p>
                      ) : null}

                      {tags}
                    </div>
                  </div>
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
                  href={`/theses/${item.id}?returnTo=${encodeURIComponent(currentBrowseHref)}`}
                  className="block"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        )}
        </div>
      </section>

      <Dialog open={filtersOpen && !isMySubmissions} onOpenChange={setFiltersOpen}>
        <DialogContent
          className="!left-1/2 !top-auto !bottom-0 w-full max-w-none !translate-x-1/2 !translate-y-0 gap-0 rounded-t-xl border border-[var(--color-separator)] bg-[var(--color-bg)] p-5 text-[var(--color-text)] sm:hidden"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Filters</h2>
            {activeFilterCount > 0 && (
              <button type="button" onClick={() => { clearAllFilters(); setFiltersOpen(false); }} className="text-xs font-semibold text-[var(--color-brand)]">Clear all</button>
            )}
          </div>
          <FilterBar className="items-start" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
