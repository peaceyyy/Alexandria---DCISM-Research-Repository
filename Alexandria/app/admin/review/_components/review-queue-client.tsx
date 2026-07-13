"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Clock, RotateCcw, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import type { ReviewStatus, AdminThesisRow } from "@/lib/services/types";

type TabKey = "for_review" | "flagged" | "all";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "for_review", label: "Pending", icon: Clock },
  { key: "flagged",    label: "Flagged", icon: RotateCcw },
  { key: "all",        label: "All",     icon: CheckCircle2 },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ReviewQueueClient({ submissions }: { submissions: AdminThesisRow[] }) {
  const [activeTab, setActiveTab] = useState<TabKey>("for_review");
  const [search, setSearch] = useState("");

  const counts = useMemo(
    () => ({
      for_review: submissions.filter((s) => s.review_status === "for_review").length,
      flagged:    submissions.filter((s) => s.review_status === "flagged").length,
      all:        submissions.filter((s) => s.review_status !== "trashed").length,
    }),
    [submissions],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return submissions.filter((s) => {
      if (activeTab !== "all" && s.review_status !== (activeTab as ReviewStatus)) return false;
      if (!query) return true;
      return (
        s.title.toLowerCase().includes(query) ||
        s.study_type.toLowerCase().includes(query)
      );
    });
  }, [activeTab, search, submissions]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "32px 32px 48px", maxWidth: 900 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#ffffff", margin: 0 }}>
          Review &amp; Approval
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#5a6070", lineHeight: 1.5 }}>
          Review submitted theses, leave field-level feedback, and decide
          whether to approve, flag, or trash a submission.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Filter by review status"
          style={{ display: "flex", gap: 2, padding: 4, borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
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
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "6px 14px", borderRadius: 7, border: "none",
                  background: isActive ? "#1a1e23" : "transparent",
                  color: isActive ? "#ffffff" : "#5a6070",
                  fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
                  transition: "background 150ms ease, color 150ms ease",
                  boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.4)" : "none",
                }}
              >
                <Icon size={13} aria-hidden />
                {label}
                <span
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    minWidth: 18, height: 18, padding: "0 5px", borderRadius: 9,
                    background: isActive ? "rgba(54,139,254,0.2)" : "rgba(255,255,255,0.07)",
                    color: isActive ? "#368bfe" : "#5a6070",
                    fontSize: 11, fontWeight: 700, lineHeight: 1,
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
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 12px", borderRadius: 7,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "#14181c", color: "#5a6070", cursor: "text",
          }}
        >
          <Search size={14} aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search submissions…"
            aria-label="Search submissions"
            style={{ width: 180, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#ffffff", fontFamily: "inherit" }}
          />
        </label>
      </div>

      {/* List */}
      <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ borderRadius: 10, border: "1px dashed rgba(255,255,255,0.1)", background: "#1a1e23", padding: "28px 24px", textAlign: "center", fontSize: 13, color: "#5a6070", lineHeight: 1.6 }}>
            {search ? `No submissions matching "${search}" in this queue.` : "This queue is empty."}
          </div>
        ) : (
          filtered.map((s) => (
            <Link key={s.id} href={`/admin/review/${s.id}`} style={{ textDecoration: "none" }} aria-label={`Review: ${s.title}`}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between",
                  borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)",
                  background: "#1a1e23", padding: "16px 20px", cursor: "pointer",
                  transition: "border-color 150ms ease, background 150ms ease",
                }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(255,255,255,0.14)"; el.style.background = "#1e2328"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(255,255,255,0.07)"; el.style.background = "#1a1e23"; }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <StatusBadge status={s.review_status} />
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#5a6070" }}>
                      {s.study_type === "thesis" ? "Thesis" : "Capstone"}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#ffffff", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>
                    {s.title}
                  </p>
                  <p style={{ margin: "5px 0 0", fontSize: 12, color: "#7a8090" }}>
                    Updated {formatDate(s.updated_at)}
                  </p>
                </div>
                <span style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", fontSize: 12, fontWeight: 600, color: "#d8dadc", whiteSpace: "nowrap", flexShrink: 0 }}>
                  Review →
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
