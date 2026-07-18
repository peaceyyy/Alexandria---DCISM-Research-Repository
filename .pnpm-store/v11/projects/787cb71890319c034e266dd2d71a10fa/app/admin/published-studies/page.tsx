import { redirect } from "next/navigation";

/** Published studies are now handled by the All Studies status filter. */
export default function PublishedStudiesPage() {
  redirect("/admin/all-studies?status=accepted");
}
