import { redirect } from "next/navigation";

export default async function PublishedStudyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  redirect(`/admin/all-studies/${resolvedParams.id}`);
}
