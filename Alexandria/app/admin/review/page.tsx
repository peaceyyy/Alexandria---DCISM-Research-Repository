"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, MessageSquare, Clock, RotateCcw, CheckCircle2, Trash2 } from "lucide-react";
import { mockReviewSubmissions } from "@/components/admin/mock-data";
import { StatusBadge } from "@/components/admin/status-badge";
import { REVIEW_STATUS_LABEL } from "@/components/review/types";
import type { ReviewStatus } from "@/lib/services/types";

// ─── Tab config ───────────────────────────────────────────────────────────────

type TabKey = "for_review" | "flagged" | "all";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "for_review", label: "Pending",  icon: Clock },
  { key: "flagged",    label: "Flagged",  icon: RotateCcw },
  { key: "all",        label: "All",      icon: CheckCircle2 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewQueuePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("for_review");
  const [search, setSearch] = useState("");

  // Counts for tab badges
  const counts = useMemo(() => ({
    for_review: mockReviewSubmissions.filter((s) => s.reviewStatus === "for_review").length,
    flagged:    mockReviewSubmissions.filter((s) => s.reviewStatus === "flagged").length,
    all:        mockReviewSubmissions.filter((s) => s.reviewStatus !== "trashed").length,
  }), []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mockReviewSubmissions.filter((s) => {
      // Status filter
      if (activeTab === "all") {
        if (s.reviewStatus === "trashed") return false;
      } else {
        if (s.reviewStatus !== (activeTab as ReviewStatus)) return false;
      }

      // Search
      if (!query) return true;
      return (
        s.title.toLowerCase().includes(query) ||
        s.department.toLowerCase().includes(query) ||
        s.authors.some((a) => a.toLowerCase().includes(query)) ||
        (s.researchArea?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [activeTab, search]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: "32px 32px 48px",
        maxWidth: 900,
      }}
    >
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
          }}
        >
          Review &amp; Approval
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#5a6070", lineHeight: 1.5 }}>
          Review submitted theses, leave field-level feedback, and decide
          whether to approve, flag, or trash a submission.
        </p>
      </div>

      {/* ── Tab Bar + Search ─────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Filter by review status"
          style={{
            display: "flex",
            gap: 2,
            padding: 4,
            borderRadius: 9,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {TABS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${key}`}
                id={`tab-${key}`}
                type="button"
                onClick={() => setActiveTab(key)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 14px",
                  borderRadius: 7,
                  border: "none",
                  background: isActive ? "#1a1e23" : "transparent",
                  color: isActive ? "#ffffff" : "#5a6070",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  transition: "background 150ms ease, color 150ms ease",
                  boxShadow: isActive
                    ? "0 1px 3px rgba(0,0,0,0.4)"
                    : "none",
                }}
              >
                <Icon size={13} aria-hidden />
                {label}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 18,
                    height: 18,
                    padding: "0 5px",
                    borderRadius: 9,
                    background: isActive
                      ? "rgba(54, 139, 254, 0.2)"
                      : "rgba(255,255,255,0.07)",
                    color: isActive ? "#368bfe" : "#5a6070",
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px",
            borderRadius: 7,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "#14181c",
            color: "#5a6070",
            cursor: "text",
          }}
        >
          <Search size={14} aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search submissions…"
            aria-label="Search submissions"
            style={{
              width: 180,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "#ffffff",
              fontFamily: "inherit",
            }}
          />
        </label>
      </div>

      {/* ── Submission List ───────────────────────────────────────────────── */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              borderRadius: 10,
              border: "1px dashed rgba(255,255,255,0.1)",
              background: "#1a1e23",
              padding: "28px 24px",
              textAlign: "center",
              fontSize: 13,
              color: "#5a6070",
              lineHeight: 1.6,
            }}
          >
            {search
              ? `No submissions matching "${search}" in this queue.`
              : "This queue is empty."}
          </div>
        ) : (
          filtered.map((s) => {
            const commentCount = s.fieldComments.length;

            return (
              <Link
                key={s.id}
                href={`/admin/review/${s.id}`}
                style={{ textDecoration: "none" }}
                aria-label={`Review: ${s.title}`}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    justifyContent: "space-between",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "#1a1e23",
                    padding: "16px 20px",
                    cursor: "pointer",
                    transition: "border-color 150ms ease, background 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(255,255,255,0.14)";
                    el.style.background = "#1e2328";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(255,255,255,0.07)";
                    el.style.background = "#1a1e23";
                  }}
                >
                  {/* Left: info */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <StatusBadge status={s.reviewStatus} />

                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          color: "#5a6070",
                        }}
                      >
                        {s.studyType === "thesis" ? "Thesis" : "Capstone"} ·{" "}
                        {s.department}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#ffffff",
                        lineHeight: 1.4,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      }}
                    >
                      {s.title}
                    </p>

                    <p
                      style={{
                        margin: "5px 0 0",
                        fontSize: 12,
                        color: "#7a8090",
                      }}
                    >
                      {s.authors.slice(0, 2).join(", ")}
                      {s.authors.length > 2
                        ? ` +${s.authors.length - 2} more`
                        : ""}
                      {" · "}
                      Submitted {formatDate(s.submittedAt)}
                    </p>
                  </div>

                  {/* Right: comment count + action */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexShrink: 0,
                    }}
                  >
                    {commentCount > 0 && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 12,
                          color: "#368bfe",
                          fontWeight: 500,
                        }}
                        aria-label={`${commentCount} review comment${commentCount !== 1 ? "s" : ""}`}
                        title={`${commentCount} reviewer comment${commentCount !== 1 ? "s" : ""}`}
                      >
                        <MessageSquare size={13} aria-hidden />
                        {commentCount}
                      </span>
                    )}

                    <span
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.04)",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#d8dadc",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Review →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
