import { redirect } from "next/navigation";

/** Visiting /admin redirects to the dashboard. */
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
