import { redirect } from "next/navigation";

/** The review queue now lives on the dashboard status filter. */
export default function AdminReviewIndexPage() {
  redirect("/admin/dashboard?status=for_review");
}
