"use client";

import { BookText, Clock, Users } from "lucide-react";
import { DataTable, type Column } from "./data-table";
import { StatCard } from "./stat-card";
import { StatusBadge } from "./status-badge";
import type {
  AdminDashboardSnapshot,
  DashboardUploadRow,
} from "@/lib/services/types";

const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDate(value: string, includeTime = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return includeTime
    ? dateTimeFormatter.format(date)
    : dateFormatter.format(date);
}

const uploadColumns: Column<DashboardUploadRow>[] = [
  {
    key: "title",
    header: "Title",
    className: "max-w-[260px]",
  },
  {
    key: "author",
    header: "Author",
  },
  {
    key: "created_at",
    header: "Date Created",
    render: (row) => formatDate(row.created_at),
  },
  {
    key: "review_status",
    header: "Status",
    render: (row) => <StatusBadge status={row.review_status} />,
  },
];

export function AdminDashboardView({
  snapshot,
}: {
  snapshot: AdminDashboardSnapshot;
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
        title="Recent Uploads"
        columns={uploadColumns}
        data={snapshot.recent_uploads}
        pageSize={5}
        rowKey="id"
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
