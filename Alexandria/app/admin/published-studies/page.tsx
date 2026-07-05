"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { mockReviewSubmissions } from "@/components/admin/mock-data";

const FILTERS = ["All", "Thesis", "Capstone"] as const;
type StudyTypeFilter = (typeof FILTERS)[number];

function getDepartmentLabel(department: string) {
  switch (department) {
    case "BSCS":
      return "Computer Science";
    case "BSIT":
      return "Information Technology";
    case "BSIS":
      return "Information Systems";
    default:
      return department;
  }
}

export default function PublishedStudiesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [studyTypeFilter, setStudyTypeFilter] = useState<StudyTypeFilter>("All");

  const publishedStudies = useMemo(
    () => mockReviewSubmissions.filter((study) => study.status === "Approved"),
    [],
  );

  const filteredStudies = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return publishedStudies.filter((study) => {
      const matchesType = studyTypeFilter === "All" || study.studyType === studyTypeFilter;
      if (!matchesType) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      const searchableText = [
        study.title,
        study.author,
        ...study.authors,
        study.abstract,
        study.category,
        getDepartmentLabel(study.department),
        ...study.researchArea,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalized);
    });
  }, [publishedStudies, searchTerm, studyTypeFilter]);

  return (
    <div className="min-h-screen bg-[#14181c] text-white">
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7f8a96]">Published Studies</p>
            <h1 className="mt-2 text-3xl font-bold">Approved studies in the repository</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#d8dadc]">
              Browse published research works that have already been approved, and search by title, author, research area, or field.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#1a1e23] px-3 py-2 text-sm text-[#d8dadc]">
              <Search size={16} aria-hidden />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search studies"
                className="w-44 bg-transparent outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => setSearchTerm(searchInput)}
              className="rounded-lg bg-[#368bfe] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Search
            </button>
            <select
              value={studyTypeFilter}
              onChange={(event) => setStudyTypeFilter(event.target.value as StudyTypeFilter)}
              className="rounded-lg border border-white/10 bg-[#1a1e23] px-3 py-2 text-sm text-white outline-none"
            >
              {FILTERS.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {filteredStudies.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/10 bg-[#1a1e23] p-8 text-sm text-[#9ea4ad]">
              No published studies match the selected filters.
            </div>
          ) : (
            filteredStudies.map((study) => (
              <a key={study.id} href={`/admin/published-studies/${study.id}`} className="block rounded-lg border border-[#d9d9d9]/15 bg-[#1a1e23] p-6 transition-colors hover:bg-white/5">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-[#969696]">
                  <span>{study.publicationDate}</span>
                  <span>•</span>
                  <span>{getDepartmentLabel(study.department)}</span>
                  <span>•</span>
                  <span>{study.studyType}</span>
                </div>
                <h2 className="mb-3 text-xl font-extrabold leading-tight text-white">{study.title}</h2>
                <p className="mb-3 text-sm text-[#d8dadc]">{study.abstract}</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {study.researchArea.map((area) => (
                    <span key={area} className="rounded-full bg-[#368bfe]/10 px-3 py-1 text-xs font-medium text-[#8ec5ff]">
                      {area}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-[#9ea4ad]">By {study.authors.join(", ")}</div>
              </a>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
