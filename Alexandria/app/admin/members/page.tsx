"use client";
import { UserPlus, Users } from "lucide-react";
import { DataTable, type Column } from "@/app/admin/_components/data-table";
import { RowActions } from "@/app/admin/_components/row-actions";
import { StatCard } from "@/app/admin/_components/stat-card";
import {
  mockMembers,
  type MockMember,
} from "@/app/admin/_components/mock-data";

const memberColumns: Column<MockMember>[] = [
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "affiliation", header: "Affiliation" },
  {
    key: "actions",
    header: "Actions",
    render: (_row) => (
      <RowActions
        editLabel="Edit member"
        deleteLabel="Delete member"
        // onEdit and onDelete will wire to real handlers in backend integration phase
      />
    ),
  },
];

export default function MembersPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-white">
        Good day, <span className="text-[#368bfe]">Admin</span>!
      </h1>

      {/* Summary stat */}
      <div className="max-w-xs">
        <StatCard
          icon={Users}
          value={mockMembers.length}
          label="Registered Members"
        />
      </div>

      {/* Members Table */}
      <DataTable
        title="Members"
        columns={memberColumns}
        data={mockMembers}
        pageSize={5}
        rowKey="id"
        headerAction={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[7px] bg-[#368bfe] px-3 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-85 active:opacity-70"
          >
            <UserPlus size={14} aria-hidden />
            Add Member
          </button>
        }
      />
    </div>
  );
}
