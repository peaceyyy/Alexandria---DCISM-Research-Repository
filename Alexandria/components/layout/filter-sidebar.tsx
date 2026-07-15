"use client";

import { cn } from "@/lib/utils";

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
};

const researchAreas = [
  "AI / ML",
  "Web Development",
  "Mobile Development",
  "Cybersecurity",
  "IoT",
  "Data Science",
];

const departments = [
  "Computer Science",
  "Information Technology",
  "Information Systems",
];

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
}: FilterSidebarProps) {
  return (
    <aside className={cn("border-r border-white/15 px-3 py-4", className)}>
      <div className="mb-4 text-sm font-semibold text-white/60">Filter</div>

      {showMySubmissions && (
        <section className="mb-5 border-y border-white/10 py-3" aria-label="My submissions">
          <label className="flex min-h-8 cursor-pointer items-center gap-2 text-xs font-semibold text-white/90">
            <input
              type="checkbox"
              checked={mySubmissionsActive}
              onChange={onToggleMySubmissions}
              aria-label="My submissions"
            />
            <span>My submissions</span>
            {flaggedSubmissionCount > 0 && (
              <span
                className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full border border-[#1da0c9]/50 bg-[#1da0c9]/10 px-1.5 py-0.5 text-[11px] font-bold text-[#9ddff2]"
                aria-label={`${flaggedSubmissionCount} submission${flaggedSubmissionCount === 1 ? "" : "s"} need revision`}
              >
                {flaggedSubmissionCount}
              </span>
            )}
          </label>
          {flaggedSubmissionCount > 0 && (
            <p className="mt-1 pl-5 text-[11px] text-[#9ddff2]">
              {flaggedSubmissionCount} need revision
            </p>
          )}
        </section>
      )}

      <section className="space-y-4 text-xs text-white/80">
        <div>
          <div className="mb-2 font-semibold">Year</div>
          <div className="flex gap-2">
            <input
              value={fromYear}
              onChange={(e) => setFromYear(e.target.value)}
              className="w-full rounded border border-white/25 bg-transparent px-2 py-1 outline-none"
              placeholder="From"
            />
            <input
              value={toYear}
              onChange={(e) => setToYear(e.target.value)}
              className="w-full rounded border border-white/25 bg-transparent px-2 py-1 outline-none"
              placeholder="To"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 font-semibold">Research Area</div>
          <div className="space-y-1">
            {researchAreas.map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedResearchAreas.includes(item)}
                  onChange={() => onToggleResearchArea(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 font-semibold">Department</div>
          <div className="space-y-1">
            {departments.map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedDepartments.includes(item)}
                  onChange={() => onToggleDepartment(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
    </aside>
  );
}
