"use client";
import { UserCheck } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { RowActions } from "@/components/admin/row-actions";
import { StatCard } from "@/components/admin/stat-card";
import { mockModerators, type MockModerator } from "@/components/admin/mock-data";


const moderatorColumns: Column<MockModerator>[] = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  {
    key: "actions",
    header: "Actions",
    render: (_row) => (
      <RowActions
        editLabel="Edit moderator"
        deleteLabel="Remove moderator"
      />
    ),
  },
];

export default function ModeratorsPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold text-white">
        Good day, <span className="text-[#368bfe]">Admin</span>!
      </h1>

      <div className="max-w-xs">
        <StatCard
          icon={UserCheck}
          value={mockModerators.length}
          label="Active Moderators"
        />
      </div>

      <DataTable
        title="Moderators"
        columns={moderatorColumns}
        data={mockModerators}
        pageSize={5}
        rowKey="id"
        headerAction={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[7px] bg-[#368bfe] px-3 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-85 active:opacity-70"
          >
            <UserCheck size={14} aria-hidden />
            Add Moderator
          </button>
        }
      />
    </div>
  );
}
