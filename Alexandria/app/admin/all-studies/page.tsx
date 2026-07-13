"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookText, Eye, FileText, MessageSquareText, Plus, Search } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { mockReviewSubmissions, updateReviewSubmission } from "@/components/admin/mock-data";
import type { ReviewStatus } from "@/lib/services/types";

const FILTER_STATUS_MAP: Record<string, ReviewStatus | null> = {
  All: null,
  Pending: "for_review",
  Approved: "accepted",
  Flagged: "flagged",
};

const FILTERS = ["All", "Pending", "Approved", "Flagged"] as const;
type StudyFilter = (typeof FILTERS)[number];

export default function AllStudiesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<StudyFilter>("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState(mockReviewSubmissions);
  const [commentDraft, setCommentDraft] = useState("");
  const [splitRatio, setSplitRatio] = useState(60);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nextRatio = ((event.clientX - rect.left) / rect.width) * 100;
      setSplitRatio(Math.min(75, Math.max(25, nextRatio)));
    };

    const handleMouseUp = () => setIsResizing(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const filteredSubmissions = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    const targetStatus = FILTER_STATUS_MAP[filter];
    const base = !targetStatus
      ? submissions
      : submissions.filter((s) => s.reviewStatus === targetStatus);

    if (!normalizedQuery) return base;

    return base.filter((s) => {
      const haystack = [
        s.title,
        s.department,
        s.researchArea ?? "",
        ...s.authors,
        ...s.advisers,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [filter, searchTerm, submissions]);

  const selectedSubmission = submissions.find((s) => s.id === selectedId) ?? null;
  const showDetailPanel = Boolean(selectedSubmission);

  const handleStatusChange = (nextStatus: ReviewStatus) => {
    if (!selectedSubmission) return;
    const updated = updateReviewSubmission(selectedSubmission.id, { reviewStatus: nextStatus });
    if (!updated) return;
    setSubmissions((cur) => cur.map((s) => (s.id === selectedSubmission.id ? updated : s)));
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">All Studies</h1>
        <p className="text-sm text-[#9ea4ad]">
          Review every study in one place, filter by status, search by keyword, and inspect the details on the right.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <StatCard icon={BookText} value={submissions.length} label="Submitted Studies" />
        <StatCard icon={FileText} value={submissions.filter((s) => s.reviewStatus === "for_review").length} label="Pending" />
        <StatCard icon={Eye} value={submissions.filter((s) => s.reviewStatus === "accepted").length} label="Approved" />
      </div>

      <div ref={containerRef} className="flex flex-col gap-4 xl:flex-row xl:gap-0">
        <section
          className="rounded-[10px] border border-white/[0.07] bg-[#1a1e23] p-5"
          style={{ flexBasis: showDetailPanel ? `${splitRatio}%` : "100%", minWidth: 0 }}
        >
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-white">Study Queue</h2>
              <p className="text-sm text-[#9ea4ad]">Filter by status, search by keyword, and select a study to inspect.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search studies"
                className="rounded-[7px] border border-white/10 bg-[#14181c] px-3 py-2 text-[13px] text-white outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchTerm(searchInput)}
                className="rounded-[7px] border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] font-semibold text-[#d8dadc] transition hover:bg-white/[0.08]"
              >
                Search
              </button>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as StudyFilter)}
                className="rounded-[7px] border border-white/10 bg-[#14181c] px-3 py-2 text-[13px] text-white outline-none"
              >
                {FILTERS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredSubmissions.map((s) => {
              const isSelected = s.id === selectedSubmission?.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setSelectedId(s.id); setCommentDraft(""); }}
                  className={`rounded-[10px] border p-4 text-left transition ${
                    isSelected
                      ? "border-[#368bfe]/70 bg-[#368bfe]/10"
                      : "border-white/[0.07] bg-[#14181c] hover:border-white/15 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{s.title}</p>
                      <p className="mt-1 text-xs text-[#9ea4ad]">
                        {s.department} · {s.studyType === "thesis" ? "Thesis" : "Capstone"}
                      </p>
                    </div>
                    <StatusBadge status={s.reviewStatus} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[12px] text-[#8f96a0]">
                    <span>{s.authors.slice(0, 2).join(", ")}{s.authors.length > 2 ? " + more" : ""}</span>
                    <span>Submitted {new Date(s.submittedAt).toLocaleDateString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {showDetailPanel ? (
          <div
            className="hidden cursor-col-resize rounded-full bg-white/10 xl:block"
            style={{ width: "8px", alignSelf: "stretch" }}
            onMouseDown={() => setIsResizing(true)}
            aria-label="Resize study panels"
            role="separator"
          />
        ) : null}

        {showDetailPanel && selectedSubmission ? (
          <section className="rounded-[10px] border border-white/[0.07] bg-[#1a1e23] p-5" style={{ flexBasis: `${100 - splitRatio}%`, minWidth: 0 }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#969696]">Study Details</p>
                <h2 className="mt-1 text-[18px] font-bold text-white">{selectedSubmission.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/review/${selectedSubmission.id}`}
                  className="rounded-[7px] border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] font-semibold text-[#d8dadc] transition hover:bg-white/[0.08]"
                >
                  Full Review
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="rounded-[7px] border border-white/10 bg-white/[0.04] p-2 text-[#d8dadc] transition hover:bg-white/[0.08]"
                  aria-label="Close study details"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-[8px] border border-white/[0.07] bg-[#14181c] p-4">
              <div className="flex items-center gap-2 text-white">
                <Search size={16} aria-hidden />
                <h3 className="text-[14px] font-semibold">Research Overview</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#d8dadc]">{selectedSubmission.abstract}</p>
            </div>

            <div className="mt-5 rounded-[8px] border border-white/[0.07] bg-[#14181c] p-4">
              <h3 className="text-[14px] font-semibold text-white">Authors</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedSubmission.authors.map((a) => (
                  <span key={a} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-[#d8dadc]">{a}</span>
                ))}
              </div>
            </div>

            {selectedSubmission.primaryFile && (
              <div className="mt-5 rounded-[8px] border border-white/[0.07] bg-[#14181c] p-4">
                <div className="flex items-center gap-2 text-white">
                  <FileText size={16} aria-hidden />
                  <h3 className="text-[14px] font-semibold">Attached File</h3>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-white/[0.07] bg-white/[0.03] px-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{selectedSubmission.primaryFile.fileName}</p>
                    <p className="text-xs text-[#9ea4ad]">{selectedSubmission.primaryFile.fileSize}</p>
                  </div>
                  <a
                    href={selectedSubmission.primaryFile.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[7px] bg-[#368bfe] px-3 py-2 text-[12px] font-semibold text-white transition hover:opacity-90"
                  >
                    Open PDF
                  </a>
                </div>
              </div>
            )}

            <div className="mt-5 rounded-[8px] border border-white/[0.07] bg-[#14181c] p-4">
              <div className="flex items-center gap-2 text-white">
                <MessageSquareText size={16} aria-hidden />
                <h3 className="text-[14px] font-semibold">Review Decision</h3>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                <label className="text-sm text-[#d8dadc]">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#969696]">Status</span>
                  <select
                    value={selectedSubmission.reviewStatus}
                    onChange={(e) => handleStatusChange(e.target.value as ReviewStatus)}
                    className="w-full rounded-[7px] border border-white/10 bg-[#0f1317] px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="for_review">Pending</option>
                    <option value="accepted">Approved</option>
                    <option value="flagged">Flagged</option>
                    <option value="trashed">Trashed</option>
                  </select>
                </label>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
