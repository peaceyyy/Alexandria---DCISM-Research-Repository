"use client";

import {
  Shield,
  ShieldCheck,
  ShieldMinus,
  UserCheck,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import {
  changeUserRoleAction,
  deactivateUserAction,
  reactivateUserAction,
} from "@/app/admin/actions";
import type {
  PaginationMeta,
  UserAdminRow,
  UserRole,
  UserRoleCounts,
} from "@/lib/services/types";
import { DataTable, type Column } from "./data-table";
import actionStyles from "./row-actions.module.css";
import { StatCard } from "./stat-card";
import { StatusBadge } from "./status-badge";

type ManagedRole = Extract<UserRole, "member" | "moderator">;

type UserManagementViewProps = {
  rows: UserAdminRow[];
  pagination: PaginationMeta;
  role: UserRole;
  roleCounts: UserRoleCounts;
  viewerName: string;
};

const ROLE_TABS: Array<{ role: UserRole; label: string }> = [
  { role: "member", label: "Members" },
  { role: "moderator", label: "Moderators" },
  { role: "admin", label: "Administrators" },
];

function displayAffiliation(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function UserManagementView({
  rows,
  pagination,
  role,
  roleCounts,
  viewerName,
}: UserManagementViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [deactivationTarget, setDeactivationTarget] =
    useState<UserAdminRow | null>(null);
  const [reason, setReason] = useState("");

  const isMemberList = role === "member";
  const isModeratorList = role === "moderator";
  const isAdministratorList = role === "admin";
  const targetRole: ManagedRole | null = isMemberList
    ? "moderator"
    : isModeratorList
      ? "member"
      : null;
  const title = ROLE_TABS.find((tab) => tab.role === role)?.label
    ?? "Accounts";
  const statIcon = isMemberList
    ? UserCheck
    : isModeratorList
      ? ShieldCheck
      : Shield;
  const totalPages = Math.max(
    1,
    Math.ceil(pagination.total_count / pagination.limit),
  );

  function refreshAfterMutation(message: string) {
    setFeedback({ tone: "success", message });
    router.refresh();
  }

  function changePage(page: number) {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  }

  function handleRoleChange(row: UserAdminRow) {
    if (!targetRole) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const result = await changeUserRoleAction(row.id, targetRole);
      if (result.error) {
        setFeedback({ tone: "error", message: result.error.message });
        return;
      }

      refreshAfterMutation(
        `${row.profile_name} is now a ${targetRole}.`,
      );
    });
  }

  function handleReactivate(row: UserAdminRow) {
    setFeedback(null);
    startTransition(async () => {
      const result = await reactivateUserAction(row.id);
      if (result.error) {
        setFeedback({ tone: "error", message: result.error.message });
        return;
      }

      refreshAfterMutation(`${row.profile_name} was reactivated.`);
    });
  }

  function handleDeactivateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!deactivationTarget) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const result = await deactivateUserAction(
        deactivationTarget.id,
        reason,
      );
      if (result.error) {
        setFeedback({ tone: "error", message: result.error.message });
        return;
      }

      const profileName = deactivationTarget.profile_name;
      setDeactivationTarget(null);
      setReason("");
      refreshAfterMutation(`${profileName} was deactivated.`);
    });
  }

  const accountColumns: Column<UserAdminRow>[] = [
    { key: "profile_name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "affiliation",
      header: "Affiliation",
      render: (row) => displayAffiliation(row.affiliation),
    },
    {
      key: "account_status",
      header: "Status",
      render: (row) => (
        <StatusBadge
          status={
            isAdministratorList
              ? "protected"
              : row.deactivated_at
                ? "deactivated"
                : "active"
          }
        />
      ),
    },
  ];

  const actionColumn: Column<UserAdminRow> = {
    key: "actions",
    header: "Actions",
    render: (row) => (
      <div className={actionStyles.actions}>
        <button
          type="button"
          className={`${actionStyles.btn} ${actionStyles.edit}`}
          disabled={isPending || Boolean(row.deactivated_at)}
          onClick={() => handleRoleChange(row)}
          aria-label={`${isMemberList ? "Promote" : "Demote"} ${row.profile_name}`}
          title={
            row.deactivated_at
              ? "Reactivate this account before changing its role."
              : undefined
          }
        >
          {isMemberList ? (
            <ShieldCheck size={14} aria-hidden />
          ) : (
            <ShieldMinus size={14} aria-hidden />
          )}
          <span className={actionStyles.btnLabel}>
            {isMemberList ? "Promote" : "Demote"}
          </span>
        </button>
        {row.deactivated_at ? (
          <button
            type="button"
            className={`${actionStyles.btn} ${actionStyles.restore}`}
            disabled={isPending}
            onClick={() => handleReactivate(row)}
            aria-label={`Reactivate ${row.profile_name}`}
          >
            <UserCheck size={14} aria-hidden />
            <span className={actionStyles.btnLabel}>Reactivate</span>
          </button>
        ) : (
          <button
            type="button"
            className={`${actionStyles.btn} ${actionStyles.delete}`}
            disabled={isPending}
            onClick={() => {
              setFeedback(null);
              setReason("");
              setDeactivationTarget(row);
            }}
            aria-label={`Deactivate ${row.profile_name}`}
          >
            <UserX size={14} aria-hidden />
            <span className={actionStyles.btnLabel}>Deactivate</span>
          </button>
        )}
      </div>
    ),
  };

  const columns = isAdministratorList
    ? accountColumns
    : [...accountColumns, actionColumn];

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold text-white">
        Good day, <span className="text-[#368bfe]">{viewerName}</span>!
      </h1>

      <div>
        <h2 className="text-lg font-bold text-white">User Management</h2>
        <p className="mt-1 text-sm text-[#969696]">
          View accounts by role and manage member or moderator access.
        </p>
      </div>

      <nav
        aria-label="User account roles"
        className="flex w-fit flex-wrap gap-1 rounded-[9px] border border-white/[0.08] bg-[#14181c] p-1"
      >
        {ROLE_TABS.map((tab) => {
          const isActive = role === tab.role;
          return (
            <Link
              key={tab.role}
              href={`/admin/users?role=${tab.role}`}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "rounded-[7px] bg-[#203858] px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-[7px] px-4 py-2 text-sm font-semibold text-[#969696] transition-colors hover:bg-white/[0.05] hover:text-white"
              }
            >
              {tab.label}
              <span
                className={
                  isActive
                    ? "ml-2 rounded-full bg-[#368bfe]/25 px-2 py-0.5 text-xs text-[#78adff]"
                    : "ml-2 rounded-full bg-white/[0.06] px-2 py-0.5 text-xs"
                }
              >
                {roleCounts[tab.role]}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="max-w-xs">
        <StatCard
          icon={statIcon}
          value={pagination.total_count}
          label={
            isAdministratorList
              ? "Protected Administrators"
              : `Registered ${title}`
          }
        />
      </div>

      {isAdministratorList ? (
        <p className="rounded-[8px] border border-[#368bfe]/20 bg-[#368bfe]/[0.07] px-4 py-3 text-sm text-[#a9c9ff]">
          Administrator accounts are visible here for transparency but cannot
          be modified from the dashboard.
        </p>
      ) : null}

      {feedback ? (
        <p
          role={feedback.tone === "error" ? "alert" : "status"}
          className={
            feedback.tone === "error"
              ? "text-sm text-[#ff6b6b]"
              : "text-sm text-[#59c987]"
          }
        >
          {feedback.message}
        </p>
      ) : null}

      <DataTable
        title={title}
        columns={columns}
        data={rows}
        pageSize={pagination.limit}
        rowKey="id"
        page={pagination.page}
        totalPages={totalPages}
        onPageChange={changePage}
      />

      {deactivationTarget ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deactivate-title"
        >
          <form
            onSubmit={handleDeactivateSubmit}
            className="w-full max-w-md rounded-[10px] border border-white/[0.1] bg-[#1a1e23] p-6 shadow-2xl"
          >
            <h2
              id="deactivate-title"
              className="text-lg font-bold text-white"
            >
              Deactivate {deactivationTarget.profile_name}
            </h2>
            <p className="mt-2 text-sm text-[#969696]">
              Their profile and thesis credits will remain. They will be
              denied authenticated access until an administrator reactivates
              the account.
            </p>
            <label
              htmlFor="deactivation-reason"
              className="mt-5 block text-sm font-semibold text-[#d8dadc]"
            >
              Reason
            </label>
            <textarea
              id="deactivation-reason"
              required
              maxLength={300}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-2 min-h-24 w-full rounded-[7px] border border-white/10 bg-[#14181c] p-3 text-sm text-white outline-none focus:border-[#368bfe]"
            />
            {feedback?.tone === "error" ? (
              <p role="alert" className="mt-3 text-sm text-[#ff6b6b]">
                {feedback.message}
              </p>
            ) : null}
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setDeactivationTarget(null)}
                className="rounded-[7px] border border-white/10 px-4 py-2 text-sm font-semibold text-[#d8dadc]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !reason.trim()}
                className="rounded-[7px] bg-[#ff6b6b] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Deactivating..." : "Deactivate"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
