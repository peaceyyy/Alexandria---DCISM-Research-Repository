import { AdminDashboardView } from "@/app/admin/_components/admin-dashboard-view";
import { AdminDataState } from "@/app/admin/_components/admin-data-state";
import { getAdminDashboardSnapshot } from "@/lib/services/admin-dashboard-service";

export default async function AdminDashboardPage() {
  const result = await getAdminDashboardSnapshot();

  if (result.error || !result.data) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <AdminDataState
          title="Dashboard unavailable"
          message={
            result.error?.message ??
            "The dashboard data could not be loaded."
          }
        />
      </div>
    );
  }

  return <AdminDashboardView snapshot={result.data} />;
}
