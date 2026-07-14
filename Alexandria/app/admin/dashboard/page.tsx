import { AdminDashboardView } from "@/app/admin/_components/admin-dashboard-view";
import { AdminDataState } from "@/app/admin/_components/admin-data-state";
import { getAdminDashboardSnapshot } from "@/lib/services/admin-dashboard-service";
import { listReviewSubmissions } from "@/lib/services/review-service";
import type { ReviewStatus } from "@/lib/services/types";

type DashboardStatusFilter = ReviewStatus | "all";

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function parseStatus(value?: string | string[]): DashboardStatusFilter {
  const status = firstValue(value);
  return status === "for_review"
    || status === "flagged"
    || status === "accepted"
    || status === "trashed"
    ? status
    : "all";
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const status = parseStatus(params.status);
  const [snapshotResult, reviewQueueResult] = await Promise.all([
    getAdminDashboardSnapshot(),
    listReviewSubmissions({
      reviewStatus: status === "all" ? undefined : status,
      limit: 50,
    }),
  ]);

  if (
    snapshotResult.error
    || !snapshotResult.data
  ) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <AdminDataState
          title="Dashboard unavailable"
          message={
            snapshotResult.error?.message ??
            "The dashboard data could not be loaded."
          }
        />
      </div>
    );
  }

  return (
    <AdminDashboardView
      snapshot={snapshotResult.data}
      reviewQueue={reviewQueueResult.data ?? []}
      reviewQueueError={reviewQueueResult.error?.message ?? null}
      selectedStatus={status}
    />
  );
}
