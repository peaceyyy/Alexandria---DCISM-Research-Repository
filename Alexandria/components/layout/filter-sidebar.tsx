"use client";

import { cn } from "@/lib/utils";
import { DEPARTMENTS } from "@/lib/domain/departments";
import { RESEARCH_AREAS } from "@/lib/domain/research-areas";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import styles from "./filter-sidebar.module.css";

type FilterSidebarProps = {
  className?: string;
  fromYear: string;
  toYear: string;
  setFromYear: (value: string) => void;
  setToYear: (value: string) => void;
  selectedResearchAreas: string[];
  selectedDepartments: string[];
  onToggleResearchArea: (value: string) => void;
  onToggleDepartment: (value: string) => void;
  showMySubmissions: boolean;
  mySubmissionsActive: boolean;
  flaggedSubmissionCount: number;
  onToggleMySubmissions: () => void;
  /** Only relevant on xl+ screens; ignored inside the mobile Dialog drawer */
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
};

export default function FilterSidebar({
  className,
  fromYear,
  toYear,
  setFromYear,
  setToYear,
  selectedResearchAreas,
  selectedDepartments,
  onToggleResearchArea,
  onToggleDepartment,
  showMySubmissions,
  mySubmissionsActive,
  flaggedSubmissionCount,
  onToggleMySubmissions,
  isCollapsed = false,
  onToggleCollapse,
}: FilterSidebarProps) {
  return (
    <aside
      id="filter-sidebar"
      className={cn(
        styles.sidebar,
        isCollapsed && styles.collapsed,
        "px-3 py-4",
        className
      )}
      aria-label="Filter studies"
    >
      {/* Header row: "Filter" title + toggle button (always in flex flow, never floats) */}
      <div className={styles.header}>
        <span
          className={styles.sectionTitle}
          aria-hidden={isCollapsed ? true : undefined}
        >
          Filter
        </span>
        {onToggleCollapse && (
          <button
            type="button"
            className={styles.collapseButton}
            aria-label={isCollapsed ? "Expand filter panel" : "Collapse filter panel"}
            aria-expanded={!isCollapsed}
            aria-controls="filter-sidebar"
            title={isCollapsed ? "Expand filter panel" : "Collapse filter panel"}
            onClick={onToggleCollapse}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={14} aria-hidden />
            ) : (
              <PanelLeftClose size={14} aria-hidden />
            )}
          </button>
        )}
      </div>

      {/* All filter content — hidden when collapsed */}
      <div className={styles.body} aria-hidden={isCollapsed ? true : undefined}>
        {showMySubmissions && (
          <section className="mb-5 border-y border-[var(--color-separator)] py-3" aria-label="My submissions">
            <label className="flex min-h-8 cursor-pointer items-center gap-2 text-xs font-semibold text-[var(--color-text)]">
              <input
                type="checkbox"
                checked={mySubmissionsActive}
                onChange={onToggleMySubmissions}
                aria-label="My submissions"
                tabIndex={isCollapsed ? -1 : undefined}
              />
              <span>My submissions</span>
              {flaggedSubmissionCount > 0 && (
                <span
                  className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full border border-[var(--color-chip-cyan-bd)] bg-[var(--color-chip-cyan-bg)] px-1.5 py-0.5 text-[11px] font-bold text-[var(--color-chip-cyan-text)]"
                  aria-label={`${flaggedSubmissionCount} submission${flaggedSubmissionCount === 1 ? "" : "s"} need revision`}
                >
                  {flaggedSubmissionCount}
                </span>
              )}
            </label>
            {flaggedSubmissionCount > 0 && (
              <p className="mt-1 pl-5 text-[11px] text-[var(--color-chip-cyan-text)]">
                {flaggedSubmissionCount} need revision
              </p>
            )}
          </section>
        )}

        <section className="space-y-4 text-xs text-[var(--color-text)]">
          <div>
            <div className="mb-2 font-semibold">Year</div>
            <div className="flex gap-2">
              <input
                value={fromYear}
                onChange={(e) => setFromYear(e.target.value)}
                className="w-full rounded border border-[var(--color-separator)] bg-transparent px-2 py-1 outline-none text-[var(--color-text)] placeholder:text-[var(--color-placeholder)]"
                placeholder="From"
                tabIndex={isCollapsed ? -1 : undefined}
              />
              <input
                value={toYear}
                onChange={(e) => setToYear(e.target.value)}
                className="w-full rounded border border-[var(--color-separator)] bg-transparent px-2 py-1 outline-none text-[var(--color-text)] placeholder:text-[var(--color-placeholder)]"
                placeholder="To"
                tabIndex={isCollapsed ? -1 : undefined}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 font-semibold">Research Area</div>
            <div className="space-y-1">
              {RESEARCH_AREAS.map((area) => (
                <label key={area.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedResearchAreas.includes(area.id)}
                    onChange={() => onToggleResearchArea(area.id)}
                    tabIndex={isCollapsed ? -1 : undefined}
                  />
                  <span>{area.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 font-semibold">Department</div>
            <div className="space-y-1">
              {DEPARTMENTS.map((department) => (
                <label key={department} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(department)}
                    onChange={() => onToggleDepartment(department)}
                    tabIndex={isCollapsed ? -1 : undefined}
                  />
                  <span>{department}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
