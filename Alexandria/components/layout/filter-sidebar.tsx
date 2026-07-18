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
  selectedStudyTypes: string[];
  onToggleResearchArea: (value: string) => void;
  onToggleDepartment: (value: string) => void;
  onToggleStudyType: (value: string) => void;
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
  selectedStudyTypes,
  onToggleResearchArea,
  onToggleDepartment,
  onToggleStudyType,
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
        className,
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
            aria-label={
              isCollapsed ? "Expand filter panel" : "Collapse filter panel"
            }
            aria-expanded={!isCollapsed}
            aria-controls="filter-sidebar"
            title={
              isCollapsed ? "Expand filter panel" : "Collapse filter panel"
            }
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
          <section
            className="mb-5 border-y border-[var(--color-separator)] py-3"
            aria-label="My submissions"
          >
            <label className="flex min-h-8 cursor-pointer items-center gap-2 text-xs font-semibold text-[var(--color-text)]">
              <input
                type="checkbox"
                checked={mySubmissionsActive}
                onChange={onToggleMySubmissions}
                aria-label="My submissions"
                tabIndex={isCollapsed ? -1 : undefined}
              />
              <span>My submissions</span>
            </label>
            {flaggedSubmissionCount > 0 && (
              <p className="mt-1 pl-5 text-[11px] text-[var(--color-chip-cyan-text)]">
                {flaggedSubmissionCount} need revision
              </p>
            )}
          </section>
        )}

        <section className="space-y-6 text-xs text-[var(--color-text)]">
          <div>
            <div className="mb-3 font-semibold">Year</div>
            <div className="flex gap-2">
              <input
                value={fromYear}
                onChange={(e) => setFromYear(e.target.value)}
                className="w-full rounded border border-[var(--color-separator)] bg-transparent px-2 py-1.5 outline-none text-[var(--color-text)] placeholder:text-[var(--color-placeholder)] focus-visible:border-[var(--color-brand)] focus-visible:ring-1 focus-visible:ring-[var(--color-brand)] transition-all"
                placeholder="From"
                tabIndex={isCollapsed ? -1 : undefined}
              />
              <input
                value={toYear}
                onChange={(e) => setToYear(e.target.value)}
                className="w-full rounded border border-[var(--color-separator)] bg-transparent px-2 py-1.5 outline-none text-[var(--color-text)] placeholder:text-[var(--color-placeholder)] focus-visible:border-[var(--color-brand)] focus-visible:ring-1 focus-visible:ring-[var(--color-brand)] transition-all"
                placeholder="To"
                tabIndex={isCollapsed ? -1 : undefined}
              />
            </div>
          </div>

          <div>
            <div className="mb-3 font-semibold">Research Area</div>
            <div className="flex flex-wrap gap-2">
              {RESEARCH_AREAS.map((area) => {
                const isSelected = selectedResearchAreas.includes(area.id);
                return (
                  <label
                    key={area.id}
                    className={cn(
                      "cursor-pointer select-none rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all",
                      isSelected
                        ? "border-[var(--color-brand-cyan)] bg-[var(--color-brand-cyan)] text-white shadow-sm"
                        : "border-[var(--color-separator-mid)] bg-transparent text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => onToggleResearchArea(area.id)}
                      tabIndex={isCollapsed ? -1 : undefined}
                    />
                    {area.label}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-3 font-semibold">Study Type</div>
            <div className="flex flex-wrap gap-2">
              {[
                ["thesis", "Thesis"],
                ["capstone", "Capstone"],
              ].map(([value, label]) => {
                const isSelected = selectedStudyTypes.includes(value);
                return (
                  <label
                    key={value}
                    className={cn(
                      "cursor-pointer select-none rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all",
                      isSelected
                        ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white shadow-sm"
                        : "border-[var(--color-separator-mid)] bg-transparent text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => onToggleStudyType(value)}
                      tabIndex={isCollapsed ? -1 : undefined}
                    />
                    {label}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-3 font-semibold">Department</div>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((department) => {
                const isSelected = selectedDepartments.includes(department);
                return (
                  <label
                    key={department}
                    className={cn(
                      "cursor-pointer select-none rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all",
                      isSelected
                        ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white shadow-sm"
                        : "border-[var(--color-separator-mid)] bg-transparent text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => onToggleDepartment(department)}
                      tabIndex={isCollapsed ? -1 : undefined}
                    />
                    {department}
                  </label>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
