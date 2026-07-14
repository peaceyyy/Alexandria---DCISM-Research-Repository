"use client";

import { BookText, Clock, Users } from "lucide-react";
import Link from "next/link";
import { DataTable, type Column } from "./data-table";
import { StatCard } from "./stat-card";
import { StatusBadge } from "./status-badge";
import type {
  AdminDashboardSnapshot,
  ReviewStatus,
  ReviewSubmissionListItem,
} from "@/lib/services/types";

const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
  timeStyle: "short",
});

type DashboardStatusFilter = ReviewStatus | "all";

const STATUS_FILTERS: Array<{
  value: DashboardStatusFilter;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "for_review", label: "Pending" },
  { value: "flagged", label: "Flagged" },
  { value: "accepted", label: "Approved" },
  { value: "trashed", label: "Trashed" },
];

function formatDate(value: string, includeTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return includeTime
    ? dateTimeFormatter.format(date)
    : dateFormatter.format(date);
}

const reviewQueueColumns: Column<ReviewSubmissionListItem>[] = [
  {
    key: "title",
    header: "Title",
    className: "max-w-[260px]",
  },
  {
    key: "authors",
    header: "Authors",
    render: (row) =>
      row.authors.length > 0 ? row.authors.slice(0, 2).join(", ") : "Unknown author",
  },
  {
    key: "submittedAt",
    header: "Submitted",
    render: (row) => formatDate(row.submittedAt),
  },
  {
    key: "reviewStatus",
    header: "Status",
    render: (row) => <StatusBadge status={row.reviewStatus} />,
  },
  {
    key: "commentCount",
    header: "Comments",
  },
  {
    key: "id",
    header: "Action",
    render: (row) =>
      row.reviewStatus === "for_review" ? (
        <Link
          href={`/admin/review/${row.id}`}
          className="inline-flex items-center justify-center rounded-[7px] border border-[#368bfe]/40 bg-[#368bfe]/10 px-3 py-1.5 text-[12px] font-semibold text-[#7db2ff] transition hover:border-[#368bfe]/70 hover:bg-[#368bfe]/15"
        >
          Review
        </Link>
      ) : (
        <span className="text-[12px] text-[#8f96a0]">No review action</span>
      ),
  },
];

export function AdminDashboardView({
  snapshot,
  reviewQueue,
  reviewQueueError,
  selectedStatus,
}: {
  snapshot: AdminDashboardSnapshot;
  reviewQueue: ReviewSubmissionListItem[];
  reviewQueueError: string | null;
  selectedStatus: DashboardStatusFilter;
}) {
  const largestDepartmentCount =
    snapshot.research_by_department[0]?.count ?? 0;

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold text-white">
        Good day,{" "}
        <span className="text-[#368bfe]">
          {snapshot.viewer.profile_name}
        </span>
        !
      </h1>

      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <StatCard
          icon={BookText}
          value={snapshot.metrics.total_research}
          label="Total Research"
        />
        <StatCard
          icon={Users}
          value={snapshot.metrics.registered_users}
          label="Registered Users"
        />
        <StatCard
          icon={Clock}
          value={snapshot.metrics.pending_docs}
          label="Pending Docs"
        />
      </div>

      <DataTable
        title="Submission Queue"
        columns={reviewQueueColumns}
        data={reviewQueue}
        pageSize={10}
        rowKey="id"
        headerAction={
          <div className="flex flex-col items-end gap-2">
            {reviewQueueError && (
              <p className="max-w-[420px] text-right text-[12px] text-[#ffb3b3]">
                {reviewQueueError}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-end gap-2">
              {STATUS_FILTERS.map((filter) => {
                const isActive = selectedStatus === filter.value;
                const href =
                  filter.value === "all"
                    ? "/admin/dashboard"
                    : `/admin/dashboard?status=${filter.value}`;

                return (
                  <Link
                    key={filter.value}
                    href={href}
                    className={`rounded-[7px] border px-3 py-1.5 text-[12px] font-semibold transition ${
                      isActive
                        ? "border-[#368bfe]/60 bg-[#368bfe]/15 text-[#7db2ff]"
                        : "border-white/10 bg-white/[0.04] text-[#d8dadc] hover:bg-white/[0.08]"
                    }`}
                  >
                    {filter.label}
                  </Link>
                );
              })}
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        <section
          className="rounded-[10px] border border-white/[0.07] bg-[#1a1e23] p-5"
          aria-label="Recent Activity"
        >
          <h2 className="mb-4 text-[15px] font-bold text-white">
            Recent Activity
          </h2>
          {snapshot.recent_activity.length === 0 ? (
            <p className="text-sm text-[#969696]">No audit activity yet.</p>
          ) : (
            <ul className="flex flex-col gap-3" role="list">
              {snapshot.recent_activity.map((item) => (
                <li key={item.id}>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#969696]">
                    {formatDate(item.occurred_at, true)}
                  </p>
                  <p className="mt-0.5 text-sm text-[#d8dadc]">{item.text}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          className="rounded-[10px] border border-white/[0.07] bg-[#1a1e23] p-5"
          aria-label="Research by Department"
        >
          <h2 className="mb-4 text-[15px] font-bold text-white">
            Research by Department
          </h2>
          {snapshot.research_by_department.length === 0 ? (
            <p className="text-sm text-[#969696]">
              No department totals yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-3" role="list">
              {snapshot.research_by_department.map((department) => (
                <li
                  key={department.department}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-[#d8dadc]">
                    {department.department}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10 max-sm:hidden">
                      <div
                        className="h-full rounded-full bg-[#368bfe]"
                        style={{
                          width: `${
                            largestDepartmentCount
                              ? Math.round(
                                  (department.count /
                                    largestDepartmentCount) *
                                    100,
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white tabular-nums">
                      {department.count}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
