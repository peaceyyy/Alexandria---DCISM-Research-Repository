"use client";
import { BookText, Clock, Users } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  mockStats,
  mockUploads,
  mockActivity,
  mockByDepartment,
  type MockUpload,
} from "@/components/admin/mock-data";


const uploadColumns: Column<MockUpload>[] = [
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
    key: "dateCreated",
    header: "Date Created",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Greeting */}
      <h1 className="text-2xl font-bold text-white">
        Good day, <span className="text-[#368bfe]">Admin</span>!
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <StatCard
          icon={BookText}
          value={mockStats.totalResearch}
          label="Total Research"
        />
        <StatCard
          icon={Users}
          value={mockStats.registeredUsers}
          label="Registered Users"
        />
        <StatCard
          icon={Clock}
          value={mockStats.pendingDocs}
          label="Pending Docs"
        />
      </div>

      {/* Recent Uploads Table */}
      <DataTable
        title="Recent Uploads"
        columns={uploadColumns}
        data={mockUploads}
        pageSize={5}
        rowKey="id"
      />

      {/* Bottom two-column row */}
      <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
        {/* Recent Activity */}
        <section
          className="rounded-[10px] border border-white/[0.07] bg-[#1a1e23] p-5"
          aria-label="Recent Activity"
        >
          <h2 className="mb-4 text-[15px] font-bold text-white">Recent Activity</h2>
          <ul className="flex flex-col gap-3" role="list">
            {mockActivity.map((item, i) => (
              <li key={i}>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#969696]">
                  {item.date}
                </p>
                <p className="mt-0.5 text-sm text-[#d8dadc]">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Research by Department */}
        <section
          className="rounded-[10px] border border-white/[0.07] bg-[#1a1e23] p-5"
          aria-label="Research by Department"
        >
          <h2 className="mb-4 text-[15px] font-bold text-white">Research by Department</h2>
          <ul className="flex flex-col gap-3" role="list">
            {mockByDepartment.map((dept) => (
              <li key={dept.label} className="flex items-center justify-between">
                <span className="text-sm text-[#d8dadc]">{dept.label}</span>
                <div className="flex items-center gap-3">
                  {/* Progress bar */}
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10 max-sm:hidden">
                    <div
                      className="h-full rounded-full bg-[#368bfe]"
                      style={{
                        width: `${Math.round((dept.count / mockByDepartment[0].count) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white tabular-nums">{dept.count}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
